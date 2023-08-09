import React, { useState } from "react";
import "./ShowStats.css";
import EtheriumIcon from "../../assets/Icons/Ethereum.svg";
import CoinOne from "../../assets/Icons/FirstPlace.png";
import CoinTwo from "../../assets/Icons/SecondPlace.png";
import CoinThree from "../../assets/Icons/ThirdPlace.png";
import Trust from "../../assets/Icons/Trust.svg";
import PayoutTransactionModal from "./PayoutTransactionModal";

const ShowStats = ({ isOpenInModal }) => {
  const [isPayoutTransactionModal, setIsPayoutTransactionModal] =
    useState(false);

  return (
    <>
      <div className={isOpenInModal ? "stats--card bought--ticket--card" : "stats--card"}>
        {!isOpenInModal && (
          <>
            <h2 className="stats--header">Stats</h2>
            <hr />
          </>
        )}

        <p className="stats--batch--no">Batch #131</p>
        <div className="stats--batch--tickets">
          <div>Bought Tickets :</div>
          <p>0</p>
        </div>
        <hr />

        <div className="stats--coins">
          <div className="stats--coin--position">
            <img src={CoinOne} alt="" />
            <div>
              <p className={isOpenInModal && "adjust--text--size"}>2.44 ETH</p>
            </div>
          </div>
          <div className="stats--coin--position">
            <img src={CoinTwo} alt="" />
            <div>
              <p className={isOpenInModal && "adjust--text--size"}>1.33 ETH</p>
            </div>
          </div>
          <div className="stats--coin--position">
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
            <p>Weekly</p>
          </div>
          <div className="stats--batch--tickets">
            <div>Ticket Price:</div>
            <p>0.0001 ETH</p>
          </div>
          <div className="stats--batch--tickets">
            <div>Sold TIckets :</div>
            <p>4,879</p>
          </div>
        </div>
        <hr />

        <div className="stats--batch--tickets">
          <div className="stats--closing--date">Closing Date :</div>
          <div className="stats--batch--closing--date--info">
            <p>June 24, 2023</p>
            <div>at 9:59 AM UTC</div>
          </div>
        </div>
        {!isOpenInModal && <button className="stats--button">All Reward History</button>}
      </div>

      {isPayoutTransactionModal && (
        <PayoutTransactionModal
          closeModal={() => setIsPayoutTransactionModal(false)}
        />
      )}
    </>
  );
};

export default ShowStats;
