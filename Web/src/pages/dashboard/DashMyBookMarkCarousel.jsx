import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CustomComponentLoader from "../../components/CustomComponentLoader/CustomComponentLoader";

function DashMyBookMarkCarousel(props) {
  const { countBookmarkbyidLoader, CarouselDataSize, countBookmarkbyid } =
    props;
  const { getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { bookmarkQuestionImage, bookmarkVideoImage } = getOnlySiteSettingData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const locateToTab = (tabData) => {
    if (tabData == "questionTab") {
      navigate("/app/myBookmarks?tab=question-tab");
    }
    if (tabData == "videoTab") {
      navigate("/app/myBookmarks?tab=video-tab");
    }
  };

  return (
    <>
      {countBookmarkbyidLoader ? (
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
          <Box
            sx={{
              width: "260px",
              height: "auto",
              pb: 2,
              backgroundColor: "rgba(0, 171, 85, 0.08)",
              borderRadius: "10px",
              mt: 2,
              cursor: "pointer",
            }}
            onClick={() => locateToTab("videoTab")}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "40px",
                width: "100%",
                borderRadius: "10px 10px 0px 0px",
                background: "linear-gradient(to right, #098A4E, #9ADD00)",
              }}
            >
              <Typography
                sx={{ color: "#fff", fontSize: "19px", fontWeight: "600" }}
              >
                Bookmarks
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
                mt: 2,
                mb:1,
              }}
            >
              <Box>
                <Typography sx={{ textAlign: "center" }}>
                  <Typography sx={{ color: "#00AB55", fontWeight: "600" }}>
                    {countBookmarkbyid.videoCount}
                  </Typography>
                  <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                    Videos
                  </Typography>
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ textAlign: "center" }}>
                  <Typography sx={{ color: "#00AB55", fontWeight: "600" }}>
                    {countBookmarkbyid.questionCount}
                  </Typography>
                  <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                    Questions
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Box>

          {/*CarouselDataSize > 0 ?
              <Box sx={{ p: 1, mt: 2, display: "flex" }}>
                <Box sx={{ display: 'block' }}>
                  <Card
                    sx={{
                      height: 200,
                      overflow: "hidden",
                      cursor: "pointer",
                      display: 'block',
                      [theme.breakpoints.down('sm')]: {
                        height: 150
                      },
                    }}
                    // onClick={() => navigate(PATH_DASHBOARD.myBookmarks)}
                    onClick={() => locateToTab('videoTab')}

                  >
                    <img src={bookmarkVideoImage} height='100%' width="220px" />
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
                        [theme.breakpoints.down('sm')]: {
                          height: 150
                        },
                      }}
                    >
                    </Box>
                  </Card>
                  <Box sx={{ display:"flex"}}>
                  <Typography gutterBottom variant="p" component="div" sx={{ color: 'primary.main', ml:1 }}>
                    {"Videos"}
                  </Typography>
                  <Typography gutterBottom variant="p" component="div" sx={{ color: 'primary.main', ml:1 }}>
                    {countBookmarkbyid.videoCount}
                  </Typography>
                  </Box>
                </Box>
                <Box sx={{display:'block', ml: 3}}>
                <Card
                  sx={{
                    height: 200,
                    overflow: "hidden",
                    cursor: "pointer",
                    [theme.breakpoints.down('sm')]: {
                      height: 150
                    },
                  }}
                  // onClick={() => navigate(PATH_DASHBOARD.myBookmarks)}
                  onClick={() => locateToTab('questionTab')}

                >
                  <img src={bookmarkQuestionImage} height='100%' width="220px" />
                </Card>
                  <Box sx={{ display:"flex"}}>
                  <Typography gutterBottom variant="p" component="div" sx={{ color: 'primary.main', ml:1  }}>
                  {"Question"}
                  </Typography>
                  <Typography gutterBottom variant="p" component="div" sx={{ color: 'primary.main', ml:1 }}>
                  {countBookmarkbyid.questionCount}
                  </Typography>
                  </Box>
                </Box>
                </Box> : <Box sx={{ width: '100%', textAlign: 'center', marginTop: '80px' }}><Typography variant="h5">Shorts Not Found</Typography></Box> */}
        </>
      )}
    </>
  );
}

export default DashMyBookMarkCarousel;
