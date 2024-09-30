import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router";
import { useSettingsContext } from "../../../components/settings";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { getTestReportAsync } from "redux/async.api";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import "./styles.css";
const count = [
  {
    id: 1,
    value: "All",
    label: "All",
  },
  {
    id: 2,
    value: "Correct",
    label: "Correct",
  },
  {
    id: 3,
    value: "Incorrect",
    label: "Incorrect",
  },
  {
    id: 4,
    value: "Unattempt",
    label: "Unattempted",
  },
];

const AnswerKeyPage = () => {
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { attemptCount, testId, category } = location?.state;
  const { studentById } = useSelector((state) => state?.student);
  const { test } = useSelector((state) => state);
  const { getTestReportforTest, getTestReportforTestLoader } = test;
  // states...
  const [currentTab, setCurrentTab] = useState("All");
  const [answerKeyData, setAnswerKeyData] = useState([]);
  const array = ["quiz_test", "scholarship_test", "assignment"];
  useEffect(() => {
    const payload = {
      attemptCount: array.includes(category) ? 1 : attemptCount,
      studentId: studentById?.id,
    };
    if (category === "my_test" || category === "scholarship_test")
      payload.testId = testId;
    if (category === "quiz_test") payload.quizId = testId;
    if (category === "assignment") payload.assignmentId = testId;
    dispatch(getTestReportAsync(payload));
  }, []);
  useEffect(() => {
    let filtered;
    if (currentTab === "All") {
      filtered = getTestReportforTest?.questions;
    } else if (currentTab === "Correct") {
      filtered = getTestReportforTest?.questions?.filter(
        (question) => question.correctAnswer === true
      );
    } else if (currentTab === "Incorrect") {
      filtered = getTestReportforTest?.questions?.filter(
        (question) =>
          question.questionAttempted === true &&
          question.correctAnswer === false
      );
    } else if (currentTab === "Unattempt") {
      filtered = getTestReportforTest?.questions?.filter(
        (question) => question.questionAttempted === false
      );
    }
    setAnswerKeyData(filtered);
  }, [currentTab]);
  //NOTE: navigate to ViewExplanation page
  const handleNavViewExplanation = (queID) => {
    navigate(PATH_DASHBOARD.ViewExplanation, {
      state: {
        questionId: queID,
      },
    });
  };
  return (
    <>
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Typography variant="h4">Answer Key</Typography>

        <Box sx={{ mt: 7 }}>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
          >
            {count.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>
        <Grid container spacing={3}>
          {answerKeyData?.length > 0 ? (
            answerKeyData?.map((item) => {
              return (
                <Grid item xs={12} md={6} key={item.id}>
                  <Card sx={{ mt: 2, p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <b style={{ fontSize: "18px" }}>Q.</b>{" "}
                      <Typography
                        variant="h5"
                        dangerouslySetInnerHTML={{
                          __html: item?.question,
                        }}
                      ></Typography>
                    </Box>
                    <Typography
                      sx={{ mt: 1, fontSize: "14px", color: "primary.main" }}
                    >
                      Answer Pace: <b>{item.answeringPace ?? "N/A"}</b>
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6" sx={{ fontSize: "12px" }}>
                        Your Answer:
                      </Typography>
                      <Typography
                        variant="p"
                        sx={{
                          color: "primary.main",
                          fontSize: "14px",
                          color: "primary.main",
                          display: "flex",
                          alignItems: "center",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: item?.answerGivenByStudent ?? "N/A",
                        }}
                      ></Typography>
                    </Box>

                    <Box sx={{ mt: 2, mb: 2 }}>
                      <Typography variant="h6" sx={{ fontSize: "12px" }}>
                        Correct Answer:
                      </Typography>
                      <Typography
                        variant="p"
                        sx={{
                          color: "green",
                          fontSize: "14px",
                          display: "flex",
                          alignItems: "center",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: item?.answer,
                        }}
                      ></Typography>
                    </Box>
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <Typography variant="p" sx={{ fontWeight: "bold" }}>
                        Marks: {item.marks}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <Typography
                        variant="p"
                        sx={{ fontSize: "12px", fontWeight: "bold" }}
                      >
                        Your Pace:
                        {moment.duration(item.time).asSeconds()}Sec
                      </Typography>
                    </Box>
                    <Typography>
                      Difficulty level: <b>{item.difficultyLevel}</b>
                    </Typography>

                    <Box
                      sx={{
                        mt: "20px",
                        width: "150px",
                        height: "30px",
                        borderRadius: " 26px",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "primary.lighter",
                        cursor: "pointer",
                      }}
                      onClick={() => handleNavViewExplanation(item?.id)}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px",
                          textAlign: " center",
                          color: "primary.main",
                        }}
                      >
                        View Explanation
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Box
              sx={{ display: "flex", justifyContent: "center", ml: 50, mt: 20 }}
            >
              <Typography variant="h5">No Data Found</Typography>
            </Box>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default AnswerKeyPage;
