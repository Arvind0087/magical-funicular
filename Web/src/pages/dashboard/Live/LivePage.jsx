import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useSelector } from "react-redux";
import { CustomAvatar } from "components/custom-avatar";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router";
import { useSettingsContext } from "../../../components/settings";
import MyEvent from "./components/MyEvent";
import BookEvent from "./components/BookEvent";
import { coursePackagesByStudentAsync } from "redux/syllabus/syllabus.async";
import { useDispatch } from "react-redux";

const EventPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { themeStretch } = useSettingsContext();
  const PRIMARY_LIGHT = theme.palette.primary.light;
  const PRIMARY_MAIN = theme.palette.primary.main;
  const { studentById } = useSelector((state) => state?.student);
  const { name, avatar, liveClassAttendance } = studentById;
  const { getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { siteLogo, siteAuthorName, siteTitle } = getOnlySiteSettingData;
  const [currentTab, setCurrentTab] = useState("My Event");
  const [course, setCourse] = useState("");
  const { getCoursePackageLoader, getCoursePackage } = useSelector(
    (state) => state?.syllabusAsy
  );

  const handleChange = (event) => {
    setCourse(event.target.value);
  };

  useEffect(() => {
    const payload = {
      batchTypeId: studentById?.batchTypeId,
      type: "livePage",
    };
    if (studentById.course_type !== "Subscription") {
      dispatch(coursePackagesByStudentAsync(payload));
    }
  }, []);

  const TABS = [
    {
      value: "My Event",
      label: "My Event",
      component: <MyEvent packageId={course} />,
    },
    {
      value: "Book An Event",
      label: "Book An Event",
      component: <BookEvent studentById={studentById} />,
    },
  ];

  const NEW_TABS = [
    {
      value: "My Event",
      label: "My Event",
      component: <MyEvent packageId={course} />,
    },
  ];

  const handleNavBackPage = () => {
    navigate(-1);
  };

  const TABS_DATA = studentById?.courseId == 7 ? NEW_TABS : TABS;

  const filteredGetCoursePackage = getCoursePackage?.filter(
    (pac) => pac?.package_type == "Live" && pac?.isPurchased == true
  );

  console.log(
    "getCoursePackage....",
    getCoursePackage,
    filteredGetCoursePackage
  );

  return (
    <>
      <Helmet>
        <title>Live | {`${siteTitle}`}</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : "xl"}>
        {/*<Box sx={{ display: "flex", alignItems: "left" }}>
          <KeyboardBackspaceIcon
            sx={{ color: "primary.main" }}
            onClick={handleNavBackPage}
          />
        </Box> */}
        {getCoursePackage?.length > 0 && (
          <Box>
            <FormControl sx={{ m: 1, minWidth: 280 }}>
              <InputLabel id="demo-simple-select-helper-label">
                Select Course
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={course}
                label="Select Course"
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Select Course</em>
                </MenuItem>
                {getCoursePackage?.map((pack) => (
                  <MenuItem value={pack?.packageId}>
                    {pack?.package_title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
          >
            {TABS_DATA &&
              TABS_DATA?.map((tab) => (
                <Tab
                  sx={{
                    bgcolor:
                      Boolean(currentTab === tab.value) && "primary.lighter",
                    px: 5,
                    margin: "0 !important",
                  }}
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                />
              ))}
          </Tabs>
        </Box>
        {TABS_DATA &&
          TABS_DATA?.map(
            (tab) =>
              tab.value === currentTab && (
                <Box key={tab.value} sx={{ mt: 5 }}>
                  {tab.component}
                </Box>
              )
          )}
      </Container>
    </>
  );
};

export default EventPage;
