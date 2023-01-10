import { useState, useEffect, createContext, useContext } from "react";
import { toast } from 'react-toastify';
import { CosmWasmClient, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { defaultRegistryTypes, SigningStargateClient } from '@cosmjs/stargate';
import { encodePubkey, makeSignDoc, Registry } from '@cosmjs/proto-signing';
import { encodeSecp256k1Pubkey } from '@cosmjs/amino/build/encoding';
import { fromBase64, toBase64 } from '@cosmjs/encoding';
import { makeSignDoc as AminoMakeSignDoc } from '@cosmjs/amino';
import { AuthInfo, TxBody, TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx';
import { config, chainConfig } from "@utils/config";

async function getKeplr() {
  if (window.keplr) {
    return window.keplr;
  }

  if (document.readyState === "complete") {
    return window.keplr;
  }

  return new Promise((resolve) => {
    const documentStateChange = (event) => {
      if (
        event.target &&
        (event.target).readyState === "complete"
      ) {
        resolve(window.keplr);
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };

    document.addEventListener("readystatechange", documentStateChange);
  });
}

const CosmwasmContext = createContext({});
export const useSigningClient = () => useContext(CosmwasmContext);

export const SigningCosmWasmProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [signingClient, setSigningClient] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  const loadClient = async () => {
    try {
      setClient(
        await CosmWasmClient.connect(config.RPC_URL)
      );
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    const keplr = await getKeplr();

    if (!window.getOfflineSigner || !window.keplr || !keplr) {
      alert("Please install keplr to continue.");
      window.open("https://www.keplr.app/", '_blank');
      return;
    } else {
      if (window.keplr.experimentalSuggestChain) {
        try {
          await window.keplr.experimentalSuggestChain(chainConfig);
        } catch (error) {
          console.log(error)
          toast.error('Failed to suggest the chain');
          return;
        }
      } else {
        toast.warn('Please use the recent version of keplr extension');
        return;
      }
    }

    try {
      await keplr.enable(config.CHAIN_ID);
      await window.keplr.enable(config.CHAIN_ID)
      const offlineSigner = await window.getOfflineSignerOnlyAmino(
        config.CHAIN_ID
      )
      const tempClient = await SigningCosmWasmClient.connectWithSigner(
        config.RPC_URL,
        offlineSigner
      );
      setSigningClient(tempClient);

      const [{ address }] = await offlineSigner.getAccounts();
      setWalletAddress(address);
      localStorage.setItem("address", address);
    }
    catch (err) {
      console.log(err)
      return
    }
  }

  const disconnect = () => {
    if (signingClient) {
      localStorage.removeItem("address");
      signingClient.disconnect();
    }
    setWalletAddress('');
    setSigningClient(null);
  }

  return (
    <CosmwasmContext.Provider
      value={{
        walletAddress,

        loadClient,
        connectWallet,
        disconnect
      }}
    >
      {children}
    </CosmwasmContext.Provider>
  )
}