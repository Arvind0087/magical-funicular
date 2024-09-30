import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { PATH_DASHBOARD } from "../../../routes/paths";
import LinearWithValueLabel from "../../auth/accountsComponents/ProgressBar";
import { useSettingsContext } from "../../../components/settings";
import {
  getScoreSummaryAsync,
  getTestAttemptedCountAsync,
  questionAnalysisAsync,
  questionTimeAnalysisAsync,
  timeSpendForTestAsync,
} from "redux/async.api";

const ReportSummmaryPage = () => {
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const PRIMARY_MAIN = theme.palette.primary.main;
  const PRIMARY_LIGHT = theme.palette.primary.light;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { userId, testId, type } = location?.state;
  const { test } = useSelector((state) => state);
  const {
    getTestAttemptedCount,
    getScoreSummary,
    getQuestionAnalysisData,
    getQuestionTimeAnalysis,
    getTimeSpendForTest,
  } = test;
  // states
  const [attempt, setAttempt] = useState("");
  const array = ["quiz_test", "scholarship_test", "assignment"];
  // functions
  const handleChange = (event) => {
    setAttempt(event.target.value);
  };

  const goToPage = () => {
    navigate(PATH_DASHBOARD.answerKey, {
      state: {
        testId: testId,
        attemptCount: attempt,
        category: type,
      },
    });
  };
  useEffect(() => {
    if (type === "my_test") {
      dispatch(
        getTestAttemptedCountAsync({
          userId: userId,
          testId: testId,
        })
      ).then((res) => {
        {
          const { payload } = res || {};
          const { status, data } = payload || {};
          if (status === 200) {
            setAttempt(data[data?.length - 1]?.value);
          }
        }
      });
    }
  }, []);

  const payload = useMemo(() => {
    const payload = {
      testId: testId,
      quizId: testId,
      assignmentId: testId,
      attemptCount: array.includes(type) ? 1 : attempt,
    };
    if (type === "my_test")
      delete payload.quizId && delete payload.assignmentId;
    if (type === "quiz_test")
      delete payload.testId && delete payload.assignmentId;
    if (type === "assignment") delete payload.testId && delete payload.quizId;
    if (type === "scholarship_test")
      delete payload.assignmentId && delete payload.quizId;
    return payload;
  }, [attempt]);

  useEffect(() => {
    if (payload.attemptCount) {
      dispatch(getScoreSummaryAsync(payload));
      dispatch(questionAnalysisAsync(payload));
      dispatch(questionTimeAnalysisAsync(payload));
      dispatch(timeSpendForTestAsync(payload));
    }
  }, [payload]);

  let isPopstateHandled = false;
  window.onpopstate = function () {
    if (!isPopstateHandled) {
      window.history.go(-2);
      isPopstateHandled = true;
    }
  };
  return (
    <>
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Typography variant="h5">Reports & Summary</Typography>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 4,
                [theme.breakpoints.down("md")]: {
                  pl: 2,
                  pr: 2,
                },
              }}
            >
              <Typography variant="h5">Recommended Test Report</Typography>
              <Box
                sx={{
                  mt: 2,
                  width: "150px",
                  height: "40px",
                  borderRadius: " 26px",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "primary.lighter",
                }}
                onClick={goToPage}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                    textAlign: " center",
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  View Answer key
                  <NavigateNextIcon />
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: array.includes(type) ? "none" : "block" }}
          >
            <Card
              sx={{
                p: 4,
                [theme.breakpoints.down("md")]: {
                  pl: 2,
                  pr: 2,
                },
              }}
            >
              <Box sx={{ display: "flex" }}>
                <Grid item xs={4} md={5}>
                  <Box
                    sx={{
                      height: "120px",
                      width: "120px",
                      position: "relative",
                      border: "2px solid #80CC8C",
                      backgroundColor: "#EAFFED",
                      borderRadius: "50%",
                      color: "#80CC8C",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      [theme.breakpoints.down("md")]: {
                        height: "80px",
                        width: "80px",
                      },
                    }}
                  >
                    <Typography sx={{ position: "absolute", top: "40%" }}>
                      {getScoreSummary.percentage}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={8} md={7}>
                  <Typography variant="h5"> Showing Reports For</Typography>
                  <Typography
                    variant="p"
                    sx={{ fontSize: "14px", color: "#787A8D" }}
                  >
                    {getTestAttemptedCount?.length} attempts report available
                  </Typography>
                  <Box sx={{ minWidth: 80, mt: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Attempt
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={attempt}
                        label="attempt"
                        onChange={handleChange}
                        sx={{
                          borderRadius: "30px",
                          width: "70%",
                          [theme.breakpoints.down("md")]: {
                            width: "100%",
                          },
                        }}
                      >
                        {getTestAttemptedCount.length > 0 &&
                          getTestAttemptedCount.map((attempts) => {
                            return (
                              <MenuItem value={attempts.value}>
                                {attempts.name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 4,
                [theme.breakpoints.down("md")]: {
                  pl: 2,
                  pr: 2,
                },
              }}
            >
              <Typography variant="h5">Score Summary</Typography>
              <Typography
                variant="p"
                sx={{ fontSize: "14px", color: "#787A8D" }}
              >
                Check your score to measure the level of preparation
              </Typography>
              <Divider sx={{ paddingBlock: "10px" }} />

              <Box sx={{ display: "flex", mt: 4, alignItems: "center" }}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      width: "170px",
                      height: "170px",
                      [theme.breakpoints.down("md")]: {
                        width: "120px",
                        height: "120px",
                      },
                    }}
                  >
                    <CircularProgressbar
                      styles={buildStyles({
                        trailColor: `${PRIMARY_LIGHT}`,
                        pathColor: `${PRIMARY_MAIN}`,
                        textColor: `${PRIMARY_MAIN}`,
                        textSize: "10px",
                      })}
                      value={40}
                      text={`Marks ${getScoreSummary?.totalScore} / ${getScoreSummary?.totalQuestion} `}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      [theme.breakpoints.down("md")]: {
                        fontSize: "13px",
                      },
                    }}
                  >
                    Maximum marks : <b>{getScoreSummary?.totalQuestion}</b>
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      [theme.breakpoints.down("md")]: {
                        fontSize: "13px",
                      },
                    }}
                  >
                    Total Score Achieved : <b>{getScoreSummary?.totalScore}</b>
                  </Typography>
                </Grid>
              </Box>
              <Box sx={{ mt: 2 }}>
                <LinearWithValueLabel
                  progressValue={getScoreSummary?.percentage}
                />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 4,
                height: "384px",
                [theme.breakpoints.down("md")]: {
                  pl: 2,
                  pr: 2,
                  height: "390px",
                },
              }}
            >
              <Typography variant="h5">Accuracy</Typography>
              <Typography
                variant="p"
                sx={{ fontSize: "14px", color: "#787A8D" }}
              >
                Shows percentage of questions answered correctly
              </Typography>
              <Divider sx={{ paddingBlock: "10px" }} />
              <Grid
                item
                xs={12}
                sx={{ width: "300px", height: "180px", mt: 4 }}
              >
                <Box
                  sx={{
                    "& .CircularProgressbar-text": {
                      transform: "translateY(-107px)",
                      rotate: "90deg",
                      fontSize: "6px !important",
                      color: `${PRIMARY_MAIN} !important`,
                      [theme.breakpoints.down("md")]: {
                        width: "200px",
                        height: "200px",
                        display: "flex",
                        justifyContent: "center",
                        mt: 4,
                      },
                    },
                  }}
                >
                  <CircularProgressbar
                    value={70}
                    circleRatio={0.5}
                    strokeWidth={10}
                    text={`Accuracy ${getScoreSummary?.totalScore} / ${getScoreSummary?.totalQuestion} `}
                    styles={{
                      root: {
                        transform: "rotate(0.75turn)",
                      },
                      path: {
                        stroke: `${PRIMARY_MAIN}`,
                        strokeLinecap: "butt",
                      },
                      trail: {
                        stroke: `${PRIMARY_LIGHT}`,
                        strokeLinecap: "butt",
                      },
                      textColor: `${PRIMARY_MAIN} !important`,
                    }}
                  />
                </Box>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "left",
                  mt: 3,
                  [theme.breakpoints.down("md")]: {
                    display: "flex",
                    // mt: -1,
                    justifyContent: "space-between",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      height: "20px",
                      width: "20px",
                      backgroundColor: "#80CC8C",
                      borderRadius: "50%",
                      mr: 0.5,
                    }}
                  ></Box>
                  <Typography
                    sx={{
                      [theme.breakpoints.down("md")]: {
                        fontSize: "12px",
                        // mt: 3
                      },
                    }}
                  >
                    Percentage:{" "}
                    <b>
                      {getScoreSummary?.totalScore}/
                      {getScoreSummary?.totalQuestion}
                    </b>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    ml: 3,
                    [theme.breakpoints.down("md")]: {
                      ml: 0,
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: "20px",
                      width: "20px",
                      backgroundColor: "primary.main",
                      borderRadius: "50%",
                      mr: 0.5,
                    }}
                  ></Box>
                  <Typography
                    sx={{
                      [theme.breakpoints.down("md")]: {
                        fontSize: "12px",
                      },
                    }}
                  >
                    Attempted:{" "}
                    <b>
                      {getScoreSummary?.totalScore}/
                      {getScoreSummary?.totalQuestion}
                    </b>
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 4,
                [theme.breakpoints.down("md")]: {
                  pl: 2,
                  pr: 2,
                },
              }}
            >
              <Typography variant="h5">Know Your Efficiency</Typography>
              <Typography
                variant="p"
                sx={{ fontSize: "14px", color: "#787A8D" }}
              >
                In depth analysis of the time spent in the test
              </Typography>
              <Divider sx={{ paddingBlock: "10px" }} />
              <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
                <Grid item xs={5}>
                  <HistoryToggleOffIcon
                    sx={{
                      height: "150px",
                      width: "150px",
                      color: "primary.main",
                      [theme.breakpoints.down("md")]: {
                        width: "120px",
                        height: "120px",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={7}>
                  <Box
                    sx={{
                      ml: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "16px",
                        [theme.breakpoints.down("md")]: {
                          fontSize: "13px",
                        },
                      }}
                    >
                      Total Test Time:<b>{getTimeSpendForTest.totalTestTime}</b>
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        [theme.breakpoints.down("md")]: {
                          fontSize: "13px",
                        },
                      }}
                    >
                      {" "}
                      Time Taken: <b>{getTimeSpendForTest.attemptedTestTime}</b>
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        [theme.breakpoints.down("md")]: {
                          fontSize: "12px",
                        },
                      }}
                    >
                      Average Time per Question:{" "}
                      <b>{getTimeSpendForTest.averageTimePerQuestion}</b>
                    </Typography>
                  </Box>
                </Grid>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 4,
                [theme.breakpoints.down("md")]: {
                  pl: 0,
                  pr: 0,
                },
              }}
            >
              <Box
                sx={{
                  [theme.breakpoints.down("md")]: {
                    p: 2,
                  },
                }}
              >
                <Typography variant="h5">
                  Time Wise Question Analysis
                </Typography>
                <Typography
                  variant="p"
                  sx={{ fontSize: "14px", color: "#787A8D" }}
                >
                  In depth analysis of the time spent in the test
                </Typography>
                <Divider sx={{ paddingBlock: "10px" }} />
              </Box>
              <Box sx={{ mt: "20px" }}>
                <table
                  cellspacing="15"
                  style={{
                    borderRadius: "30px",
                    fontFamily: "arial",
                    borderCollapse: "collapse",
                    width: "100%",
                    textAlign: "center",
                    border: "3px solid white",
                  }}
                >
                  <tr>
                    <th
                      style={{
                        backgroundColor: "#AEFFF8",
                        border: "3px solid white",
                        padding: "15px",
                      }}
                    >
                      Answer Pace
                    </th>
                    <th
                      style={{
                        backgroundColor: "#FFF3DB",
                        border: "3px solid white",
                        padding: "15px",
                      }}
                    >
                      Correct Question
                    </th>
                    <th
                      style={{
                        backgroundColor: "#88D2FF",
                        border: "3px solid white",
                        padding: "15px",
                      }}
                    >
                      Incorrect question
                    </th>
                  </tr>
                  <tr>
                    <td
                      style={{
                        backgroundColor: "#EBFEFC",
                        display: "flex",
                        alignItems: "center",
                        padding: "15px",
                        border: "3px solid white",
                      }}
                    >
                      <AccessTimeIcon
                        sx={{
                          fontSize: "48px",
                          color: "primary.main",
                          mr: 1,
                          [theme.breakpoints.down("md")]: {
                            fontSize: "32px",
                          },
                        }}
                      />
                      <Typography
                        sx={{
                          [theme.breakpoints.down("md")]: {
                            fontSize: "12px",
                          },
                        }}
                      >
                        Too Fast
                      </Typography>
                    </td>
                    <td
                      style={{
                        backgroundColor: "#FFF3DB",
                        padding: "15px",
                        border: "3px solid white",
                      }}
                    >
                      {getQuestionTimeAnalysis?.tooFast?.correctQuestion}
                    </td>
                    <td
                      style={{
                        backgroundColor: "#D7EFFD",
                        padding: "15px",
                        border: "3px solid white",
                      }}
                    >
                      {getQuestionTimeAnalysis?.tooFast?.wrongQuestion}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        backgroundColor: "#EBFEFC",
                        display: "flex",
                        alignItems: "center",
                        padding: "15px",
                        border: "3px solid white",
                      }}
                    >
                      <HourglassBottomIcon
                        sx={{
                          fontSize: "48px",
                          color: "primary.main",
                          mr: 1,
                          [theme.breakpoints.down("md")]: {
                            fontSize: "32px",
                          },
                        }}
                      />
                      <Typography
                        sx={{
                          [theme.breakpoints.down("md")]: {
                            fontSize: "12px",
                          },
                        }}
                      >
                        Ideal
                      </Typography>
                    </td>
                    <td
                      style={{
                        backgroundColor: "#FFF3DB",
                        padding: "15px",
                        border: "3px solid white",
                      }}
                    >
                      {getQuestionTimeAnalysis?.ideal?.correctQuestion}
                    </td>
                    <td
                      style={{
                        backgroundColor: "#D7EFFD",
                        padding: "15px",
                        border: "3px solid white",
                      }}
                    >
                      {getQuestionTimeAnalysis?.ideal?.wrongQuestion}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        backgroundColor: "#EBFEFC",
                        display: "flex",
                        alignItems: "center",
                        padding: "15px",
                        border: "3px solid white",
                      }}
                    >
                      <TimelapseIcon
                        sx={{
                          fontSize: "48px",
                          color: "primary.main",
                          mr: 1,
                          [theme.breakpoints.down("md")]: {
                            fontSize: "32px",
                          },
                        }}
                      />
                      <Typography
                        sx={{
                          [theme.breakpoints.down("md")]: {
                            fontSize: "12px",
                          },
                        }}
                      >
                        Over Time
                      </Typography>
                    </td>
                    <td
                      style={{
                        backgroundColor: "#FFF3DB",
                        padding: "15px",
                        border: "3px solid white",
                      }}
                    >
                      {getQuestionTimeAnalysis?.overTime?.correctQuestion}
                    </td>
                    <td
                      style={{
                        backgroundColor: "#D7EFFD",
                        padding: "15px",
                        border: "3px solid white",
                      }}
                    >
                      {getQuestionTimeAnalysis?.overTime?.wrongQuestion}
                    </td>
                  </tr>
                </table>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 4,
                height: "602px",
                [theme.breakpoints.down("md")]: {
                  pl: 2,
                  pr: 2,
                },
              }}
            >
              <Typography variant="h5">Time Wise Question Analysis</Typography>
              <Typography
                variant="p"
                sx={{ fontSize: "14px", color: "#787A8D" }}
              >
                In depth analysis of the time spent in the test
              </Typography>
              <Divider sx={{ paddingBlock: "10px" }} />
              <Box sx={{ minWidth: 120 }}>
                {/* <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Difficult</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        // value={age}
                                        label="attempt"
                                        onChange={handleChange}
                                        sx={{
                                            borderRadius: '30px',
                                            width: '40%',
                                            [theme.breakpoints.down('md')]: {
                                                width: '100%'
                                            },
                                        }}
                                    >
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                    </Select>
                                </FormControl> */}
              </Box>

              <Box
                sx={{
                  height: "160px",
                  width: "160px",
                  backgroundColor: "red",
                  position: "relative",
                  top: "46px",
                  left: "40px",
                  borderRadius: "17%",
                  backgroundColor: "#BBFFC5",
                  border: "8px solid #139527",
                  p: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#139527",
                    fontSize: "25px",
                    textAlign: "center",
                  }}
                >
                  {getQuestionAnalysisData.noOfCorrectAnswer}
                </Typography>
              </Box>
              <Box
                sx={{
                  height: "140px",
                  width: "140px",
                  backgroundColor: "green",
                  position: "relative",
                  left: "101px",
                  top: "0px",
                  borderRadius: "17%",
                  backgroundColor: "#FFC9C9",
                  border: "8px solid #E70B0B",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#E70B0B",
                    fontSize: "25px",
                    textAlign: "center",
                  }}
                >
                  {getQuestionAnalysisData.noOfIncorrectAnswer}
                </Typography>
              </Box>
              <Box
                sx={{
                  height: "120px",
                  width: "120px",
                  backgroundColor: "blue",
                  position: "relative",
                  left: "168px",
                  bottom: "240px",
                  borderRadius: "17%",
                  backgroundColor: "#D9E5FF",
                  border: "8px solid #245CBE",
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#245CBE",
                    fontSize: "25px",
                    textAlign: "center",
                  }}
                >
                  {getQuestionAnalysisData.unAttemptedQuestion}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  mt: -8,
                  [theme.breakpoints.down("md")]: {
                    display: "flex",
                    mt: -12,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      height: "20px",
                      width: "20px",
                      backgroundColor: "#139527",
                      borderRadius: "50%",
                      mr: 0.5,
                    }}
                  ></Box>
                  <Typography
                    sx={{
                      [theme.breakpoints.down("md")]: {
                        fontSize: "12px",
                      },
                    }}
                  >
                    Correct
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      height: "20px",
                      width: "20px",
                      backgroundColor: "#E70B0B",
                      borderRadius: "50%",
                      mr: 0.5,
                    }}
                  ></Box>
                  <Typography
                    sx={{
                      [theme.breakpoints.down("md")]: {
                        fontSize: "12px",
                      },
                    }}
                  >
                    InCorrect
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      height: "20px",
                      width: "20px",
                      backgroundColor: "#245CBE",
                      borderRadius: "50%",
                      mr: 0.5,
                    }}
                  ></Box>
                  <Typography
                    sx={{
                      [theme.breakpoints.down("md")]: {
                        fontSize: "12px",
                      },
                    }}
                  >
                    Unattempted
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ReportSummmaryPage;
