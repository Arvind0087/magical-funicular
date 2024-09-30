import React from "react";

import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import RadialSeparators from "./RadialSeparators";

const CircularProgressGraph = ({ value }) => (
  <div style={{ width: "80px" }}>
    <CircularProgressbarWithChildren
      value={value}
      text={`${value}%`}
      strokeWidth={10}
      styles={buildStyles({
        strokeLinecap: "butt",
      })}
    >
      <RadialSeparators
        count={10}
        style={{
          background: "#fff",
          width: "2px",
          height: `${10}%`,
          color: "#fff",
        }}
      />
    </CircularProgressbarWithChildren>
  </div>
);

export default CircularProgressGraph;
