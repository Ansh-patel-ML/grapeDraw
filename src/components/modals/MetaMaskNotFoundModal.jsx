import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import CloseModal from "../../assets/Icons/Button/CloseModal.svg";

import "./MetaMaskNotFoundModal.css";
const MetaMaskNotFoundModal = ({ closeModal }) => {
  const handleCloseModal = () => {
    closeModal();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return ReactDOM.createPortal(
    <>
      <div className="modal--wrapper"></div>
      <div className="Connect">
        <div className="Connect--Heading">
          <h1>Wallet Not Detected!</h1>
          <img
            src={CloseModal}
            alt=""
            className="close-modal"
            onClick={handleCloseModal}
          />
        </div>
        <div className="NotDetected--Text">
          <p>
            Sorry we are unable to detect metamask. Please download it from the
            below button.
          </p>
        </div>
        <div
          className="Connect--Metamask--Button"
          onClick={() => window.open("https://metamask.io/download/", "_blank")}
        >
          <h4>Download Metamask</h4>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
};

export default MetaMaskNotFoundModal;
