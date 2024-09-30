import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { isArray } from "lodash";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { PATH_DASHBOARD } from "routes/paths";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import useTheme from "@mui/material/styles/useTheme";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import useMediaQuery from "@mui/material/useMediaQuery";
import ClockImage from "assets/images/ClockImage.svg";
import VideoIconImage from "assets/images/VideoIconImage.svg";
import NoteIconImage from "assets/images/NoteIconImage.svg";
import insta from "../../assets/socialmedia/insta.png";
import linkedin from "../../assets/socialmedia/linkedin.png";
import facebook from "../../assets/socialmedia/facebook.png";
import yt from "../../assets/socialmedia/yt.png";
import whatsapp from "../../assets/socialmedia/whatsapp.png";
import telegram from "../../assets/socialmedia/telegram.png";
import FreeLiveCarousel from "../../components/freeLiveClass/FreeLiveCarousel";
import CircularProgressGraph from "./CircularProgressGraph";
import newimg from "../../assets/images/dashboard/newimg.png";

import {
  getSubjectsByStudentAsync,
  getcountBookmarkAsync,
  getAllOnlyForYouAsync,
  getAllBannerByTypeAsync,
  getActivityReportOfUserAsync,
  getNewShortsByStudentIdAsync,
  getStudentByIdAsync,
  addUserSpendTimeAsync,
} from "redux/async.api";
import { getFreeEventByStudentIdAsync } from "redux/freeliveClass/freeliveClass.async";
import { useSettingsContext } from "components/settings";
import CustomComponentLoaderBox from "components/CustomComponentLoaderBox/CustomComponentLoaderBox";
import DashboardShortsCarousel from "./DashboardShortsCarousel";
import OnlyForYouCarousel from "./OnlyForYouCarousel";
import DashMyBookMarkCarousel from "./DashMyBookMarkCarousel";
import DashboardSpeak from "./DashboardSpeak";
import "./Dashboard.css";
import RightArrow from "../../assets/images/rightArrow.png";
import Timeicon from "../../assets/images/timeicon.png";
import { Toys } from "@material-ui/icons";
import { freeResource } from "./data";

export default function Dashboard() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const {
    bannerLoader,
    banners,
    AllOnlyForYouLoader,
    AllOnlyForYou = [],
  } = useSelector((state) => state?.dashboard);
  const { freeLiveLoader, freeLive } = useSelector((state) => state?.freeLive);
  const { subjectBy } = useSelector((state) => state?.subject);
  const { studentById = {} } = useSelector((state) => state?.student);
  const { id, subscriptionType } = studentById;
  const { newVideosLoader, newVideos = [] } = useSelector(
    (state) => state?.shorts
  );
  const { activityReportOfUser = {} } = useSelector((state) => state?.activity);
  const { countBookmarkbyidLoader, countBookmarkbyid = {} } = useSelector(
    (state) => state?.dashboard
  );
  const CarouselDataSize = Object.keys(countBookmarkbyid).length;
  const { userInfo } = useSelector((state) => state.userInfo);
  const { getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );

  const {
    siteTitle,
    instagramLink,
    facebookLink,
    linkedinLink,
    youtubeLink,
    whatsappLink,
  } = getOnlySiteSettingData;

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToScroll: 1,
    arrows: false,
  };

  useEffect(() => {
    const payload = {
      userId: userInfo?.userId,
      batchTypeId: "",
    };
    dispatch(getStudentByIdAsync(payload));
    dispatch(addUserSpendTimeAsync({}));
    dispatch(getcountBookmarkAsync());
    dispatch(getAllBannerByTypeAsync({ type: "Home" }));
    dispatch(getAllOnlyForYouAsync());
    dispatch(getActivityReportOfUserAsync());
  }, [dispatch, userInfo?.userId]);

  useEffect(() => {
    if (id && studentById?.courseId) {
      dispatch(
        getNewShortsByStudentIdAsync({
          type: "",
          studentId: id,
        })
      );
      dispatch(
        getSubjectsByStudentAsync({
          courseId: studentById.courseId,
          boardId: studentById.boardId,
          classId: studentById.classId,
          batchTypeId: studentById.batchTypeId,
        })
      );
    }
  }, [
    dispatch,
    id,
    studentById.batchTypeId,
    studentById.boardId,
    studentById.classId,
    studentById.courseId,
  ]);

  //NOTE: redirect to subscription page
  const handleSubscribeClick = () => {
    navigate(PATH_DASHBOARD.subscription);
  };

  //NOTE: redirect to recentActivity page
  const handleRecentActivityClick = (label) => {
    navigate(PATH_DASHBOARD.recentActivity, {
      state: {
        label: label,
      },
    });
  };

  //NOTE: redirect to syllabus page
  const handleSyllabusClick = (item) => {
    if (studentById?.courseId == 7) {
      navigate("/app/chapters", {
        state: {
          subjectInfo: item,
        },
      });
    } else {
      navigate("/app/syllabus", {
        state: {
          subjectInfo: item,
        },
      });
    }
  };

  //NOTE: redirect to myLearningReports page
  const handleMyLearningReportsClick = () => {
    navigate(PATH_DASHBOARD.myLearningReports);
  };

  useEffect(() => {
    let payload = {
      status: "home",
      batchTypeId: studentById?.batchTypeId,
    };
    dispatch(getFreeEventByStudentIdAsync(payload));
  }, []);

  const freeResourceHandler = (route) => {
    navigate(`/app/${route}`);
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | {`${siteTitle}`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "xl"}>
        {studentById?.course_type !== "Purchase" &&
          ["Free"].includes(subscriptionType) && (
            <Grid container sx={{ mb: 4 }}>
              <Grid item xs={12} md={5}>
                <Card
                  sx={{
                    overflow: "hidden",
                    mt: "10px",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <CardHeader
                    title="Your free trial expires today"
                    sx={{ paddingLeft: 0, paddingTop: 0 }}
                  />
                  <CardContent sx={{ padding: "16px", paddingLeft: 0 }}>
                    <Typography component="div">
                      Subscribe to enjoy an uninterrupted learning experience.
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 0, paddingLeft: 0 }}>
                    <Button
                      variant="contained"
                      sx={{
                        color: "#fff",
                        borderRadius: "50px",
                        padding: "6px 16px",
                        cursor: "pointer",
                      }}
                      onClick={handleSubscribeClick}
                    >
                      Subscribe Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          )}

        {/* SECTION - banner card */}
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={12} md={10} lg={10}>
            {bannerLoader ? (
              <Box
                sx={{
                  height: "350px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                }}
              >
                <CustomComponentLoaderBox padding="0" size={50} />
              </Box>
            ) : (
              <Slider {...settings} className="deshboard-slider">
                {isArray(banners) &&
                  banners?.slice(0, 5)?.map((item, index) => (
                    <Card key={`${index}lazyImg`}>
                      <LazyLoadImage
                        key={index}
                        src={item.image}
                        effect="blur"
                        width="100%"
                        height={isDesktop ? "350px" : "auto"}
                        className="lazyloadbanner"
                      />
                    </Card>
                  ))}
              </Slider>
            )}
          </Grid>
        </Grid>

        {/* SECTION - Recent Activities */}
        <Box
          sx={{
            backgroundColor: "rgba(242, 107, 53, 0.1)",
            width: { xs: "100%", sm: "60%", md: "50%" },
            height: "250px",
            borderRadius: "12px",
            mt: 8,
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(to right, #F26B35, #FEDD40)",
              width: "100%%",
              height: "100px",
              borderRadius: "12px 12px 0px 0px",
              padding: "0px 15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                sx={{ fontSize: "20px", fontWeight: "500", color: "#fff" }}
              >
                Recent Activities
              </Typography>
              <Typography
                sx={{ fontSize: "16px", fontWeight: "400", color: "#fff" }}
              >
                Track your recently studied topics
              </Typography>
            </Box>
            {/*<Box
              sx={{ cursor: "pointer" }}
              onClick={handleMyLearningReportsClick}
            >
              <img src={RightArrow} alt="right arrow" width="30px" />
            </Box> */}
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "auto",
              display: "flex",
              justifyContent: "space-between",
              pl: { xs: 1, sm: 3, md: 4 },
              pr: { xs: 1, sm: 3, md: 4 },
              pt: { xs: 3, sm: 3, md: 3 },
            }}
          >
            {/*<Box>
              <Box sx={{ display: "flex" }}>
                {"⏳"}{" "}
                <Typography
                  sx={{
                    fontSize: { xs: "15px", sm: "20px", md: "23px" },
                    fontWeight: "600",
                  }}
                >
                  Weekly Time Spent
                </Typography>
              </Box>

              <Box
                sx={{ mt: 1, display: "flex", alignItems: "flex-end", gap: 1 }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "35px", sm: "40px", md: "45px" },
                    fontWeight: "700",
                    color: "#f26b35",
                  }}
                >
                  {activityReportOfUser?.weeklyTimeSpent}
                </Typography>{" "}
                <Typography
                  sx={{
                    fontSize: { xs: "18px", sm: "20px", md: "20px" },
                    fontWeight: "600",
                    color: "rgba(103, 105, 108, 1)",
                  }}
                >
                  Minutes
                </Typography>
              </Box>
            </Box> */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
                // mt: "-20px",
                ml: { xs: "-20px", sm: "-57px", md: "-65px" },
              }}
            >
              <Typography sx={{ mb: 1, fontSize: "14px", fontWeight: 600 }}>
                Course Completed (%)
              </Typography>
              <CircularProgressGraph
                value={activityReportOfUser?.learnPercent}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: { xs: "10px", sm: "18px", md: "20px" },
              }}
            >
              <Box
                sx={{
                  width: { xs: "70px", sm: "80px", md: "80px" },
                  height: "100px",
                  backgroundColor: "rgba(242, 107, 53, 0.2)",
                  border: "2px solid #fff",
                  borderRadius: "6px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  pt: 2,
                  pb: 2,
                }}
                onClick={() => handleRecentActivityClick("Learn")}
              >
                <Typography
                  sx={{ color: "#f26b35", fontSize: "24px", fontWeight: "600" }}
                >
                  {activityReportOfUser?.learnActivity}
                </Typography>
                <Typography
                  sx={{ color: "#f26b35", fontSize: "20px", fontWeight: "500" }}
                >
                  Learn
                </Typography>
              </Box>
              <Box
                sx={{
                  width: { xs: "70px", sm: "80px", md: "80px" },
                  height: "100px",
                  backgroundColor: "rgba(242, 107, 53, 0.2)",
                  border: "2px solid #fff",
                  borderRadius: "6px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  pt: 2,
                  pb: 2,
                }}
                onClick={() => handleRecentActivityClick("Test")}
              >
                <Typography
                  sx={{ color: "#f26b35", fontSize: "24px", fontWeight: "600" }}
                >
                  {activityReportOfUser?.totalTest}
                </Typography>
                <Typography
                  sx={{ color: "#f26b35", fontSize: "20px", fontWeight: "500" }}
                >
                  Test
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3} marginTop="32px">
          <Grid item xs={12}>
            <Typography component="div" fontWeight="700" variant="h4">
              Start Learning
            </Typography>
            <Typography component="div">
              Track your recently studied topics
            </Typography>
          </Grid>
          <Grid item container mt={2} spacing={0}>
            {subjectBy && subjectBy.length > 0 ? (
              subjectBy.map((item, index) => (
                <Grid
                  item
                  sx={{
                    mr: 4,
                    mt: { xs: 2, sm: 0 },
                    position: "relative",
                    width: { xs: "145px", sm: "180px" },
                    height: "205px",
                    backgroundColor: index % 2 === 0 ? "#fef1eb" : "#e7f4ee",
                    borderRadius: 1,
                    cursor: "pointer",
                    border: `2px solid ${
                      subjectBy?.id === item?.id
                        ? index % 2 === 0
                          ? "#F26B35"
                          : "#098A4E"
                        : "none"
                    }`,
                  }}
                  key={index}
                  onClick={() => handleSyllabusClick(item)}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "45%",
                      // border: "1px solid black",
                      position: "absolute",
                      backgroundColor: index % 2 === 0 ? "#fde4d9" : "#d1eade",
                      top: "0",
                      left: "0",
                      borderRadius: "8px 8px 50% 50%",
                    }}
                  ></Box>
                  <Box
                    sx={{
                      textAlign: "center",
                      cursor: "pointer",
                      paddingTop: "12px",
                    }}
                  >
                    <Box
                      sx={{
                        // borderRadius: "50%",
                        width: "60px",
                        height: "70px",
                        display: "grid",
                        placeItems: "center",
                        margin: "auto",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        width="100%"
                        style={{ zIndex: "44" }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        mt: 3,
                        mb: 0,
                        fontSize: "14px",
                        fontWeight: "600",
                        textAlign: "center",
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: "100%",
                      height: "50px",
                      borderRadius: "0px 0px 8px 8px",
                      display: "flex",
                      position: "absolute",
                      bottom: "0px",
                      alignItems: "center",
                      justifyContent: "center",
                      boxSizing: "border-box",
                      mt: 1,
                      color: "#212B36",
                      backgroundImage: `linear-gradient(to right, ${
                        index % 2 === 0 ? "#F26B35" : "#098A4E"
                      }, ${index % 2 === 0 ? "#FEE140" : "#9ADD00"})`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#fff",
                      }}
                    >
                      {item.isAllSubject === true
                        ? item.subjectCount
                        : item.chaptersCount}{" "}
                      Chapters
                    </Typography>
                  </Box>
                </Grid>
              ))
            ) : (
              <Typography>No Data Found</Typography>
            )}
          </Grid>
        </Grid>
        {studentById?.course_type == "Purchase" && (
          <>
            <Box
              sx={{
                ml: "0px",
                mb: 4,
                mt: 6,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography component="div" fontWeight="700" variant="h4">
                <span style={{ color: "#F26B35" }}>FREE</span> Resources
              </Typography>
              <img
                src={newimg}
                alt="new text"
                height="16px"
                style={{ marginLeft: "10px", marginTop: "3px" }}
              />
            </Box>
            <Grid container spacing={2}>
              {freeResource?.map((item, index) => (
                <Grid item xs={2} md={1} key={`${index}res`}>
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{ cursor: "pointer" }}
                        onClick={() => freeResourceHandler(item?.route)}
                      >
                        <img src={item?.img} alt={item?.title} width="50px" />
                      </Box>
                      <Typography
                        sx={{ mt: 1, textAlign: "center", fontSize: "14px" }}
                      >
                        {item?.title}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {studentById?.course_type == "Purchase" && (
          <Box
            sx={{
              mt: 6,
              display: "flex",
              justifyContent: "space-between",
              width: { xs: "100%", sm: "80%", md: "70%" },
            }}
          >
            <Typography component="div" fontWeight="700" variant="h4">
              Watch <span style={{ color: "#F26B35" }}>FREE</span> live Classes
            </Typography>
            <Typography
              sx={{
                color: "#098A4E",
                // borderBottom: "1px solid #098A4E",
                textDecoration: "underline",
                cursor: "pointer",
                fontSize: "18px",
              }}
              onClick={() => navigate(PATH_DASHBOARD.freeevent)}
            >
              View All
            </Typography>
          </Box>
        )}

        {freeLiveLoader ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              // alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          freeLive?.length > 0 &&
          studentById?.course_type == "Purchase" && (
            <FreeLiveCarousel data={freeLive} loader={freeLiveLoader} />
          )
        )}

        {newVideos?.length > 0 ? (
          <Box sx={{ mt: 7 }}>
            <Typography variant="h4">Veda Shorts</Typography>
            <DashboardShortsCarousel
              userId={studentById?.id}
              shortsCarouselData={newVideos}
              newVideosLoader={newVideosLoader}
            />
          </Box>
        ) : null}

        {AllOnlyForYou?.length > 0 ? (
          <Box sx={{ mt: 7 }}>
            <Typography variant="h4">Only For You</Typography>
            <OnlyForYouCarousel
              AllOnlyForYouLoader={AllOnlyForYouLoader}
              AllOnlyForYou={AllOnlyForYou}
            />
          </Box>
        ) : null}

        {CarouselDataSize > 0 ? (
          <Box sx={{ mt: 7 }}>
            <Typography variant="h4">My Bookmarks</Typography>
            <DashMyBookMarkCarousel
              id={id}
              countBookmarkbyidLoader={countBookmarkbyidLoader}
              CarouselDataSize={CarouselDataSize}
              countBookmarkbyid={countBookmarkbyid}
            />
          </Box>
        ) : null}
        <DashboardSpeak />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 7,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ color: "primary.main", mb: 3 }}>
              Reach Us
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              columnGap: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {instagramLink ? (
              <Box sx={{ cursor: "pointer" }}>
                <Link to={instagramLink} target="_blank">
                  <img alt="" src={insta} width="40px" height="40px" />
                </Link>
              </Box>
            ) : null}
            {linkedinLink ? (
              <Box sx={{ cursor: "pointer" }}>
                <Link to={linkedinLink} target="_blank">
                  <img alt="" src={linkedin} width="40px" height="40px" />
                </Link>
              </Box>
            ) : null}
            {facebookLink ? (
              <Box sx={{ cursor: "pointer" }}>
                <Link to={facebookLink} target="_blank">
                  {" "}
                  <img alt="" src={facebook} width="40px" height="40px" />
                </Link>
              </Box>
            ) : null}
            {youtubeLink ? (
              <Box sx={{ cursor: "pointer" }}>
                <Link to={youtubeLink} target="_blank">
                  {" "}
                  <img
                    alt=""
                    src={yt}
                    width="40px"
                    height="40px"
                    borderRadius="150px"
                  />
                </Link>
              </Box>
            ) : null}
            {whatsappLink ? (
              <Box sx={{ cursor: "pointer" }}>
                <Link to={whatsappLink} target="_blank">
                  <img alt="" src={whatsapp} width="40px" height="40px" />
                </Link>
              </Box>
            ) : null}

            {studentById?.telegramLink ? (
              <Box sx={{ cursor: "pointer" }}>
                <Link to={studentById?.telegramLink} target="_blank">
                  <img alt="" src={telegram} width="40px" height="40px" />
                </Link>
              </Box>
            ) : null}
          </Box>
        </Box>
      </Container>
    </>
  );
}
