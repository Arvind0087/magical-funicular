import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Avatar } from "@mui/material";
import {
  Box,
  Card,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { isArray } from "lodash";
import Image7 from "assets/images/design7.png";
import ClockImage from "assets/images/ClockImage.svg";
import VideoIconImage from "assets/images/VideoIconImage.svg";
import NoteIconImage from "assets/images/NoteIconImage.svg";
import {
  getSubjectsByStudentAsync,
  getcountBookmarkAsync,
  getAllOnlyForYouAsync,
  getAllBannerByTypeAsync,
} from "redux/async.api";
import { useSettingsContext } from "components/settings";
import DashboardShortsCarousel from "./DashboardShortsCarousel";
import OnlyForYouCarousel from "./OnlyForYouCarousel";
import DashMyBookMarkCarousel from "./DashMyBookMarkCarousel";
import DashboardSpeak from "./DashboardSpeak.jsx";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./Dashboard.css";
import CustomComponentLoaderBox from "components/CustomComponentLoaderBox/CustomComponentLoaderBox";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  const {
    bannerLoader,
    banners,
    AllOnlyForYouLoader,
    AllOnlyForYou = [],
  } = useSelector((state) => state?.dashboard);
  const { subjectLoader, subjectBy } = useSelector((state) => state?.subject);
  const { studentById = [] } = useSelector((state) => state?.student);
  const { id } = studentById;
  const { getOnlySiteSettingLoader, getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { siteLogo, siteAuthorName, favicon, siteTitle } =
    getOnlySiteSettingData;
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

  useMemo(() => {
    // GET SUBJECTS
    if (studentById?.courseId) {
      dispatch(
        getSubjectsByStudentAsync({
          courseId: studentById?.courseId,
          boardId: studentById?.boardId,
          classId: studentById?.classId,
          batchTypeId: studentById?.batchTypeId,
        })
      );
    }
  }, [studentById]);

  useEffect(() => {
    dispatch(getAllBannerByTypeAsync({ type: "Home" }));
    dispatch(getcountBookmarkAsync());
    dispatch(getAllOnlyForYouAsync({ type: "web" }));
  }, []);
  //NOTE: handle nav syllabus
  const handleNavSyllabus = () => {
    navigate("/app/syllabus");
  };
  return (
    <>
      <Helmet>
        <title>Dashboard | {`${siteTitle}`}</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={6} md={7} lg={7}>
            {bannerLoader ? (
              <CustomComponentLoaderBox padding="0" size={50} />
            ) : (
              <Slider {...settings} className="deshboard-slider">
                {isArray(banners) &&
                  banners
                    ?.slice(0, 5)
                    ?.map((item, index) => (
                      <LazyLoadImage
                        key={index}
                        src={item.image}
                        effect="blur"
                        width="100%"
                        height="350px"
                        className="lazyloadbanner"
                      />
                    ))}
              </Slider>
            )}
          </Grid>

          <Grid item xs={12} sm={6} md={5} lg={5}>
            <Box
              sx={{
                mt: { xs: "35px", sm: "0px", md: "0px", lg: "0px" },
              }}
            >
              <Typography variant="h4">Recent Activities</Typography>
              <Typography>Track your recently studied topics</Typography>
            </Box>
            <Card
              sx={{
                m: 1,
                p: 2,
                maxHeight: 323,
                maxWidth: 460,
                overflow: "hidden",
                cursor: "pointer",
                background: "#FFFFFF",
                borderRadius: "16px",
                border: "1px solid",
                color: "#efeff5",
              }}
            >
              <Grid container>
                <Grid item xs={7}>
                  <Box>
                    <img
                      src={ClockImage}
                      height={46}
                      width={46}
                      style={{
                        color: "primary.main",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{ color: "#232735", typography: "subtitle2", mt: 1 }}
                  >
                    Weekly Time Spent
                  </Box>
                  <Box
                    sx={{
                      color: "primary.main",
                      fontWeight: 600,
                      marginBottom: "11px",
                      fontSize: "18px",
                    }}
                  >
                    15 sec
                  </Box>
                  <Box>
                    <Button
                      fullWidth
                      sx={{
                        color: "primary.main",
                        borderRadius: "20px",
                        width: "120px",
                        background: "#FFE0CC",
                        bgcolor: "primary.lighter",
                      }}
                    >
                      View All &nbsp;
                      <ArrowForwardIosIcon sx={{ fontSize: "15px" }} />
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={5} sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <img src={VideoIconImage} height={46} width={46} />
                    </Box>
                    <Box
                      sx={{ fontWeight: 600, fontSize: "22px", color: "black" }}
                    >
                      2
                    </Box>
                    <Box
                      sx={{
                        fontWeight: 600,
                        fontSize: "18px",
                        color: "black",
                        display: "flex",
                      }}
                    >
                      Learn
                      <ArrowForwardIosIcon
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: " #DC5F19",
                          marginLeft: "2px",
                          color: "primary.main",
                          ml: 1,
                        }}
                      />
                    </Box>
                  </Box>
                  <Divider sx={{ border: "1px solid #E2E2E2", mt: 2 }} />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Box>
                      <img src={NoteIconImage} height={46} width={46} />
                    </Box>
                    <Box
                      sx={{ fontWeight: 600, fontSize: "22px", color: "black" }}
                    >
                      0
                    </Box>
                    <Box
                      sx={{
                        fontWeight: 600,
                        fontSize: "18px",
                        color: "black",
                        // ml: 4
                      }}
                    >
                      Test
                      <ArrowForwardIosIcon
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: " #DC5F19",
                          marginLeft: "2px",
                          color: "primary.main",
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 7 }}>
          <Typography variant="h4">Start Learning</Typography>
          <Typography>Track your recently studied topics</Typography>
        </Box>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {subjectBy &&
            subjectBy?.map((item, index) => {
              return (
                <Grid
                  item
                  sx={{ mr: 4 }}
                  key={index}
                  onClick={handleNavSyllabus}
                >
                  <Box sx={{ textAlign: "center", cursor: "pointer" }}>
                    <Avatar
                      sx={{
                        borderRadius: "50%",
                        width: "80px",
                        height: "80px",
                        display: "grid",
                        placeItems: "center",
                        margin: "auto",
                      }}
                    >
                      <img src={item.image} alt={item.name} />
                    </Avatar>
                    <Box
                      sx={{
                        width: "80px",
                        height: "16px",
                        borderRadius: " 26px",
                        mt: 1,
                        marginX: "auto",
                        bgcolor: "primary.lighter",
                        color: "#212B36",
                      }}
                    >
                      <Typography sx={{ fontSize: "11px", fontWeight: "600" }}>
                        Chapters - {item.chaptersCount}
                      </Typography>
                    </Box>
                    <Typography sx={{ mt: 1 }}>{item.name}</Typography>
                  </Box>
                </Grid>
              );
            })}
        </Grid>
        <Box sx={{ mt: 7 }}>
          <Typography variant="h4">Veda Shorts</Typography>
          <DashboardShortsCarousel userId={studentById?.id} />
        </Box>
        <Box sx={{ mt: 7 }}>
          <Typography variant="h4">Only For You</Typography>
          <OnlyForYouCarousel
            AllOnlyForYouLoader={AllOnlyForYouLoader}
            AllOnlyForYou={AllOnlyForYou}
          />
        </Box>
        <Box sx={{ mt: 7 }}>
          <Typography variant="h4">My Bookmarks</Typography>
          <DashMyBookMarkCarousel id={id} />
        </Box>
        <Box sx={{ mt: 7 }}>
          <Typography variant="h4">My Downloads</Typography>
          <Box sx={{ p: 1, mt: 2 }}>
            <Card
              sx={{
                height: 200,
                width: 257,
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <img src={Image7} height={200} width="100%" />
              <Box
                sx={{
                  display: "flex",
                  color: "#fff",
                  flexDirection: "column",
                  justifyContent: "end",
                  height: 200,
                  position: "absolute",
                  top: "0",

                  p: 2,
                }}
              >
                <Box>
                  <Typography>Downloaded Videos</Typography>
                  <Typography>70</Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>
        <DashboardSpeak />
      </Container>
    </>
  );
}
