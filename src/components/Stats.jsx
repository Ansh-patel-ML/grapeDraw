import React, { useContext, useState } from "react";
import ConnectMetaMask from "./modals/ConnectMetaMask";
import { WalletContext } from "../App";
import MessagePopUp from "./modals/MessagePopUp";
import ConnectWallet from "./ConnectWallet";
import ShowRewardHistory from "./ShowRewardHistory";
import MetaMaskNotFoundModal from "./modals/MetaMaskNotFoundModal";

import "./Stats.css";
import ShowStats from "./modals/ShowStats";

const Stats = ({ width }) => {
  const { metaMaskAccountInfo } = useContext(WalletContext);

  const [openModal, setOpenModal] = useState(false);
  const [isConnectedPopUp, setIsConnectedPopUp] = useState(false);
  const [showRewardHistory, setShowRewardHistory] = useState(true);
  const [showConnectWallet, setShowConnectWallet] = useState(true);
  const [isMetaMaskNotFound, setIsMetaMaskNotFound] = useState(false);
  const [highlightButton, setHighlightButton] = useState({
    isRewardOpen: true,
    isStatsOpen: false,
  });

  const closePopUp = () => setIsConnectedPopUp(false);
  const closeConnectModal = (isConnected, address) => {
    setOpenModal(false);
    setIsMetaMaskNotFound(false);
    if (address && isConnected) {
      setIsConnectedPopUp(true);
      setTimeout(() => {
        setIsConnectedPopUp(false);
      }, 5000);
    } else {
      setHighlightButton((prev) => {
        return {
          ...prev,
          isRewardOpen: !prev.isRewardOpen,
          isStatsOpen: false,
        };
      });
    }
  };

  const handleRewardClicked = () => {
    if (!metaMaskAccountInfo.address && !metaMaskAccountInfo.isConnected) {
      setHighlightButton((prev) => {
        if (prev.isStatsOpen) {
          return {
            isRewardOpen: !prev.isRewardOpen,
            isStatsOpen: false,
          };
        } else {
          return {
            ...prev,
            isRewardOpen: !prev.isRewardOpen,
          };
        }
      });
      setShowConnectWallet((prev) => !prev);
    } else {
      setHighlightButton((prev) => {
        if (prev.isStatsOpen) {
          // setShowConnectWallet((prev) => !prev);
          return {
            isRewardOpen: !prev.isRewardOpen,
            isStatsOpen: false,
          };
        } else {
          // setShowConnectWallet((prev) => !prev);
          return {
            ...prev,
            isRewardOpen: !prev.isRewardOpen,
          };
        }
      });
      setShowRewardHistory((prev) => !prev);
    }
  };

  const handleConnectToWallet = () => {
    if (window.ethereum) {
      setOpenModal(true);
    } else {
      setIsMetaMaskNotFound(true);
    }
  };

  const handleStatsClicked = () => {
    if (!metaMaskAccountInfo.address && !metaMaskAccountInfo.isConnected) {
      setHighlightButton((prev) => {
        if (prev.isRewardOpen) {
          setShowConnectWallet(false);
          return {
            isRewardOpen: false,
            isStatsOpen: !prev.isStatsOpen,
          };
        } else {
          return {
            ...prev,
            isStatsOpen: !prev.isStatsOpen,
          };
        }
      });
    }
  };

  return (
    <div className="Stats">
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
      {width <= 768 && (
        <>
          <div className="Stats--Button--Container">
            <div
              className={
                highlightButton.isRewardOpen ? "button Clicked" : "button"
              }
              onClick={handleRewardClicked}
            >
              Rewards
            </div>
            <div
              className={
                highlightButton.isStatsOpen ? "button Clicked" : "button"
              }
              onClick={handleStatsClicked}
            >
              Stats
            </div>
          </div>
          <div className="Stats--Show">
            {!metaMaskAccountInfo.address && showConnectWallet && (
              <ConnectWallet
                setOpenModal={handleConnectToWallet}
                setShowConnectWallet={setShowConnectWallet}
                message={"Connect to Metamask to view your rewards"}
              />
            )}
            {metaMaskAccountInfo.address && showRewardHistory && (
              <ShowRewardHistory />
            )}
            <ShowStats />
          </div>
        </>
      )}
      {width > 768 && (
        <>
          {!metaMaskAccountInfo.address && (
            <ConnectWallet
              setOpenModal={handleConnectToWallet}
              setShowConnectWallet={setShowConnectWallet}
              message={"Connect to Metamask to view your rewards"}
            />
          )}
          {metaMaskAccountInfo.address && <ShowRewardHistory />}
          <ShowStats /> 
        </>
      )}
    </div>
  );
};

export default Stats;
