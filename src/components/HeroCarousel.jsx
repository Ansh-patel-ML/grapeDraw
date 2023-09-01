import React, { useEffect } from "react";
import { useQuery } from "react-query";
import SoldTickets from "../assets/Icons/SoldTickets.svg";
import TotalPrizeFund from "../assets/Icons/TotalPrizeFund.svg";
import ActiveBatchesFund from "../assets/Icons/ActiveBatchesFund.svg";

import "./HeroCarousel.css";

const statsCard = [
  {
    iconName: "activeBatchesFund",
    title1: "Active Batches' ",
    title2: "Prize Fund",
    amount: "$389.768",
    EthereumQTY: "191.02 ETH",
  },
  {
    iconName: "soldTickets",
    title1: "Active Batches' ",
    title2: "Sold Tickets",
    amount: "167,025 Tickets",
  },
  {
    iconName: "totalPrizeFund",
    title1: "Total ",
    title2: "Prize Fund",
    amount: "$1,847,099",
    EthereumQTY: "796.18 ETH",
  },
];

const icons = {
  activeBatchesFund: ActiveBatchesFund,
  soldTickets: SoldTickets,
  totalPrizeFund: TotalPrizeFund,
};

const HeroCarousel = () => {
  const {
    isLoading,
    error,
    data: lotteryStats,
  } = useQuery("lotteryStats", async () => {
    const response = await fetch("http://44.203.188.29/lotteryStats");
    const data = await response.json();
    return data;
  });

  const { data: ethPriceInUSD } = useQuery(["networkData"], async () => {
    const response = await fetch(`http://44.203.188.29/networkData`);
    const data = await response.json();
    return data;
  });

  useEffect(() => {
    if (lotteryStats && ethPriceInUSD) {
      statsCard[0].amount = `$${(
        ethPriceInUSD?.ethPrice * lotteryStats.active.prizeFound
      ).toFixed(2)}`;
      statsCard[0].EthereumQTY = `${lotteryStats.active.prizeFound} ETH`;
      statsCard[1].amount = `${lotteryStats.active.soldTickets} Tickets`;
      statsCard[2].amount = `$${(
        ethPriceInUSD?.ethPrice * lotteryStats.total.prizeFound
      ).toFixed(2)}`;
      statsCard[2].EthereumQTY = `${lotteryStats.total.prizeFound} ETH`;
    }
  }, [lotteryStats, ethPriceInUSD]);

  return (
    <div className="carousel--container">
      {statsCard?.map((statsData, index) => (
        <div className="stats--card--body" key={index}>
          <div className="stats--upper--body">
            <img src={icons?.[statsData["iconName"]] || ""} alt="" />
          </div>

          <div className="stats--lower--body">
            <h3 className="stats--title">
              <span>{statsData?.title1 || ""}</span>
              <span className="stats--title2">{statsData?.title2 || ""}</span>
            </h3>
            <hr />
            <div className="stats--lower--body--valus">
              <p>{statsData?.amount || ""}</p>
              <p>{statsData?.EthereumQTY || ""}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroCarousel;
