import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { getActivityReportOfUserAsync } from "redux/async.api";
import _ from "lodash";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ClockImage from "assets/images/ClockImage.svg";
import VideoIconImage from "assets/images/VideoIconImage.svg";
import NoteIconImage from "assets/images/NoteIconImage.svg";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSettingsContext } from "components/settings";
import CustomComponentLoader from "components/CustomComponentLoader";
import { PATH_DASHBOARD } from "routes/paths";
import LearningRecentContent from "./learningRecentContent";
import CircularProgressGraph from "../../../src/pages/dashboard/CircularProgressGraph";

export default function MyLearningReports() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { themeStretch } = useSettingsContext();
  const { getActivityReportOfUserLoader, activityReportOfUser = {} } =
    useSelector((state) => state?.activity);
  const currentUrl = location.pathname;
  useEffect(() => {
    dispatch(getActivityReportOfUserAsync());
  }, []);
  //NOTE: redirect to recentActivity page
  const handleRecentActivityClick = (label) => {
    navigate(PATH_DASHBOARD.recentActivity, {
      state: {
        label: label,
      },
    });
  };
  return (
    <Container maxWidth={themeStretch ? false : "xl"}>
      {Object.keys(activityReportOfUser)?.length ? (
        <>
          {getActivityReportOfUserLoader ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                color: "primary.main",
                mt: 28,
              }}
            >
              <CustomComponentLoader padding="0" size={50} />
            </Box>
          ) : (
            <>
              <Typography
                variant="h4"
                sx={{ m: 1 }}
                display={
                  currentUrl == "/app/MyLearningReports" ? "block" : "none"
                }
              >
                My Learning Reports
              </Typography>
              <Box
                sx={{
                  backgroundColor: "rgba(242, 107, 53, 0.1)",
                  width: { xs: "100%", sm: "80%", md: "50%" },
                  height: "250px",
                  borderRadius: "12px",
                  mt: 8,
                }}
              >
                <Box
                  sx={{
                    background: "linear-gradient(to right, #F26B35, #FEDD40)",
                    width: "100%%",
                    height: "100px",
                    borderRadius: "12px 12px 0px 0px",
                    padding: "0px 15px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "20px",
                        fontWeight: "500",
                        color: "#fff",
                      }}
                    >
                      Recent Activities
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: "400",
                        color: "#fff",
                      }}
                    >
                      Track your recently studied topics
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    height: "auto",
                    display: "flex",
                    justifyContent: "space-between",
                    pl: { xs: 1, sm: 3, md: 4 },
                    pr: { xs: 1, sm: 3, md: 4 },
                    pt: { xs: 3, sm: 3, md: 3 },
                  }}
                >
                  {/*<Box>
                    <Box sx={{ display: "flex" }}>
                      {"⏳"}{" "}
                      <Typography
                        sx={{
                          fontSize: { xs: "15px", sm: "20px", md: "23px" },
                          fontWeight: "600",
                        }}
                      >
                        Weekly Time Spent
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        mt: 1,
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: "35px", sm: "40px", md: "45px" },
                          fontWeight: "700",
                          color: "#f26b35",
                        }}
                      >
                        {activityReportOfUser?.weeklyTimeSpent}
                      </Typography>{" "}
                      <Typography
                        sx={{
                          fontSize: { xs: "18px", sm: "20px", md: "20px" },
                          fontWeight: "600",
                          color: "rgba(103, 105, 108, 1)",
                        }}
                      >
                        Minutes
                      </Typography>
                    </Box>
                  </Box> */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      mt: "-20px",
                    }}
                  >
                    <CircularProgressGraph
                      value={activityReportOfUser?.learnPercent}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: { xs: "10px", sm: "18px", md: "20px" },
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: "70px", sm: "80px", md: "80px" },
                        height: "100px",
                        backgroundColor: "rgba(242, 107, 53, 0.2)",
                        border: "2px solid #fff",
                        borderRadius: "6px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        pt: 2,
                        pb: 2,
                      }}
                      onClick={() => handleRecentActivityClick("Learn")}
                    >
                      <Typography
                        sx={{
                          color: "#f26b35",
                          fontSize: "24px",
                          fontWeight: "600",
                        }}
                      >
                        {activityReportOfUser?.learnActivity}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#f26b35",
                          fontSize: "20px",
                          fontWeight: "500",
                        }}
                      >
                        Learn
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: { xs: "70px", sm: "80px", md: "80px" },
                        height: "100px",
                        backgroundColor: "rgba(242, 107, 53, 0.2)",
                        border: "2px solid #fff",
                        borderRadius: "6px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        pt: 2,
                        pb: 2,
                      }}
                      onClick={() => handleRecentActivityClick("Test")}
                    >
                      <Typography
                        sx={{
                          color: "#f26b35",
                          fontSize: "24px",
                          fontWeight: "600",
                        }}
                      >
                        {activityReportOfUser?.totalTest}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#f26b35",
                          fontSize: "20px",
                          fontWeight: "500",
                        }}
                      >
                        Test
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/*<Box sx={{ mt: 3 }}>
                <LearningRecentContent
                  activityReportOfUser={activityReportOfUser}
                />
              </Box> */}
            </>
          )}
        </>
      ) : (
        <Box sx={{ width: "100%", textAlign: "center", marginTop: "80px" }}>
          <Typography variant="h5">No Data Found</Typography>
        </Box>
      )}
    </Container>
  );
}
