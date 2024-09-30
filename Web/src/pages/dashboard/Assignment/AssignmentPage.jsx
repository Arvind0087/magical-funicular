import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Tab, Tabs, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { useSettingsContext } from "../../../components/settings";
import CustomComponentLoader from "../../../components/CustomComponentLoader";
import {
  getAllBannerByTypeAsync,
  getSubjectsByStudentAsync,
} from "../../../redux/async.api";
import MyAssignment from "./components/MyAssignment";
import { MyTest } from "./components/MyTest";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router";

const AssignmentPage = () => {
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("Assignment");
  const [subjectInfo, setSubjectInfo] = useState([]);
  const [subjectId, setSubjectId] = useState();
  const dispatch = useDispatch();
  const { AssignmentBannerByTypeLoader, AssignmentBannerByType } = useSelector(
    (state) => state?.assignment
  );
  const { studentById } = useSelector((state) => state?.student);
  const { courseId, boardId, classId, batchTypeId } = studentById;
  const { getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { siteTitle } = getOnlySiteSettingData;
  useEffect(() => {
    // GET SUBJECTS
    if (courseId) {
      dispatch(
        getSubjectsByStudentAsync({
          courseId: courseId,
          boardId: boardId,
          classId: classId,
          batchTypeId: batchTypeId,
        })
      ).then((res) => {
        const { payload } = res || {};
        const { status, data } = payload || {};
        if (status === 200) {
          setSubjectInfo(data);
          setSubjectId(data[0]?.id);
        }
      });
    }
  }, [studentById]);

  useEffect(() => {
    dispatch(getAllBannerByTypeAsync({ type: "Assignment" }));
  }, []);

  const TABS = [
    {
      value: "Assignment",
      label: "My Assignment",
      component: <MyAssignment subjectInfo={subjectInfo} />,
    },
    {
      value: "Test",
      label: "My Tests",
      component: <MyTest studentById={studentById} />,
    },
  ];
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
  return (
    <>
      <Helmet>
        <title>Assignment | {`${siteTitle}`}</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {AssignmentBannerByTypeLoader ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  color: "primary.main",
                }}
              >
                <CustomComponentLoader padding="0" size={50} />
              </Box>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                {AssignmentBannerByType?.length > 0 ? (
                  <Slider {...settings} className="deshboard-slider">
                    {AssignmentBannerByType?.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          borderRadius: "20px",
                          overflow: "hidden",
                          maxHeight: "400px",
                        }}
                      >
                        <img width="100%" src={item.image} alt="" />
                      </Box>
                    ))}
                  </Slider>
                ) : null}
              </Grid>
            </>
          )}
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
          >
            {TABS.map((tab, index) => (
              <Tab
                sx={{
                  bgcolor:
                    Boolean(currentTab === tab.value) && "primary.lighter",
                  px: 5,
                  margin: "0 !important",
                }}
                key={index}
                label={tab.label}
                value={tab.value}
              />
            ))}
          </Tabs>

          {TABS.map(
            (tab) =>
              tab.value === currentTab && (
                <Box key={tab.value} sx={{ mt: 5 }}>
                  {tab.component}
                </Box>
              )
          )}
        </Box>
      </Container>
    </>
  );
};

export default AssignmentPage;
