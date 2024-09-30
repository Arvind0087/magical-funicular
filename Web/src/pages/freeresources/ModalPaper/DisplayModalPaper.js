import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import pdficon from "../../../assets/images/pdficon.png";
import NoVideo from "../../../assets/images/NoVideos.svg";

function DisplayModalPaper() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const modalData = location?.state?.item;

  const backHandler = () => {
    navigate(-1);
  };

  const resourceHandler = () => {
    navigate(`/app/syllabus/resource/${modalData?.id}`, {
      state: {
        id: modalData?.id,
        url: modalData?.pdf,
        resourceType: "pdf",
      },
    });
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          backgroundColor: "#fff",
          width: "103%",
          height: "50px",
          marginLeft: "-15px",
          mt: 2,
        }}
      >
        <Box
          sx={{
            ml: 5,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ArrowBackIcon
            sx={{ color: "#000", cursor: "pointer" }}
            onClick={backHandler}
          />
          <Typography sx={{ color: "#000", fontSize: "18px" }}>
            {modalData?.pdf_title}
          </Typography>
        </Box>
      </Box>

      <Container>
        {!modalData ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img src={NoVideo} alt="" width="250px" />
              <Typography sx={{ fontWeight: 600, mt: 1 }}>
                No Modal Paper Found!
              </Typography>
            </Box>
          </Box>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Box
                sx={{
                  backgroundColor: "#FFF",
                  borderBottom: "1px dashed #ccc",
                  width: "100%",
                  height: "60px",
                  padding: "10px 15px",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: "35px",
                    height: "35px",
                    cursor: "pointer",
                  }}
                  onClick={resourceHandler}
                  className="playIconPdf"
                >
                  <img src={pdficon} alt="play icon" />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography sx={{ fontSize: "14px" }}>
                    {modalData?.pdf_title}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
}

export default DisplayModalPaper;
