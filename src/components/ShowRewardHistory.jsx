import React, { useContext, useState } from "react";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { useQuery } from "react-query";
import "./ShowRewardHistory.css";
import { WalletContext } from "../App";
import NotificationPanel from "./NotificationPanel";
import BoughtTicketsModal from "./modals/BoughtTicketsModal";
import { TailSpin } from "react-loader-spinner";

const ShowRewardHistory = () => {
  const { metaMaskAccountInfo } = useContext(WalletContext);
  const [boughtTicketsModal, setBoughtTicketsModal] = useState(false);

  const { data: winningBatch, isLoading } = useQuery(
    ["userWinningBatch"],
    async () => {
      const response = await fetch(
        `http://44.203.188.29/batch/user/${metaMaskAccountInfo.address}`
      );
      const data = await response.json();
      return data;
    }
  );

  return (
    <>
      <div className="ShowRewards--Container">
        <div className="ShowRewards--Header">
          <h4>My Tickets</h4>
          <h4 className="Blue" onClick={() => setBoughtTicketsModal(true)}>
            29 Tickets
          </h4>
        </div>
        <div className="ShowRewards--Main">
          <div className="Notification">
            {winningBatch?.items?.length === 0 ? (
              ""
            ) : (
              <h4 className="Grey">Notifications:</h4>
            )}
            {winningBatch?.items?.length >= 1 && (
              <h4 className="Blue">Clear</h4>
            )}
          </div>
          <div className="ShowRewards--Notification--Container">
            {!isLoading &&
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
            {winningBatch?.items?.length === 0 && (
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
        <BoughtTicketsModal closeModal={() => setBoughtTicketsModal(false)} />
      )}
    </>
  );
};

export default ShowRewardHistory;
