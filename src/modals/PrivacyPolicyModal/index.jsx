import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { PrivacyPolicyData } from "../../data/PrivacyPolicy";
import CloseModal from "../../assets/Icons/Button/CloseModal.svg";
import "../TermsOfUseModal/index.css";

const PrivacyPolicyModal = ({ closeModal }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return ReactDOM.createPortal(
    <>
      <div className="modal--wrapper"></div>
      <div className="TermsOfUse-Connect">
        <div className="TermsOfUse--tickets--head">
          <div className="Connect--Heading">
            <h1 style={{ marginLeft: "13px" }}>Privacy Policy</h1>
            <img
              src={CloseModal}
              alt=""
              className="close-modal"
              onClick={() => closeModal(false)}
            />
          </div>
        </div>
        <div className="TermsOfUse--tickets--body">
          <div className="terms--of--use--mainContainer">
            {PrivacyPolicyData.map((terms, index) => {
              if (!terms.subSection && !terms.endSubtitle) {
                return (
                  <div className="terms--of--use" key={terms.id}>
                    <h2 className="terms--of--use--title">{terms.title}</h2>
                    {terms?.email ? (
                      <p className="terms--of--use--subTitle">
                        {terms.subTitle}{" "}
                        <a href={`mailto:${terms.email}`}>{terms.email}</a>
                      </p>
                    ) : (
                      <p className="terms--of--use--subTitle">
                        {terms.subTitle}
                      </p>
                    )}
                  </div>
                );
              } else if (Object.keys(terms).includes("subSection")) {
                return (
                  <div className="terms--of--use">
                    <h2 className="terms--of--use--title">{terms.title}</h2>
                    <p className="terms--of--use--subTitle">{terms.subTitle}</p>
                    {terms.subSection.map((subSection, index) => {
                      return (
                        <div
                          className="terms--of--use--subSection--container"
                          key={subSection.id}
                        >
                          <h2 className="terms--of--use--title">
                            {subSection.title}
                          </h2>
                          <p className="terms--of--use--subTitle">
                            {subSection.subTitle}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              } else {
                return (
                  <div>
                    <p className="terms--of--use--subTitle">
                      {terms.endSubtitle}
                    </p>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
};

export default PrivacyPolicyModal;
