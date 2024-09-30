import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "react-hot-toast";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { addBookmarkAsync } from "redux/bookmark/bookmark.async";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import {
  assignmentAtttemptedAsync,
  getExamSummaryAsync,
  getQuestionByAssignmentIdAsync,
  getTestDetailByTestIdAsync,
  submitTestAsync,
  testAttemptedAsync,
} from "../redux/async.api";
import LoadingScreen from "../components/loading-screen/LoadingScreen";
import { toastoptions } from "../utils/toastoptions";
import { PATH_DASHBOARD } from "../routes/paths";
import ExamSummary from "./dashboard/CreateTest/components/ExamSummary";
import ReactHtmlParser from "react-html-parser";
import "./stylesheet.css";
import CancelTestDialog from "./CancelTestDialog";

const convertToSecond = (timeString = "") => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return totalSeconds;
};

const formatTime = (time) => {
  const hours = Math.floor(time / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

function formatTimeObj(time = 0) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = time - hours * 3600 - minutes * 60;
  return (
    (hours < 10 ? "0" + hours : hours) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    ":" +
    (seconds < 10 ? "0" + seconds : seconds)
  );
}

const StartTest = () => {
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [dialogOpen, setDailogOpen] = useState(false);

  const category = searchParams.get("type");
  // state
  const [open, setOpen] = useState(false);
  const { getTestDetail = {}, getExamSummary = {} } = useSelector(
    (state) => state.test
  );
  const { studentById } = useSelector((state) => state?.student);
  const [questionList, setQuestionList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [activeQueIdx, setActiveQueIdx] = useState(0);
  const [bookmarkQuestion, setBookmarkQuestion] = useState(false);
  const [time, setTime] = useState("00:00:00");
  useEffect(() => {
    if (category === "assignment") {
      dispatch(
        getQuestionByAssignmentIdAsync({
          testId: id,
        })
      );
    } else {
      const payload = {
        id: id,
        type: "testId",
      };
      if (category === "quiz_test") payload.type = "quizId";
      if (category === "scholarship_test") payload.type = "scholarshipId";
      dispatch(getTestDetailByTestIdAsync(payload));
    }
  }, [id]);

  const questionHandler = (queId) => {
    // questionList.map((item) => item.isActive ?
    if (category === "assignment") {
      dispatch(
        assignmentAtttemptedAsync({
          id: questionDetail?.id,
          answer: selectedOption,
          time: formatTimeObj(questionDetail?.time),
          assignmentId: id,
        })
      ).then((res) => {
        if (res?.payload?.status === 200) {
          setQuestionList((prevTimers) =>
            prevTimers.map((timer) =>
              timer.isActive
                ? {
                    ...timer,
                    answer: selectedOption,
                    isActive: false,
                    visited: true,
                    buttonBgColor:
                      selectedOption == "" ? "#85888A" : "primary.main",
                  }
                : timer
            )
          );
          setQuestionList((prevTimers) =>
            prevTimers.map((timer, index) =>
              timer.id === queId
                ? {
                    ...timer,
                    time: 0,
                    isActive: true,
                    visited: true,
                    buttonBgColor:
                      questionList[index]?.answer == ""
                        ? "#85888A"
                        : "primary.main",
                  }
                : timer
            )
          );
          //find index of active question
          setActiveQueIdx(
            questionList?.findIndex((item) => item?.id === queId)
          );
          // reset the value
          setSelectedOption(
            questionList[questionList?.findIndex((item) => item?.id === queId)]
              ?.answer
          );
        }
      });
    } else {
      const payload = {
        id: questionDetail?.id,
        answer: selectedOption,
        time: formatTimeObj(questionDetail?.time),
      };
      if (category === "quiz_test") payload.type = "quiz";
      dispatch(testAttemptedAsync(payload)).then((res) => {
        if (res?.payload?.status === 200) {
          setQuestionList((prevTimers) =>
            prevTimers.map((timer) =>
              timer.isActive
                ? {
                    ...timer,
                    answer: selectedOption,
                    isActive: false,
                    visited: true,
                    buttonBgColor:
                      selectedOption == "" ? "#85888A" : "primary.main",
                  }
                : timer
            )
          );
          setQuestionList((prevTimers) =>
            prevTimers.map((timer, index) =>
              timer.id === queId
                ? {
                    ...timer,
                    time: 0,
                    isActive: true,
                    visited: true,
                    buttonBgColor:
                      questionList[index]?.answer == ""
                        ? "#85888A"
                        : "primary.main",
                  }
                : timer
            )
          );
          //find index of active question
          setActiveQueIdx(
            questionList?.findIndex((item) => item?.id === queId)
          );
          // reset the value
          setSelectedOption(
            questionList[questionList?.findIndex((item) => item?.id === queId)]
              ?.answer
          );
        }
      });
    }
    // : "")
    // start timer for selected quesion.
  };
  // timer functionality in every for object
  useEffect(() => {
    const intervalIds = questionList.map((timer, index) => {
      if (timer.isActive) {
        return setInterval(() => {
          setQuestionList((prevTimersData) => {
            const updatedTimer = { ...prevTimersData[index] };
            updatedTimer.time += open == false ? 1 : 0;
            return [
              ...prevTimersData.slice(0, index),
              updatedTimer,
              ...prevTimersData.slice(index + 1),
            ];
          });
        }, 1000);
      }
      return null;
    });
    return () => {
      intervalIds.forEach((intervalId) => clearInterval(intervalId));
    };
  }, [questionList]);

  useEffect(() => {
    const timeInSec = convertToSecond(getTestDetail?.time);
    setTime(timeInSec);
    if (!!getTestDetail?.questions?.length) {
      const questions = getTestDetail?.questions?.map((item, index) => {
        if (index === 0)
          return {
            ...item,
            time: 0,
            isActive: true,
            selected: "",
            answer: "",
            visited: true,
            buttonBgColor: "#85888A",
          };
        return {
          ...item,
          time: 0,
          isActive: false,
          selected: "",
          answer: "",
          visited: false,
          buttonBgColor: "#F1F1F1",
        };
      });
      setQuestionList(questions);
    }
  }, [getTestDetail]);

  let questionDetail;

  const onToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  // timer functionality for global time
  useEffect(() => {
    const timer =
      open === false
        ? time > 0 && setInterval(() => setTime(time - 1), 1000)
        : time > 0 && setInterval(() => setTime(time), 1000); // minus one second every second
    return () => clearInterval(timer); // clear interval on unmount
  }, [time, open]);

  // Final submit
  const handleSubmit = () => {
    const activeTimer = questionList?.filter((item) => item.isActive);
    if (category === "assignment") {
      dispatch(
        assignmentAtttemptedAsync({
          id: questionDetail?.id,
          answer: selectedOption,
          time: formatTimeObj(questionDetail?.time),
          assignmentId: id,
        })
      ).then((res) => {
        if (res?.payload?.status === 200) {
          setQuestionList((prevTimers) =>
            prevTimers.map((timer) =>
              timer.isActive
                ? {
                    ...timer,
                    answer: selectedOption,
                    buttonBgColor:
                      questionList[activeQueIdx]?.answer == ""
                        ? "#85888A"
                        : "primary.main",
                    visited: true,
                  }
                : timer
            )
          );
          dispatch(
            getExamSummaryAsync({
              studentTestId: getTestDetail?.testStartId,
            })
          );
          setOpen(true);
        }
      });
    } else {
      const payload = {
        id: activeTimer[0]?.id,
        answer: selectedOption,
        time: formatTimeObj(questionDetail?.time),
      };
      if (category === "quiz_test") payload.type = "quiz";
      dispatch(testAttemptedAsync(payload)).then((res) => {
        if (res?.payload?.status === 200) {
          setQuestionList((prevTimers) =>
            prevTimers.map((timer) =>
              timer.isActive
                ? {
                    ...timer,
                    answer: selectedOption,
                    buttonBgColor:
                      questionList[activeQueIdx]?.answer == ""
                        ? "#85888A"
                        : "primary.main",
                    visited: true,
                  }
                : timer
            )
          );
          dispatch(
            getExamSummaryAsync({
              studentTestId: getTestDetail?.testStartId,
            })
          );
          setOpen(true);
        }
      });
    }
  };

  const handleCancel = () => {
    setDailogOpen(true);
  };

  useEffect(() => {
    if (time === 0 || time === 60) {
      handleSubmit(); // call the function when the timer is over
    }
  }, [time]);

  const saveAndNextHanlder = () => {
    // questionList.map((item) => item.isActive ?
    if (category === "assignment") {
      dispatch(
        assignmentAtttemptedAsync({
          id: questionDetail?.id,
          answer: selectedOption,
          time: formatTimeObj(questionDetail?.time),
          assignmentId: id,
        })
      ).then((res) => {
        if (res?.payload?.status === 200) {
          setQuestionList((prevTimers) =>
            prevTimers.map((timer) =>
              timer.isActive
                ? {
                    ...timer,
                    answer: selectedOption,
                    isActive: false,
                    visited: true,
                    buttonBgColor:
                      selectedOption == "" ? "#85888A" : "primary.main",
                  }
                : timer
            )
          );
          setQuestionList((prevTimers) =>
            prevTimers.map((timer) =>
              timer == questionList[activeQueIdx + 1]
                ? {
                    ...timer,
                    time: 0,
                    isActive: true,
                    buttonBgColor:
                      questionList[activeQueIdx + 1].answer == ""
                        ? "#85888A"
                        : "primary.main",
                  }
                : timer
            )
          );
          setActiveQueIdx(activeQueIdx + 1);
          setSelectedOption(questionList[activeQueIdx + 1]?.answer);
        }
      });
    } else {
      const payload = {
        id: questionDetail?.id,
        answer: selectedOption,
        time: formatTimeObj(questionDetail?.time),
      };
      if (category === "quiz_test") payload.type = "quiz";
      dispatch(testAttemptedAsync(payload)).then((res) => {
        if (res?.payload?.status === 200) {
          setQuestionList((prevTimers) =>
            prevTimers.map((timer) =>
              timer.isActive
                ? {
                    ...timer,
                    answer: selectedOption,
                    isActive: false,
                    visited: true,
                    buttonBgColor:
                      selectedOption == "" ? "#85888A" : "primary.main",
                  }
                : timer
            )
          );
          setQuestionList((prevTimers) =>
            prevTimers.map((timer) =>
              timer == questionList[activeQueIdx + 1]
                ? {
                    ...timer,
                    time: 0,
                    isActive: true,
                    buttonBgColor:
                      questionList[activeQueIdx + 1].answer == ""
                        ? "#85888A"
                        : "primary.main",
                  }
                : timer
            )
          );
          setActiveQueIdx(activeQueIdx + 1);
          setSelectedOption(questionList[activeQueIdx + 1]?.answer);
        }
      });
    }
    // : "")
  };
  const PreviousHandler = () => {
    // questionList.map((item) => item.isActive ?
    if (category === "assignment") {
      dispatch(
        assignmentAtttemptedAsync({
          id: questionDetail?.id,
          answer: selectedOption,
          time: formatTimeObj(questionDetail?.time),
          assignmentId: id,
        })
      ).then((res) => {
        if (res?.payload?.status === 200) {
          setQuestionList((prevTimers) =>
            prevTimers.map((timer) =>
              timer.isActive
                ? {
                    ...timer,
                    isActive: false,
                    answer: selectedOption,
                    visited: true,
                    buttonBgColor:
                      selectedOption == "" ? "#85888A" : "primary.main",
                  }
                : timer
            )
          );
          setQuestionList((prevTimers) =>
            prevTimers.map((timer) =>
              timer == questionList[activeQueIdx - 1]
                ? {
                    ...timer,
                    time: 0,
                    isActive: true,
                    buttonBgColor:
                      questionList[activeQueIdx - 1]?.answer == ""
                        ? "#85888A"
                        : "primary.main",
                  }
                : timer
            )
          );
          setActiveQueIdx(activeQueIdx - 1);
          setSelectedOption(questionList[activeQueIdx - 1].answer);
        }
      });
    } else {
      const payload = {
        id: questionDetail?.id,
        answer: selectedOption,
        time: formatTimeObj(questionDetail?.time),
      };
      if (category === "quiz_test") payload.type = "quiz";
      dispatch(testAttemptedAsync(payload)).then((res) => {
        if (res?.payload?.status === 200) {
          setQuestionList((prevTimers) =>
            prevTimers.map((timer) =>
              timer.isActive
                ? {
                    ...timer,
                    isActive: false,
                    answer: selectedOption,
                    visited: true,
                    buttonBgColor:
                      selectedOption == "" ? "#85888A" : "primary.main",
                  }
                : timer
            )
          );
          setQuestionList((prevTimers) =>
            prevTimers.map((timer) =>
              timer == questionList[activeQueIdx - 1]
                ? {
                    ...timer,
                    time: 0,
                    isActive: true,
                    buttonBgColor:
                      questionList[activeQueIdx - 1]?.answer == ""
                        ? "#85888A"
                        : "primary.main",
                  }
                : timer
            )
          );
          setActiveQueIdx(activeQueIdx - 1);
          setSelectedOption(questionList[activeQueIdx - 1].answer);
        }
      });
    }
    //  : "")
  };

  const questionSelectHandler = (select) => {
    setSelectedOption(select);
  };
  const examSummaryNoHandler = () => {
    setQuestionList((prevTimers) =>
      prevTimers.map((timer) =>
        timer.isActive
          ? {
              ...timer,
              answer: selectedOption,
              buttonBgColor:
                questionList[activeQueIdx]?.answer == ""
                  ? "#85888A"
                  : "primary.main",
              visited: true,
            }
          : timer
      )
    );
    setOpen(false);
  };
  const state = {
    userId: studentById?.id,
    testId: id,
    type: category,
  };

  const examSummaryYesHandler = () => {
    // submitTest
    const payload = {
      testStartId: getTestDetail?.testStartId,
    };
    dispatch(submitTestAsync(payload)).then((res) => {
      if (res?.payload?.status === 200) {
        toast.success(res?.payload?.message, toastoptions);
        if (category === "scholarship_test")
          state.testId = getTestDetail?.testId;
        navigate(PATH_DASHBOARD.reportSummary, {
          state,
        });
      }
    });
  };

  const okHandler = () => {
    if (category === "scholarship_test") state.testId = getTestDetail?.testId;
    navigate(PATH_DASHBOARD.reportSummary, {
      state,
    });
  };

  const timeOverSubmitHandler = () => {
    // submit test
    const payload = {
      testStartId: getTestDetail?.testStartId,
    };
    dispatch(submitTestAsync(payload)).then((res) => {
      if (res?.payload?.status === 200) {
        toast.success(res?.payload?.message, toastoptions);
      }
    });
  };
  const handleBookmarkQuestion = (queId) => {
    const payload = {
      userId: studentById?.id,
      typeId: queId,
      bookmarkType: "question",
      bookmark: bookmarkQuestion ? 0 : 1,
    };
    dispatch(addBookmarkAsync(payload)).then((res) => {
      if (res?.payload?.status === 200)
        toast.success(res?.payload?.message, toastoptions);
      setBookmarkQuestion(!bookmarkQuestion);
    });
  };
  questionDetail = useMemo(() => {
    return questionList?.filter((item) => item.isActive)[0] || {};
  }, [questionList]);

  const activeQue = useMemo(() => {
    return questionList?.filter((item) => item.isActive);
  }, [questionList]);

  console.log("questionDetail?.questions....", questionDetail?.questions);

  return (
    <>
      {questionList.length && (
        <Grid
          container
          spacing={2}
          sx={{
            pt: 4,
            paddingInline: "20px",
            minHeight: 1,
          }}
        >
          <Grid item xs={12} md={8}>
            <Typography>
              <b>{getTestDetail?.title} </b> Single Choice Question
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
              [theme.breakpoints.down("md")]: {
                justifyContent: "left",
              },
            }}
          >
            <Box sx={{ display: "flex", float: "right", fontSize: "14px" }}>
              <AccessTimeIcon sx={{ color: "primary.main" }} />
              <Typography variant="p">
                Remaining time: <b>{formatTime(time)}</b>
              </Typography>
            </Box>
            <Box sx={{ paddingInline: "10px" }}>
              <Button
                onClick={handleSubmit}
                sx={{
                  borderRadius: "10px",
                  color: "#ffff",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "35px",
                  // width: '50%',
                  backgroundColor: "primary.main",
                }}
                type="submit"
                className="OTP-button"
                variant="contained"
              >
                Submit
              </Button>
            </Box>
            <Box sx={{ paddingInline: "10px" }}>
              <Button
                onClick={handleCancel}
                sx={{
                  borderRadius: "10px",
                  color: "#ffff",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "35px",
                  // width: '50%',
                  backgroundColor: "error.main",
                  ":hover": {
                    backgroundColor: "#ff1a1a",
                  },
                }}
                type="button"
                className="OTP-button"
                variant="contained"
              >
                Cancel
              </Button>
            </Box>

            <CancelTestDialog
              dialogOpen={dialogOpen}
              setDailogOpen={setDailogOpen}
            />

            <Box
              sx={{
                color: "primary.main",
                fontSize: "20px",
                cursor: "pointer",
              }}
              onClick={onToggleFullScreen}
            >
              <FullscreenExitIcon />
            </Box>
          </Grid>
          <Grid item md={8} xs={12}>
            <Card sx={{ p: 3 }}>
              <Grid container>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", float: "right" }}>
                    <AccessTimeIcon sx={{ color: "primary.main" }} />
                    <Typography variant="p" sx={{ paddingInline: "5px" }}>
                      <b>{formatTimeObj(questionDetail?.time)}</b>
                    </Typography>
                    <Box
                      onClick={() => {
                        handleBookmarkQuestion(questionDetail?.questionId);
                      }}
                    >
                      {bookmarkQuestion ? (
                        <BookmarkIcon sx={{ color: "primary.main" }} />
                      ) : (
                        <BookmarkBorderIcon sx={{ color: "primary.main" }} />
                      )}
                    </Box>
                  </Box>
                </Grid>
                <>
                  <Grid item md={12} xs={12}>
                    <Typography variant="h5">
                      {ReactHtmlParser(questionDetail?.questions)}
                    </Typography>

                    {/* <Typography
                      dangerouslySetInnerHTML={{
                        __html: questionDetail?.questions,
                      }}
                    /> */}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      border: "1px solid gray",
                      borderRadius: "50px",
                      mt: 4,
                      p: 2,
                      //   maxHeight: "70px",
                      backgroundColor:
                        selectedOption === "A" ? "primary.main" : "",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => questionSelectHandler("A")}
                  >
                    A.
                    <Typography variant="subtitle2">
                      {ReactHtmlParser(questionDetail?.A)}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      border: "1px solid gray",
                      borderRadius: "50px",
                      mt: 4,
                      p: 2,
                      //   maxHeight: "70px",
                      backgroundColor:
                        selectedOption === "B" ? "primary.main" : "",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => questionSelectHandler("B")}
                  >
                    B.{" "}
                    <Typography variant="subtitle2">
                      {ReactHtmlParser(questionDetail?.B)}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      border: "1px solid gray",
                      borderRadius: "50px",
                      mt: 4,
                      p: 2,
                      //   maxHeight: "70px",
                      backgroundColor:
                        selectedOption === "C" ? "primary.main" : "",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => questionSelectHandler("C")}
                  >
                    C.{" "}
                    <Typography variant="subtitle2">
                      {ReactHtmlParser(questionDetail?.C)}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      border: "1px solid gray",
                      borderRadius: "50px",
                      mt: 4,
                      p: 2,
                      //   maxHeight: "70px",
                      backgroundColor:
                        selectedOption === "D" ? "primary.main" : "",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => questionSelectHandler("D")}
                  >
                    D.{" "}
                    <Typography variant="subtitle2">
                      {ReactHtmlParser(questionDetail?.D)}
                    </Typography>
                  </Grid>
                </>
              </Grid>
            </Card>
            <Grid
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
                pb: 2,
              }}
            >
              <Button
                onClick={PreviousHandler}
                disabled={
                  questionList?.findIndex(
                    (item) => item?.id === activeQue[0]?.id
                  )
                    ? false
                    : true
                }
                sx={{
                  borderRadius: "10px",
                  color: "#ffff",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "35px",
                  backgroundColor: "primary.main",
                }}
                type="submit"
                className="OTP-button"
                variant="contained"
              >
                Previous
              </Button>

              <Button
                onClick={saveAndNextHanlder}
                disabled={
                  questionList.length - 1 ==
                  questionList.findIndex(
                    (item) => item?.id === activeQue[0]?.id
                  )
                    ? true
                    : false
                }
                sx={{
                  borderRadius: "10px",
                  color: "#ffff",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "35px",
                  backgroundColor: "primary.main",
                }}
                type="submit"
                className="OTP-button"
                variant="contained"
              >
                Save & Next
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, minHeight: "500px" }}>
              <Typography variant="h6">Session Summary</Typography>
              <Box>
                <Grid container spacing={2} sx={{ mt: 3 }}>
                  {questionList?.length > 0 &&
                    questionList.map((que, index) => {
                      return (
                        <Grid
                          item
                          xs={2}
                          sx={{ display: "flex", flexDirection: "column" }}
                          key={index}
                        >
                          <Box
                            sx={{
                              height: "40px",
                              width: "40px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: que?.buttonBgColor,
                              borderRadius: "10px",
                              cursor: "pointer",
                            }}
                            onClick={() => questionHandler(que?.id)}
                          >
                            {index + 1}
                          </Box>
                          <Box
                            sx={{
                              height: "3px",
                              width: "40px",
                              backgroundColor: "red",
                              mt: 0.3,
                              display:
                                que?.id === questionDetail?.id
                                  ? "block"
                                  : "none",
                            }}
                          ></Box>
                        </Grid>
                      );
                    })}
                </Grid>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
      {!questionList.length && <LoadingScreen />}
      {open && (
        <ExamSummary
          open={open}
          remainingTime={time}
          setOpen={setOpen}
          getExamSummary={getExamSummary}
          examSummaryNoHandler={examSummaryNoHandler}
          examSummaryYesHandler={examSummaryYesHandler}
          questionList={questionList}
          timeOverSubmitHandler={timeOverSubmitHandler}
          okHandler={okHandler}
        />
      )}
    </>
  );
};
export default StartTest;
