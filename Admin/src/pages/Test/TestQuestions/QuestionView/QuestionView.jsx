import React from "react";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { Grid, Card, Stack, Typography, Paper, Box, Container } from "@mui/material";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import ReactHtmlParser from "react-html-parser";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { getTestByIdAsync } from "redux/slices/TestSlice/async.api";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import moment from "moment";


const Viewcreate = () => {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { testLoader, getTestById } = useSelector((state) => state.tests);
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

  useEffect(() => {
    if (id) dispatch(getTestByIdAsync(id));
  }, [id]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false} >
      <Helmet>
        <title> Test Questions | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Questions"
        links={[
          { name: "Test" },
          { name: "Create Test", href: "/app/test/test-questions" },
          { name: "Questions" }
        ]}
      />
      {testLoader ? (
        <Card sx={{ p: 1, display: "flex", justifyContent: "center", py: 5 }}>
          <CustomComponentLoader padding="0 0" size={40} />
        </Card>
      ) : (
        <>
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
                        marginBottom: "10px !important",
                      }}
                    >
                      <Stack
                        justifyContent="space-between"
                        direction={{ xs: "column", sm: "row" }}
                      >
                        <Stack
                          direction='column'
                          alignItems={{ sm: "start" }}
                          sx={{ mb: 0.5 }}
                        >
                          <Typography variant="body1">
                            <b>Course: </b>&nbsp;
                            <span style={{ fontWeight: 400 }}>
                              {getTestById?.data?.courseName}
                            </span>
                          </Typography>
                          <Typography variant="body1">
                            <b>Board: </b>&nbsp;
                            <span style={{ fontWeight: 400 }}>
                              {getTestById?.data?.boardName}
                            </span>
                          </Typography>
                          <Typography variant="body1">
                            <b>Class: </b>&nbsp;
                            <span style={{ fontWeight: 400 }}>
                              {getTestById?.data?.className}
                            </span>
                          </Typography>
                        </Stack>
                        <Stack
                          direction='column'
                          alignItems={{ sm: "start" }}
                          sx={{ mb: 0.5 }}
                        >
                          <Typography variant="body1">
                            <b>Batch: </b>&nbsp;
                            <span style={{ fontWeight: 400 }}>
                              {getTestById?.data?.batchType.map(ev => ev).join(",")}
                            </span>
                          </Typography>
                          <Typography variant="body1">
                            <b>Paper Type: </b>&nbsp;
                            <span style={{ fontWeight: 400 }}>
                              {getTestById?.data?.category}
                            </span>
                          </Typography>
                          <Typography variant="body1">
                            <b> Paper:</b>&nbsp;
                            <span style={{ fontWeight: 400 }}>
                              {getTestById?.data?.title}
                            </span>
                          </Typography>
                        </Stack>

                        <Stack
                          direction='column'
                          alignItems={{ sm: "start" }}
                          sx={{ mb: 0.5 }}
                        >
                          <Typography variant="body1">
                            <b>Number Of Questions :</b>&nbsp;
                            <span style={{ fontWeight: 400 }}>
                              {getTestById?.data?.numberOfQuestions}
                            </span>{" "}
                          </Typography>

                          <Typography variant="body1">
                            <b>Time :</b>&nbsp;
                            <span style={{ fontWeight: 400 }}>
                              {/* {getTestById?.data?.time} */}
                              {moment.duration(getTestById?.data?.time).asMinutes() + " Minute"}
                            </span>
                          </Typography>
                        </Stack>
                      </Stack>
                    </Paper>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
            {getTestById?.data?.questions?.map((question, index) => (
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Stack
                    spacing={1.5}
                    sx={{ px: 3, padding: "0px !important" }}
                  >
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
                          <MathJaxContext config={config}>
                            <MathJax>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: "16px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                                key={index}
                              >
                                Question {index + 1}. &nbsp;{" "}
                                {ReactHtmlParser(question?.question)}
                              </Typography>
                            </MathJax>

                            <Box>
                              <MathJax key={index}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Box>A.&nbsp;</Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      {ReactHtmlParser(question?.A)}
                                    </Box>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Box>B.&nbsp;</Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      {ReactHtmlParser(question?.B)}
                                    </Box>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Box>C.&nbsp;</Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      {ReactHtmlParser(question?.C)}
                                    </Box>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Box>D.&nbsp;</Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      {ReactHtmlParser(question?.D)}
                                    </Box>
                                  </Box>
                                </Box>
                              </MathJax>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <CheckBoxIcon color="success" />
                              <Typography variant="body2">
                                {ReactHtmlParser(question?.answer)}
                              </Typography>
                            </Box>
                          </MathJaxContext>
                        </Box>
                      </Paper>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            ))}
          </Card>
        </>
      )}
    </Container >
  );
};

export default Viewcreate;
