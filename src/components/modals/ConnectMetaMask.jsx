import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import CloseModal from "../../assets/Icons/Button/CloseModal.svg";
import MetaMaskIcon from "../../assets/Icons/MetaMask.svg";
import Web3 from "web3";
import GrapeDraw from "../../contracts/GrapeDraw.json";
import "./ConnectMetaMask.css";
import { WalletContext } from "../../App";

const ConnectMetaMask = ({ closeModal }) => {
  const { metaMaskAccountInfo, setMetaMaskAccountInfo } =
    useContext(WalletContext);

  const handleCloseModal = (isConnected, address) => {
    closeModal(isConnected, address);
  };

  const ConnectToMetaMask = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3Instance = new Web3(window.ethereum);
        const contractAddress = "0x93C6D6c09a2682285268c2C2168Aca6B4a236887";
        const contract = new web3Instance.eth.Contract(
          GrapeDraw.abi,
          contractAddress
        );
        const accounts = await web3Instance.eth.getAccounts();
        setMetaMaskAccountInfo({
          ...metaMaskAccountInfo,
          web3: web3Instance,
          contractInstance: contract,
          isConnected: true,
          address: accounts[0],
        });
        handleCloseModal(true, accounts[0]);
      } else {
        console.error("MetaMask not detected. Please install MetaMask.");
      }
    } catch (error) {
      console.error("Error connecting:");
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
          <h1>Connect Wallet</h1>
          <img
            src={CloseModal}
            alt=""
            className="close-modal"
            onClick={handleCloseModal}
          />
        </div>
        <div className="Connect--Metamask--Display">
          <img src={MetaMaskIcon} alt="" />
          <h4>Metamask</h4>
        </div>
        <div className="Connect--Metamask--Button" onClick={ConnectToMetaMask}>
          <h4>Connect Metamask</h4>
        </div>
        <div className="Connect--Terms">
          <p>
            By clicking Connect Metamask, you are accepting the
            <span className="blue"> Terms of Use</span> and{" "}
            <span className="blue">Privacy Policy</span>
          </p>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
};

export default ConnectMetaMask;
