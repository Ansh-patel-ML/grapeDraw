import React, { useState, useRef } from "react";

import "./Wrapper.css";
import useResizeObserver from "./customHooks/ResizeObserver";

const Wrapper = ({ children }) => {
  const WrapperRef = useRef(null);
  const [, setWidth] = useState(0);

  const handleResize = (entries) => {
    for (let entry of entries) {
      const { width } = entry.contentRect;
      setWidth(width);
    }
  };

  useResizeObserver(WrapperRef, handleResize);

  return (
    <div className={"high--padding"} ref={WrapperRef}>
      {children}
    </div>
  );
};

export default Wrapper;
