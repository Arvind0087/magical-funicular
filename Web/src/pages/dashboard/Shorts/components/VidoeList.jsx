import React, { useEffect, useRef, useState } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { useDispatch } from "react-redux";
import { setUrl } from "../../../../redux/slices/shorts.slice";
import CustomComponentLoader from "../../../../components/CustomComponentLoader/CustomComponentLoader";
import SubjectCustomTabs from "components/SubjectBlockCustom/subjectCustomTabs";
import {
  getAllLikeShortsByStudentIdAsync,
  getShortsByStudentIdAsync,
} from "redux/async.api";
import NoVideo from "../../../../assets/images/NoVideos.svg";

const VideoList = ({ allShorts, tabs }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { boardId, classId, courseId, batchTypeId, id } = useSelector(
    (state) => state?.student?.studentById
  );
  let {
    ShortsBystudentIdLoader,
    shortsByStudentSubjectIdLoader,
    likedShortsByStudentIdLoader,
    likedShortsBySubjectIdLoader,
  } = useSelector((state) => state.shorts);
  // state
  const [currentTab, setCurrentTab] = useState(tabs[0]?.id ? tabs[0]?.id : "");
  //  function
  const openVideo = (videoId, videoUrl, video, sourceId) => {
    navigate(`${PATH_DASHBOARD.videoPlayer(videoId)}?type=shorts`, {
      state: {
        videoUrl,
        video,
        sourceId,
      },
    });
    dispatch(setUrl(videoId));
  };

  useEffect(() => {
    tabs?.map((item) => {
      if (item?.isAllSubject) {
        setCurrentTab(item?.id);
        dispatch(
          getShortsByStudentIdAsync({
            studentId: id,
            subjectId: item?.id,
          })
        );
        dispatch(
          getAllLikeShortsByStudentIdAsync({
            studentId: id,
            subjectId: item?.id,
          })
        );
      }
    });
  }, []);

  const handleEvent = (tabNum) => {
    setCurrentTab(tabNum);
    dispatch(
      getShortsByStudentIdAsync({
        studentId: id,
        subjectId: tabNum,
      })
    );
    dispatch(
      getAllLikeShortsByStudentIdAsync({
        studentId: id,
        subjectId: tabNum,
      })
    );
  };

  return (
    <>
      <Box sx={{ mt: 4 }}>
        <Typography sx={{ mb: 4 }} variant="h4">
          Veda Shorts
        </Typography>
        <SubjectCustomTabs
          handleEvent={handleEvent}
          subjectInfo={tabs}
          currentTab={currentTab}
        />
      </Box>
      {allShorts?.length > 0 ? (
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {ShortsBystudentIdLoader ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "100px",
                  color: "primary.main",
                }}
              >
                <CustomComponentLoader padding="0" size={50} />
              </Box>
            </>
          ) : (
            <>
              {allShorts?.length > 0 ? (
                allShorts.map((item) => {
                  return (
                    <Grid item xs={12} sm={4} md={3} key={item.id}>
                      <Card
                        sx={{
                          height: 370,
                          overflow: "hidden",
                          width: allShorts?.length === 1 ? "100%" : "100%",
                        }}
                        onClick={() =>
                          openVideo(
                            item.id,
                            item.video,
                            allShorts,
                            item?.original_resolution
                          )
                        }
                      >
                        <video
                          src={item.video}
                          height={370}
                          width="100%"
                          style={{ objectFit: "cover" }}
                          poster={item.thumbnail}
                        />
                      </Card>
                      <Box
                        sx={{
                          bottom: "130px",
                          zIndex: "40",
                          textAlign: "left",
                          mt: 2,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "17px",
                            color: "black",
                            fontWeight: "700",
                            zIndex: "7777",
                          }}
                        >
                          {item.title}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })
              ) : (
                <Box
                  sx={{ width: "100%", textAlign: "center", marginTop: "80px" }}
                >
                  <Typography variant="h5">No shorts Found</Typography>
                </Box>
              )}
            </>
          )}
        </Grid>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
            }}
          >
            <img src={NoVideo} alt="" width="250px" />
            <Typography sx={{ fontWeight: 600, mt: 1 }}>
              No Shorts found!
            </Typography>
          </Box>
        </>
      )}
    </>
  );
};
export default VideoList;
