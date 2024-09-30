import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Slider from "react-slick";
import { useNavigate } from "react-router";
import moment from "moment";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import _ from "lodash";
import { addBookmarkAsync } from "redux/bookmark/bookmark.async";
import { PATH_DASHBOARD } from "../../routes/paths";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import SyllabusVideokeleton from "components/Skeletons/SyllabusVideokeleton/SyllabusVideokeleton";
import calender from "../../assets/images/calender.png";
import languageimg from "../../assets/images/languageimg.png";
import clock from "../../assets/images/clock.png";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";

export default function FreeLiveCarousel({ data, loader }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dataInfo, setdataInfo] = useState([]);
  const [resourceType, setResourceType] = useState("video");
  const { bookmarkLoader } = useSelector((state) => state.bookmark);
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  useMemo(() => {
    if (data) setdataInfo(data);
  }, [data]);

  const freeLiveVideo = (videoData) => {
    if (videoData) {
      let assignDateTime = videoData?.startedBy;
      const splitValue = assignDateTime && assignDateTime.split("T");
      const providedDate = splitValue[0];
      const providedTime = splitValue[1];
      const providedDateTime = moment(
        `${providedDate} ${providedTime}`,
        "YYYY-MM-DD HH:mm:ss"
      );
      const currentDateTime = moment();

      if (currentDateTime.isSameOrAfter(providedDateTime)) {
        navigate(`${PATH_DASHBOARD?.event}/${videoData?.id}`);
      } else {
        toast.error("Please join on time!", toastoptions);
      }
    }
  };

  return (
    <>
      <Slider {...settings}>
        {loader ? (
          <SyllabusVideokeleton />
        ) : (
          dataInfo?.map((item, In) => (
            <Box
              sx={{
                pr: 2,
                boxSizing: "border-box",
              }}
              key={In}
            >
              <Box
                sx={{
                  height: 350,
                  mt: 3,
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                  justifyContent: "space-between",
                  // border: "2px solid rgb(234, 234, 234)",
                  borderRadius: "6px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Card
                  sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "16px",
                    alignItems: "center",
                    mb: 2,
                    cursor: "pointer",
                  }}
                  onClick={() => freeLiveVideo(item)}
                >
                  <LazyLoadImage
                    alt={item?.subject}
                    effect="blur"
                    src={item?.thumbnail}
                    width="100%"
                    height="100%"
                    borderRadius="16px"
                    objectFit="cover"
                  />
                </Card>

                <Box sx={{ display: "flex", flexDirection: "row" }}>
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      width: "100%",
                      ml: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <img
                        src={languageimg}
                        alt="language image"
                        width="15px"
                      />
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#67696C",
                          fontWeight: "600",
                        }}
                      >
                        {item?.subjectName}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{ fontSize: "15px", fontWeight: 600, mt: 1 }}
                    >
                      {item?.title}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "12px", mt: 1, mb: 1, color: "#67696C" }}
                    >
                      By{" "}
                      {item?.teachers
                        ?.map((teacher, index) => teacher?.teacherName)
                        .filter(Boolean)
                        .join(", ")}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <img src={calender} alt="calender" width="15px" />
                        <Typography sx={{ color: "#67696C", fontSize: "12px" }}>
                          {moment(item?.startedBy)?.format("DD MMMM, YYYY")}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          ml: 6,
                        }}
                      >
                        <img src={clock} alt="calender" width="15px" />
                        <Typography sx={{ color: "#67696C", fontSize: "12px" }}>
                          {moment(item?.startedBy).format("h:mm A")}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Button
                    onClick={() => freeLiveVideo(item)}
                    sx={{
                      width: "140px",
                      background: "linear-gradient(to right, #F37B36, #FDD83F)",
                      color: "#fff",
                    }}
                  >
                    Watch Now
                  </Button>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Slider>
    </>
  );
}
