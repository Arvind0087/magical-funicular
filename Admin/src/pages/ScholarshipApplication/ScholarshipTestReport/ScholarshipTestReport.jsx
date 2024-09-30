import React from "react";
import { Grid, Card, Stack, Typography, Paper, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import ReactHtmlParser from "react-html-parser";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { getTestReportByIdAsync } from "redux/slices/TestSlice/async.api";
import CustomBreadcrumbs from 'components/custom-breadcrumbs/CustomBreadcrumbs';
import { PATH_DASHBOARD } from "routes/paths";
const Viewcreate = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const query = new URLSearchParams(location.search);
  const { testreportLoader, reportById } = useSelector(
    (state) => state.testreport
  );

  const config = {
    loader: { load: ["[tex]/html"] },
    tex: {
      packages: { "[+]": ["html"] },
      inlineMath: [["$", "$"]],
      displayMath: [["$$", "$$"]],
    },
    onLoad: () => {},
  };

  useEffect(() => {
    if (id) {
      const payload = {
        testId: query.get("testId"),
        studentId: query.get("studentId"),
      };
      dispatch(getTestReportByIdAsync(payload));
    }
  }, [id]);

  return (
    <Box>
      <Card sx={{ p: 2 }}>
      <CustomBreadcrumbs
          heading={"Scholarship Test Report"}
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            {
              name: "Scholarship Application ",
              href: PATH_DASHBOARD.scholorshipapplication,
            },
            {
              name: "Scholarship Test Report" ,
            },
          ]}
        />
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
                        {reportById?.studentName}
                      </span>
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ marginLeft: "-60px" }}
                    >
                      Test Name :&nbsp;
                      <span style={{ fontWeight: 400 }}>
                        {reportById?.title}
                      </span>{" "}
                    </Typography>

                    <Typography variant="subtitle2">
                      Total Question :&nbsp;
                      <span style={{ fontWeight: 400 }}>
                        {reportById?.numberOfQuestions}
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
                        {reportById?.correctAnswer}
                      </span>
                    </Typography>
                    <Typography variant="subtitle2">
                      Unattempted Answer :&nbsp;
                      <span style={{ fontWeight: 400 }}>
                        {" "}
                        {reportById?.unAttemptedAnswer}
                      </span>{" "}
                    </Typography>

                    <Typography variant="subtitle2">
                      Wrong Answer :&nbsp;
                      <span style={{ fontWeight: 400 }}>
                        {reportById?.wrongAnswer}
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
                        {reportById?.testTime}
                      </span>
                    </Typography>
                  </Stack>
                </Paper>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Card>
      {reportById?.questions?.map((details, index) => (
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
  );
};

export default Viewcreate;
