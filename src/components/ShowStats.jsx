import React, { useState, useContext } from "react";
import { useQuery } from "react-query";
import "./ShowStats.css";
import EtheriumIcon from "../assets/Icons/Ethereum.svg";
import CoinOne from "../assets/Icons/FirstPlace.png";
import CoinTwo from "../assets/Icons/SecondPlace.png";
import CoinThree from "../assets/Icons/ThirdPlace.png";
import Trust from "../assets/Icons/Trust.svg";
import PayoutTransactionModal from "./modals/PayoutTransactionModal";
import ShowBoughtBatchTickets from "./modals/ShowBoughtBatchTickets";
import { WalletContext } from "../App";

const ShowStats = ({ isOpenInModal, batchInfo }) => {
  const { metaMaskAccountInfo } = useContext(WalletContext);
  const [isPayoutTransactionModal, setIsPayoutTransactionModal] =
    useState(false);
  const [boughtTicketsModal, setBoughtTicketsModal] = useState(false);

  const { data: userWinningBatchTotalTickets } = useQuery(
    ["userWinningBatchTotalTickets"],
    async () => {
      const response = await fetch(
        `http://44.203.188.29/bid/user/${metaMaskAccountInfo.address}`
      );
      const data = await response.json();
      const ticketsAmount = data.items
        .filter((batch) => {
          if (batch["batchId"] === batchInfo?.id) {
            return batch;
          }
        })
        .reduce((acc, curr) => {
          if (!acc.ticketAmount) {
            acc["ticketAmount"] = 0;
          }
          acc["ticketAmount"] += curr["ticketsAmount"];
          return acc;
        }, {});
      return ticketsAmount;
    },
    {
      enabled: metaMaskAccountInfo.address !== null,
    }
  );

  const { data: contractInfo } = useQuery(
    ["contractInfo", batchInfo?.id],
    async () => {
      const response = await fetch(`http://44.203.188.29/contract`);
      const data = await response.json();
      const contractById = data.items.filter(
        (val) => val.id === batchInfo?.contractId
      )[0];
      return contractById;
    }
  );

  const { data: transaction } = useQuery(
    ["transaction", batchInfo?.id],
    async () => {
      const response = await fetch(
        `http://44.203.188.29/bid/batch/${batchInfo.id}`
      );
      const data = await response.json();
      return data;
    },
    {
      enabled: batchInfo === undefined ? false : true,
    }
  );

  const formatCustomDate = (date, index) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "UTC",
    };

    const formattedDate = date.toLocaleString("en-US", options);
    const timePart = formattedDate.split(", ")[1];
    if (index === 1) {
      return `${formattedDate.split(", ")[0]}`;
    } else {
      return `at ${timePart} UTC`;
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
    const transactionAmount = transaction?.items?.reduce((acc, curr) => {
      if (!acc.amount) {
        acc["amount"] = 0;
      }
      acc["amount"] += curr["ticketsAmount"];
      return acc;
    }, {});
    return transactionAmount.amount;
  };

  return (
    <>
      <div
        className={
          isOpenInModal ? "stats--card bought--ticket--card" : "stats--card"
        }
      >
        {!isOpenInModal && (
          <>
            <h2 className="stats--header">Stats</h2>
            <hr />
          </>
        )}

        <p className="stats--batch--no">{`Batch #${batchInfo?.id}`}</p>
        <div className="stats--batch--tickets">
          <div>Bought Tickets :</div>
          <p>{userWinningBatchTotalTickets?.ticketAmount}</p>
        </div>
        <hr />

        <div className="stats--coins">
          <div
            className={
              batchInfo?.["winner1"] === metaMaskAccountInfo.address
                ? "stats--coin--position won"
                : "stats--coin--position"
            }
          >
            <img src={CoinOne} alt="" />
            <div>
              <p className={isOpenInModal && "adjust--text--size"}>2.44 ETH</p>
            </div>
          </div>
          <div
            className={
              batchInfo?.["winner1"] === metaMaskAccountInfo.address
                ? "stats--coin--position won"
                : "stats--coin--position"
            }
          >
            <img src={CoinTwo} alt="" />
            <div>
              <p className={isOpenInModal && "adjust--text--size"}>1.33 ETH</p>
            </div>
          </div>
          <div
            className={
              batchInfo?.["winner1"] === metaMaskAccountInfo.address
                ? "stats--coin--position won"
                : "stats--coin--position"
            }
          >
            <img src={CoinThree} alt="" />
            <div>
              <p className={isOpenInModal && "adjust--text--size"}>0.92 ETH</p>
            </div>
          </div>
        </div>

        <div className="stats--payout">
          <img src={Trust} alt="" />
          <p onClick={() => setIsPayoutTransactionModal(true)}>
            Payout Transaction
          </p>
        </div>
        <hr />

        <div>
          <div className="stats--batch--tickets">
            <div>Blockchain :</div>
            <div className="stats--batch--tickets--div">
              <img src={EtheriumIcon} alt="" />
              <p>Ethereum</p>
            </div>
          </div>
          <div className="stats--batch--tickets">
            <div>Period :</div>
            <p>
              {contractInfo &&
                `${hoursToPeriod(contractInfo?.duration / 3600)
                  .charAt(0)
                  .toUpperCase()}${hoursToPeriod(
                  contractInfo?.duration / 3600
                ).slice(1)}`}
            </p>
          </div>
          <div className="stats--batch--tickets">
            <div>Ticket Price:</div>
            <p>{contractInfo && contractInfo.bidPrice / 10 ** 18} ETH</p>
          </div>
          <div className="stats--batch--tickets">
            <div>Sold Tickets :</div>
            <p>{transaction && getTransactionAmount(transaction)}</p>
          </div>
        </div>
        <hr />

        <div className="stats--batch--tickets">
          <div className="stats--closing--date">Closing Date :</div>
          <div className="stats--batch--closing--date--info">
            <p>{formatCustomDate(new Date(batchInfo?.endTime * 1000), 1)}</p>
            <div>
              {formatCustomDate(new Date(batchInfo?.endTime * 1000), 2)}
            </div>
          </div>
        </div>
        {!isOpenInModal && (
          <button
            className="stats--button"
            onClick={() => setBoughtTicketsModal(true)}
          >
            All Reward History
          </button>
        )}
      </div>

      {isPayoutTransactionModal && (
        <PayoutTransactionModal
          closeModal={() => setIsPayoutTransactionModal(false)}
        />
      )}
      {boughtTicketsModal && (
        <ShowBoughtBatchTickets
          closeModal={() => setBoughtTicketsModal(false)}
          modalText="Rewards Tickets"
        />
      )}
    </>
  );
};

export default ShowStats;
