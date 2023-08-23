import React, { useState, useContext, useEffect } from "react";

import EtheriumIcon from "../assets/Icons/Ethereum.svg";
import CoinOne from "../assets/Icons/FirstPlace.png";
import CoinTwo from "../assets/Icons/SecondPlace.png";
import CoinThree from "../assets/Icons/ThirdPlace.png";
import LeftArrowBtn from "../assets/Icons/LeftArrowBtn.svg";
import RightArrowBtn from "../assets/Icons/RightArrowBtn.svg";
import InfoIcon from "../assets/Icons/16.svg";
import { WalletContext } from "../App";
import ConnectMetaMask from "./modals/ConnectMetaMask";
import {
  _Bid,
  _getBidCount,
  _getBidPrice,
  _getLottriesInfo,
} from "../ContractFunctions";
import MessagePopUp from "./modals/MessagePopUp";
import GrapeDraw from "../contracts/GrapeDraw.json";
import "./Batch.css";
import TransactionErrorModal from "./modals/TransactionErrorModal";
import MetaMaskNotFoundModal from "./modals/MetaMaskNotFoundModal";
import TransactionModal from "./modals/TransactionModal";

const Batch = ({ batchInfo, contractAddress }) => {
  const [tickets, SetTickets] = useState(1);
  const [bidCount, setBidCount] = useState(0);
  const [bidPrice, setBidPrice] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [isConnectedPopUp, setIsConnectedPopUp] = useState(false);
  const [isMetaMaskNotFound, setIsMetaMaskNotFound] = useState(false);
  const [isTransactionModal, setIsTransactionModal] = useState(false);
  const [isTransactionOngoing, setIsTransactionOngoing] = useState(false);
  const [transactionErrorModal, setTransactionErrorModal] = useState(false);
  const [transactionStatusPopUp, setTransactionStatusPopUp] = useState(false);
  const [contractInstance, setContractInstance] = useState(null);
  const { metaMaskAccountInfo } = useContext(WalletContext);

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

  const closeTransactionErrorModal = () => setTransactionErrorModal(false);
  const closePopUp = () => setIsConnectedPopUp(false);

  const HandleRemoveTicket = () => {
    if (tickets > 1) {
      SetTickets((tickets) => tickets - 1);
    }
  };
  const HandleAddTicket = () => {
    if (tickets < 999) SetTickets((tickets) => tickets + 1);
  };

  const HandleBuyTickets = () => {
    if (metaMaskAccountInfo.address && metaMaskAccountInfo.isConnected) {
      setIsTransactionOngoing(true);
      _Bid(
        bidPrice.ethValue,
        tickets,
        metaMaskAccountInfo.address,
        metaMaskAccountInfo.web3,
        contractInstance,
        setIsTransactionOngoing,
        setTransactionStatusPopUp,
        setTransactionErrorModal
      );
    } else {
      if (window.ethereum) {
        setOpenModal(true);
      } else {
        setIsMetaMaskNotFound(true);
      }
    }
  };

  useEffect(() => {
    if (metaMaskAccountInfo.web3) {
      const contract = new metaMaskAccountInfo.web3.eth.Contract(
        GrapeDraw.abi,
        contractAddress
      );
      setContractInstance(contract);
      _getBidCount(contract, setBidCount);
      _getBidPrice(contract, setBidPrice, metaMaskAccountInfo.web3);
    }
  }, []);

  return (
    <div className="Batch">
      {openModal && <ConnectMetaMask closeModal={closeConnectModal} />}
      {isConnectedPopUp && (
        <MessagePopUp
          message="You've successfully connected to Metamask Wallect"
          closePopUp={closePopUp}
        />
      )}
      {transactionStatusPopUp && (
        <MessagePopUp
          message={`You've successfully purchased ${tickets} tickets for Batch #134`}
          closePopUp={closePopUp}
        />
      )}
      {transactionErrorModal && (
        <TransactionErrorModal closeModal={closeTransactionErrorModal} />
      )}
      {isMetaMaskNotFound && (
        <MetaMaskNotFoundModal closeModal={closeConnectModal} />
      )}
      {isTransactionModal && (
        <TransactionModal
          closeModal={() => setIsTransactionModal(false)}
          batchId={batchInfo.id}
        />
      )}
      <div className="Batch--Heading">
        <h1>{`Batch #${batchInfo.id}`}</h1>
        <div>
          <img src={EtheriumIcon} alt="" />
          <h4>Ethereum</h4>
        </div>
      </div>
      <div className="Batch--Time--Stats">
        <div>
          <h4 className="gray grow">Period:</h4>
          <h4>Daily</h4>
        </div>
        <div>
          <h4 className="gray grow">Ends in:</h4>
          <h4>00:03:58</h4>
        </div>
      </div>
      <div className="Batch--Price--Stats">
        <div className="Batch--Price--Stats--Info">
          <h4 className="gray">Grand prizes</h4>
          <img src={InfoIcon} alt="" />
        </div>
        <div className="Batch--Price--Container">
          <div>
            <img src={CoinOne} alt="" />
            <div>
              <h4 className="big normal">2.44 ETH</h4>
              <h4 className="gray invisible">$4687.29</h4>
            </div>
          </div>
          <div>
            <img src={CoinTwo} alt="" />
            <div>
              <h4 className="big normal">0.92 ETH</h4>
              <h4 className="gray invisible">$1767.58</h4>
            </div>
          </div>
          <div>
            <img src={CoinThree} alt="" />
            <div>
              <h4 className="big normal">1.33 ETH</h4>
              <h4 className="gray invisible">$2555.30</h4>
            </div>
          </div>
        </div>
      </div>
      <div className="Batch--Tickets--Price">
        <h4 className="gray">Ticket Price:</h4>
        <div>
          <h4 className="normal">{bidPrice.ethValue} ETH</h4>
          <h4 className="gray">${bidPrice.usdValue}</h4>
        </div>
      </div>
      <div className="Batch--Tickets--Sold">
        <h4 className="gray">Sold tickets:</h4>
        <div>
          <h4 className="normal">{parseInt(bidCount)}</h4>
          <h4
            className="transaction"
            onClick={() => setIsTransactionModal(true)}
          >
            Transactions
          </h4>
        </div>
      </div>
      <div className="Batch--Buy--Container">
        <div className="Batch--Add--Button">
          <img
            className={tickets === 1 ? "btn--disable" : "decrement--button"}
            src={LeftArrowBtn}
            alt=""
            onClick={HandleRemoveTicket}
          />
          <h4>{tickets}</h4>
          <img
            className={tickets === 999 ? "btn--disable" : "increment--button"}
            src={RightArrowBtn}
            alt=""
            onClick={HandleAddTicket}
          />
        </div>
        {isTransactionOngoing ? (
          <div
            className="Batch--Transaction--Button"
            onClick={HandleBuyTickets}
          >
            <h4>
              Transaction<span className="dot1">.</span>
              <span className="dot2">.</span>
              <span className="dot3">.</span>
            </h4>
          </div>
        ) : (
          <div className="Batch--Buy--Button" onClick={HandleBuyTickets}>
            <h4>
              Buy {(+bidPrice.ethValue * tickets).toFixed(3)} ETH {tickets}{" "}
              Tickets
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default Batch;
