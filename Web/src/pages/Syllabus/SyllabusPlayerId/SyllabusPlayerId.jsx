import React, { useMemo, useState, useEffect, useRef } from "react";
import Plyr from "plyr-react";
import { useLocation, useNavigate, useParams } from "react-router";
import "plyr-react/plyr.css";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useSettingsContext } from "components/settings";
import {
  getContentsByTopicIdAsync,
  addRecentActivityAsync,
  addMarkAsReadAsync,
} from "redux/syllabus/syllabus.async";
import { toast } from "react-hot-toast";
import { toastoptions } from "../../../utils/toastoptions";
import _ from "lodash";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { addBookmarkAsync } from "redux/bookmark/bookmark.async";
import ShareWith from "../../../components/shareWith/ShareWith";
import correctIcon from "../../../assets/images/correct.png";
import "./styles.css";

const SyllabusPlayerId = () => {
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  const [contentByTopicInfo, setContentByTopicInfo] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [selectedItemPlay, setSelectedItemPlay] = useState({});
  const [openShareDialog, setShareOpenDialog] = useState(false);
  const { contentByTopic } = useSelector((state) => state.syllabusAsy);
  const [currentTime, setCurrentTime] = useState();
  const [currentId, setCurrentId] = useState(null);

  const filteredContentByTopic = contentByTopic?.filter(
    (item) => item?.tag == "Learning Content"
  );

  const filteredContentByTopicInfo = contentByTopicInfo?.filter(
    (item) => item?.tag == "Learning Content"
  );

  const handleResourse = (id, condition) => {
    const updateOpen = _.map(filteredContentByTopicInfo, (ev) => {
      if (ev.id === id)
        return {
          ...ev,
          resourseOpen: condition,
        };
      else return ev;
    });
    setContentByTopicInfo(updateOpen);
  };

  const handleTimeUpdate = () => {
    const currentTime = playerRef.current.plyr.currentTime;

    setCurrentTime(currentTime);
    dispatch(
      addRecentActivityAsync({
        videoId: selectedItem?.id,
        subjectId: selectedItem?.subjectId,
        topicId: id,
        time: Math.floor(currentTime),
        status: "ongoing",
      })
    );
  };

  const renderVideo = useMemo(
    () => (
      <div
        style={{
          width: "100%",
          height: "70vh !important",
          position: "relative !imporatnt",
          top: "20% !important",
        }}
        onClick={handleTimeUpdate}
      >
        <Plyr
          options={{
            controls: [
              "play-large",
              "play",
              "rewind",
              "fast-forward",
              "progress",
              "current-time",
              "mute",
              "volume",
              "captions",
              "settings",
              // "pip",
              "fullscreen",
            ],
            autoplay: true, // make auto play
          }}
          ref={playerRef}
          source={selectedItemPlay}
        />
      </div>
    ),
    [selectedItemPlay]
  );

  let youtubeArray =
    selectedItem?.originalSource?.includes("/shorts/") &&
    selectedItem?.originalSource?.split("/");

  let idsString =
    youtubeArray?.length > 0
      ? youtubeArray[youtubeArray?.length - 1]
      : selectedItem?.originalSource;

  let youtubeIds = idsString?.includes("?")
    ? idsString?.split("?")[0]
    : selectedItem?.originalSource;

  useEffect(() => {
    if (selectedItem) {
      const payload = {
        type: "video",
        sources: [],
      };
      if (selectedItem?.source === "youtube") {
        payload?.sources?.push({
          src: selectedItem?.originalSource,
          // src: currentId !== null && currentId,
          // src: youtubeIds,
          provider: selectedItem?.source,
        });
      } else {
        payload?.sources?.push({
          src: selectedItem?.originalSource,
        });
      }
      setSelectedItemPlay(payload);
    }
  }, [selectedItem]);

  useEffect(() => {
    dispatch(
      getContentsByTopicIdAsync({
        topicId: id,
      })
    );
  }, []);

  useEffect(() => {
    if (filteredContentByTopic?.length > 0) {
      const mapInfo = _.map(filteredContentByTopic, (ev) => {
        return {
          ...ev,
          resourseOpen: false,
        };
      });

      setContentByTopicInfo(mapInfo);
      setSelectedItem(mapInfo[0]);
    }
  }, [contentByTopic]);

  const bookmarkupdate = (In) => {
    dispatch(
      addBookmarkAsync({
        subjectId: In?.subjectId,
        typeId: In?.id,
        bookmarkType: "video",
        bookmark: !In.bookmark ? 1 : 0,
      })
    );
    const update = _.map(filteredContentByTopicInfo, (ev) => {
      if (In.id === ev.id) {
        return {
          ...ev,
          bookmark: !In.bookmark,
        };
      }
      return ev;
    });
    setContentByTopicInfo(update);
  };

  const handleNavBackPage = () => {
    navigate(-1);
  };

  const showEndingVideo = () => {
    let totalDuration = Math.floor(playerRef?.current?.plyr?.duration);
    let currentTime = Math.floor(playerRef?.current?.plyr?.currentTime);
    const remainingTime = totalDuration - currentTime;

    if (playerRef?.current?.plyr?.duration !== 0 && remainingTime <= 1) {
      playerRef?.current?.plyr?.restart();
      setTimeout(() => {
        playerRef?.current?.plyr?.pause();
      }, 500);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      showEndingVideo();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [showEndingVideo]);

  const readHandler = (val) => {
    const payload = {
      videoId: selectedItem?.id,
    };
    if (!val) {
      dispatch(addMarkAsReadAsync(payload))?.then((res) => {
        if (res?.payload?.status == 200) {
          toast.success(res.payload?.message, toastoptions);
          dispatch(
            getContentsByTopicIdAsync({
              topicId: id,
            })
          );
        }
      });
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "left" }}>
        <Button
          type="button"
          sx={{ backgroundColor: "primary.lighter" }}
          onClick={handleNavBackPage}
        >
          <KeyboardBackspaceIcon sx={{ color: "primary.main" }} />
        </Button>
      </Box>
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Grid container spacing={3}>
          <Grid item md={7}>
            <Box sx={{ borderRadius: "15px", mt: 3 }}>
              {renderVideo}
              <Box sx={{ mx: "7px", mt: "10px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "16px", color: "primary.main" }}>
                    {selectedItem?.subject}
                  </Typography>
                  <Box>
                    <ShareOutlinedIcon
                      fontSize="medium"
                      sx={{
                        mr: "8px",
                        cursor: "pointer",
                        color: "primary.main",
                      }}
                      onClick={() => setShareOpenDialog(true)}
                    />
                    {Boolean(
                      _.find(
                        filteredContentByTopicInfo,
                        (ev) => ev.id === selectedItem.id
                      )?.bookmark
                    ) ? (
                      <BookmarkIcon
                        fontSize="medium"
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            background: "#c8facd",
                            p: "5px",
                            borderRadius: "50px",
                            color: "primary.main",
                          },
                        }}
                        onClick={() =>
                          bookmarkupdate(
                            _.find(
                              filteredContentByTopicInfo,
                              (ev) => ev.id === selectedItem?.id
                            )
                          )
                        }
                      />
                    ) : (
                      <TurnedInNotIcon
                        fontSize="medium"
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            background: "#c8facd",
                            p: "5px",
                            borderRadius: "50px",
                          },
                        }}
                        onClick={() =>
                          bookmarkupdate(
                            _.find(
                              filteredContentByTopicInfo,
                              (ev) => ev.id === selectedItem?.id
                            )
                          )
                        }
                      />
                    )}
                  </Box>
                </Box>

                <Typography variant="h4" mb={1}>
                  {selectedItem?.topic}
                </Typography>

                <Box sx={{ display: "flex" }}>
                  {/* <Box
                      sx={{ display: "flex", alignItems: "center", mr: "10px" }}
                    >
                      <AccessTimeIcon
                        color="#787A8D"
                        fontSize="15px"
                        sx={{ mr: "3px", color: "#787A8D" }}
                      />
                      <Typography color="#787A8D" fontSize="15px">
                        {duration} Minutes
                      </Typography>
                    </Box> */}

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <YouTubeIcon
                      fontSize="15px"
                      sx={{ mr: "3px", color: "#787A8D" }}
                    />
                    <Typography color="#787A8D" fontSize="15px">
                      {filteredContentByTopicInfo?.length} Videos
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                position: "sticky",
                top: "0px",
                backgroundColor: "white",
                height: "60px",
                pt: 1.5,
              }}
            >
              <Typography variant="h5">Related Topics</Typography>
            </Box>
            <Box sx={{ overflowX: "hidden" }}>
              {filteredContentByTopicInfo?.length > 0 &&
                filteredContentByTopicInfo?.map((item, index) => (
                  <PlaybackVideoCustom
                    key={index}
                    item={item}
                    handleResourse={handleResourse}
                    setSelectedItem={setSelectedItem}
                    selectedItem={selectedItem}
                    readHandler={readHandler}
                  />
                ))}
            </Box>
          </Grid>
        </Grid>
        <ShareWith
          {...{
            setShareOpenDialog,
            openShareDialog,
          }}
        />
      </Container>
    </>
  );
};

export default SyllabusPlayerId;

function PlaybackVideoCustom({
  item,
  selectedItem,
  handleResourse,
  setSelectedItem,
  readHandler,
}) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          p: 2,
          bgcolor: Boolean(selectedItem?.id === item?.id) && "primary.lighter",
          borderRadius: "10px",
        }}
      >
        <Box display="flex">
          <LazyLoadImage
            alt={item.topic}
            effect="blur"
            src={item.thumbnailFile}
            width="90px"
            height="90px"
            style={{ borderRadius: "10%", objectFit: "cover" }}
          />

          <Box ml={2} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h6" display="flex" alignItems="center">
              {_.truncate(item.topic, { length: 30 })}
              {item.bookmark && (
                <BookmarkIcon
                  fontSize="medium"
                  sx={{
                    ml: 1,
                    cursor: "pointer",
                  }}
                />
              )}
            </Typography>
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          flexDirection="column"
          alignItems="center"
          ml={{ xs: 1, md: 1 }}
        >
          <PlayCircleRoundedIcon
            fontSize="large"
            sx={{
              cursor: "pointer",
              "&:hover": {
                background: "#00ab55",
                p: "5px",
                borderRadius: "50px",
              },
            }}
            onClick={() => setSelectedItem(item)}
          />

          <Box sx={{ minWidth: "120px" }}>
            <Button
              sx={{ fontSize: "12px", mt: 1 }}
              onClick={() => readHandler(selectedItem?.markAsRead)}
              disabled={selectedItem?.markAsRead}
            >
              <img
                src={correctIcon}
                alt="correct icon"
                width="30px"
                height="30px"
                style={{ marginRight: "5px" }}
              />
              {selectedItem?.markAsRead ? "Completed" : "Mark Read"}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
