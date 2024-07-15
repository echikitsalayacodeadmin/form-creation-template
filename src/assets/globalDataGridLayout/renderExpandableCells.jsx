import React, { useEffect, useRef, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { Typography } from "@mui/material";

const RenderExpandableCells = (props) => {
  const [isOverflowed, setIsOverflow] = useState(false);
  const { value } = props;

  const textElementRef = useRef(null);

  const checkOverflow = () => {
    const clientWidth = textElementRef.current.getBoundingClientRect().width;

    textElementRef.current.style.overflow = "visible";
    const contentWidth = textElementRef.current.getBoundingClientRect().width;
    textElementRef.current.style.overflow = "hidden";

    setIsOverflow(contentWidth > clientWidth);
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, []);

  // const displayValue = Array.isArray(value) ? value.join(", ") : value;

  // const displayValue = Array.isArray(value)
  //   ? value.join(", ")
  //   : typeof value === "object" && Array.isArray(value)
  //   ? Object.entries(value)
  //       .map(([key, val]) => `${key}: ${val}`)
  //       .join(", ")
  //   : value;

  const displayValue =
    value !== null && value !== undefined
      ? Array.isArray(value)
        ? value.join(", ")
        : typeof value === "object" && !Array.isArray(value)
        ? Object.entries(value)
            .map(([key, val]) => `${key}: ${val}`)
            .join(", ")
        : String(value)
      : "";

  return (
    <Tooltip title={displayValue} disableHoverListener={!isOverflowed}>
      <span
        ref={textElementRef}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {displayValue}
      </span>
    </Tooltip>
  );
};

export default RenderExpandableCells;
