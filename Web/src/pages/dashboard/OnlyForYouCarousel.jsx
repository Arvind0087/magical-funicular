import React from "react";
import Slider from "react-slick";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import CustomComponentLoader from "../../components/CustomComponentLoader/CustomComponentLoader";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "routes/paths";
function OnlyForYouCarousel(props) {
  const { AllOnlyForYou, AllOnlyForYouLoader } = props;
  const navigate = useNavigate();
  const theme = useTheme();

  const newAllOnlyForYou = AllOnlyForYou.slice(-2);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: AllOnlyForYou?.length > 1 ? 2 : 1,
          slidesToScroll: 2,
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
      {AllOnlyForYouLoader ? (
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
          {newAllOnlyForYou.length > 0 ? (
            <Box sx={{ display: "flex" }}>
              {newAllOnlyForYou?.map((item, index) => (
                <Box sx={{ pr: 3, pt: 3 }} key={index}>
                  <Box
                    sx={{
                      borderRadius: "8px",
                      overflow: "hidden",
                      height: "100%",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (item?.otherLink == null) {
                        window.location.replace(item?.webBackLink);
                      } else {
                        const newWindow = window.open(
                          item?.otherLink,
                          "_blank"
                        );
                        newWindow.opener = null;
                      }
                    }}
                  >
                    <img src={item?.image} width="250px" height="auto" alt="" />
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ width: "100%", textAlign: "center", marginTop: "80px" }}>
              <Typography variant="h5">Data Not Found</Typography>
            </Box>
          )}{" "}
        </>
      )}
    </>
  );
}

export default OnlyForYouCarousel;
