import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { useSettingsContext } from "../../../components/settings";
import CustomComponentLoader from "../../../components/CustomComponentLoader/CustomComponentLoader";
import {
  getNewShortsByStudentIdAsync,
  getShortsByStudentIdAsync,
  getSubjectsByStudentAsync,
} from "../../../redux/async.api";
import DashboardShortsCarousel from "../DashboardShortsCarousel";
import VideoList from "./components/VidoeList";

const ShortsPage = () => {
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { boardId, classId, courseId, batchTypeId, id } = useSelector(
    (state) => state?.student?.studentById
  );

  const {
    newVideos,
    newVideosLoader,
    ShortsBystudentId,
    ShortsBystudentIdLoader,
  } = useSelector((state) => state?.shorts);
  const { subjectBy: subjectByStudentId } = useSelector(
    (state) => state?.subject
  );
  const { getOnlySiteSettingLoader, getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { siteLogo, siteAuthorName, siteTitle } = getOnlySiteSettingData;

  useEffect(() => {
    if (batchTypeId) {
      dispatch(
        getSubjectsByStudentAsync({
          courseId: courseId,
          boardId: boardId,
          classId: classId,
          batchTypeId: batchTypeId,
        })
      );
    }
    // for new videos.......
    if (id) {
      dispatch(
        getNewShortsByStudentIdAsync({
          type: "new",
          studentId: id,
        })
      );
    }
  }, [batchTypeId, id]);

  useEffect(() => {
    dispatch(
      getShortsByStudentIdAsync({
        studentId: id,
        subjectId: subjectByStudentId[0]?.id,
      })
    );
  }, []);

  const getSubjectShorts = (subjectId) => {
    dispatch(
      getShortsByStudentIdAsync({
        studentId: id,
        subjectId: subjectId,
      })
    );
  };

  function getTabsData(subId) {
    getSubjectShorts(subId);
  }

  const handleNavFavoriteShorts = () => {
    navigate(PATH_DASHBOARD.favoriteShorts);
  };

  return (
    <>
      <Helmet>
        <title>Shorts | {`${siteTitle}`}</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : "xl"}>
        {/* <Box sx={{ display: 'flex', alignItems: 'left' }}>
          <KeyboardBackspaceIcon sx={{ color: 'primary.main' }} onClick={() => navigate(-1)}/>
        </Box> */}
        <Box>
          <Box sx={{ display: "flex", justifyContent: "right", mt: 0 }}>
            {/* <Box><Typography variant="h4">Shorts</Typography></Box> */}
            {/*<Box>
              <FavoriteBorderIcon
                sx={{
                  fontSize: "30px",
                  color: "primary.main",
                  cursor: "pointer",
                }}
                onClick={handleNavFavoriteShorts}
              />
              </Box> */}
          </Box>
          {newVideos?.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h4">New Videos</Typography>
              {newVideosLoader ? (
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
              ) : (
                <DashboardShortsCarousel
                  shortsCarouselData={newVideos}
                  newVideosLoader={newVideosLoader}
                />
              )}
            </Box>
          ) : null}
        </Box>
        <VideoList
          getTabsData={getTabsData}
          allShorts={ShortsBystudentId.data}
          tabs={subjectByStudentId}
        />
      </Container>
    </>
  );
};
export default ShortsPage;
