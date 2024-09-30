import { Box, Skeleton } from "@mui/material";
import React from "react";

const SyllabusVideokeleton = () => {
  return (
    <Box
      sx={{
        width: "280px",
        background: "#e7e9eb",
        mr: 2,
        px: 2,
        py: 2,
        border: "1px solid #f3f6f9",
        borderRadius: "10px",
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <Skeleton
          variant="text"
          width="20%"
          height={30}
          sx={{ fontSize: "1rem" }}
        />
        <Skeleton
          variant="text"
          width="10%"
          height={30}
          sx={{ fontSize: "1rem" }}
        />
      </Box>
      <Box display="flex" justifyContent="center" sx={{ mt: "10px" }}>
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
      <Box sx={{ mt: "20px" }}>
        <Skeleton
          variant="text"
          width="50%"
          height={30}
          sx={{ fontSize: "1rem" }}
        />
        <Skeleton
          variant="text"
          width="80%"
          height={30}
          sx={{ fontSize: "1rem" }}
        />
      </Box>
    </Box>
  );
};

export default SyllabusVideokeleton;
