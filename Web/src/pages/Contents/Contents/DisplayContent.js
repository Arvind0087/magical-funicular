import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CircularProgress from "@mui/material/CircularProgress";
import {
  getLearningContentByIdAsync,
  chapterNotesAsync,
} from "redux/syllabus/syllabus.async";
import Grid from "@mui/material/Grid";
import playicon from "../../../assets/images/playicon.png";
import pdficon from "../../../assets/images/pdficon.png";
import lockicon from "../../../assets/images/lockicon.png";
import "./style.css";

function DisplayContent() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    learningLoader,
    learningAsync,
    learningData,
    notesLoader,
    notesData,
  } = useSelector((state) => state?.syllabusAsy);
  const [tabVal, setTabVal] = useState("class");

  const chapterById = location?.state?.val;
  const subjectId = location?.state?.subjectId;
  const courseStatus = location?.state?.courseStatus;

  const backHandler = () => {
    navigate(-1);
  };

  const handleTabChange = (event, newValue) => {
    setTabVal(newValue);
  };

  useEffect(() => {
    if (tabVal !== "practice") {
      const payload = {
        subjectId: subjectId,
        chapterId: chapterById?.id,
        category: tabVal == "class" ? "Learning Content" : "Help Resource",
      };
      dispatch(getLearningContentByIdAsync(payload));
    }
  }, [tabVal]);

  useEffect(() => {
    let payload = { chapterId: chapterById?.id };
    dispatch(chapterNotesAsync(payload));
  }, [chapterById?.id]);

  const handleNavVideoPlayerPage = (itemId, subjectId) => {
    navigate(`/app/syllabus/${itemId}`, {
      state: {
        subjectId: subjectId,
      },
    });
  };

  const resourceHandler = (val) => {
    navigate(`/app/syllabus/resource/${val?.id}`, {
      state: {
        id: val?.id,
        url: val?.note,
        resourceType: "pdf",
      },
    });
  };

  // const localLearningData =
  //   learningData?.data?.length > 0 &&
  //   learningData?.data[0]?.tag == "Help Resource"
  //     ? learningData?.data?.length > 0 &&
  //       learningData?.packagePurcahsed == false
  //       ? [learningAsync[0]]
  //       : learningAsync
  //     : [];

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
          // background: "linear-gradient(to right, #098A4E, #9ADD00)",
          // zIndex: 12344,
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
            {chapterById?.name}
          </Typography>
        </Box>
      </Box>
      <Container>
        <Box>
          <TabContext value={tabVal}>
            <Box sx={{ borderColor: "divider" }}>
              <TabList onChange={handleTabChange}>
                <Tab label="Classes" value="class" />
                <Tab label="Notes" value="note" />
                <Tab label="Practice" value="practice" />
              </TabList>
            </Box>
            <TabPanel value="class">
              <Box>
                {learningLoader ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : courseStatus !== "notpaid" && learningAsync?.length > 0 ? (
                  <Grid container spacing={2}>
                    {courseStatus !== "notpaid" &&
                      learningAsync?.map((item, index) => {
                        return (
                          <Grid item xs={12} sm={10}>
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
                                cursor: item.lockStatus ? "auto" : "pointer",
                                // pointerEvents: item.lockStatus ? "none" : "",
                                // opacity: item.lockStatus ? 0.6 : 1,
                              }}
                              onClick={() => {
                                handleNavVideoPlayerPage(item?.id, subjectId);
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 2,
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: "35px",
                                    height: "35px",
                                  }}
                                  className="playIcon"
                                >
                                  <img src={playicon} alt="play icon" />
                                </Box>

                                <Typography sx={{ fontSize: "18px" }}>
                                  {item?.name}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        );
                      })}
                  </Grid>
                ) : courseStatus == "notpaid" ? (
                  <>
                    {learningData?.packagePurcahsed == false && (
                      <Box
                        sx={{
                          backgroundColor: "#FFF",
                          width: "100%",
                          height: "60px",
                          padding: "10px 15px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              width: "35px",
                              height: "35px",
                            }}
                            className="playIconPdf"
                          >
                            <img src={lockicon} alt="lock icon" />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography sx={{ fontSize: "18px" }}>
                                That’s all for the
                              </Typography>
                              <Box
                                sx={{
                                  backgroundColor: "#F26B35",
                                  borderRadius: "2px",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    padding: "2px 5px",
                                    color: "#fff",
                                  }}
                                >
                                  Free Plan
                                </Typography>
                              </Box>
                            </Box>
                            <Box>
                              <Typography
                                sx={{
                                  fontSize: "12px",
                                  color: "#A2A3A5",
                                }}
                              >
                                Enroll into Our Courses to Unlock all topics
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {learningData?.packagePurcahsed == false && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          width: "50%",
                        }}
                      >
                        <Button
                          sx={{
                            background:
                              "linear-gradient(to right, #F27235, #FDDA3F)",
                            width: "30%",
                            color: "#fff",
                            mt: 2,
                          }}
                        >
                          Buy Course
                        </Button>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box>
                    <p>No Data found!</p>
                  </Box>
                )}
              </Box>
            </TabPanel>

            <TabPanel value="note">
              {notesLoader ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : notesData[0]?.note !== null ? (
                <Grid container spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: "18px", fontWeight: "600", mb: 1 }}
                    >
                      Study Notes
                    </Typography>
                  </Box>

                  {notesData?.map((item, index) => {
                    return (
                      <Grid item xs={12} sm={7}>
                        <Box
                          sx={{
                            backgroundColor: "#FFF",
                            borderBottom: "1px dashed #ccc",
                            width: "100%",
                            height: "60px",
                            padding: "10px 15px",
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: "35px",
                              height: "35px",
                              cursor: "pointer",
                            }}
                            onClick={() => resourceHandler(item)}
                            className="playIconPdf"
                          >
                            <img src={pdficon} alt="play icon" />
                          </Box>

                          <Typography sx={{ fontSize: "18px" }}>
                            {item?.chapterName}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : courseStatus == "notpaid" ? (
                <>
                  {learningData?.packagePurcahsed == false && (
                    <Box
                      sx={{
                        backgroundColor: "#FFF",
                        width: "100%",
                        height: "60px",
                        padding: "10px 15px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: "35px",
                            height: "35px",
                          }}
                          className="playIconPdf"
                        >
                          <img src={lockicon} alt="lock icon" />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography sx={{ fontSize: "18px" }}>
                              That’s all for the
                            </Typography>
                            <Box
                              sx={{
                                backgroundColor: "#F26B35",
                                borderRadius: "2px",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "12px",
                                  padding: "2px 5px",
                                  color: "#fff",
                                }}
                              >
                                Free Plan
                              </Typography>
                            </Box>
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                fontSize: "12px",
                                color: "#A2A3A5",
                              }}
                            >
                              Enroll into Our Courses to Unlock all topics
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {learningData?.packagePurcahsed == false && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "50%",
                      }}
                    >
                      <Button
                        sx={{
                          background:
                            "linear-gradient(to right, #F27235, #FDDA3F)",
                          width: "30%",
                          color: "#fff",
                          mt: 2,
                        }}
                      >
                        Buy Course
                      </Button>
                    </Box>
                  )}
                </>
              ) : (
                <Box>
                  <p>No Data found!</p>
                </Box>
              )}
            </TabPanel>

            <TabPanel value="practice"></TabPanel>
          </TabContext>
        </Box>
      </Container>
    </>
  );
}

export default DisplayContent;
