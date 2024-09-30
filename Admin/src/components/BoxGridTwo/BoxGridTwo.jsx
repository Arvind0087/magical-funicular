import React from "react";
import { Box } from "@mui/material";

const BoxGridTwo = ({ children, smframe = 2, rowGap = 3 }) => {
  return (
    <Box
      rowGap={rowGap}
      columnGap={2}
      display="grid"
      gridTemplateColumns={{
        xs: "repeat(1, 1fr)",
        sm: `repeat(${smframe}, 1fr)`,
      }}
    >
      {children}
    </Box>
  );
};

export default BoxGridTwo;
