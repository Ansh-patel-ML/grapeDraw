import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { useQuery } from "react-query";
import CloseModal from "../../assets/Icons/Button/CloseModal.svg";
import CompletedIcon from "../../assets/Icons/CompletedIcon.png";
import "./index.css";

const PayoutTransactionModal = ({ closeModal, batchId }) => {
  const { data: payoutBatchInfo } = useQuery(
    ["payoutTransactionBatchInfo"],
    async () => {
      const response = await fetch(`http://44.203.188.29/batch/${batchId}`);
      const data = await response.json();
      return data;
    },
    {
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
              <p>
                {formatCustomDate(
                  new Date(payoutBatchInfo?.item?.endTime * 1000),
                  1
                )}
              </p>
              <div>
                {formatCustomDate(
                  new Date(payoutBatchInfo?.item?.endTime * 1000),
                  2
                )}
              </div>
            </div>
          </div>
          <div>
            <hr />
            <div className="payout--time--info--container">
              <div className="payout--tnx--info">
                <p>{payoutBatchInfo?.item?.amount1 / 10 ** 18} ETH</p>
                <div className="payout--completed">
                  <img src={CompletedIcon} alt="" />
                  <p>Completed</p>
                </div>
              </div>
              <div className="payout--address">
                <a
                  className="transaction--address"
                  href={`https://sepolia.etherscan.io/tx/${payoutBatchInfo?.item?.drawTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {payoutBatchInfo &&
                    payoutBatchInfo?.item?.drawTxHash.slice(0, -35)}
                  ...
                </a>
              </div>
            </div>
          </div>
          <div>
            <hr />
            <div className="payout--time--info--container">
              <div className="payout--tnx--info">
                <p>
                  {payoutBatchInfo && payoutBatchInfo?.item?.amount2 / 10 ** 18}{" "}
                  ETH
                </p>
                <div className="payout--completed">
                  <img src={CompletedIcon} alt="" />
                  <p>Completed</p>
                </div>
              </div>
              <div className="payout--address">
                <a
                  className="transaction--address"
                  href={`https://sepolia.etherscan.io/tx/${payoutBatchInfo?.item?.drawTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {payoutBatchInfo &&
                    payoutBatchInfo?.item?.drawTxHash.slice(0, -35)}
                  ...
                </a>
              </div>
            </div>
          </div>
          <div>
            <hr />
            <div className="payout--time--info--container">
              <div className="payout--tnx--info">
                <p>
                  {payoutBatchInfo && payoutBatchInfo?.item?.amount3 / 10 ** 18}{" "}
                  ETH
                </p>
                <div className="payout--completed">
                  <img src={CompletedIcon} alt="" />
                  <p>Completed</p>
                </div>
              </div>
              <div className="payout--address">
                <a
                  className="transaction--address"
                  href={`https://sepolia.etherscan.io/tx/${payoutBatchInfo?.item?.drawTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {payoutBatchInfo &&
                    payoutBatchInfo?.item?.drawTxHash.slice(0, -35)}
                  ...
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
};

export default PayoutTransactionModal;
