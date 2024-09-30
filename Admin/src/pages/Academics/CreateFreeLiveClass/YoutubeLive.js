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
import moment from "moment";
import { useSettingsContext } from "components/settings";
import _ from "lodash";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { joinLiveClassAsync } from "redux/async.api";
import "./styles.css";
import ChatBox from "./ChatBox";

const YoutubeLive = () => {
  const location = useLocation();
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  const [contentByTopicInfo, setContentByTopicInfo] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [selectedItemPlay, setSelectedItemPlay] = useState({});
  const [currentTime, setCurrentTime] = useState();
  const [currentId, setCurrentId] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const videoData = location?.state?.data;
  const { userinfo } = useSelector((state) => state.userinfo);

  const handleTimeUpdate = () => {
    const currentTime = playerRef.current.plyr.currentTime;
    setCurrentTime(currentTime);
  };

  //   const checkLiveStatus = (videoData) => {
  //     if (videoData) {
  //       let videoDateTime = videoData?.startedBy;
  //       const splitValue = videoDateTime && videoDateTime.split("T");

  //       if (splitValue && splitValue.length === 2) {
  //         const providedDate = splitValue[0];
  //         const providedTime = splitValue[1];
  //         const providedDateTime = moment(
  //           `${providedDate} ${providedTime}`,
  //           "YYYY-MM-DD HH:mm:ss"
  //         );
  //         const currentDateTime = moment();

  //         if (currentDateTime.isSame(providedDateTime, "day")) {
  //           if (currentDateTime.isSameOrAfter(providedDateTime)) {
  //             setIsLive(true);
  //           } else {
  //             setIsLive(false);
  //           }
  //         } else if (currentDateTime.isAfter(providedDateTime)) {
  //           setIsLive(false);
  //         } else {
  //           setIsLive(false);
  //         }
  //       } else {
  //         console.error("");
  //       }
  //     }
  //   };

  //   useEffect(() => {
  //     checkLiveStatus(videoData);
  //   }, []);

  const showEndingVideo = () => {
    if (
      playerRef?.current?.plyr?.currentTime !== NaN &&
      playerRef?.current?.plyr?.currentTime == 0
    ) {
      let totalDuration = Math.floor(playerRef?.current?.plyr?.duration);
      if (totalDuration == 0) {
        setIsLive(true);
      } else {
        setIsLive(false);
      }
      const latestTime = Math.floor(playerRef?.current?.plyr?.currentTime);

      let payload = {
        studentId: videoData?.id,
        eventId: videoData?.id,
        joinStatus: true,
      };

      //   dispatch(joinLiveClassAsync(payload)).then((res) => {
      //     if (res?.payload?.status === 200) {
      //       console.log("");
      //     }
      //   });
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
          src: selectedItem?.url,
          provider: "youtube",
        });
      } else {
        payload?.sources?.push({
          src: selectedItem?.url,
        });
      }
      setSelectedItemPlay(payload);
    }
  }, [selectedItem]);

  useEffect(() => {
    setSelectedItem(videoData);
    setContentByTopicInfo([videoData]);
  }, []);

  const handleNavBackPage = () => {
    navigate(-1);
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
                    {""}| By {selectedItem?.teacherName}
                  </Typography>
                </Box>

                <Typography variant="h4" mb={1}>
                  {selectedItem?.title}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ overflowX: "hidden", mt: "22px" }}>
              <ChatBox
                eventId={videoData?.id}
                isLive={isLive}
                eventById={videoData}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default YoutubeLive;
