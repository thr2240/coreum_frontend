import { useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { SSRProvider } from "react-bootstrap";
import sal from "sal.js";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from 'react-toastify';
import { AuthContextProvider } from "@context/authContext";
import { SigningCosmWasmProvider } from "@context/cosmwasm";
import "../assets/css/bootstrap.min.css";
import "../assets/css/feather.css";
import "../assets/css/modal-video.css";
import "react-toastify/dist/ReactToastify.css";
import "../assets/scss/style.scss";
import 'react-toastify/dist/ReactToastify.css';

const MyApp = ({ Component, pageProps }) => {
    const getLayout = Component.getLayout || ((page) => page);
    const router = useRouter();
    useEffect(() => {
        sal({ threshold: 0.1, once: true });
    }, [router.asPath]);

    useEffect(() => {
        sal();
    }, []);
    useEffect(() => {
        document.body.className = `${pageProps.className}`;
    });
    return (
        <SSRProvider>
            {getLayout(
                <ThemeProvider defaultTheme="dark">
                    <AuthContextProvider>
                        <SigningCosmWasmProvider>
                            <Component {...pageProps} />
                        </SigningCosmWasmProvider>
                    </AuthContextProvider>
                </ThemeProvider>
            )}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
            />
        </SSRProvider>
    );
};

MyApp.propTypes = {
    Component: PropTypes.elementType,
    pageProps: PropTypes.shape({
        className: PropTypes.string,
    }),
};

export default MyApp;
