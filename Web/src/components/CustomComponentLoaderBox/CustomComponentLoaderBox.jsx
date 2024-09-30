import { CircularProgress } from "@material-ui/core";
import { Box } from "@mui/material";
import React from "react";

const CustomComponentLoaderBox = ({ padding, size }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        color: "primary.main",
      }}
    >
      <div
        style={{
          padding: padding,
        }}
      >
        <CircularProgress color="inherit" size={size} />
      </div>
    </Box>
  );
};

export default CustomComponentLoaderBox;
