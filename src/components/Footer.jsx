import React from "react";
import "./Footer.css";
import TermsOfUseModal from "./modals/TermsOfUseModal";
import PrivacyPolicyModal from "./modals/PrivacyPolicyModal";
import DiscordIcon from "../assets/Icons/Button/Discord.svg";
import TelegramIcon from "../assets/Icons/Button/Telegram.svg";
import TwitterIcon from "../assets/Icons/Button/Twitter.svg";
import heartIcon from "../assets/Icons/heart-fill.png";

const Footer = () => {
  const [closeTermsOfUseModal, setCloseTermsOfUseModal] = React.useState(false);
  const [closePrivacyPolicyModal, setClosePrivacyPolicyModal] =
    React.useState(false);
  return (
    <>
      {closeTermsOfUseModal && (
        <TermsOfUseModal closeModal={setCloseTermsOfUseModal} />
      )}
      {closePrivacyPolicyModal && (
        <PrivacyPolicyModal closeModal={setClosePrivacyPolicyModal} />
      )}
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
          <p>
            Created with <img src={heartIcon} alt="" className="Footer--icon" />{" "}
            for the Decentralized World.
          </p>
          <div className="Footer--links--container">
            <div onClick={() => setCloseTermsOfUseModal(true)}>
              Terms of Use
            </div>
            <div onClick={() => setClosePrivacyPolicyModal(true)}>
              Privacy Policy
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
