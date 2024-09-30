import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import Slider from "react-slick";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

function MockTestComponent(props) {
  const [CarouselData, setCarouselData] = useState(props.CarouselData);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
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
  return (
    <>
      <Slider {...settings}>
        {CarouselData.map((item) => (
          <Box sx={{ p: 3 }}>
            <Card sx={{ height: 200, overflow: "hidden" }}>
              <img src={item.video} />
              <Box
                sx={{
                  position: "absolute",
                  top: "0",
                  height: 200,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                  background: " rgba(0, 0, 0, 0.4)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      width: "70px",
                      height: "20px",
                      borderRadius: " 26px",

                      display: "grid",
                      placeItems: "center",
                      bgcolor: "primary.main",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "11px",
                        textAlign: " center",
                        color: "#ffff",
                      }}
                    >
                      {item.subject}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      color: "primary.main",
                    }}
                  >
                    <BookmarkBorderIcon />
                  </Box>
                </Box>
                <Box
                  sx={{
                    color: "#ffff",
                    textAlign: "center",
                  }}
                >
                  <PlayCircleOutlineIcon
                    sx={{
                      fontSize: "45px",
                      cursor: "pointer",
                    }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "12.9px", color: "#ffff" }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ fontSize: "12px", color: "#ffff" }}>
                    {item.description}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        ))}
      </Slider>
    </>
  );
}

export default MockTestComponent;
