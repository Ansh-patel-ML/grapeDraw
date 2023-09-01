import React from "react";
import { useQuery } from "react-query";
import Batch from "./Batch";
import { TailSpin } from "react-loader-spinner";

const RenderBatchs = ({ batchInfo }) => {
  const { data: batch, isLoading } = useQuery(["contract"], async () => {
    const response = await fetch(
      `http://44.203.188.29/batch/contract/${batchInfo.id}`
    );
    const data = await response.json();
    return data;
  });
  return (
    <>
      {isLoading && (
        <>
          <TailSpin
            height="40"
            width="40"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{
              justifyContent: "center",
            }}
            visible={true}
          />
          <h4
            className="gray"
            style={{
              textAlign: "center",
              marginLeft: "15px",
              marginTop: "15px",
            }}
          >
            Searching for Batches...
          </h4>
        </>
      )}
      {!isLoading && (
        <>
          {batch?.items
            .filter((contract) => {
              if (contract.state === "active") {
                return contract;
              }
            })
            .map((activeContract, index) => {
              return (
                <Batch
                  batchInfo={activeContract}
                  key={index}
                  contractAddress={batchInfo.address}
                  batchDuration={batchInfo.duration}
                  bidPriceInWei={batchInfo.bidPrice}
                />
              );
            })}
        </>
      )}
    </>
  );
};

export default RenderBatchs;
