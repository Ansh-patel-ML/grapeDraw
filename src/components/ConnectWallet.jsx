import React from "react";
import "./ConnectWallet.css";

const ConnectWallet = ({ setOpenModal, setShowConnectWallet, message }) => {
  const handleConnectToWallet = () => {
    setOpenModal(true);
    setShowConnectWallet(false);
  };
  return (
    <div className="ConnectWallet">
      <h4>{message}</h4>
      <div className="ConnectWallet--Button" onClick={handleConnectToWallet}>
        <h4>Connect</h4>
      </div>
    </div>
  );
};

export default ConnectWallet;
