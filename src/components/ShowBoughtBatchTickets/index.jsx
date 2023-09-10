import React, { useEffect, useContext, useState } from "react";
import ReactDOM from "react-dom";
import { useQuery } from "react-query";
import { TailSpin } from "react-loader-spinner";
import { WalletContext } from "../../App";
import ShowStats from "../ShowStats";
import SearchIcon from "../../assets/Icons/SearchIcon.png";
import CloseModal from "../../assets/Icons/Button/CloseModal.svg";
import "./index.css";

const ShowBoughtBatchTickets = ({ closeModal, modalText }) => {
  const { metaMaskAccountInfo } = useContext(WalletContext);
  const [searchedBatched, setSearchedBatched] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const { data: userRewardBatches, isLoading: userRewardBatchesLoading } =
    useQuery(
      ["allWinningBatch"],
      async () => {
        const response = await fetch(
          `${process.env.REACT_APP_API}/batch/user/${metaMaskAccountInfo.address}?status=winnings`
        );
        const data = await response.json();
        return data;
      },
      {
        enabled:
          modalText === "Rewards Tickets" &&
          metaMaskAccountInfo.address !== null,
        refetchInterval: 30000,
      }
    );

  const { data: allArchivedBatch, isLoading: allArchivedBatchSearching } =
    useQuery(
      ["allArchivedBatchs"],
      async () => {
        const response = await fetch(
          `${process.env.REACT_APP_API}/batch/user/${metaMaskAccountInfo.address}?status=all`
        );
        const data = await response.json();
        return data;
      },
      {
        enabled:
          modalText === "Bought Tickets" &&
          metaMaskAccountInfo.address !== null,
        refetchInterval: 30000,
      }
    );

  const { data: searchedBatchByUser, isLoading: searchingBatch } = useQuery(
    ["searchedBatchByInput", searchedBatched],
    async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API}/batch/${searchedBatched}`
      );
      const data = await response.json();
      if (modalText !== "Bought Tickets") {
        const filteredBatch = userRewardBatches.items.filter(
          (batch) => batch.id === +searchedBatched
        );
        if (filteredBatch.length >= 1) {
          return {
            item: filteredBatch[0],
          };
        } else {
          return {
            item: null,
          };
        }
      }
      return data;
    },
    {
      enabled: searchedBatched !== "" && metaMaskAccountInfo.address !== null,
      refetchInterval: 30000,
    }
  );

  const handleChange = (e) => {
    setSearchedBatched(e.target.value);
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
      <div className="Bought-Connect" id="Bought-connect--imp">
        <div className="bought--tickets--head">
          <div className="Connect--Heading">
            <h1>{modalText}</h1>
            <img
              src={CloseModal}
              alt=""
              className="close-modal"
              onClick={closeModal}
            />
          </div>
          <div
            className={isFocused ? "searchbar searchbar--focused" : "searchbar"}
          >
            <img
              src={SearchIcon}
              alt=""
              className="search--icon"
              onClick={() => setSearchedBatched(null)}
            />
            <input
              type="search"
              placeholder="Enter batch number"
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={
                isFocused
                  ? "search--input search--input--focused"
                  : "search--input"
              }
            />
          </div>
        </div>
        {userRewardBatchesLoading === true ||
        allArchivedBatchSearching === true ? (
          <>
            <TailSpin
              height="30"
              width="30"
              color="#4fa94d"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{
                alignItem: "center",
                justifyContent: "center",
                marginTop: "130px",
              }}
              visible={true}
            />
            <h4
              className="batchNotFound"
              style={{ marginLeft: "20px", marginTop: "5px" }}
            >
              Loading Batches..
            </h4>
          </>
        ) : (
          <div className="bought--tickets--body">
            {modalText === "Rewards Tickets" &&
              searchedBatched === "" &&
              userRewardBatches?.items?.length >= 1 &&
              userRewardBatches.items.map((value) => (
                <>
                  <ShowStats
                    key={value.id}
                    isOpenInModal={true}
                    batchInfo={value}
                  />
                </>
              ))}
            {modalText === "Rewards Tickets" &&
              searchedBatched === "" &&
              userRewardBatches?.items?.length === 0 && (
                <h2 style={{ marginTop: "40px", textAlign: "center" }}>
                  No {modalText} Found
                </h2>
              )}
            {modalText === "Rewards Tickets" &&
              searchedBatched === null &&
              userRewardBatches?.items?.length >= 1 && (
                <button className="stats--button">More Batches</button>
              )}

            {modalText === "Bought Tickets" &&
              searchedBatched === "" &&
              allArchivedBatch?.items?.length >= 1 &&
              allArchivedBatch.items.map((value) => (
                <>
                  <ShowStats
                    key={value.id}
                    isOpenInModal={true}
                    batchInfo={value}
                  />
                </>
              ))}
            {modalText === "Bought Tickets" &&
              searchedBatched === "" &&
              allArchivedBatch?.items?.length === 0 && (
                <h2 style={{ marginTop: "40px", textAlign: "center" }}>
                  No {modalText} Found
                </h2>
              )}
            {modalText === "Bought Tickets" &&
              searchedBatched === null &&
              allArchivedBatch?.items?.length >= 1 && (
                <button className="stats--button">More Batches</button>
              )}

            {searchedBatchByUser && searchedBatchByUser?.item !== null && (
              <>
                <ShowStats
                  isOpenInModal={true}
                  batchInfo={searchedBatchByUser.item}
                />
              </>
            )}
            {searchedBatchByUser && searchedBatchByUser.item === null && (
              <>
                <h4 className="batchNotFound">{`Batch "${searchedBatched}" not found`}</h4>
              </>
            )}

            {searchingBatch === true && (
              <>
                <TailSpin
                  height="30"
                  width="30"
                  color="#4fa94d"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{
                    alignItem: "center",
                    justifyContent: "center",
                  }}
                  visible={true}
                />
                <h4
                  className="batchNotFound"
                  style={{ marginLeft: "20px", marginTop: "5px" }}
                >
                  Searching..
                </h4>
              </>
            )}
          </div>
        )}
      </div>
    </>,
    document.getElementById("modal")
  );
};

export default ShowBoughtBatchTickets;
