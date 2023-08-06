import React, { useEffect, useContext } from "react";
import ReactDOM from "react-dom";

import "./TransactionErrorModal.css";
import { WalletContext } from "../../App";
import { MetaMaskAvatar } from "react-metamask-avatar";
import CloseModal from "../../assets/Icons/Button/CloseModal.svg";

const TransactionErrorModal = ({ closeModal }) => {
  
  const { metaMaskAccountInfo } = useContext(WalletContext);
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
          <h1>Transaction is failed</h1>
          <img
            src={CloseModal}
            alt=""
            className="close-modal"
            onClick={handleCloseModal}
          />
        </div>
        <div className="Connect--Terms">
          <p>
            It looks like we didn't manage to run the transaction successfully.
            Maybe there are not enough funds in your wallet or something else.
            Try to check your wallet and repeat the transaction.
          </p>
        </div>
        <div className="Wallet--Details">
          <h4>Wallet Address:</h4>
          <div className="header--user--info">
            {metaMaskAccountInfo.address && (
              <>
                <MetaMaskAvatar
                  address={metaMaskAccountInfo.address}
                  size={32}
                />
                <h4>
                  {metaMaskAccountInfo.address.slice(0, 6)}...
                  {metaMaskAccountInfo.address.slice(-4)}
                </h4>
              </>
            )}
          </div>
        </div>
        <div className="Connect--Metamask--Button" onClick={handleCloseModal}>
          <h4>Continue</h4>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
};

export default TransactionErrorModal;
