import React, { useMemo, useState, useEffect, useRef } from "react";
import Plyr from "plyr-react";
import { useLocation, useNavigate, useParams } from "react-router";
import "plyr-react/plyr.css";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import YouTubeIcon from "@mui/icons-material/YouTube";
import moment from "moment";
import { useSettingsContext } from "components/settings";
import _ from "lodash";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import playIcon from "../../assets/images/dashboard/play.png";
import "./styles.css";

const VideoPlayer = () => {
  const location = useLocation();
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const { vidId } = useParams();
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  const [selectedItem, setSelectedItem] = useState({});
  const [selectedItemPlay, setSelectedItemPlay] = useState({});
  const [currentTime, setCurrentTime] = useState();
  const pyqsData = location.state.pyqsData;

  console.log("pyqsData....", pyqsData);

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
    if (pyqsData) {
      const payload = {
        type: "video",
        sources: [],
      };

      payload?.sources?.push({
        src: pyqsData?.originalVideoUrl
          ? pyqsData?.originalVideoUrl
          : pyqsData?.convertdVideoUrl,
        provider: "youtube",
      });

      setSelectedItemPlay(payload);
    }
  }, [pyqsData]);

  const handleNavBackPage = () => {
    navigate(-1);
  };

  const handleResourse = (id, condition) => {
    // const updateOpen = _.map(filteredContentByTopicInfo, (ev) => {
    //   if (ev.id === id)
    //     return {
    //       ...ev,
    //       resourseOpen: condition,
    //     };
    //   else return ev;
    // });
    // setContentByTopicInfo(updateOpen);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          backgroundColor: "#fff",
          width: "103%",
          height: "50px",
          marginLeft: "-15px",
          mt: 2,
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
            onClick={handleNavBackPage}
          />
          <Typography sx={{ color: "#000", fontSize: "18px" }}>
            {pyqsData?.title}
          </Typography>
        </Box>
      </Box>
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Grid container spacing={3}>
          <Grid item md={7} xs={12}>
            <Box sx={{ borderRadius: "15px" }}>
              <Box className="event-videos">{renderVideo}</Box>
              {/*<Box sx={{ mx: "7px", mt: "10px" }}>
                <Typography variant="h4" mb={1}>
                  {pyqsData?.video_title}
                </Typography>
              </Box> */}
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
              {pyqsData && (
                <PlaybackVideoCustom
                  item={pyqsData}
                  handleResourse={handleResourse}
                  setSelectedItem={setSelectedItem}
                  selectedItem={selectedItem}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default VideoPlayer;

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <LazyLoadImage
            alt={item?.title}
            effect="blur"
            src={playIcon}
            width="35px"
            style={{ objectFit: "cover" }}
          />
          <Typography sx={{ ml: 1, fontSize: "12px" }}>
            {item?.video_title}
          </Typography>
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
        </Box>
      </Box>
    </>
  );
}
