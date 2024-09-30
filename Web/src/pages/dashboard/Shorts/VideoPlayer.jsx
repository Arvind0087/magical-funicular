import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import "plyr-react/plyr.css";
import Plyr from "plyr-react";
import { useLocation, useNavigate, useParams } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ShareWith from "components/shareWith/ShareWith";
import { toast } from "react-hot-toast";
import "./styles.css";

import {
  getNextShortsAsync,
  getOneShortsByStudentIdAsync,
  getPreviousShortsAsync,
  likeShortsAsync,
} from "../../../redux/async.api";
import { useSettingsContext } from "../../../components/settings";
import { toastoptions } from "../../../utils/toastoptions";

const VideoPlayer = () => {
  const location = useLocation();
  const { sourceId } = location?.state;

  const { themeStretch } = useSettingsContext();
  const videoId = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state?.student?.studentById);
  // states
  const [videostate, setVideoState] = useState("");
  const [videoSource, setVideoSource] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [videoLikeStatus, setVideoLikeStatus] = useState(false);
  const [videoid, setVideoid] = useState(Number(videoId.link));
  const [openShareDialog, setShareOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState("");

  const handleClickOpen = () => {
    setShareOpenDialog(true);
  };
  const getVideo = (videoid) => {
    setLoading(true);
    if (id && videoid) {
      dispatch(
        getOneShortsByStudentIdAsync({
          studentId: id,
          shortsId: videoid,
        })
      ).then((response) => {
        if (response.payload.status === 200) {
          setVideoState(response?.payload?.data?.video);
          setVideoThumbnail(response?.payload?.data?.thumbnail);
          setVideoLikeStatus(response?.payload?.data?.like);
          setVideoid(response?.payload?.data?.id);
          setVideoSource(response?.payload?.data?.source);
          setLoading(false);
        }
      });
    }
  };

  useEffect(() => {
    if (videoid) {
      getVideo(videoid);
    }
  }, [videoid, id]);

  const likeShort = () => {
    // like the short
    if (!videoLikeStatus) {
      dispatch(
        likeShortsAsync({
          studentId: id,
          shortsId: videoid,
          like: 1,
        })
      ).then((res) => {
        if (res?.payload?.status === 200) {
          toast.success(res.payload.message, toastoptions);
          setVideoLikeStatus(true);
        }
      });
    } else {
      // dislike the post
      dispatch(
        likeShortsAsync({
          studentId: id,
          shortsId: videoid,
          like: 0,
        })
      ).then((res) => {
        if (res.payload.status === 200) {
          toast.success(res.payload.message, toastoptions);
          setVideoLikeStatus(false);
        }
      });
    }
  };

  const goToNext = () => {
    dispatch(
      getNextShortsAsync({
        shortsId: videoid,
        studentId: id,
      })
    ).then((res) => {
      if (res.payload.status === 200) {
        setVideoState(res?.payload?.data?.video);
        setVideoid(res?.payload?.data?.id);
      }
    });
  };

  const goToPrevious = () => {
    dispatch(
      getPreviousShortsAsync({
        shortsId: videoid,
        studentId: id,
      })
    ).then((res) => {
      if (res.payload.status === 200) {
        setVideoState(res?.payload?.data?.video);
        setVideoid(res?.payload?.data?.id);
      }
    });
  };

  let youtubeIds = videostate?.includes("/shorts/") ? sourceId : videostate;

  const renderVideo = useMemo(
    () => (
      <div className="video-shorts">
        <Plyr
          height={400}
          controls={true}
          options={{
            controls: [
              // "play-large",
              "play",
              // "rewind",
              // "fast-forward",
              "progress",
              "current-time",
              "mute",
              "volume",
              "captions",
              // "settings",
              // "pip",
              // "fullscreen",
            ],
            ratio: "9:16",
            autoplay: true,
            // captions: { active: true, language: "auto", update: true },
            // previewThumbnails: { enabled: true, src: { videoThumbnail } },
          }}
          source={{
            type: "video",
            sources: [
              {
                src: videoSource === "youtube" ? youtubeIds : videostate,
                // provider: 'html5'
                provider: videoSource === "youtube" ? "youtube" : "html5",
              },
            ],
          }}
        />
      </div>
    ),
    [videostate]
  );
  if (!videostate) return null;
  if (loading) return null;
  const handleNavBackPage = () => {
    navigate(-1);
  };
  return (
    <Container maxWidth={themeStretch ? false : "xl"}>
      <Box sx={{ display: "flex", alignItems: "left" }}>
        <KeyboardBackspaceIcon
          sx={{ color: "primary.main" }}
          onClick={handleNavBackPage}
        />
      </Box>
      <Card
        sx={{
          mt: 2,
          width: { xs: "90%", sm: "50%", md: "30%" },
          margin: "auto",
        }}
      >
        {renderVideo}
        <Grid container>
          <Grid
            item
            xs={7}
            sx={{ display: "flex", justifyContent: "left" }}
          ></Grid>
          <Grid item xs={5} sx={{ display: "flex", justifyContent: "right" }}>
            <Box
              sx={{
                right: "3.5%",
                marginTop: "30px",
                zIndex: 1000,
                transform: "translate(0, -50%)",
                border: "none",
                display: "block",
                height: "40px",
                width: "40px",
                textAlign: "center",
                borderRadius: "50%",
                marginLeft: "10px",
                color: videoLikeStatus === true ? "red" : "gray",
              }}
              onClick={likeShort}
            >
              <FavoriteIcon
                sx={{
                  fontSize: "25px",
                  marginTop: "7px",
                  color: videoLikeStatus === true ? "red" : "gray",
                }}
              />
            </Box>
            <Box
              sx={{
                marginInline: "10px",
                zIndex: 1000,
                marginTop: "30px",
                transform: "translate(0, -50%)",
                border: "none",
                display: "block",
                height: "40px",
                width: "40px",
                textAlign: "center",
                borderRadius: "50%",
              }}
            >
              <ShareIcon
                sx={{
                  fontSize: "25px",
                  marginTop: "7px",
                  color: "primary.main",
                }}
                onClick={handleClickOpen}
              />
            </Box>
          </Grid>
        </Grid>
      </Card>
      {/* share */}
      <ShareWith
        {...{
          setShareOpenDialog,
          openShareDialog,
        }}
      />
    </Container>
  );
};
export default VideoPlayer;
