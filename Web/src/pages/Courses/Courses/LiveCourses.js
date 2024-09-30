import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { userCoursePackageBypackageIdAsync } from "redux/syllabus/syllabus.async";
import Grid from "@mui/material/Grid";
import { Helmet } from "react-helmet-async";
import About from "./About";
import Schedule from "./Schedule";
import Educators from "./Educators";

function LiveCourses() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { getCoursePackageByIdLoader, getCoursePackageById } = useSelector(
    (state) => state?.syllabusAsy
  );
  const { getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { siteTitle } = getOnlySiteSettingData;
  const courseById = location?.state?.val;
  const [tab, setTab] = useState(
    courseById?.isPurchased ? "schedule" : "about"
  );

  useEffect(() => {
    const payload = {
      packageId: courseById?.packageId,
    };
    dispatch(userCoursePackageBypackageIdAsync(payload));
  }, []);

  const backHandler = () => {
    navigate(-1);
  };

  const tabHandler = (tabVal) => {
    setTab(tabVal);
  };

  return (
    <>
      <Helmet>
        <title>Live Courses | {`${siteTitle}`}</title>
        <meta
          property="og:title"
          content={getCoursePackageById?.package_title}
        />
        <meta
          property="og:image"
          content={getCoursePackageById?.package_thumbnail}
        />
        <meta
          name="twitter:title"
          content={getCoursePackageById?.package_title}
        />
        <meta
          name="twitter:image"
          content={getCoursePackageById?.package_thumbnail}
        />
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
          // background: "linear-gradient(to right, #098A4E, #9ADD00)",
          // zIndex: 12344,
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
            {tab?.charAt(0)?.toUpperCase() + tab?.slice(1)}
          </Typography>
        </Box>
      </Box>
      <Container>
        <Box sx={{ width: "90%", height: "350px", mt: 3 }}>
          <LazyLoadImage
            alt="Course list"
            effect="blur"
            src={getCoursePackageById?.package_thumbnail}
            width="100%"
            height="100%"
            objectFit="cover"
            style={{ borderRadius: "16px" }}
          />
        </Box>
        <Typography variant="h5" sx={{ mt: 2 }}>
          {getCoursePackageById?.package_title}
        </Typography>
        <Typography sx={{ fontSize: "12px", fontWeight: "600", mt: 1, mb: 2 }}>
          Start Date{" "}
          {moment(getCoursePackageById?.package_start_date).format(
            "D MMMM YYYY"
          )}
        </Typography>
        <Box sx={{ display: "flex", gap: { xs: 3, sm: 3 }, mt: 4 }}>
          <Button
            sx={{
              backgroundColor: tab == "about" ? "#1f7a1f" : "#41AA30",
              color: "#fff",
              padding: "3px 15px",
              borderRadius: "4px",
              width: "110px",
              "&:hover": { backgroundColor: "#47d147" },
            }}
            onClick={() => tabHandler("about")}
          >
            About
          </Button>
          <Button
            sx={{
              backgroundColor: tab == "schedule" ? "#1f7a1f" : "#41AA30",
              color: "#fff",
              padding: "3px 15px",
              borderRadius: "4px",
              width: "110px",
              "&:hover": { backgroundColor: "#47d147" },
            }}
            onClick={() => tabHandler("schedule")}
          >
            Schedule
          </Button>
          <Button
            sx={{
              backgroundColor: tab == "educators" ? "#1f7a1f" : "#41AA30",
              color: "#fff",
              padding: "3px 15px",
              borderRadius: "4px",
              width: "110px",
              "&:hover": { backgroundColor: "#47d147" },
            }}
            onClick={() => tabHandler("educators")}
          >
            Educators
          </Button>
        </Box>
        {tab == "about" && (
          <About getCoursePackageById={getCoursePackageById} />
        )}
        {tab == "schedule" && <Schedule />}
        {tab == "educators" && (
          <Educators packageId={getCoursePackageById?.id} />
        )}
      </Container>
    </>
  );
}

export default LiveCourses;
