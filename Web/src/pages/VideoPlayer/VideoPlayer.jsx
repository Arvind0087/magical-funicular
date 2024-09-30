import React, {useState} from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import { useTheme } from "@mui/material";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import "./VideoPlayer.css";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FolderIcon from "@mui/icons-material/Folder";
import { useSettingsContext } from "../../components/settings";
import ShareWith from '../../components/shareWith/ShareWith'

const VideoPlayer = () => {
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const [openShareDialog, setShareOpenDialog] = useState(false)

  const data = [
    {
      id: 1,
      vide: "https://dwc48rifn4uxk.cloudfront.net/deepVideoDekho.mp4",
    },
  ];

  const selectedTopics = [
    {
      id: 1,
      image:
        "https://images.vexels.com/media/users/3/136749/isolated/preview/6f1655bec9f0912928018b899765c8db-rocket-square-icon-by-vexels.png",
      topic: "An Introduction to motion",
      time: "50 mins",
    },
    {
      id: 2,
      image:
        "https://images.vexels.com/media/users/3/136749/isolated/preview/6f1655bec9f0912928018b899765c8db-rocket-square-icon-by-vexels.png",
      topic: "An Introduction to motion 2",
      time: "50 mins",
    },
    {
      id: 3,
      image:
        "https://images.vexels.com/media/users/3/136749/isolated/preview/6f1655bec9f0912928018b899765c8db-rocket-square-icon-by-vexels.png",
      topic: "An Introduction to motion 3",
      time: "40 mins",
    },
    {
      id: 4,
      image:
        "https://images.vexels.com/media/users/3/136749/isolated/preview/6f1655bec9f0912928018b899765c8db-rocket-square-icon-by-vexels.png",
      topic: "An Introduction to motion 4  ",
      time: "30 mins",
    },
    {
      id: 5,
      image:
        "https://images.vexels.com/media/users/3/136749/isolated/preview/6f1655bec9f0912928018b899765c8db-rocket-square-icon-by-vexels.png",
      topic: "An Introduction to motion 5 ",
      time: "20 mins",
    },
    {
      id: 6,
      image:
        "https://images.vexels.com/media/users/3/136749/isolated/preview/6f1655bec9f0912928018b899765c8db-rocket-square-icon-by-vexels.png",
      topic: "An Introduction to motion 6",
      time: "60 mins",
    },
    {
      id: 7,
      image:
        "https://images.vexels.com/media/users/3/136749/isolated/preview/6f1655bec9f0912928018b899765c8db-rocket-square-icon-by-vexels.png",
      topic: "An Introduction to motion 7",
      time: "10 mins",
    },
    {
      id: 8,
      image:
        "https://images.vexels.com/media/users/3/136749/isolated/preview/6f1655bec9f0912928018b899765c8db-rocket-square-icon-by-vexels.png",
      topic: "An Introduction to motion 8",
      time: "50 mins",
    },
  ];

  return (
    <>
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Box>
          <Grid container spacing={3}>
            <Grid item md={7}>
              <Box sx={{ borderRadius: "15px" }}>
                {data.map((item, index) => (
                  <Plyr
                    key={index}
                    // ref={ref}
                    source={{
                      type: "video",
                      sources: [
                        {
                          src: item.vide,
                          // provider: provider
                        },
                      ],
                    }}
                  options={{
                   autoplay: true // make video autoplay
                  }}
                  />
                ))}
                <Box sx={{ mx: "7px", mt: "10px" }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      sx={{ fontSize: "16px", color: "primary.main" }}
                    >
                      An Introduction to motion
                    </Typography>
                    <Box>
                      <ShareOutlinedIcon
                        onClick={() => setShareOpenDialog(true)}
                        sx={{ mr: "5px" }} />
                      <TurnedInNotIcon />
                    </Box>
                  </Box>

                  <Typography variant="h4">
                    Motion and measurements of Distances
                  </Typography>

                  <Box sx={{ display: "flex" }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mr: "10px" }}
                    >
                      <AccessTimeIcon
                        color="#787A8D"
                        fontSize="15px"
                        sx={{ mr: "3px", color: "#787A8D" }}
                      />{" "}
                      <Typography color="#787A8D" fontSize="15px">
                        50 mins
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <YouTubeIcon
                        fontSize="15px"
                        sx={{ mr: "3px", color: "#787A8D" }}
                      />{" "}
                      <Typography color="#787A8D" fontSize="15px">
                        10 Videos
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  marginInline: "auto",
                  width: "auto",
                  height: { md: "600px", xs: "auto" },
                  p: "0px 15px 15px 15px",
                  position: "relative",
                  overflow: { md: "scroll", xs: "inherit" },
                  [theme.breakpoints.down("md")]: {
                    background: "none",
                    boxShadow: "none",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "sticky",
                    top: "0px",
                    zIndex: "10000",
                    backgroundColor: "white",
                    height: "60px",
                    pt: 1.5,
                  }}
                >
                  <Typography variant="h5">Releated Topics</Typography>
                </Box>
                <Box sx={{ overflowX: "hidden" }}>
                  {selectedTopics.map((item, index) => (
                    <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
                      <Box>
                        <img
                          src={item.image}
                          alt=""
                          width="90px"
                          height="90px"
                          sx={{ borderRadius: "10%" }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="h6">{item.topic}</Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mr: "10px",
                          }}
                        >
                          <AccessTimeIcon
                            color="#787A8D"
                            fontSize="15px"
                            sx={{ mr: "3px", color: "#787A8D" }}
                          />{" "}
                          <Typography color="#787A8D" fontSize="15px">
                            {item.time}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            border: "1px solid black",
                            display: "flex",
                            alignItems: "center",
                            height: "25px",
                            width: "150px",
                            mt: 0.5,
                            borderRadius: "18px",
                          }}
                        >
                          &nbsp;&nbsp;
                          <FolderIcon />
                          <Box sx={{ display: "flex", alignContent: "center" }}>
                            &nbsp; Resources <KeyboardArrowDownIcon />
                          </Box>
                        </Box>
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        ml={{ xs: 1, md: 3 }}
                      >
                        <PlayCircleOutlinedIcon sx={{ opacity: "0.5" }} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <ShareWith
        {...{
          setShareOpenDialog,
          openShareDialog,
        }}
      />
    </>
  );
};

export default VideoPlayer;