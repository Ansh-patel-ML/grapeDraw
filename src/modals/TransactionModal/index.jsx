import React, { useEffect, useState, useContext } from "react";
import ReactDOM from "react-dom";
import { useQuery } from "react-query";
import { WalletContext } from "../../App";
import { TailSpin } from "react-loader-spinner";
import moment from "moment";
import CloseModal from "../../assets/Icons/Button/CloseModal.svg";
import "./index.css";

const TransactionModal = ({ closeModal, batchId }) => {
  const { metaMaskAccountInfo } = useContext(WalletContext);
  const [tnxMonth, setThxMonth] = useState(null);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const { data: batchData, isLoading } = useQuery(
    ["batch", batchId],
    async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API}/bid/batch/${batchId}`
      );
      const data = await response.json();
      return data;
    },
    {
      refetchInterval: 30000,
    }
  );

  return ReactDOM.createPortal(
    <>
      <div className="modal--wrapper"></div>
      <div className="transactionModal--Connect" id="transaction--Connect">
        <div className="transactionModal--Heading">
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
            <h3>{`Batch #${batchId}`}</h3>
            <hr />
          </div>
          <div className="transaction--body">
            {isLoading ? (
              <TailSpin
                height="40"
                width="40"
                color="#4fa94d"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{
                  width: "100%",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
                wrapperClass=""
                visible={true}
              />
            ) : (
              <>
                <div>
                  <p className="transaction--date">{tnxMonth}</p>
                  {batchData.items.length === 0 && (
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        color: "#000",
                        fontWeight: "bold",
                        marginTop: "20px",
                      }}
                    >
                      No Transaction to show
                    </p>
                  )}
                  {batchData.items.length !== 0 &&
                    batchData.items?.map((tnx, index) => {
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
                              {`${tnx.txHash.slice(0, 20)}...`}
                            </a>
                            <p>{moment(tnx.date).format("HH:mm")}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
};

export default TransactionModal;
