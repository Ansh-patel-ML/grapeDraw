import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import "./TransactionModal.css";
import CloseModal from "../../assets/Icons/Button/CloseModal.svg";

const transactions = [
  {
    date: "June 24, 2023",
    transaction: [
      {
        ticketsQTY: 3,
        address: "0x5287b9736e648...",
        time: "00:07",
      },
      {
        ticketsQTY: 3,
        address: "0xe3230077c765c...",
        time: "00:06",
      },
      {
        ticketsQTY: 3,
        address: "0x813f68c6f7b4d...",
        time: "00:02",
      },
    ],
  },

  {
    date: "June 23, 2023",
    transaction: [
      {
        ticketsQTY: 787,
        address: "0x5287b9736e648...",
        time: "23:59",
      },
      {
        ticketsQTY: 2,
        address: "0xe3230077c765c...",
        time: "23:52",
      },
      {
        ticketsQTY: "67",
        address: "0x813f68c6f7b4d...",
        time: "23:52",
      },
      {
        ticketsQTY: 787,
        address: "0x5287b9736e648...",
        time: "23:47",
      },
      {
        ticketsQTY: 2,
        address: "0xe3230077c765c...",
        time: "23:42",
      },
    ],
  },
  {
    date: "June 23, 2023",
    transaction: [
      {
        ticketsQTY: 787,
        address: "0x5287b9736e648...",
        time: "23:59",
      },
      {
        ticketsQTY: 2,
        address: "0xe3230077c765c...",
        time: "23:52",
      },
      {
        ticketsQTY: "67",
        address: "0x813f68c6f7b4d...",
        time: "23:52",
      },
      {
        ticketsQTY: 787,
        address: "0x5287b9736e648...",
        time: "23:47",
      },
      {
        ticketsQTY: 2,
        address: "0xe3230077c765c...",
        time: "23:42",
      },
    ],
  },
];

const TransactionModal = ({ closeModal }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return ReactDOM.createPortal(
    <>
      <div className="modal--wrapper"></div>
      <div className="Connect" id="Connect">
        <div className="Connect--Heading Transaction-heading">
          <h1>Transaction</h1>
          <img
            src={CloseModal}
            alt=""
            className="close-modal"
            onClick={closeModal}
          />
        </div>
        <div className="transaction--modal">
          <div className="transaction--header">
            <h3>Batch #134</h3>
            <hr />
          </div>
          <div className="transaction--body">
            {transactions?.map((transaction, index) => (
              <div key={index}>
                <p className="transaction--date">{transaction.date}</p>

                <div>
                  {transaction.transaction?.map((data, index) => (
                    <div key={index} className="single-transaction">
                      {typeof data.ticketsQTY === "string" ? (
                        <h5 className="debited">
                          {`You Paid ${data.ticketsQTY} Tickets`}
                        </h5>
                      ) : (
                        <h5>{`Paid ${data.ticketsQTY} Tickets`}</h5>
                      )}

                      <div className="transaction">
                        <p className="transaction--address">{data.address}</p>
                        <p>{data.time}</p>
                      </div>
                    </div>
                  ))}
                  <hr />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
};

export default TransactionModal;
