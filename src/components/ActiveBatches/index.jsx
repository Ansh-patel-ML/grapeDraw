import React, { useEffect, useContext, useState, useRef } from "react";
import Web3 from "web3";
import { useQuery } from "react-query";
import { WalletContext } from "../../App";
import useResizeObserver from "../../Utils/customHooks/ResizeObserver";
import RenderBatchs from "../RenderBatchs";
import Stats from "../Stats";
import "./index.css";

const ActiveBatches = () => {
  const { metaMaskAccountInfo, setMetaMaskAccountInfo } =
    useContext(WalletContext);

  const [width, setWidth] = useState();
  const BatchRef = useRef(null);

  const handleResize = (entries) => {
    for (let entry of entries) {
      const { width } = entry.contentRect;
      setWidth(width);
    }
  };

  const { data: ActiveBatches, isLoading } = useQuery(
    ["batch"],
    async () => {
      const response = await fetch(`${process.env.REACT_APP_API}/contract`);
      const data = await response.json();
      return data;
    },
    {
      refetchInterval: 30000,
    }
  );

  useResizeObserver(BatchRef, handleResize);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setMetaMaskAccountInfo({
        ...metaMaskAccountInfo,
        web3: web3Instance,
      });
    }
  }, []);

  return (
    <div
      className={
        width >= 768 ? "Active--Batches flipPosition" : "Active--Batches"
      }
      ref={BatchRef}
    >
      {}
      <div
        className={
          width < 768 ? "Active--Batches--Main unFlip" : "Active--Batches--Main"
        }
      >
        <h1>Active Batches</h1>
        {!isLoading &&
          ActiveBatches.items
            .filter((batch) => {
              if (batch.state === "active") {
                return batch;
              }
            })
            .map((batchInfo, index) => {
              return <RenderBatchs batchInfo={batchInfo} key={index} />;
            })}
        {!isLoading &&
          ActiveBatches.items.filter((batch) => batch.state === "active")
            .length === 0 && <h2>No Active Batch Found</h2>}
      </div>
      {width < 768 && <Stats width={width} />}
      {width >= 768 && <Stats width={width} />}
    </div>
  );
};

export default ActiveBatches;
