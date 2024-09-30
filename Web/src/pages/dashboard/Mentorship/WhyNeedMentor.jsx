import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Slider from "react-slick";
import ReactReadMoreReadLess from "react-read-more-read-less";
import { useTheme } from "@mui/material";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { getAllMentorshipWhyMentorpAsync } from "../../../redux/mentorship/mentorshipHelp.async";
import CustomComponentLoader from "../../../components/CustomComponentLoader/CustomComponentLoader";
import { removeTags } from "utils/removeTag";
function WhyNeedMentor() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { mentorshiphelpMentorLoader, mentorshiphelpMentorBy = [] } = useSelector((state) => state?.mentorshipHelp);
  useEffect(() => {
    dispatch(getAllMentorshipWhyMentorpAsync({
      "type": "mentor"
    }));
  }, []);
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
          slidesToShow: mentorshiphelpMentorBy?.length > 3 ? 3 : mentorshiphelpMentorBy?.length,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: mentorshiphelpMentorBy?.length > 2 ? 2 : mentorshiphelpMentorBy.length,
          slidesToScroll: 3,
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
      {mentorshiphelpMentorLoader ? <><Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', color: 'primary.main' }}>
        <CustomComponentLoader padding="0" size={50} />
      </Box></> :
        <>{mentorshiphelpMentorBy.length > 0 ? <Slider {...settings}>
          {mentorshiphelpMentorBy?.map((item, i) => (
            <Box key={i} sx={{ pr: 3, pt: 1, mt: 1 }}>
              <Card
                sx={{
                  minHeight: 280,
                  overflow: "hidden",
                  bgcolor: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                  alignItems: "center",
                  p: 1,
                  width: mentorshiphelpMentorBy?.length < 2 ? "30%" : mentorshiphelpMentorBy?.length < 3 ? "70%" : "100%",
                  [theme.breakpoints.down('md')]: {
                    width: mentorshiphelpMentorBy?.length < 2 ? "55%" : mentorshiphelpMentorBy?.length < 3 ? "90%" : "100%"
                  },
                  [theme.breakpoints.down('sm')]: {
                    width: "100%"
                  },
                }}
              >
                <Box
                  sx={{
                    borderRadius: "8px",
                    height: "90px",
                    width: "30%",
                  }}
                >
                  <img src={item?.image} height="100%" width="100%" style={{ objectFit: "scale-down" }} alt="" />
                </Box>
                <Box sx={{ textAlign: "center", mb: 1, height: "30%" }}>
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontSize: "20px",
                      height: "40%",
                      overflow: "hidden"
                    }}
                  >
                    {item?.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#888888", fontSize: "14px",
                      height: "70%",
                      overflow: "hidden",
                    }}
                  >
                    <ReactReadMoreReadLess
                      charLimit={100}
                      readMoreText={"more"}
                      readLessText={"less"}
                      readMoreStyle={{ fontSize: "10px", cursor: "pointer" }}
                      readLessStyle={{ fontSize: "10px", cursor: "pointer" }}
                    >
                      {removeTags(item?.description)}
                    </ReactReadMoreReadLess>
                  </Typography>
                </Box>
              </Card>
            </Box>
          ))}
        </Slider> : <Box sx={{ width: '100%', textAlign: 'center', marginTop: '80px' }}><Typography variant="h5">No Data Found</Typography></Box>}</>
      }
    </>
  );
}

export default WhyNeedMentor;
