import React from "react";
import "./Footer.css";

import DiscordIcon from "../assets/Icons/Button/Discord.svg";
import TelegramIcon from "../assets/Icons/Button/Telegram.svg";
import TwitterIcon from "../assets/Icons/Button/Twitter.svg";

const Footer = () => {
  return (
    <div className="Footer">
      <div className="Footer--sectionOne">
        <h4>Subscribe to our channels to keep up with the next batches</h4>
        <div className="Footer--Icon--Container">
          <img src={DiscordIcon} alt="" />
          <img src={TwitterIcon} alt="" />
          <img src={TelegramIcon} alt="" />
        </div>
      </div>
      <div className="Footer--sectionTwo">
        <p>Created with ♥️ for the Decentralized World.</p>
        <div className="Footer--links--container">
          <a href="#">Terms of Use</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
