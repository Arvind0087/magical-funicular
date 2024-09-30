import React from "react";
import LoaderImG from "../../assets/ldloader.svg";
import { Box } from "@mui/material";

const CustomLoader = ({ padding, size, width }) => {
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={LoaderImG}
        alt="loader"
        style={{
          width: width,
        }}
      />
    </Box>
  );
};

export default CustomLoader;
