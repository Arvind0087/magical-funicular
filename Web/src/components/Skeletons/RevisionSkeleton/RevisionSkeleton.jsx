import { Box, Card, Grid, Skeleton } from "@mui/material";
import React from "react";

const RevisionSkeleton = () => {
  return (
    <Grid container spacing={2} mt={2}>
      <Grid item xs={10} md={6} lg={4}>
        <Card
          sx={{
            p: 2,
            width: "100%",
            borderRadius: "5px",
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Skeleton variant="text" width="50%" sx={{ fontSize: "1rem" }} />
            <Skeleton variant="text" width="10%" sx={{ fontSize: "1rem" }} />
          </Box>
          <Skeleton
            variant="rounded"
            width="100%"
            height={200}
            sx={{ my: 2 }}
          />
          <Skeleton variant="text" width="100%" sx={{ fontSize: "1rem" }} />
          <Skeleton variant="text" width="100%" sx={{ fontSize: "1rem" }} />
        </Card>
      </Grid>
    </Grid>
  );
};

export default RevisionSkeleton;
