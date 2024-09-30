import React from "react";
import {useEffect} from "react";
import { useSelector,useDispatch } from "react-redux";
import Slider from "react-slick";
import { useTheme } from "@mui/material";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { getAllMentorshipHelpAsync } from "../../../redux/mentorship/mentorshipHelp.async";
import CustomComponentLoader from '../../../components/CustomComponentLoader/CustomComponentLoader';
function SaarthiHelp() {
 const theme=useTheme();
 const dispatch=useDispatch();
 const {mentorshiphelpHelpLoader,mentorshiphelpHelpBy=[]} = useSelector((state) => state?.mentorshipHelp);
 useEffect(() => {
     dispatch( getAllMentorshipHelpAsync({
         "type":"help"
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
          slidesToShow:mentorshiphelpHelpBy?.length>2?2:mentorshiphelpHelpBy?.length,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: mentorshiphelpHelpBy?.length>2?2:mentorshiphelpHelpBy?.length,
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
     { mentorshiphelpHelpLoader ?<><Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', color: 'primary.main' }}>
           <CustomComponentLoader padding="0" size={50} />
        </Box></>:
      <>{mentorshiphelpHelpBy.length >0?<Slider {...settings}>
        { mentorshiphelpHelpBy?.map((item,i) => (
          <Box key={i} sx={{ pr: 3, pt: 1,mt:1 }}>
            <Card
              sx={{
                height: 200,
                overflow: "hidden",
                p: 2,
                bgcolor: "transparent",
                display: "flex",
                justifyContent:"space-around",
                alignItems:"center",
                width:mentorshiphelpHelpBy?.length<2?"50%":"100%",
                [theme.breakpoints.down('md')]: {
                  width:"100%"
              },
              }}
            >
              <Box
                sx={{
                  borderRadius: "8px",
                  width:"20%",
                  height:"60%",
                  alignItems:"center",
                }}
              >
                <img src={item?.image} height="100%" width="100%" style={{objectFit:"scale-down"}} alt="" />
              </Box>
              <Box sx={{width:"70%",marginLeft:"-1%",
              [theme.breakpoints.down('md')]: {
                marginLeft:"2%"
              }
            }}>
              <Typography
                  sx={{
                    fontWeight: "600",
                    fontSize: "20px",
                  }}
                >
                  {item ?.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color:"#787A8D"
                  }}
                >
                {item?.description}
                </Typography>
              </Box>
            </Card>
          </Box>
        ))}
      </Slider>:<Box sx={{width:'100%',textAlign:'center',marginTop:'80px'}}><Typography variant="h5">No Data Found</Typography></Box>}</>
}
    </>
  );
}

export default SaarthiHelp;
