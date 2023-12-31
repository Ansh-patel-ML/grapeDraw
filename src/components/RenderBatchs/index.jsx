import React from "react";
import { useQuery } from "react-query";
import { TailSpin } from "react-loader-spinner";
import Batch from "../Batch";

const RenderBatchs = ({ batchInfo }) => {
  const { data: batch, isLoading } = useQuery(
    ["contract", batchInfo.id],
    async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API}/batch/contract/${batchInfo.id}`
      );
      const data = await response.json();
      return data;
    },
    {
      refetchInterval: 30000,
    }
  );

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
                  batchChain={batchInfo.chain}
                />
              );
            })}
        </>
      )}
    </>
  );
};

export default RenderBatchs;
