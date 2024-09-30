import React from "react";
import {
  Grid, Card,
  Stack, Typography, Paper, Box, MenuItem,
  Select, FormControl, InputLabel, Container
} from "@mui/material";
import { useSettingsContext } from "components/settings";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import ReactHtmlParser from "react-html-parser";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { getTestReportByIdAsync, getTestAttemptedCountAsync, getTestReportByCountAsync } from "redux/slices/TestSlice/async.api";
import CustomBreadcrumbs from 'components/custom-breadcrumbs/CustomBreadcrumbs';
import { PATH_DASHBOARD } from "routes/paths";
import moment from "moment";
import _ from 'lodash'
const StudentOwnTestReport = () => {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const location = useLocation();
  const [getAttempts, setAttempts] = useState(1)
  const { id } = useParams();
  const query = new URLSearchParams(location.search);
  const { testreportLoader, reportById, testCount, countTestResult } = useSelector(
    (state) => state.testreport
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const config = {
    loader: { load: ["[tex]/html"] },
    tex: {
      packages: { "[+]": ["html"] },
      inlineMath: [["$", "$"]],
      displayMath: [["$$", "$$"]],
    },
    onLoad: () => { },
  };

  // useEffect(() => {
  //   if (id) {
  //     const payload = {
  //       testId: query.get("testId"),
  //       studentId: query.get("studentId"),
  //       studentStartId: query.get("testId"),
  //     };
  //     dispatch(getTestReportByIdAsync(payload));
  //   }
  // }, [id]);

  useEffect(() => {
    if (id) {
      const payload = {
        testId: query?.get("testId"),
        userId: query?.get("studentId")
      }
      dispatch(getTestAttemptedCountAsync(payload))
    }
  }, [id])

  useEffect(() => {
    if (getAttempts) {
      const payload = {
        testId: query?.get("testId"),
        studentId: query?.get("studentId"),
        attemptCount: getAttempts,
      }
      dispatch(getTestReportByCountAsync(payload))
    }
  }, [id, getAttempts])

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Student Own Test | {`${tabTitle}`} </title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={"Student Own Test Report"}
        links={[
          { name: "Test", href: PATH_DASHBOARD.root },
          { name: "Student Own Test", href: PATH_DASHBOARD.studentowntest },
          { name: "Student Own Test Report" },
        ]}

        action={
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 5 }}>
            <FormControl size="small">
              <InputLabel size="small">Attempts</InputLabel>
              <Select
                size="small"
                sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                label="Attempts"
                value={getAttempts}
                onChange={(e) => setAttempts(e.target.value)}
              >
                <MenuItem value="">Select Aattempt</MenuItem>
                {
                  testCount?.data?.map(ev => (
                    <MenuItem key={ev?.id} value={ev?.value}>{ev?.name}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Box>
        }
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

                      marginBottom: "10px !important",
                    }}
                  >
                    <Box
                      sx={{
                        marginBottom: "10px !important",
                        marginRight: "10px !important",
                      }}
                    >
                      <Box>
                        <Typography variant="h6">Test Report</Typography>
                      </Box>
                    </Box>
                    <Stack
                      justifyContent="space-between"
                      direction={{ xs: "column", sm: "row" }}
                      alignItems={{ sm: "center" }}
                      sx={{ mb: 0.5 }}
                    >
                      {/* <StyledIcon icon="mdi:account-student" /> */}
                      <Typography variant="subtitle2">
                        Student Name:&nbsp;
                        <span style={{ fontWeight: 400 }}>
                          {countTestResult?.studentName}
                        </span>
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ marginLeft: "-60px" }}
                      >
                        Test Name :&nbsp; Own Test
                        <span style={{ fontWeight: 400 }}>
                          {/* {countTestResult?.title} */}
                        </span>{" "}
                      </Typography>

                      <Typography variant="subtitle2">
                        Total Question :&nbsp;
                        <span style={{ fontWeight: 400 }}>
                          {countTestResult?.numberOfQuestions}
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
                          {countTestResult?.correctAnswer}
                        </span>
                      </Typography>
                      <Typography variant="subtitle2">
                        Unattempted Answer :&nbsp;
                        <span style={{ fontWeight: 400 }}>
                          {" "}
                          {countTestResult?.unAttemptedAnswer}
                        </span>{" "}
                      </Typography>

                      <Typography variant="subtitle2">
                        Wrong Answer :&nbsp;
                        <span style={{ fontWeight: 400 }}>
                          {countTestResult?.wrongAnswer}
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
                          {/* {countTestResult?.testTime} */}
                          {moment.duration(countTestResult?.testTime).asMinutes() + " Minute"}
                        </span>
                      </Typography>
                    </Stack>
                  </Paper>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Card>
        {countTestResult?.questions?.map((details, index) => (
          <MathJaxContext config={config}>
            <Card sx={{ p: 1 }}>
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
                          // bgcolor: "white",
                          marginBottom: "10px !important",
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
                                  alignItems: "center",
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
                                justifyContent: "space-between",
                                marginBottom: "0px",
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Box>A.&nbsp;</Box>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  {ReactHtmlParser(details?.A)}
                                </Box>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Box>B.&nbsp;</Box>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  {ReactHtmlParser(details?.B)}
                                </Box>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Box>C.&nbsp;</Box>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  {ReactHtmlParser(details?.C)}
                                </Box>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Box>D.&nbsp;</Box>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
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

                            {/* <Checkbox {...label} defaultChecked color="success" /> */}
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
                                    display: "flex",
                                  }}
                                >
                                  <CheckBoxIcon color="success" />{" "}
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
                                  <DisabledByDefaultIcon color="red" />{" "}
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

export default StudentOwnTestReport;
