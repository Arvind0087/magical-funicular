import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { useNavigate } from "react-router";
// Changeble---------
import BookmarkIcon from '@mui/icons-material/Bookmark';
// Changeble---------
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { addBookmarkAsync } from "redux/bookmark/bookmark.async";
import { LazyLoadImage } from "react-lazy-load-image-component";
import _ from "lodash";
import SubjectCustomTabs from "components/SubjectBlockCustom/subjectCustomTabs";
import { getAllbookmarkedQueAsync } from "../../../../redux/async.api";
import CustomComponentLoader from "../../../../components/CustomComponentLoader";
import NoVideo from '../../../../assets/images/NoVideos.svg';

const VideosPage = (props) => {
  const { tabs, id } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dataInfo, setdataInfo] = useState([]);
  const allVideos = useSelector(state => state?.bookmarked?.bookmarkedQuestions?.data)
  const bookmarkedLoader = useSelector(state => state.bookmarked.bookmarkedQuestionsLoader)
  const [currentTab, setCurrentTab] = useState();

  useEffect(() => {
    tabs?.map((item) => {
      if (item?.isAllSubject) {
        setCurrentTab(item?.id)
        dispatch(
          getAllbookmarkedQueAsync({
            bookmarkType: "video",
            userId: id,
            subjectId: item?.id
          })
        );
      }
    })
  }, [])

  const handleEvent = (tabNum) => {
    setCurrentTab(tabNum)
    dispatch(getAllbookmarkedQueAsync({
      bookmarkType: 'video',
      userId: id,
      subjectId: tabNum
    }))
  };

  const bookmarkupdate = (In) => {
    dispatch(
      addBookmarkAsync({
        subjectId: In.subjectId,
        typeId: In.videoId,
        bookmarkType: "video",
        bookmark: !In.bookmark ? 1 : 0,
      })).then((res) => {
        const { payload } = res || {};
        const { status, data } = payload || {};
        if (status === 200) {
          dispatch(getAllbookmarkedQueAsync({
            bookmarkType: 'video',
            userId: id,
            subjectId: currentTab
          }))
        }
      })

    const update = _.map(dataInfo, (ev) => {
      if (In.id === ev.id) {
        return {
          ...ev,
          bookmark: !In.bookmark,
        };
      }
      return ev;
    });
    setdataInfo(update);
  };
  const hanldeNavVideo = (topicId) =>{
    navigate(`/app/syllabus/${topicId}`)
  }
  return (
    <>
      <Box sx={{ mt: 7 }}>
        <SubjectCustomTabs handleEvent={handleEvent} subjectInfo={tabs} currentTab={currentTab} />
      </Box>

      {
        bookmarkedLoader ?
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', color: 'primary.main', mt: 10 }}>
            <CustomComponentLoader padding="0" size={50} />
          </Box>
          :
          <Grid container spacing={3}>
            {allVideos?.length > 0 ?
              <>
                {allVideos?.map((item, In) => (
                  <Grid item key={item.id} xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        height: 140,
                        mt: 7,
                        display: "flex",
                        p: 2,
                        justifyContent: "space-between",
                        border: "2px solid rgb(234, 234, 234)",
                        borderRadius: "6px"
                      }}
                    >
                      <Card sx={{ width: "70%", height: "100%", borderRadius: "16px", alignItems: "center", }}
                        onClick={() =>
                          hanldeNavVideo(item?.topicId)
                        }
                      >
                        <LazyLoadImage
                          alt={item?.subject}
                          effect="blur"
                          src={item?.thumbnail}
                          width="100%"
                          height="100%"
                          borderRadius="16px"
                          objectFit="cover"
                        />
                      </Card>
                      <Box
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          width: "100%",
                          ml: 2
                        }}
                      >
                        <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
                          {_.truncate(item?.name, { length: 30 })}
                        </Typography>
                        <Typography sx={{ fontSize: "15px" }}>
                          {item?.chapter}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "15px",
                            color: "primary.main",
                            fontWeight: "600"
                          }}
                        >
                          {item?.subject}
                        </Typography>
                      </Box>
                      <Box >
                        {item?.bookmark ? (
                          <BookmarkIcon
                            fontSize="medium"
                            sx={{
                              color: 'primary.main',
                              cursor: "pointer",
                              "&:hover": {
                                background: "primary.lighter",
                                p: "5px",
                                borderRadius: "50px",
                              },
                            }}
                            onClick={() => bookmarkupdate(item)
                            }
                          />
                        ) : (
                          <BookmarkBorderIcon
                            color="white"
                            sx={{
                              cursor: "pointer",
                              "&:hover": {
                                background: "#c8facd",
                                p: "5px",
                                borderRadius: "50px",
                              },
                            }}
                            onClick={() => bookmarkupdate(item)}
                          />
                        )}
                      </Box>
                    </Box>
                  </Grid>
                ))
                }
              </>
              :
              <>
                <Box sx={{ width: '100%', textAlign: 'center', mt: 10, display: 'flex', justifyContent: 'center' }}>
                  <img src={NoVideo} /></Box>
                <Box sx={{ width: "100%" }}>
                  <Typography variant='h6' sx={{ textAlign: 'center' }}>Your Bookmark is empty</Typography>
                </Box>
              </>
            }
          </Grid>
      }
    </>

  )
}
export default VideosPage;