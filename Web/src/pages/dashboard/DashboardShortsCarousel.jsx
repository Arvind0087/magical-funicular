import React from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Slider from "react-slick";
import { setUrl } from "../../redux/slices/shorts.slice";
import { PATH_DASHBOARD } from "../../routes/paths";
import { getNewShortsByStudentIdAsync } from "../../redux/async.api";
import CustomComponentLoader from "../../components/CustomComponentLoader/CustomComponentLoader";

function DashboardShortsCarousel(props) {
  const { newVideos, newVideosLoader, shortsCarouselData } = props;

  const setPercentage = (slideLength) => {
    let percentage;
    switch (slideLength) {
      case 1:
        percentage = "25%";
        break;
      case 2:
        percentage = "50%";
        break;
      case 3:
        percentage = "75%";
        break;
      default:
        percentage = "100%";
    }
    return percentage;
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  var settings = {
    dots: true,
    color: "primary.main",
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow:
            shortsCarouselData?.length > 3 ? 4 : shortsCarouselData?.length,
          slidesToScroll:
            shortsCarouselData?.length > 3 ? 4 : shortsCarouselData?.length,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow:
            shortsCarouselData?.length > 2 ? 3 : shortsCarouselData?.length,
          slidesToScroll:
            shortsCarouselData?.length > 2 ? 3 : shortsCarouselData?.length,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
    ],
  };

  const openNewVideo = (videoId, videoUrl, video, sourceId) => {
    navigate(`${PATH_DASHBOARD.videoPlayer(videoId)}?type=shorts`, {
      state: { videoUrl, video, sourceId },
    });
    dispatch(setUrl(videoId));
  };

  return (
    <>
      {newVideosLoader ? (
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
          {shortsCarouselData?.length > 0 ? (
            <Box
              sx={{
                width: {
                  xs: "70%",
                  sm: "100%",
                  md: setPercentage(shortsCarouselData?.length),
                },
              }}
            >
              <Slider {...settings}>
                {shortsCarouselData?.length > 0 &&
                  shortsCarouselData?.map((item, index) => (
                    <Box sx={{ p: 1, mt: 2 }} key={index}>
                      <Card
                        sx={{
                          height: 360,
                          overflow: "hidden",
                          width: "100%",
                        }}
                        onClick={() =>
                          openNewVideo(
                            item?.id,
                            item?.video,
                            shortsCarouselData,
                            item?.original_resolution
                          )
                        }
                      >
                        <video
                          src={item?.video}
                          height={360}
                          width="100%"
                          style={{ objectFit: "cover" }}
                          poster={item?.thumbnail}
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
                    </Box>
                  ))}
              </Slider>
            </Box>
          ) : (
            <Box sx={{ width: "100%", textAlign: "center", marginTop: "80px" }}>
              <Typography variant="h5">Shorts Not Found</Typography>
            </Box>
          )}
        </>
      )}
    </>
  );
}
export default DashboardShortsCarousel;
