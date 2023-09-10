import React, { useState, useContext } from "react";
import { useQuery } from "react-query";
import { WalletContext } from "../../App";
import ShowBoughtBatchTickets from "../ShowBoughtBatchTickets";
import PayoutTransactionModal from "../../modals/PayoutTransactionModal";
import EtheriumIcon from "../../assets/Icons/Ethereum.svg";
import CoinOne from "../../assets/Icons/FirstPlace.png";
import CoinTwo from "../../assets/Icons/SecondPlace.png";
import CoinThree from "../../assets/Icons/ThirdPlace.png";
import Trust from "../../assets/Icons/Trust.svg";
import "./index.css";

const ShowStats = ({ isOpenInModal, batchInfo }) => {
  const { metaMaskAccountInfo } = useContext(WalletContext);
  const [isPayoutTransactionModal, setIsPayoutTransactionModal] =
    useState(false);
  const [boughtTicketsModal, setBoughtTicketsModal] = useState(false);

  const { data: userWinningBatchTotalTickets } = useQuery(
    ["userWinningBatchTotalTickets", batchInfo?.id],
    async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API}/bid/user/${metaMaskAccountInfo.address}`
      );
      const data = await response.json();
      const ticketsAmount = data.items
        .filter((batch) => {
          if (batch["batchId"] === batchInfo["id"]) {
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
      enabled: metaMaskAccountInfo.address !== null && batchInfo !== undefined,
      refetchInterval: 30000,
    }
  );

  const { data: contractInfo } = useQuery(
    ["contractInfo", batchInfo?.id],
    async () => {
      const response = await fetch(`${process.env.REACT_APP_API}/contract`);
      const data = await response.json();
      const contractById = data.items.filter(
        (val) => val.id === batchInfo?.contractId
      )[0];
      return contractById;
    },
    {
      enabled: batchInfo === undefined ? false : true,
      refetchInterval: 30000,
    }
  );

  const { data: transaction } = useQuery(
    ["transaction", batchInfo?.id],
    async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API}/bid/batch/${batchInfo.id}`
      );
      const data = await response.json();
      return data;
    },
    {
      enabled: batchInfo === undefined ? false : true,
      refetchInterval: 30000,
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
      return `${timePart} UTC`;
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
    return transactionAmount?.amount;
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
        {batchInfo === undefined ? (
          <>
            <h2 style={{ textAlign: "center" }}>No Stats Found</h2>
          </>
        ) : (
          <>
            <p className="stats--batch--no">{`Batch #${batchInfo?.id}`}</p>
            {batchInfo?.["winner1"] === metaMaskAccountInfo.address && (
              <div className="celebration--container">
                <p>🎉 Congratulations, you won 1st place here.</p>
              </div>
            )}
            {batchInfo?.["winner2"] === metaMaskAccountInfo.address && (
              <div className="celebration--container">
                <p>🎉 Congratulations, you won 2nd place here.</p>
              </div>
            )}
            {batchInfo?.["winner3"] === metaMaskAccountInfo.address && (
              <div className="celebration--container">
                <p>🎉 Congratulations, you won 3rd place here.</p>
              </div>
            )}
            <div className="stats--batch--tickets">
              <div>Bought Tickets :</div>
              <p>
                {userWinningBatchTotalTickets?.ticketAmount === undefined
                  ? 0
                  : userWinningBatchTotalTickets?.ticketAmount}
              </p>
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
                  <p className={isOpenInModal && "adjust--text--size"}>
                    {batchInfo.amount1 / 10 ** 18} ETH
                  </p>
                </div>
              </div>
              <div
                className={
                  batchInfo?.["winner2"] === metaMaskAccountInfo.address
                    ? "stats--coin--position won"
                    : "stats--coin--position"
                }
              >
                <img src={CoinTwo} alt="" />
                <div>
                  <p className={isOpenInModal && "adjust--text--size"}>
                    {batchInfo.amount2 / 10 ** 18} ETH
                  </p>
                </div>
              </div>
              <div
                className={
                  batchInfo?.["winner3"] === metaMaskAccountInfo.address
                    ? "stats--coin--position won"
                    : "stats--coin--position"
                }
              >
                <img src={CoinThree} alt="" />
                <div>
                  <p className={isOpenInModal && "adjust--text--size"}>
                    {batchInfo.amount3 / 10 ** 18} ETH
                  </p>
                </div>
              </div>
            </div>
            {batchInfo?.state !== "active" && (
              <>
                <div className="stats--payout">
                  <img src={Trust} alt="" />
                  <p onClick={() => setIsPayoutTransactionModal(true)}>
                    Payout Transaction
                  </p>
                </div>
              </>
            )}
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
                <p>
                  {formatCustomDate(new Date(batchInfo?.endTime * 1000), 1)}
                </p>
                <div>
                  {formatCustomDate(new Date(batchInfo?.endTime * 1000), 2)}
                </div>
              </div>
            </div>
            {!isOpenInModal && metaMaskAccountInfo.address && (
              <button
                className="stats--button"
                onClick={() => setBoughtTicketsModal(true)}
              >
                All Reward History
              </button>
            )}
          </>
        )}
      </div>

      {isPayoutTransactionModal && (
        <PayoutTransactionModal
          closeModal={() => setIsPayoutTransactionModal(false)}
          batchId={batchInfo.id}
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
