import React from "react";

import "./NotificationPanel.css";
import NotificationDot from "../assets/Icons/NotificationDot.svg";

const NotificationPanel = ({ data }) => {
  return (
    <div className="Notification--Container" key={data.id}>
      <div className="Notification--Text">
        <h4>
          Congrats! Your <span className="Blue">ticket</span> won on Batch{" "}
          <span className="Blue">{data.message}</span>
        </h4>
        <h4>{data.date}</h4>
      </div>
      <div className="Notification--Unseen">
        <img src={NotificationDot} alt="" />
      </div>
    </div>
  );
};

export default NotificationPanel;
