import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { WalletContext } from "../../App";
import ConnectMetaMask from "../../modals/ConnectMetaMask";
import MessagePopUp from "../../modals/MessagePopUp";
import MetaMaskNotFoundModal from "../../modals/MetaMaskNotFoundModal";
import ConnectWallet from "../ConnectWallet";
import ShowRewardHistory from "../ShowRewardHistory";
import ShowStats from "../ShowStats";
import "./index.css";

const Stats = ({ width }) => {
  const { metaMaskAccountInfo } = useContext(WalletContext);

  const [openModal, setOpenModal] = useState(false);
  const [isConnectedPopUp, setIsConnectedPopUp] = useState(false);
  const [showStatsHistory, setShowStatsHistory] = useState(false);
  const [showConnectRewardWallet, setShowConnectRewardsWallet] = useState(true);
  const [isMetaMaskNotFound, setIsMetaMaskNotFound] = useState(false);
  const [highlightButton, setHighlightButton] = useState({
    isRewardOpen: true,
    isStatsOpen: false,
  });

  const { data: latestCompletedBatch } = useQuery(
    ["WinningBatch"],
    async () => {
      const response = await fetch(`${process.env.REACT_APP_API}/batch`);
      const data = await response.json();
      const lastestArchivedBatch = await data.items.filter((val) => {
        if (val.state === "archived") {
          return val;
        }
      });
      return lastestArchivedBatch[0];
    },
    {
      refetchInterval: 30000,
    }
  );

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
          setShowConnectRewardsWallet(true);
          setShowStatsHistory(false);
          return {
            isRewardOpen: !prev.isRewardOpen,
            isStatsOpen: false,
          };
        } else {
          if (prev.isRewardOpen) {
            setShowConnectRewardsWallet(false);
            setShowStatsHistory(false);
          } else {
            setShowConnectRewardsWallet(true);
            setShowStatsHistory(false);
          }
          return {
            ...prev,
            isRewardOpen: !prev.isRewardOpen,
          };
        }
      });
    } else {
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
      setShowStatsHistory(false);
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
    setHighlightButton((prev) => {
      if (prev.isRewardOpen) {
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
    setShowStatsHistory((prev) => !prev);
    setShowConnectRewardsWallet(false);
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
          <div className="Stats--Show" style={{ marginTop: "-7px" }}>
            {!metaMaskAccountInfo.address && showConnectRewardWallet && (
              <ConnectWallet
                setOpenModal={handleConnectToWallet}
                setShowConnectWallet={setShowConnectRewardsWallet}
                message={"Connect to Metamask to view your rewards"}
              />
            )}
            {metaMaskAccountInfo.address && !showStatsHistory && (
              <ShowRewardHistory />
            )}
            {showStatsHistory && (
              <ShowStats
                isOpenInModal={false}
                batchInfo={latestCompletedBatch}
              />
            )}
          </div>
        </>
      )}
      {width > 768 && (
        <>
          {!metaMaskAccountInfo.address && (
            <ConnectWallet
              setOpenModal={handleConnectToWallet}
              setShowConnectWallet={setShowConnectRewardsWallet}
              message={"Connect to Metamask to view your rewards"}
            />
          )}
          {metaMaskAccountInfo.address && <ShowRewardHistory />}
          <ShowStats isOpenInModal={false} batchInfo={latestCompletedBatch} />
        </>
      )}
    </div>
  );
};

export default Stats;
