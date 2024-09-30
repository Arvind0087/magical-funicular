import { useState, useEffect, useTransition } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment";
import { Helmet } from "react-helmet-async";
import { PATH_DASHBOARD } from "routes/paths";
import { getSubjectsByStudentAsync } from "../../../redux/async.api";
import NoVideo from "../../../assets/images/NoVideos.svg";

export default function Notes() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { siteTitle } = getOnlySiteSettingData;

  const { studentById = {} } = useSelector((state) => state?.student);
  const { subjectBy, subjectLoader } = useSelector((state) => state?.subject);

  useEffect(() => {
    dispatch(getSubjectsByStudentAsync());
  }, []);
  const backHandler = () => {
    navigate(-1);
  };

  const notesHandler = (item) => {
    navigate(`${PATH_DASHBOARD.notesChapter}`, {
      state: {
        subjectBy: item,
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Notes | {`${siteTitle}`}</title>
      </Helmet>
      <Box
        sx={{
          position: "relative",
          backgroundColor: "#fff",
          width: "103%",
          height: "50px",
          marginLeft: "-15px",
          // marginTop: "-14px",
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
            Notes
          </Typography>
        </Box>
      </Box>

      <Container>
        <Grid container spacing={2}>
          {subjectLoader ? (
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
          ) : subjectBy?.length > 0 ? (
            subjectBy?.map((item, index) => {
              return (
                <Grid item xs={12} sm={6} key={index}>
                  <Box
                    sx={{
                      backgroundColor: "#F9F9F9",
                      borderRadius: "10px",
                      width: "100%",
                      height: "60px",
                      padding: "10px 15px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Box>
                        <img src={item?.image} alt="notes data" width="35px" />
                      </Box>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          sx={{ fontSize: "16px", fontWeight: "600" }}
                        >
                          {item?.name}
                        </Typography>
                        <Typography sx={{ fontSize: "13px" }}>
                          Chapters {item?.chaptersCount}
                        </Typography>
                      </Box>
                    </Box>
                    <ArrowForwardIosIcon
                      sx={{ color: "#000", cursor: "pointer" }}
                      onClick={() => notesHandler(item)}
                    />
                  </Box>
                </Grid>
              );
            })
          ) : (
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
                  No data Found!
                </Typography>
              </Box>
            </Box>
          )}
        </Grid>
      </Container>
    </>
  );
}
