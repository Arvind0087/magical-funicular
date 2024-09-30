import React from "react";
import {useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import Slider from "react-slick";
import { useTheme } from "@mui/material";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { getAllMentorshipfeatureAsync } from "../../../redux/mentorship/mentorshipHelp.async";
import CustomComponentLoader from '../../../components/CustomComponentLoader/CustomComponentLoader';
function AskDoubtSlider() {
  const dispatch=useDispatch();
  const theme = useTheme();
  const { mentorshiphelpfeatureLoader,mentorshiphelpfeatureBy=[]} = useSelector((state) => state?.mentorshipHelp)
  useEffect(() => {
      dispatch( getAllMentorshipfeatureAsync({
          "type":"feature"
        }));
    }, []);

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    // variableWidth:true,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow:mentorshiphelpfeatureBy?.length>6? 6 :mentorshiphelpfeatureBy?.length,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
          // variableWidth: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: mentorshiphelpfeatureBy?.length>3? 3 :mentorshiphelpfeatureBy?.length,
          slidesToScroll: 3,
          initialSlide: 2,
          // variableWidth: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow:mentorshiphelpfeatureBy?.length>3?3 :mentorshiphelpfeatureBy?.length,
          slidesToScroll: 1,
          initialSlide: 2,
          // variableWidth: false,
        },
      },
    ],
  };
  return (
    <>
     { mentorshiphelpfeatureLoader ?<><Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', color: 'primary.main' }}>
           <CustomComponentLoader padding="0" size={50} />
        </Box></>:
      <>{mentorshiphelpfeatureBy?.length >0?<><Slider {...settings}>
        { mentorshiphelpfeatureBy?.map((item,index) => (
          <Box key={index} sx={{ pr: 3, pt: 3}}>
            <Card
              sx={{
                height: 150,
                overflow: "hidden",
                p:1,
                bgcolor: "transparent",
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                alignItems:"center",
                width:mentorshiphelpfeatureBy?.length<4?"60%":mentorshiphelpfeatureBy?.length<6?"80%":"100%",
                [theme.breakpoints.down('md')]: {
                  width:"100%"
              },
              }}
            >
              <Box
                sx={{
                  borderRadius: "8px",
                  height:"57%",
                  alignItems:"center"
                }}
              >
                <img src={item?.image} height="100%" alt="" />
              </Box>
              <Box sx={{textAlign:"center"}}>
              <Typography
                  sx={{
                    fontWeight: "500",
                    fontSize: "18px",
                  }}
                >
                  {item?.title}
                </Typography>
              </Box>
            </Card>
          </Box>
        ))
        }
      </Slider></>:<><Box sx={{width:'100%',textAlign:'center',marginTop:'80px'}}><Typography variant="h5">No Data Found</Typography></Box></>
}</>
}
    </>
  );
}

export default AskDoubtSlider;
