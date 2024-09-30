import { Box, Skeleton } from "@mui/material";
import React from "react";

const SubjectsSkeleton = () => {
  return (
    <Box
      sx={{
        width: "170px",
        background: "#fafbfd",
        mr: 2,
        p: 4,
        border: "1px solid #f3f6f9",
      }}
    >
      <Box display="flex" justifyContent="center" mb={1}>
        <Skeleton variant="circular" width={70} height={70} />
      </Box>
      <Skeleton variant="text" height={30} sx={{ fontSize: "1rem" }} />
      <Skeleton variant="text" height={30} sx={{ fontSize: "1rem" }} />
    </Box>
  );
};

export default SubjectsSkeleton;
