import React, { useContext, useEffect, useState } from "react";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { useQuery } from "react-query";
import "./ShowRewardHistory.css";
import { WalletContext } from "../App";
import NotificationPanel from "./NotificationPanel";
import ShowBoughtBatchTickets from "./modals/ShowBoughtBatchTickets";
import { TailSpin } from "react-loader-spinner";

const ShowRewardHistory = () => {
  const { metaMaskAccountInfo } = useContext(WalletContext);
  const [boughtTicketsModal, setBoughtTicketsModal] = useState(false);
  const [noNotification, setNoNotification] = useState(false);

  const { data: winningBatch, isLoading } = useQuery(
    ["userWinningBatch"],
    async () => {
      const response = await fetch(
        `http://44.203.188.29/batch/user/${metaMaskAccountInfo.address}?status=winnings`
      );
      const data = await response.json();
      return data;
    }
  );

  const { data: userWinningBatchTotalTickets } = useQuery(
    ["userWinningBatchTotalTickets"],
    async () => {
      const response = await fetch(
        `http://44.203.188.29/bid/user/${metaMaskAccountInfo.address}`
      );
      const data = await response.json();
      const ticketsAmount = data.items.reduce((acc, curr) => {
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

  useEffect(() => {
    setNoNotification(JSON.parse(localStorage.getItem("no-notification")));
  }, []);

  return (
    <>
      <div className="ShowRewards--Container">
        <div className="ShowRewards--Header">
          <h4>My Tickets</h4>
          <h4 className="Blue" onClick={() => setBoughtTicketsModal(true)}>
            {userWinningBatchTotalTickets &&
              userWinningBatchTotalTickets?.ticketAmount}{" "}
            Tickets
          </h4>
        </div>
        <div className="ShowRewards--Main">
          <div className="Notification">
            {noNotification === true || winningBatch?.items?.length === 0 ? (
              ""
            ) : (
              <h4 className="Grey">Notifications:</h4>
            )}
            {noNotification === true ||
              (winningBatch?.items?.length >= 1 && (
                <h4
                  className="Blue"
                  onClick={() => {
                    localStorage.setItem(
                      "no-notification",
                      JSON.stringify(true)
                    );
                    setNoNotification(true);
                  }}
                >
                  Clear
                </h4>
              ))}
          </div>
          <div className="ShowRewards--Notification--Container">
            {(noNotification === false || noNotification === null) &&
              winningBatch &&
              winningBatch.items.map((data) => {
                return <NotificationPanel data={data} key={data.id} />;
              })}
            {isLoading && (
              <TailSpin
                height="30"
                width="30"
                color="#4fa94d"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{
                  justifyContent: "center",
                }}
                visible={true}
              />
            )}
            {(noNotification === true || winningBatch?.items?.length === 0) && (
              <h4 className="gray" style={{ textAlign: "center" }}>
                No Notification
              </h4>
            )}
          </div>
        </div>
        <div className="ShowRewards--Footer">
          <h4>Wallet Address:</h4>
          <div>
            <MetaMaskAvatar address={metaMaskAccountInfo.address} size={32} />
            <h4>
              {metaMaskAccountInfo.address.slice(0, 6)}...
              {metaMaskAccountInfo.address.slice(-4)}
            </h4>
          </div>
        </div>
      </div>
      {boughtTicketsModal && (
        <ShowBoughtBatchTickets
          closeModal={() => setBoughtTicketsModal(false)}
          modalText="Bought Tickets"
        />
      )}
    </>
  );
};

export default ShowRewardHistory;
