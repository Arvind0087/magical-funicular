import React from "react";
import { Helmet } from "react-helmet-async";
import { Theme, useTheme, makeStyles } from "@mui/material/styles";
import "./dashboard.css";
import {
  Container,
  Grid,
  Card,
  Box,
  CardContent,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import GroupIcon from "@mui/icons-material/Group";
import EastIcon from "@mui/icons-material/East";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import PlanPremiumIcon from "assets/icons/PlanPremiumIcon";
import { getDashboardAsync } from "redux/dashboard/dashboard.async";
import { useSettingsContext } from "components/settings/SettingsContext";
import { PATH_DASHBOARD } from "routes/paths";
import { Link } from "react-router-dom";
import AnalyticsCurrentVisits from "./AnalayticCurrent";
import TestReportStatistic from "./TestReportGraph/TestReportStatistic";
import {
  getUserGenderDataAsync,
  getStudentSubscriptionAsync,
} from "redux/async.api";
import { getStudentTestReportGraphAsync } from "redux/slices/TestSlice/async.api";
import { epmtyStudentRecord } from "redux/slices/student.slice";
import _ from "lodash";
import BarChartSimple from "utils/charts/StudentStrengthChart";
import LiveStudentChart from "utils/charts/LiveStudentChart";
import LiveTestContentReport from "utils/charts/LiveTestContentReport";
import UserRegisterChart from "utils/charts/UserRegisterChart";
import StudentAttendanceGraph from "utils/charts/StudentAttendanceChart";
import Student from "pages/StudentManager/Student/index";
import { getStateFilterAsync } from "redux/filter/filter.async";
import SellsDashboard from "./SellsDashboard";
import PurchaseDashboard from "./PurchaseDashboard";
import RegistrationDashboard from "./RegistrationDashboard";

export default function Dashboard() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [seriesData, setSeriesData] = useState();
  const { themeStretch } = useSettingsContext();
  const [tabs, setTabs] = useState("user");
  const { permissionMenu } = useSelector((state) => state.menuPermission);
  const { dashboardLoader, dashboard } = useSelector(
    (state) => state.dashboard
  );
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );
  const { getUserGenderData, getStudentSubscriptionData } = useSelector(
    (state) => state.student
  );
  const { getStudentTestReportGraph } = useSelector((state) => state.tests);
  const { studentLoader, studentFilter } = useSelector(
    (state) => state.studentFilter
  );

  const Dashboard_values = [
    {
      id: 1,
      icon: GroupIcon,
      title: "Students",
      titleColor: "#005249",
      counts: dashboard?.userCount,
      bgColor: "#C8FACD",
      navigateLink: `${PATH_DASHBOARD.student}`,
    },
    {
      id: 2,
      icon: PlanPremiumIcon,
      title: "Batch Types",
      titleColor: "#7A4100",
      counts: dashboard?.batchTypeCount,
      bgColor: "#FFF5CC",
      navigateLink: `${PATH_DASHBOARD.batchtype}`,
    },
    {
      id: 3,
      icon: SmartDisplayIcon,
      title: "Shorts",
      titleColor: "#003768",
      counts: dashboard?.shortsCount,
      bgColor: "#CAFDF5",
      navigateLink: `${PATH_DASHBOARD.short}`,
    },
    {
      id: 4,
      icon: GroupIcon,
      title: "Staffs",
      titleColor: "#7A0916",
      counts: dashboard?.staffCount,
      bgColor: "#FFE9D5",
      navigateLink: `${PATH_DASHBOARD.staff}`,
    },
    {
      id: 5,
      icon: QuestionMarkIcon,
      title: "Doubts",
      titleColor: "#660033",
      counts: dashboard?.doubtCount,
      bgColor: "#99ffff",
      navigateLink: `${PATH_DASHBOARD.doubts}`,
    },
    {
      id: 6,
      icon: QuestionMarkIcon,
      title: "Questions",
      titleColor: "#993300",
      counts: dashboard?.questionCount,
      bgColor: "#ffb3d9",
      navigateLink: `${PATH_DASHBOARD.questionbank}`,
    },
  ];

  useEffect(() => {
    dispatch(getStateFilterAsync({}));
    // dispatch(getStateAsync({}));
  }, []);

  useEffect(() => {
    dispatch(getDashboardAsync());
  }, []);

  useEffect(() => {
    dispatch(epmtyStudentRecord());
    dispatch(getUserGenderDataAsync());
    dispatch(getStudentSubscriptionAsync());
  }, []);

  useEffect(() => {
    if (seriesData && seriesData) {
      let payload = {
        id: seriesData?.value || seriesData?.id,
      };
      dispatch(getStudentTestReportGraphAsync(payload?.id));
    }
  }, [seriesData]);

  const _ = require("lodash");

  const arrayOfObjects = studentFilter;

  const firstObject = _.first(arrayOfObjects && arrayOfObjects);

  useEffect(() => {
    setSeriesData(firstObject);
  }, [firstObject]);

  const tabHandler = (val) => {
    setTabs(val);
  };

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Dashboard | {`${tabTitle}`}</title>
      </Helmet>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          gap: 1,
          mb: 4,
          mt: { xs: 2, sm: 2, md: -3 },
        }}
      >
        <Button
          variant={tabs == "user" ? "contained" : "outlined"}
          onClick={() => tabHandler("user")}
          sx={{ fontSize: "12px", width: "70px" }}
        >
          User
        </Button>
        <Button
          variant={tabs == "sale" ? "contained" : "outlined"}
          onClick={() => tabHandler("sale")}
          sx={{ fontSize: "12px", width: "70px" }}
        >
          Sale
        </Button>
        <Button
          variant={tabs == "purchase" ? "contained" : "outlined"}
          onClick={() => tabHandler("purchase")}
          sx={{ fontSize: "12px", width: "80px" }}
        >
          Purchase
        </Button>
        <Button
          variant={tabs == "registration" ? "contained" : "outlined"}
          onClick={() => tabHandler("registration")}
          sx={{ fontSize: "12px", width: "90px" }}
        >
          Registration
        </Button>
      </Box>
      {tabs == "user" && (
        <>
          {Boolean(permissionMenu[0]?.items?.length === 0) ? (
            <Box
              sx={{
                background: "#d6f4e2",
                p: 5,
                mt: 2,
                borderRadius: 1,
                color: "#07ae59",
              }}
            >
              <Typography sx={{ fontWeight: "700" }}>
                No permission provided to you!
              </Typography>
              <Typography
                sx={{
                  fontWeight: "200",
                  fontSize: "15px",
                  lineHeight: "25px",
                  color: "#768590",
                  mt: 1,
                }}
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {Dashboard_values?.map((values, index) => (
                <Grid item xs={12} md={3} key={index}>
                  <Card sx={{ backgroundColor: values.bgColor }}>
                    <CardContent>
                      <Box
                        sx={{
                          height: "64px",
                          width: "64px",
                          margin: "auto",
                          // borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          // background:
                          //   "linear-gradient(135deg, rgba(0, 171, 85, 0) 0%, rgba(0, 171, 85, 0.24) 97.35%)",
                          color: values.titleColor,
                          justifyContent: "center",
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <h2>{values?.counts}</h2>
                      </Box>
                      <Box
                        sx={{
                          margin: "auto",
                          display: "grid",
                          placeItems: "center",
                          color: values.titleColor,
                        }}
                      >
                        <h2>{values?.title}</h2>
                      </Box>
                      <Box
                        sx={{
                          height: "30px",
                          width: "30px",
                          margin: "auto",
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          background: values?.titleColor,
                        }}
                      >
                        <Link to={values?.navigateLink}>
                          <EastIcon
                            sx={{
                              color: "#FFFFFF",
                              justifyContent: "center",
                              alignItems: "center",
                              display: "flex",
                            }}
                          />
                        </Link>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <AnalyticsCurrentVisits
                    title={getUserGenderData?.title}
                    chart={{
                      series: getUserGenderData?.data || [],
                      colors: [
                        theme.palette?.primary?.main,
                        theme.palette?.info?.main,
                        theme.palette?.error?.main,
                        theme.palette?.warning?.main,
                      ],
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <AnalyticsCurrentVisits
                    title="By Subscription"
                    chart={{
                      series: getStudentSubscriptionData?.data || [],
                      colors: [
                        theme.palette?.warning?.main,
                        theme.palette?.primary?.main,
                      ],
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <UserRegisterChart />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <LiveStudentChart />
              </Grid>
              <Grid item xs={12}>
                <LiveTestContentReport />
              </Grid>
              <Grid item xs={12}>
                <BarChartSimple />
              </Grid>
              {/* <Grid item xs={12}>
                <StudentAttendanceGraph />
              </Grid>

              <Grid item xs={12} md={12}>
                <Stack spacing={3} sx={{ mt: 3 }}>
                  <TestReportStatistic
                    title="Student Test Report"
                    subheader="Test Report"
                    setSeriesData={setSeriesData}
                    seriesData={seriesData && seriesData}
                    chart={{
                      categories:
                        getStudentTestReportGraph &&
                        getStudentTestReportGraph?.data?.map((ev) => ev?.title),
                      colors: [
                        theme?.palette?.primary?.main,
                        theme?.palette?.warning?.main,
                      ],
                      series: [
                        {
                          type: seriesData?.label,
                          data: [
                            {
                              name: "Correct Answer",
                              data:
                                getStudentTestReportGraph &&
                                getStudentTestReportGraph?.data?.map(
                                  (ev) => ev?.correct
                                ),
                            },
                            {
                              name: "Incorrect Answer",
                              data:
                                getStudentTestReportGraph &&
                                getStudentTestReportGraph?.data?.map(
                                  (ev) => ev?.wrongAnswer
                                ),
                            },
                            {
                              name: "Unattempted",
                              data:
                                getStudentTestReportGraph &&
                                getStudentTestReportGraph?.data?.map(
                                  (ev) => ev?.unAttemptedAnswer
                                ),
                            },
                          ],
                        },
                      ],
                    }}
                  />
                </Stack>
              </Grid> */}
            </Grid>
          )}
        </>
      )}
      {tabs == "sale" && (
        <>
          <SellsDashboard />
        </>
      )}
      {tabs == "purchase" && (
        <>
          <PurchaseDashboard />
        </>
      )}
      {tabs == "registration" && (
        <>
          <RegistrationDashboard />
        </>
      )}
    </Container>
  );
}
