import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./BoughtTicketsModal.css";
import SearchIcon from "../../assets/Icons/SearchIcon.png";
import CloseModal from "../../assets/Icons/Button/CloseModal.svg";
import { useState } from "react";
import ShowStats from "../ShowStats";

const BoughtTicketsModal = ({ closeModal }) => {
  const [batches, setBatches] = useState(["1", "2", "3"]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return ReactDOM.createPortal(
    <>
      <div className="modal--wrapper"></div>
      <div className="Bought-Connect" id="Connect">
        <div className="bought--tickets--head">
          <div className="Connect--Heading">
            <h1>Bought Tickets</h1>
            <img
              src={CloseModal}
              alt=""
              className="close-modal"
              onClick={closeModal}
            />
          </div>
          <div className="searchbar">
              <img src={SearchIcon} alt="" className="search--icon" />
            <input
              type="search"
              className="search--input"
              placeholder="Enter batch number"
            />
          </div>
        </div>
        <div className="bought--tickets--body">
          {batches.map((index) => (
            <>
              <ShowStats key={index} isOpenInModal={true} />
            </>
          ))}
          <button
            className="stats--button"
            onClick={() => setBatches((prev) => [...prev, "4", "5", "6"])}
          >
            More Batches
          </button>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
};

export default BoughtTicketsModal;
