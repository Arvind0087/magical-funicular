import React from "react";
import { useEffect} from "react";
import { useSelector,useDispatch } from "react-redux";
import Slider from "react-slick";
import { useTheme } from "@mui/material";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { getAllMentorAsync } from "../../../redux/mentorship/mentorshipHelp.async";
import CustomComponentLoader from "../../../components/CustomComponentLoader/CustomComponentLoader";
function YourMentor() {
  const dispatch=useDispatch();
  const theme=useTheme();
  const {mentorTeacherLoader,mentorTeacherMentorBy=[]} = useSelector((state) => state?.mentorshipHelp);
  useEffect(() => {
      dispatch( getAllMentorAsync());
    }, []);

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow:  4,
    slidesToScroll: 2,
    initialSlide: 0,
    // variableWidth:true,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: mentorTeacherMentorBy?.length>5?5:mentorTeacherMentorBy?.length,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: mentorTeacherMentorBy?.length>3?3:mentorTeacherMentorBy?.length,
          slidesToScroll: 3,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: mentorTeacherMentorBy?.length>2?2:mentorTeacherMentorBy?.length,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
    ],
  };
  return (
    <>
    { mentorTeacherLoader ?<><Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', color: 'primary.main' }}>
           <CustomComponentLoader padding="0" size={50} />
        </Box></>:
      <>{mentorTeacherMentorBy.length >0?<Slider {...settings}>
        { mentorTeacherMentorBy?.map((item,i) => (
          <Box key={i} sx={{pr:3,pt:1,mt:1}}>
            <Card
              sx={{
                height: 250,
                overflow: "hidden",
                bgcolor: "transparent",
                display: "flex",
                flexDirection: "column", 
                width:mentorTeacherMentorBy?.length<2?"17%":mentorTeacherMentorBy?.length<4?"60%":"100%",
                [theme.breakpoints.down('md')]: {
                  width:mentorTeacherMentorBy?.length<2?"40%":mentorTeacherMentorBy?.length<4?"70%":"100%",
                },
                [theme.breakpoints.down('sm')]: {
                  width:mentorTeacherMentorBy?.length<2?"80%":"100%",
                },
              }}
            >
              <Card
                sx={{
                  borderRadius: "8px",
                  height:"77%",
                }}
              >
                <img src={item?.avatar} borderRadius="8px" height="100%" width="100%" alt="" style={{objectFit:"scale-down"}}/>
              </Card>
              <Box sx={{textAlign:"center",mb:1,height:"23%"}}>
              <Typography
                  sx={{
                    fontWeight: "500",
                    fontSize: "20px",
                    height:"50%",
                    overflow:"hidden"
                  }}
                >
                  {item?.name}
                </Typography>
               <Typography
               sx={{color:"#888888", fontSize: "18px",height:"50%",
               overflow:"hidden"}}
               >{item?.name}</Typography>
              </Box>
            </Card>
          </Box>
        ))}
      </Slider>:<Box sx={{width:'100%',textAlign:'center',marginTop:'80px'}}><Typography variant="h5">No Data Found</Typography></Box>}</>
}
    </>
  );
}

export default YourMentor;
