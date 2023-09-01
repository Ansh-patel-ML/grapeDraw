import React, { useContext, useRef, useState } from "react";
import useResizeObserver from "../Utils/customHooks/ResizeObserver";
import GrapeDrawIcon from "../assets/Icons/GrapeDraw.svg";
import "./Header.css";
import { MetaMaskAvatar } from "react-metamask-avatar";
import ConnectMetaMask from "./modals/ConnectMetaMask";
import { WalletContext } from "../App";
import MessagePopUp from "./modals/MessagePopUp";
import MetaMaskNotFoundModal from "./modals/MetaMaskNotFoundModal";

const Header = () => {
  const [width, setWidth] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [isConnectedPopUp, setIsConnectedPopUp] = useState(false);
  const [isMetaMaskNotFound, setIsMetaMaskNotFound] = useState(false);

  const headerRef = useRef(null);
  const { metaMaskAccountInfo } = useContext(WalletContext);

  const handleResize = (entries) => {
    for (let entry of entries) {
      const { width } = entry.contentRect;
      setWidth(width);
    }
  };

  useResizeObserver(headerRef, handleResize);

  const closeConnectModal = (isConnected, address) => {
    setOpenModal(false);
    setIsMetaMaskNotFound(false);
    if (address && isConnected) {
      setIsConnectedPopUp(true);
      setTimeout(() => {
        setIsConnectedPopUp(false);
      }, 7000);
    }
  };

  const closePopUp = () => setIsConnectedPopUp(false);

  const handleConnect = async () => {
    if (window.ethereum) {
      setOpenModal(true);
    } else {
      setIsMetaMaskNotFound(true);
    }
  };

  return (
    <div className="header" ref={headerRef}>
      {openModal && <ConnectMetaMask closeModal={closeConnectModal} />}
      {isConnectedPopUp && (
        <MessagePopUp
          message="You've successfully connected to Metamask Wallect"
          closePopUp={closePopUp}
        />
      )}
      {isMetaMaskNotFound && (
        <MetaMaskNotFoundModal closeModal={closeConnectModal} />
      )}
      <div className="header--container">
        <div className="header--grapeDraw">
          <img src={GrapeDrawIcon} alt="GrapeDraw" />
          <h1 className={width >= 414 ? "show" : "hide"}>GRAPEDRAW</h1>
        </div>
        {metaMaskAccountInfo.address && (
          <div className="header--user--info">
            <MetaMaskAvatar address={metaMaskAccountInfo.address} size={32} />
            <h4>
              {metaMaskAccountInfo.address.slice(0, 6)}...
              {metaMaskAccountInfo.address.slice(-4)}
            </h4>
          </div>
        )}
        {!metaMaskAccountInfo.address && (
          <button className="header--connect" onClick={handleConnect}>
            Connect
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
