import React, { useContext, useState } from "react";
import { MetaMaskAvatar } from "react-metamask-avatar";

import "./ShowRewardHistory.css";
import { WalletContext } from "../App";
import NotificationPanel from "./NotificationPanel";
import BoughtTicketsModal from "./modals/BoughtTicketsModal";

const tempData = [
  {
    id: 1,
    message: "#138",
    date: "June 23, 2023 at 9:59 AM UTC",
  },
  {
    id: 2,
    message: "#134",
    date: "June 21, 2023 at 10:59 AM UTC",
  },
  {
    id: 3,
    message: "#132",
    date: "June 20, 2023 at 9:59 AM UTC",
  },
  {
    id: 4,
    message: "#131",
    date: "June 19, 2023 at 9:59 AM UTC",
  },
  {
    id: 5,
    message: "#130",
    date: "June 18, 2023 at 9:59 AM UTC",
  },
  {
    id: 6,
    message: "#129",
    date: "June 17, 2023 at 9:59 AM UTC",
  },
  {
    id: 7,
    message: "#128",
    date: "June 16, 2023 at 9:59 AM UTC",
  },
  {
    id: 8,
    message: "#127",
    date: "June 15, 2023 at 9:59 AM UTC",
  },
];

const ShowRewardHistory = () => {
  const { metaMaskAccountInfo } = useContext(WalletContext);
  const [boughtTicketsModal, setBoughtTicketsModal] = useState(false);

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
            <h4 className="Grey">Notifications:</h4>
            <h4 className="Blue">Clear</h4>
          </div>
          <div className="ShowRewards--Notification--Container">
            {tempData.map((data) => {
              return <NotificationPanel data={data} key={data.id} />;
            })}
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
