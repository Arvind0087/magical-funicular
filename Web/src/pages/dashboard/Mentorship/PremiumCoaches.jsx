import React from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useState } from "react";
import Slider from "react-slick";

function PremiumCoaches(props) {
  const [premiumCoachData, setPremiumCoachData] = useState(
    props.PremiumCoachData
  );

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
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
          slidesToScroll: 3,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
    ],
  };
  return (
    <>
      <Slider {...settings}>
        {premiumCoachData.map((item,i) => (
          <Box key={i} sx={{ pr: 3, pt: 1,mt:1 }}>
            <Card
              sx={{
                height: 200,
                overflow: "hidden",
                p: 2,
                bgcolor: "transparent",
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                border:"2px solid rgb(226,226,226)"
              }}
            >
              <Box
                sx={{
                  borderRadius: "8px",
                  height:"60%",
                  alignItems:"center"
                }}
              >
                <img src={item.photo} height="100%" width="100%" alt="" />
              </Box>
              <Box sx={{textAlign:"center"}}>
              <Typography
                  sx={{
                    fontWeight: "500",
                    fontSize: "20px",
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
              <Box
                sx={{
                  borderRadius: "8px",
                  height:"14%",
                  alignItems:"center",
                  display:"flex",
                  paddingInline:"33%",
                 
                }}
              >
                <Box sx={{height:"100%",alignItems:"center",marginBottom:"2px"}}>
                <img src={item.crown} height="90%" width="90%" alt="" style={{objectFit:"scale-down"}} />
                </Box>
                <Box sx={{marginLeft:"2px",marginBottom:"1%"}}>
                <Typography
                  sx={{
                    fontWeight: "500",
                    fontSize: "18px",
                    color:"primary.main"
                  }}
                >
                  Premium
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

export default PremiumCoaches;
