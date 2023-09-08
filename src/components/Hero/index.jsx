import React, { useRef, useState } from "react";
import useResizeObserver from "../../Utils/customHooks/ResizeObserver";
import HeroCarousel from "../HeroCarousel";
import "./index.css";

const Hero = () => {
  const heroRef = useRef(null);
  const [width, setWidth] = useState(0);

  const handleResize = (entries) => {
    for (let entry of entries) {
      const { width } = entry.contentRect;
      setWidth(width);
    }
  };

  useResizeObserver(heroRef, handleResize);
  return (
    <div className="hero" ref={heroRef}>
      <div
        className={
          "hero--texts--container " + (width <= 530 && "text--realign")
        }
      >
        {width <= 530 && (
          <>
            <h3>Get access to daily prize pools with as little as $1</h3>
            <h6>95% of the funds are divided among the winners.</h6>
          </>
        )}
        {width > 530 && (
          <>
            <h3>Get access to daily prize</h3>
            <h3>pools with as little as $1</h3>
            <h6>95% of the funds are divided among</h6>
            <h6>the winners.</h6>
          </>
        )}
      </div>
      <HeroCarousel screenWidth={width} />
    </div>
  );
};

export default Hero;
