import React, { useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import ShowStats from "../ShowStats";
import { useQuery } from "react-query";
import "./ShowBoughtBatchTickets.css";
import SearchIcon from "../../assets/Icons/SearchIcon.png";
import CloseModal from "../../assets/Icons/Button/CloseModal.svg";
import { WalletContext } from "../../App";

const ShowBoughtBatchTickets = ({ closeModal, modalText }) => {
  const { metaMaskAccountInfo } = useContext(WalletContext);

  const rewardBatch = modalText === "Rewards Tickets" ? true : false;
  const { data: userRewardBatches } = useQuery(
    ["WinningBatch"],
    async () => {
      const response = await fetch(
        `http://44.203.188.29/batch/user/${metaMaskAccountInfo.address}`
      );
      const data = await response.json();
      return data;
    },
    {
      enabled: rewardBatch && metaMaskAccountInfo.address !== null,
    }
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return ReactDOM.createPortal(
    <>
      <div className="modal--wrapper"></div>
      <div className="Bought-Connect" id="Connect">
        <div className="bought--tickets--head">
          <div className="Connect--Heading">
            <h1>{modalText}</h1>
            <img
              src={CloseModal}
              alt=""
              className="close-modal"
              onClick={closeModal}
            />
          </div>
          <div className="searchbar">
            <img src={SearchIcon} alt="" className="search--icon" />
            <input
              type="search"
              className="search--input"
              placeholder="Enter batch number"
            />
          </div>
        </div>
        <div className="bought--tickets--body">
          {userRewardBatches?.items?.length >= 1 &&
            userRewardBatches.items.map((value, index) => (
              <>
                <ShowStats key={index} isOpenInModal={true} batchInfo={value} />
              </>
            ))}
          <button className="stats--button">More Batches</button>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
};

export default ShowBoughtBatchTickets;
