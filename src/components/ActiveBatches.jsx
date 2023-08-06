import React, { useEffect, useContext, useState, useRef } from "react";
import Web3 from "web3";

import Batch from "./Batch";
import Stats from "./Stats";
import "./ActiveBatches.css";
import { WalletContext } from "../App";
import GrapeDraw from "../contracts/GrapeDraw.json";
import useResizeObserver from "../Utils/customHooks/ResizeObserver";

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

  useResizeObserver(BatchRef, handleResize);

  useEffect(() => {
    if(window.ethereum){
      const web3Instance = new Web3(window.ethereum);
      const contractAddress = "0x93C6D6c09a2682285268c2C2168Aca6B4a236887";
      const contract = new web3Instance.eth.Contract(
        GrapeDraw.abi,
        contractAddress
      );
      setMetaMaskAccountInfo({
        ...metaMaskAccountInfo,
        web3: web3Instance,
        contractInstance: contract,
      });
    }
  },[]);

  return (
    <div
      className={
        width >= 768 ? "Active--Batches flipPosition" : "Active--Batches"
      }
      ref={BatchRef}
    >
      {width < 768 && <Stats width={width} />}
      {}
      <div
        className={
          width < 768 ? "Active--Batches--Main unFlip" : "Active--Batches--Main"
        }
      >
        <h1>Active Batches</h1>
        <Batch />
        <Batch />
      </div>
      {width >= 768 && <Stats width={width} />}
    </div>
  );
};

export default ActiveBatches;
