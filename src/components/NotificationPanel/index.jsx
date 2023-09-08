import React from "react";
import NotificationDot from "../../assets/Icons/NotificationDot.svg";
import "./index.css";

const NotificationPanel = ({ data }) => {
  const formatCustomDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "UTC",
    };

    const formattedDate = date.toLocaleString("en-US", options);
    const timePart = formattedDate.split(", ")[1];
    return `${formattedDate.split(", ")[0]} at ${timePart} UTC`;
  };

  return (
    <div className="Notification--Container" key={data.id}>
      <div className="Notification--Text">
        <h4>
          Congrats! Your <span className="Blue">ticket</span> won on Batch{" "}
          <span className="Blue">#{data.id}</span>
        </h4>
        <h4>{formatCustomDate(new Date(data.endTime * 1000))}</h4>
      </div>
      <div className="Notification--Unseen">
        <img src={NotificationDot} alt="" />
      </div>
    </div>
  );
};

export default NotificationPanel;
