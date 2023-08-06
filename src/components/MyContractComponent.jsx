import React, { useState, useEffect } from "react";
import Web3 from "web3";

import GrapeDraw from "../contracts/GrapeDraw.json";

const MyContractComponent = () => {
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [data, setData] = useState(0);

  useEffect(() => {
    async function loadWeb3AndContract() {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
          // Use the contract address from the JSON file
          const contractAddress = "0x93C6D6c09a2682285268c2C2168Aca6B4a236887"; // Replace with your contract address
          const contract = new web3Instance.eth.Contract(
            GrapeDraw.abi,
            contractAddress
          );
          setContractInstance(contract);
        } catch (error) {
          console.error("Error loading Web3 or contract:", error);
        }
      } else {
        console.error("MetaMask not detected. Please install MetaMask.");
      }
    }

    loadWeb3AndContract();
  }, []);

  const handleGetData = async () => {
    try {
      const ether = 0.001 * 2;
      const bidAmount = web3.utils.toWei(ether.toString(), "ether");
      await contractInstance.methods.Bid(2).send({
        from: "0x7DBB98Ff98980F02D934a3AA15DE9C0dA1846246",
        value: bidAmount,
        gas: 90000,
      });
      setData("Bid successful!");
    } catch (error) {
      console.error("Error bidding:", error);
      setData("Error bidding. Please check the console for details.");
    }
  };

  //   const handleSetData = async () => {
  //     if (contractInstance && web3) {
  //       try {
  //         const newValue = 42; // Set your desired value here
  //         const accounts = await web3.eth.getAccounts();
  //         await contractInstance.methods
  //           .setData(newValue)
  //           .send({ from: accounts[0] });
  //         setData(newValue);
  //       } catch (error) {
  //         console.error("Error calling setData:", error);
  //       }
  //     }
  //   };

  return (
    <div>
      <h1>Smart Contract Example</h1>
      <p>Data: {data}</p>
      <button onClick={handleGetData}>Get Data</button>
      {/* <button onClick={handleSetData}>Set Data</button> */}
    </div>
  );
};

export default MyContractComponent;
