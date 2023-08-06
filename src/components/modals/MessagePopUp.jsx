import React from "react";
import ReactDOM from "react-dom";
import ClosePopUpIcon from "../../assets/Icons/Button/CloseModal.svg";

import "./MessagePopUp.css";

const MessagePopUp = ({ message, closePopUp }) => {
  const handleClosePopUp = () => {
    closePopUp();
  };
  return ReactDOM.createPortal(
    <div className="PopUp--Container">
      <p>{message}</p>
      <img src={ClosePopUpIcon} alt="" onClick={handleClosePopUp} />
    </div>,
    document.getElementById("modal")
  );
};

export default MessagePopUp;
