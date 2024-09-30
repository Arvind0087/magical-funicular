import React, { useMemo, useState, useEffect, useRef } from "react";
import Plyr from "plyr-react";
import { useLocation, useNavigate, useParams } from "react-router";
import "plyr-react/plyr.css";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import socketio from "socket.io-client";
import YouTubeIcon from "@mui/icons-material/YouTube";
import moment from "moment";
import { Helmet } from "react-helmet-async";
import { useSettingsContext } from "components/settings";
import {
  getContentsByTopicIdAsync,
  addRecentActivityAsync,
} from "redux/syllabus/syllabus.async";
import _ from "lodash";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  getLiveEventByIdAsync,
  getEventByEventIdAsync,
} from "../../../../redux/async.api";
import { joinLiveClassAsync, watchingLiveClassAsync } from "redux/async.api";
import { setEventId, setUsersData } from "redux/slices/schedule.slice";
import "./styles.css";
import ChatBox from "./ChatBox";
import RateUsNew from "../../../../pages/dashboard/RateUs/RateUsNew";

const VideoPlayer = () => {
  const location = useLocation();
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const { vidId } = useParams();
  const navigate = useNavigate();
  const { getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { siteTitle } = getOnlySiteSettingData;

  const { themeStretch } = useSettingsContext();
  const { eventByIdLoader, eventById } = useSelector((state) => state?.live);
  const { userJoinLoader, userJoin } = useSelector((state) => state?.schedule);
  const [contentByTopicInfo, setContentByTopicInfo] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [selectedItemPlay, setSelectedItemPlay] = useState({});
  const [openShareDialog, setShareOpenDialog] = useState(false);
  const [eventStatus, setEventStatus] = useState(false);
  const [currentTime, setCurrentTime] = useState();
  const [currentId, setCurrentId] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [tab, setTab] = useState("");
  const [socket, setSocket] = useState(null);
  const { studentLoader, studentById } = useSelector((state) => state.student);
  const { liveUsers } = useSelector((state) => state?.schedule);
  const studentId = location?.state?.studentId;

  // useEffect(() => {
  //   const newSocket = socketio("https://api.vedaacademy.org.in");
  //   setSocket(newSocket);
  //   return () => newSocket.disconnect();
  // }, []);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // const sendCountMessage = (status) => {
  //   if (socket) {
  //     let userId = studentById?.id;
  //     let batchId = studentById?.batchTypeId;
  //     socket.emit("send-watching-count", userId, vidId, batchId, status);
  //   }
  // };

  // const handleTimeUpdate = () => {
  //   const currentTime = playerRef.current.plyr.currentTime;
  //   setCurrentTime(currentTime);
  //   const plyr = playerRef.current.plyr;
  // if (isLive) {
  //   if (plyr.paused) {
  //     sendCountMessage(0);
  //   } else {
  //     sendCountMessage(1);
  //   }
  // }
  // };

  const showEndingVideo = () => {
    let totalDuration = Math.floor(playerRef?.current?.plyr?.duration);
    const latestTime = Math.floor(playerRef?.current?.plyr?.currentTime);

    if (latestTime !== NaN && latestTime == 0) {
      if (totalDuration == 0) {
        setIsLive(true);
      } else {
        setIsLive(false);
      }

      let payload = {
        studentId: studentId,
        eventId: vidId,
        joinStatus: true,
      };

      // dispatch(joinLiveClassAsync(payload)).then((res) => {
      //   if (res?.payload?.status === 200) {
      //     console.log("");
      //   }
      // });
      // if (totalDuration == 0) {
      //   sendCountMessage(1);
      // }
    }
  };

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("receive-watching-count", (data) => {
  //       dispatch(setUsersData(data));
  //     });
  //   }

  //   return () => {
  //     if (socket) {
  //       socket.off("receive-watching-count");
  //     }
  //   };
  // }, [socket]);

  useEffect(() => {
    if (vidId) {
      let payload = {
        id: vidId,
      };
      dispatch(getEventByEventIdAsync(payload)).then((res) => {
        if (res?.payload == "Event not found.") {
          setEventStatus(true);
        }
      });
      dispatch(setEventId(vidId));
    }
  }, [vidId]);

  useEffect(() => {
    const interval = setInterval(() => {
      showEndingVideo();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [showEndingVideo]);

  const renderVideo = useMemo(
    () => (
      <div
        style={{
          width: "100%",
          height: "70vh !important",
          position: "relative !imporatnt",
          top: "20% !important",
        }}
        // onClick={handleTimeUpdate}
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
            autoplay: true,
          }}
          ref={playerRef}
          source={selectedItemPlay}
        />
      </div>
    ),
    [selectedItemPlay]
  );

  useEffect(() => {
    if (selectedItem) {
      const payload = {
        type: "video",
        sources: [],
      };
      if (selectedItem?.category === "Youtube") {
        payload?.sources?.push({
          // src: selectedItem?.originalSource,
          // src: currentId !== null && currentId,
          src: selectedItem?.originalUrl
            ? selectedItem?.originalUrl
            : selectedItem?.url,
          provider: "youtube",
        });
      } else {
        payload?.sources?.push({
          src: selectedItem?.originalUrl,
        });
      }
      setSelectedItemPlay(payload);
    }
  }, [selectedItem]);

  useEffect(() => {
    // if (videoData) {
    //   setSelectedItem(videoData);
    //   setContentByTopicInfo([videoData]);
    // } else {
    //   setSelectedItem(eventById);
    //   setContentByTopicInfo([eventById]);
    // }

    if (eventById) {
      setSelectedItem(eventById);
      setContentByTopicInfo([eventById]);
    }
  }, [vidId, eventById]);

  const handleNavBackPage = () => {
    navigate(-1);
  };

  if (eventByIdLoader) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  } else if (eventStatus) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <Typography sx={{ color: "red", fontSize: "20px" }}>
          This link is not accessible to you!!
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Helmet>
        <title>Event | {`${siteTitle}`}</title>
      </Helmet>

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
          <Grid item md={7} xs={12}>
            <Box sx={{ borderRadius: "15px", mt: 3 }}>
              <Box className="event-videos">{renderVideo}</Box>
              <Box sx={{ mx: "7px", mt: "10px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "16px", color: "primary.main" }}>
                    {isLive == true ? (
                      <>
                        🔴
                        <span style={{ color: "#f8312f" }}>
                          {selectedItem?.type}
                        </span>{" "}
                      </>
                    ) : (
                      <>Recorded Class </>
                    )}
                    {""}| By{" "}
                    {selectedItem?.teachrs
                      ?.map((teacher, index) => teacher?.teacherName)
                      .filter(Boolean)
                      .join(", ")}
                  </Typography>
                  {/*isLive == true ? (
                    <Typography sx={{ fontSize: "12px", color: "#068c52" }}>
                      {liveUsers ? liveUsers : 0} Watching
                    </Typography>
                  ) : (
                    <Typography sx={{ fontSize: "12px", color: "#068c52" }}>
                      {selectedItem?.watchedCount
                        ? selectedItem?.watchedCount
                        : 0}{" "}
                      views
                    </Typography>
                  ) */}
                </Box>

                <Typography variant="h4" mb={1}>
                  {selectedItem?.title}
                </Typography>
                <Box>
                  <TabContext value={tab}>
                    <Box sx={{ borderColor: "divider" }}>
                      <TabList onChange={handleTabChange}>
                        <Tab label="Notes" value="Notes" />
                        <Tab label="Feedback" value="Feedback" />
                      </TabList>
                    </Box>

                    <TabPanel value={tab}>
                      {tab == "Notes" &&
                        (eventById?.note ? (
                          <embed
                            oncontextmenu="return false"
                            src={eventById?.note + "#toolbar=0"}
                            type="application/pdf"
                            height={1000}
                            width={900}
                          />
                        ) : (
                          <Typography>Note Not Available</Typography>
                        ))}
                      {tab == "Feedback" && (
                        <Box sx={{ position: "relative" }}>
                          <RateUsNew eventId={vidId} />
                        </Box>
                      )}
                    </TabPanel>
                  </TabContext>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ overflowX: "hidden", mt: "22px" }}>
              <ChatBox eventId={vidId} isLive={isLive} eventById={eventById} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default VideoPlayer;
