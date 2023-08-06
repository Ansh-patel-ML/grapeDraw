import React, { useState } from "react";

import "./BoughtTickets.css";
import "./modals/ShowStats.css";
import Trust from "./../assets/Icons/Trust.svg";
import CoinOne from "./../assets/Icons/FirstPlace.png";
import CoinTwo from "./../assets/Icons/SecondPlace.png";
import CoinThree from "./../assets/Icons/ThirdPlace.png";
import EtheriumIcon from "./../assets/Icons/Ethereum.svg";
import PayoutTransactionModal from "./modals/PayoutTransactionModal";

const BoughtTickets = () => {
  const [isPayoutTransactionModal, setIsPayoutTransactionModal] =
    useState(false);

  return (
    <>
      <div className="stats--card bought--ticket--card">
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
              <p>2.44 ETH</p>
            </div>
          </div>
          <div className="stats--coin--position">
            <img src={CoinTwo} alt="" />
            <div>
              <p>1.33 ETH</p>
            </div>
          </div>
          <div className="stats--coin--position">
            <img src={CoinThree} alt="" />
            <div>
              <p>0.92 ETH</p>
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
            <div>Peropd :</div>
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
          <div>Closing Date :</div>
          <div>
            <p>June 24, 2023</p>
            <div>at 9:59 AM UTC</div>
          </div>
        </div>
      </div>

      {isPayoutTransactionModal && (
        <PayoutTransactionModal
          closeModal={() => setIsPayoutTransactionModal(false)}
        />
      )}
    </>
  );
};

export default BoughtTickets;
