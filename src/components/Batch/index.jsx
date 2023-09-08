import React, { useState, useContext, useEffect } from "react";
import { useQuery } from "react-query";
import Countdown from "react-countdown";
import { TailSpin } from "react-loader-spinner";
import { WalletContext } from "../../App";
import { _Bid, _getBidCount, _getBidPrice } from "../../ContractFunctions";
import ConnectMetaMask from "../../modals/ConnectMetaMask";
import MessagePopUp from "../../modals/MessagePopUp";
import TransactionErrorModal from "../../modals/TransactionErrorModal";
import MetaMaskNotFoundModal from "../../modals/MetaMaskNotFoundModal";
import TransactionModal from "../../modals/TransactionModal";
import EtheriumIcon from "../../assets/Icons/Ethereum.svg";
import CoinOne from "../../assets/Icons/FirstPlace.png";
import CoinTwo from "../../assets/Icons/SecondPlace.png";
import CoinThree from "../../assets/Icons/ThirdPlace.png";
import LeftArrowBtn from "../../assets/Icons/LeftArrowBtn.svg";
import RightArrowBtn from "../../assets/Icons/RightArrowBtn.svg";
import InfoIcon from "../../assets/Icons/16.svg";
import GrapeDraw from "../../contracts/GrapeDraw.json";
import "./index.css";

const Batch = ({
  batchInfo,
  contractAddress,
  batchDuration,
  bidPriceInWei,
  batchChain,
}) => {
  const [tickets, SetTickets] = useState(1);
  const [bidCount, setBidCount] = useState(null);
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
  const [endTime, setEndTime] = useState(false);
  const [callNetworkData, setCallNetworkData] = useState(false);

  const closeTransactionErrorModal = () => setTransactionErrorModal(false);
  const closePopUp = () => setIsConnectedPopUp(false);
  const closeTransactionPopUp = () => setTransactionStatusPopUp(false);

  const { data: ethPriceInUSD } = useQuery(
    ["networkData"],
    async () => {
      const response = await fetch(`http://44.203.188.29/networkData`);
      const data = await response.json();
      return data;
    },
    {
      refetchInterval: 30000,
    }
  );

  const { data: transaction } = useQuery(
    ["transaction", batchInfo.id],
    async () => {
      const response = await fetch(
        `http://44.203.188.29/bid/batch/${batchInfo.id}`
      );
      const data = await response.json();
      return data;
    },
    {
      enabled: callNetworkData,
      refetchInterval: 30000,
    }
  );

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
        setTransactionErrorModal,
        SetTickets
      );
    } else {
      if (window.ethereum) {
        setOpenModal(true);
      } else {
        setIsMetaMaskNotFound(true);
      }
    }
  };

  const hoursToPeriod = (hours) => {
    if (hours >= 24 * 7) {
      return "weekly";
    } else if (hours >= 24) {
      return "daily";
    } else if (hours >= 1) {
      return "hourly";
    } else {
      return "less than an hour";
    }
  };

  const getTransactionAmount = (transaction) => {
    const transactionAmount = transaction.items.reduce((acc, curr) => {
      if (!acc.amount) {
        acc["amount"] = 0;
      }
      acc["amount"] += curr["ticketsAmount"];
      return acc;
    }, {});
    return transactionAmount.amount;
  };

  const countDecimalPlaces = (number) => {
    const numberString = number.toString();
    if (numberString.indexOf(".") === -1) {
      return 0;
    }
    const decimalPart = numberString.split(".")[1];
    return decimalPart.length;
  };

  const handleCustomAddTickets = (e) => {
    console.log("222222222", e);
    SetTickets((prev) => {
      if (e.target.value === "") {
        return 1;
      }
      return e.target.value;
    });
  };

  useEffect(() => {
    if (metaMaskAccountInfo.web3) {
      const contract = new metaMaskAccountInfo.web3.eth.Contract(
        GrapeDraw.abi,
        contractAddress
      );
      setContractInstance(contract);
      setCallNetworkData(true);
      _getBidCount(contract, setBidCount);
      _getBidPrice(contract, setBidPrice, metaMaskAccountInfo.web3);
    } else {
      setCallNetworkData(true);
    }
  }, [transactionStatusPopUp]);

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
          message={`You've successfully purchased ${tickets} tickets for Batch #${batchInfo.id}`}
          closePopUp={closeTransactionPopUp}
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
          <h4>{batchChain}</h4>
        </div>
      </div>
      {endTime ? (
        <>
          <div className="Batch--Time--Stats">
            <div>
              <h4 className="gray grow">Period:</h4>
              <h4>{`${hoursToPeriod(batchDuration / 3600)
                .charAt(0)
                .toUpperCase()}${hoursToPeriod(batchDuration / 3600).slice(
                1
              )}`}</h4>
            </div>
            <div>
              <h4 className="gray grow">Ends in:</h4>
              <Countdown
                date={new Date(batchInfo.endTime * 1000)}
                className="countdown"
                daysInHours="true"
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <TailSpin
              height="30"
              width="30"
              color="#4fa94d"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperClass=""
              visible={true}
            />
            <p style={{ color: "#666666" }}>Looking for winners...</p>
          </div>
          <div className="Batch--Price--Stats ">
            <div className="Batch--Price--Stats--Info">
              <h4 className="gray">Grand prizes</h4>
              <img src={InfoIcon} alt="" />
            </div>
            <div className="Batch--Price--Container endTime">
              <div>
                <img src={CoinOne} alt="" />
                <div>
                  <h4 className="big normal">
                    {(batchInfo.amount1 / 10 ** 18).toLocaleString(undefined, {
                      maximumFractionDigits: 10,
                    })}{" "}
                    ETH
                  </h4>
                  <h4 className="gray invisible">
                    $
                    {(
                      ethPriceInUSD.ethPrice *
                      (batchInfo.amount1 / 10 ** 18)
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 10,
                    })}
                  </h4>
                </div>
              </div>
              <div>
                <img src={CoinTwo} alt="" />
                <div>
                  <h4 className="big normal">
                    {(batchInfo.amount2 / 10 ** 18).toLocaleString(undefined, {
                      maximumFractionDigits: 10,
                    })}{" "}
                    ETH
                  </h4>
                  <h4 className="gray invisible">
                    $
                    {(
                      ethPriceInUSD.ethPrice *
                      (batchInfo.amount2 / 10 ** 18)
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 10,
                    })}
                  </h4>
                </div>
              </div>
              <div>
                <img src={CoinThree} alt="" />
                <div>
                  <h4 className="big normal">
                    {(batchInfo.amount3 / 10 ** 18).toLocaleString(undefined, {
                      maximumFractionDigits: 10,
                    })}{" "}
                    ETH
                  </h4>
                  <h4 className="gray invisible">
                    $
                    {(
                      ethPriceInUSD.ethPrice *
                      (batchInfo.amount3 / 10 ** 18)
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 10,
                    })}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="Batch--Time--Stats">
            <div>
              <h4 className="gray grow">Period:</h4>
              <h4>{`${hoursToPeriod(batchDuration / 3600)
                .charAt(0)
                .toUpperCase()}${hoursToPeriod(batchDuration / 3600).slice(
                1
              )}`}</h4>
            </div>
            <div>
              <h4 className="gray grow">Ends in:</h4>
              <Countdown
                date={new Date(batchInfo.endTime * 1000)}
                onComplete={() => setEndTime(true)}
                className="countdown"
                daysInHours={true}
              />
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
                  <h4 className="big normal">
                    {(batchInfo.amount1 / 10 ** 18).toLocaleString(undefined, {
                      maximumFractionDigits: 10,
                    })}{" "}
                    ETH
                  </h4>
                  <h4 className="gray invisible">
                    $
                    {(
                      ethPriceInUSD.ethPrice *
                      (batchInfo.amount1 / 10 ** 18)
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 10,
                    })}
                  </h4>
                </div>
              </div>
              <div>
                <img src={CoinTwo} alt="" />
                <div>
                  <h4 className="big normal">
                    {(batchInfo.amount2 / 10 ** 18).toLocaleString(undefined, {
                      maximumFractionDigits: 10,
                    })}{" "}
                    ETH
                  </h4>
                  <h4 className="gray invisible">
                    $
                    {(
                      ethPriceInUSD.ethPrice *
                      (batchInfo.amount2 / 10 ** 18)
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 10,
                    })}
                  </h4>
                </div>
              </div>
              <div>
                <img src={CoinThree} alt="" />
                <div>
                  <h4 className="big normal">
                    {(batchInfo.amount3 / 10 ** 18).toLocaleString(undefined, {
                      maximumFractionDigits: 10,
                    })}{" "}
                    ETH
                  </h4>
                  <h4 className="gray invisible">
                    $
                    {(
                      ethPriceInUSD.ethPrice *
                      (batchInfo.amount3 / 10 ** 18)
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 10,
                    })}
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div className="Batch--Tickets--Price">
            <h4 className="gray">Ticket Price:</h4>
            <div>
              <h4 className="normal">{bidPriceInWei / 10 ** 18} ETH</h4>
              <h4 className="gray">
                $
                {callNetworkData &&
                  ethPriceInUSD &&
                  (
                    ethPriceInUSD.ethPrice *
                    (bidPriceInWei / 10 ** 18)
                  ).toLocaleString(undefined, {
                    maximumFractionDigits: 10,
                  })}
              </h4>
            </div>
          </div>
          <div className="Batch--Tickets--Sold">
            <h4 className="gray">Sold tickets:</h4>
            <div>
              <h4 className="normal">
                {bidCount === null && transaction
                  ? getTransactionAmount(transaction)
                  : parseInt(bidCount)}
              </h4>
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
              {/* <h4>{tickets}</h4> */}
              <input
                type="text"
                value={tickets}
                className="batch--buy--value"
                onChange={handleCustomAddTickets}
              />
              <img
                className={
                  tickets === 999 ? "btn--disable" : "increment--button"
                }
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
                <h4 className="batch--buy--text">
                  Buy{" "}
                  {callNetworkData
                    ? ((bidPriceInWei / 10 ** 18) * tickets).toFixed(
                        countDecimalPlaces(bidPriceInWei / 10 ** 18)
                      )
                    : (+bidPrice.ethValue * tickets).toFixed(
                        countDecimalPlaces(+bidPrice.ethValue)
                      )}{" "}
                  ETH {tickets} Tickets
                </h4>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Batch;
