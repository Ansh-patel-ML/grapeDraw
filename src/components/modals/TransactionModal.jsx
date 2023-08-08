import React, { useEffect, useState, useContext } from "react";
import ReactDOM from "react-dom";
import { useQuery } from "react-query";
import "./TransactionModal.css";
import moment from "moment";
import { WalletContext } from "../../App";
import CloseModal from "../../assets/Icons/Button/CloseModal.svg";

const TransactionModal = ({ closeModal, batchId }) => {
  const { metaMaskAccountInfo } = useContext(WalletContext);
  const [tnxMonth, setThxMonth] = useState(null);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const { data: batchData, isLoading, isError } = useQuery(
    ["batch", batchId],
    async () => {
      const response = await fetch(
        `http://44.203.188.29/batch/SEPOLIA/0xe802a503fe148bb09da203c8b6d46c54cc4eea10/${batchId}`
      );
      const data = await response.json();
      return data;
    }
  );

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
            <div>
              <p className="transaction--date">{tnxMonth}</p>
              {batchData?.map((tnx, index) => {
                if (tnxMonth === null) {
                  setThxMonth(moment(tnx.date).format("LL"));
                }
                return (
                  <div key={index} className="single-transaction">
                    {tnx.sender === metaMaskAccountInfo.address ? (
                      <h5 className="debited">
                        {`You Paid ${tnx.ticketsAmount} Tickets`}
                      </h5>
                    ) : (
                      <h5>{`Paid ${tnx.ticketsAmount} Tickets`}</h5>
                    )}

                    <div className="transaction">
                      <a
                        className="transaction--address"
                        href={`https://sepolia.etherscan.io/tx/${tnx.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {`${tnx.txHash.slice(0, 30)}...`}
                      </a>
                      <p>{moment(tnx.date).format("LT")}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
};

export default TransactionModal;
