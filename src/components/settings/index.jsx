import { useState } from 'react';
import { FiSettings } from 'react-icons/fi';
import { FaBook } from 'react-icons/fa';
import Image from "next/image";
import Modal from 'react-modal';
import ColorSwitcher from "@components/color-switcher";
import Carosuel from "@ui/carousel";
import TutorialData from "../../data/tutorial.json";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '700px'
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.66)",
    zIndex: 10000
  },
};

const Settings = () => {
  const [isModal, setModal] = useState(false);
  const openModal = () => {
    setModal(true);
  }

  const closeModal = () => {
    setModal(false);
  }
  return (
    <div className="icon-box">
      <div className="icon-setting">
        <FiSettings size={18} />
      </div>
      <div className="rn-dropdown py-4 px-5">
        <div className="setting-container">
          <button className="setting-tutorial" onClick={openModal}>
            <FaBook size={16} />
            <span>TUTORIAL</span>
          </button>
          <div className="setting-lang">
            <select className="select-lang">
              <option>eng</option>
              <option>esp</option>
              <option>deu</option>
              <option>fra</option>
              <option>portuguese</option>
              <option>ita</option>
              <option>ned</option>
              <option>lat</option>
              <option>svenska</option>
              <option>polski</option>
              <option>русский</option>
              <option>ellinikí</option>
              <option>türk</option>
              <option>Việt</option>
              <option>tagalog</option>
              <option>日本語</option>
              <option>中文简体</option>
              <option>中文繁體</option>
              <option>한국인</option>
              <option>عربى</option>
              <option>فارسی</option>
            </select>
          </div>
          <div id="my_switcher" className="setting-option my_switcher">
            <ColorSwitcher />
          </div>
        </div>
        <Modal
          className="tutorial-modal"
          isOpen={isModal}
          style={customStyles}
          contentLabel="Tutorial Modal"
        >
          <div className='w-100'>
            {TutorialData.length > 0 && (
              <Carosuel dots={false} items={1}>
                {
                  TutorialData.map(item => (
                    <div className='tutorial-page' key={item.id}>
                      <Image
                        src={item.image.src}
                        alt={item.title}
                        width={500}
                        height={400}
                      />
                      <div className='tutorial-content'>
                        <h3 className='mb--5'>{item.title}</h3>
                        <span className='fs-3 mb--5'>{item.description}</span>
                        {
                          item.id === 5 && (
                            <button className='btn-end-tutorial' onClick={closeModal}>Get Started</button>
                          )
                        }
                      </div>
                    </div>
                  ))
                }
              </Carosuel>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Settings;
