import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { userAllBatchesAsync } from "redux/syllabus/syllabus.async";
import { useSelector, useDispatch } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import NoVideo from "../../../assets/images/NoVideos.svg";
import moment from "moment";

function AllBatches() {
  const dispatch = useDispatch();
  const { allBatchLoader, allBatches } = useSelector(
    (state) => state?.syllabusAsy
  );

  useEffect(() => {
    dispatch(userAllBatchesAsync({}));
  }, []);

  return (
    <Container>
      {allBatchLoader ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 8,
            width: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : allBatches?.length > 0 ? (
        <Grid container spacing={2}>
          {allBatches?.map((item) => (
            <Grid item xs="12" sm="6" md="4">
              <Box
                sx={{
                  border: "1px solid #ccc",
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                <Box sx={{ width: "30%" }}>
                  <img
                    src={item?.courseThumbnail}
                    alt="thumbnail image"
                    width="60px"
                  />
                </Box>
                <Box sx={{ width: "70%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "18px",
                          mr: 1,
                        }}
                      >
                        Course:
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "16px",
                        }}
                      >
                        {item?.courseName} ({item?.className})
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                      Batch:
                    </Typography>
                    <Typography sx={{ ml: 1, fontSize: "16px" }}>
                      {item?.batchName}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                      Starts at:
                    </Typography>
                    <Typography sx={{ ml: 1, fontSize: "16px" }}>
                      {moment(item?.batchStartDate).format("DD MMM YYYY")}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
            mt: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={NoVideo} width="250px" />
          <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
            No Subscription Found!
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default AllBatches;
