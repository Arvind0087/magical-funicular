import { useState, useEffect, useTransition } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TabContext from "@mui/lab/TabContext";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from "@mui/material/CircularProgress";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { LazyLoadImage } from "react-lazy-load-image-component";
import moment from "moment";
import { Helmet } from "react-helmet-async";
import { PATH_DASHBOARD } from "routes/paths";
import {
  coursePackagesByStudentAsync,
  userAllBatchesAsync,
} from "redux/syllabus/syllabus.async";
import SubscribedCourse from "./SubscribedCourse";
import AllBatches from "./AllBatches";

export default function Syllabus() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { getCoursePackageLoader, getCoursePackage } = useSelector(
    (state) => state?.syllabusAsy
  );
  const { getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { siteTitle } = getOnlySiteSettingData;

  const { userInfo } = useSelector((state) => state.userInfo);
  const { studentById = {} } = useSelector((state) => state?.student);
  const [tab, setTab] = useState("Our Courses");
  const [isPending, startTransition] = useTransition();

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const handleTabChange = (event, newValue) => {
    startTransition(() => {
      setTab(newValue);
    });
  };

  useEffect(() => {
    const payload = {
      batchTypeId: studentById?.batchTypeId,
      type: tab == "Our Courses" ? "allcourse" : "purchased",
    };
    if (studentById.course_type !== "Subscription") {
      dispatch(coursePackagesByStudentAsync(payload));
    }
  }, [tab]);

  const backHandler = () => {
    navigate(-1);
  };

  const viewCourse = (val) => {
    if (val.package_type == "Recorded" || val?.package_type == "Navodaya_Kit") {
      navigate(`${PATH_DASHBOARD.courses}/${val.packageId}`, {
        state: {
          val,
        },
      });
    } else if (val.package_type == "Live") {
      navigate(`${PATH_DASHBOARD.livecourses}/${val.packageId}`, {
        state: {
          val,
        },
      });
    }
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <>
      <Helmet>
        <title>Courses | {`${siteTitle}`}</title>
      </Helmet>
      <Box
        sx={{
          position: "relative",
          backgroundColor: "#fff",
          width: "103%",
          height: "50px",
          marginLeft: "-15px",
          // marginTop: "-14px",
          mt: 2,
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
            {tab}
          </Typography>
        </Box>
      </Box>

      <Container>
        <TabContext value={tab}>
          <Box sx={{ borderColor: "divider" }}>
            <TabList onChange={handleTabChange}>
              <Tab label="Our Courses" value="Our Courses" />
              <Tab
                label={
                  studentById?.course_type == "Subscription"
                    ? "My Subscriptions"
                    : "My Courses"
                }
                value={
                  studentById?.course_type == "Subscription"
                    ? "My Subscriptions"
                    : "My Courses"
                }
              />
            </TabList>
          </Box>

          <TabPanel value={tab}>
            {studentById?.course_type == "Subscription" &&
              (tab == "Our Courses" ? (
                <Button
                  onClick={toggleDrawer("right", true)}
                  sx={{
                    backgroundColor: "#098A4E",
                    padding: "8px 15px",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#098A4E",
                    },
                  }}
                >
                  <FormatListBulletedIcon sx={{ mr: 1 }} /> View All Courses
                </Button>
              ) : (
                <AllBatches />
              ))}

            {studentById?.course_type !== "Subscription" &&
              (getCoursePackageLoader ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 8,
                    width: "100%",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : getCoursePackage?.length > 0 ? (
                <Box sx={{ pt: 4, position: "relative" }}>
                  <Grid container spacing={3}>
                    {getCoursePackage?.map((item) => {
                      return (
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              width: "100%",
                              // height: "479px",
                              height: "auto",
                              backgroundColor: "#314A53",
                              borderRadius: "4px",
                              padding: "15px",
                            }}
                          >
                            <Box
                              sx={{
                                // height: { xs: "45%", sm: "47%", md: "53%" },
                                height: { xs: "200px", sm: "250px" },
                                width: "100%",
                                margin: "auto",
                              }}
                            >
                              <LazyLoadImage
                                alt={item?.package_title}
                                effect="blur"
                                src={item?.package_thumbnail}
                                width="100%"
                                height="100%"
                                objectFit="contain"
                                style={{ borderRadius: "8px" }}
                              />
                            </Box>
                            <Box sx={{ width: "100%" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  mt: 2,
                                }}
                              >
                                <Button
                                  sx={{
                                    backgroundColor: "#12303B",
                                    color: "#FFFFFF",
                                    opacity: "0.5",
                                    fontSize: "12px",
                                    padding: "3px 15px",
                                    borderRadius: "4px",
                                    cursor: "auto",
                                    "&:hover": { backgroundColor: "#00264d" },
                                  }}
                                >
                                  {item?.batchName}
                                </Button>
                                <Button
                                  sx={{
                                    backgroundColor: "#FF0000",
                                    color: "#FFFFFF",
                                    fontSize: "12px",
                                    padding: "3px 15px",
                                    borderRadius: "4px",
                                    cursor: "auto",
                                    "&:hover": { backgroundColor: "#ff3333" },
                                  }}
                                >
                                  {item?.package_type}
                                </Button>
                              </Box>
                              <Typography
                                sx={{
                                  fontSize: "23px",
                                  fontWeight: "600",
                                  color: "#fff",
                                  mt: 2,
                                }}
                              >
                                {item?.package_title}
                              </Typography>
                              <Typography sx={{ color: "#FFFFFF", mt: 1 }}>
                                <span style={{ opacity: 0.5 }}>Starts on</span>{" "}
                                <span style={{ opacity: 1 }}>
                                  {moment(item?.package_start_date).format(
                                    "D MMMM YYYY"
                                  )}
                                </span>
                              </Typography>
                              <Box
                                sx={{
                                  border: "1px solid #D9D9D9",
                                  opacity: "0.5",
                                  mt: 3,
                                }}
                              ></Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  mt: 2,
                                }}
                              >
                                <Box>
                                  <Typography
                                    sx={{
                                      color: "#fff",
                                      fontSize: "20px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {item && !item.isPurchased
                                      ? `₹${item?.package_selling_price}`
                                      : ""}{" "}
                                    {item && !item.isPurchased ? (
                                      <span
                                        style={{
                                          textDecoration: "line-through",
                                          fontSize: "16px",
                                          opacity: "0.8",
                                        }}
                                      >
                                        ₹{item?.package_price}
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </Typography>
                                </Box>
                                <Button
                                  sx={{
                                    backgroundColor: "#41AA30",
                                    color: "#fff",
                                    padding: "3px 15px",
                                    borderRadius: "4px",
                                    "&:hover": { backgroundColor: "#47d147" },
                                  }}
                                  onClick={() => viewCourse(item)}
                                >
                                  {item?.isPurchased == true
                                    ? "Start Learning"
                                    : "View Course"}
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              ) : (
                <Box>
                  <p>No Data found!</p>
                </Box>
              ))}
          </TabPanel>
        </TabContext>

        {state && (
          <SubscribedCourse
            setState={setState}
            state={state}
            toggleDrawer={toggleDrawer}
          />
        )}
      </Container>
    </>
  );
}
