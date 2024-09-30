import { CircularProgress } from "@material-ui/core";
import React from "react";

const CustomComponentLoader = ({ padding, size }) => {
  return (
    <div
      style={{
        padding: padding,
      }}
    >
      <CircularProgress color="inherit" size={size} />
    </div>
  );
};

export default CustomComponentLoader;
