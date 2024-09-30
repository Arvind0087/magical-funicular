import { Helmet } from "react-helmet-async";
import React from "react";
import { Grid, Card, Stack, Typography, Paper, Box, Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import ReactHtmlParser from "react-html-parser";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { getquizByIdAsync } from "redux/slices/QuizReportSlice/quiz.async.api";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "routes/paths";
import { emptyquiz } from "redux/slices/QuizReportSlice/quiz.slice";
import { useSettingsContext } from "components/settings";

const QuizReportList = () => {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const query = new URLSearchParams(location.search);
  const { testreportLoader, reportById } = useSelector(
    (state) => state.testreport
  );
  const { quizLoader, getQuizById } = useSelector((state) => state.quizReport);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const config = {
    loader: { load: ["[tex]/html"] },
    tex: {
      packages: { "[+]": ["html"] },
      inlineMath: [["$", "$"]],
      displayMath: [["$$", "$$"]]
    },
    onLoad: () => { }
  };

  useEffect(() => {
    if (Boolean(id)) {
      const payload = {
        quizId: Number(query.get("quizId")),
        studentId: Number(query.get("studentId"))
      };
      dispatch(getquizByIdAsync(payload));
    }
  }, [Boolean(id)]);

  // useEffect(() => {
  //   if (getQuizById.status === 200) {
  //     toast.success(getQuizById.message, toastoptions);
  //   }
  // }, [getQuizById]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Quiz | {`${tabTitle}`} </title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={"Quiz  Report"}
        links={[
          { name: "Quiz", href: PATH_DASHBOARD.quizreportlist },
          { name: "Quiz  Report" }
        ]}
      />
      <Box>
        <Card sx={{ p: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Stack spacing={1.5} sx={{ px: 3, padding: "0px !important" }}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ paddingBottom: "0px !important" }}
                >
                  <Paper
                    sx={{
                      p: 1.5,
                      flexGrow: 1,
                      bgcolor: "background.neutral",

                      marginBottom: "10px !important"
                    }}
                  >
                    <Box
                      sx={{
                        marginBottom: "10px !important"
                        // marginRight: "10px !important"
                      }}
                    >
                      <Box>
                        <Typography variant="h6">Quiz Report</Typography>
                      </Box>
                    </Box>

                    <Stack
                      justifyContent="space-between"
                      direction={{ xs: "column", sm: "row" }}
                      alignItems={{ sm: "center" }}
                      sx={{ mb: 0.5 }}
                    >
                      <Typography variant="subtitle2">
                        Student Name:&nbsp;
                        <span style={{ fontWeight: 400 }}>
                          {getQuizById?.data?.studentName}
                        </span>
                      </Typography>
                      <Typography variant="subtitle2">
                        Quiz Name :&nbsp;
                        <span style={{ fontWeight: 400 }}>
                          {getQuizById?.data?.subjectName}
                        </span>{" "}
                      </Typography>

                      <Typography variant="subtitle2">
                        Total Question :&nbsp;
                        <span style={{ fontWeight: 400 }}>
                          {getQuizById?.data?.numberOfQuestions}
                        </span>
                      </Typography>
                    </Stack>

                    <Stack
                      justifyContent="space-between"
                      direction={{ xs: "column", sm: "row" }}
                      alignItems={{ sm: "center" }}
                      sx={{ mb: 0.5 }}
                    >
                      <Typography variant="subtitle2">
                        Correct Answer:&nbsp;
                        <span style={{ fontWeight: 400 }}>
                          {getQuizById?.data?.correctAnswer}
                        </span>
                      </Typography>
                      <Typography variant="subtitle2" sx={{ marginLeft: "99px" }}>
                        Unattempted Answer :
                        <span style={{ fontWeight: 400 }}>
                          {getQuizById?.data?.unAttemptedAnswer}
                        </span>
                      </Typography>

                      <Typography variant="subtitle2">
                        Wrong Answer :&nbsp;
                        <span style={{ fontWeight: 400 }}>
                          {getQuizById?.data?.wrongAnswer}
                        </span>
                      </Typography>
                    </Stack>

                    <Stack
                      justifyContent="space-between"
                      direction={{ xs: "column", sm: "row" }}
                      alignItems={{ sm: "center" }}
                      sx={{ mb: 0.5 }}
                    >
                      <Typography variant="subtitle2">
                        Time :&nbsp;
                        <span style={{ fontWeight: 400 }}>
                          {getQuizById?.data?.testTime}
                        </span>
                      </Typography>
                    </Stack>
                  </Paper>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Card>
        {getQuizById?.data?.questions?.map((details, index) => (
          <MathJaxContext config={config}>
            <Card sx={{ p: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Stack spacing={1.5} sx={{ px: 3, padding: "0px !important" }}>
                    <Stack
                      // direction="row"
                      spacing={2}
                      sx={{ paddingBottom: "0px !important" }}
                      direction={{ xs: "column", sm: "row" }}
                    >
                      <Paper
                        sx={{
                          p: 1.5,
                          flexGrow: 1,
                          bgcolor: "background.neutral",
                          marginBottom: "10px !important"
                        }}
                      >
                        <Box>
                          <Box>
                            <MathJax>
                              <Typography
                                variant="body2"
                                sx={{
                                  mt: 2,
                                  fontSize: "16px",
                                  display: "flex ",
                                  alignItems: "center"
                                }}
                              >
                                {index + 1}.{ReactHtmlParser(details?.question)}
                              </Typography>
                            </MathJax>
                          </Box>

                          <MathJax key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Box>A.&nbsp;</Box>
                                <Box sx={{ display: "flex" }}>
                                  {ReactHtmlParser(details?.A)}
                                </Box>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Box>B.&nbsp;</Box>
                                <Box sx={{ display: "flex" }}>
                                  {ReactHtmlParser(details?.B)}
                                </Box>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Box>C.&nbsp;</Box>
                                <Box sx={{ display: "flex" }}>
                                  {ReactHtmlParser(details?.C)}
                                </Box>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Box>D.&nbsp;</Box>
                                <Box sx={{ display: "flex" }}>
                                  {ReactHtmlParser(details?.D)}
                                </Box>
                              </Box>
                            </Box>
                          </MathJax>

                          <Stack
                            sx={{ mt: 2 }}
                            direction={{ xs: "column", sm: "row" }}
                            alignItems={{ sm: "center" }}
                          >
                            <CheckBoxIcon color="success" />
                            <Typography variant="body2">
                              {details?.answer}
                            </Typography>
                            {details?.answer === details?.answerGivenByStudent ? (
                              <>
                                <Box
                                  variant="h6"
                                  sx={{
                                    mt: 2,
                                    mx: 50,
                                    color: "#36B37E",
                                    display: "flex"
                                  }}
                                >
                                  <CheckBoxIcon color="success" />
                                  {details?.answerGivenByStudent}
                                </Box>
                              </>
                            ) : details?.answerGivenByStudent === null ? (
                              <Typography
                                variant="h6"
                                sx={{ mx: 50, color: "red" }}
                              >
                                UnAttempted
                              </Typography>
                            ) : details?.answer !==
                              details?.answerGivenByStudent ? (
                              <>
                                <Box
                                  variant="h6"
                                  sx={{ mx: 50, color: "red", display: "flex" }}
                                >
                                  <DisabledByDefaultIcon color="red" />
                                  {details?.answerGivenByStudent}
                                </Box>
                              </>
                            ) : (
                              ""
                            )}
                          </Stack>
                        </Box>
                      </Paper>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Card>
          </MathJaxContext>
        ))}
      </Box>
    </Container>
  );
};

export default QuizReportList;
