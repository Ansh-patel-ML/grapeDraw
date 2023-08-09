import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import CloseModal from "../../assets/Icons/Button/CloseModal.svg";
import CompletedIcon from "../../assets/Icons/CompletedIcon.png";
import "./PayoutTransactionModal.css";

const transactions = [
  {
    ETH_QTY: "2.44 ETH",
    accountAddress: "0x5287b9736e648...",
    transaction: "Completed",
  },
  {
    ETH_QTY: "1.33 ETH",
    accountAddress: "0x9f57b953h6648...",
    transaction: "Completed",
  },
  {
    ETH_QTY: "0.92 ETH",
    accountAddress: "0x5287b9736e648...",
    transaction: "Completed",
  },
];

const PayoutTransactionModal = ({ closeModal }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return ReactDOM.createPortal(
    <>
      <div className="modal--wrapper"></div>
      <div className="Connect">
        <div className="Connect--Heading">
          <h1 className="payout--tnx--heading">Payout Transaction</h1>
          <img
            src={CloseModal}
            alt=""
            className="close-modal"
            onClick={closeModal}
          />
        </div>
        <div className="payout--body">
          {window.innerWidth > 345 && <h4>Order #w15987h454578yuj_657</h4>}
          {window.innerWidth <= 345 && <h4>Order #w15987h45457...</h4>}

          <div className="payout--time">
            <div>Time:</div>
            <div className="payout--time--info">
              <p>June 24, 2023</p>
              <div>at 9:59 AM UTC</div>
            </div>
          </div>

          {transactions.map((transactionDetails, index) => (
            <div key={index}>
              <hr />
              <div className="payout--time--info--container">
                {/* <div>
                  <p>{transactionDetails.ETH_QTY}</p>
                  <div className="payout--address">
                    {transactionDetails.accountAddress}
                  </div>
                </div>
                <div className="payout--completed">
                  <img src={CompletedIcon} alt="" />
                  <p>{transactionDetails.transaction}</p>
                </div> */}
                <div className="payout--tnx--info">
                  <p>{transactionDetails.ETH_QTY}</p>
                  <div className="payout--completed">
                    <img src={CompletedIcon} alt="" />
                    <p>{transactionDetails.transaction}</p>
                  </div>
                </div>
                <div className="payout--address">
                  {transactionDetails.accountAddress}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
};

export default PayoutTransactionModal;
