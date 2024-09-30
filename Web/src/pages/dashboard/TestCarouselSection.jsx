import React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useState } from "react";
import Slider from "react-slick";

function TestCarouselSection(props) {
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
  return (
    <>
      <Slider {...settings}>
        {CarouselData.map((item) => (
          <Box sx={{ p: 3 }}>
            <Card
              sx={{
                height: 200,
                overflow: "hidden",
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontWeight: "600",
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "15px",
                    mt: 2.6,
                  }}
                >
                  Questions: {item.n_of_questions}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "15px",
                  }}
                >
                  Time: {item.time}
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  sx={{ color: "#fff", borderRadius: "60px" }}
                >
                  Re-attempt
                </Button>
              </Box>
            </Card>
          </Box>
        ))}
      </Slider>
    </>
  );
}

export default TestCarouselSection;
