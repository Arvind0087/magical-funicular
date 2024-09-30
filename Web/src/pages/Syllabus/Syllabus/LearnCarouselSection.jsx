import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Slider from "react-slick";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import _ from "lodash";
import { addBookmarkAsync } from "redux/bookmark/bookmark.async";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import SyllabusVideokeleton from "components/Skeletons/SyllabusVideokeleton/SyllabusVideokeleton";
import "./style.css";

export default function LearnCarouselComponet({ data, loader }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dataInfo, setdataInfo] = useState([]);
  const [resourceType, setResourceType] = useState("video");
  const { bookmarkLoader } = useSelector((state) => state.bookmark);
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
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

  const bookmarkupdate = (In) => {
    const update = _.map(dataInfo, (ev) => {
      if (In.videoId === ev.videoId) {
        return {
          ...ev,
          bookmark: !In.bookmark,
        };
      }
      return ev;
    });
    setdataInfo(update);
    dispatch(
      addBookmarkAsync({
        subjectId: In.subjectId,
        typeId: In.videoId,
        bookmarkType: "video",
        bookmark: !In.bookmark ? 1 : 0,
      })
    ).then((response) => {
      if (response?.error?.message === "Rejected") {
        const update = _.map(dataInfo, (ev) => {
          if (In.videoId === ev.videoId) {
            return {
              ...ev,
              bookmark: In.bookmark,
            };
          }
          return ev;
        });
        setdataInfo(update);
      }
    });
  };

  const openFile = (file) => {
    if (file?.resourceType === "pdf" || file?.resourceType === "image") {
      navigate(`/app/syllabus/resource/${file?.videoId}`, {
        state: {
          id: file?.id,
          url: file?.originalSource,
          resourceType: file?.resourceType,
        },
      });
    } else {
      navigate(`/app/syllabus/${file?.id}`);
    }
  };

  return (
    <>
      <Slider {...settings} className="learn-slider-container">
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
                  height: 300,
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
                  onClick={() => openFile(item)}
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
                    <Typography
                      sx={{
                        fontSize: "15px",
                        color: "primary.main",
                        fontWeight: "600",
                        mb: 1,
                      }}
                    >
                      {item?.subject}
                    </Typography>
                    <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
                      {_.truncate(item?.name, { length: 30 })}
                    </Typography>
                    <Typography sx={{ fontSize: "15px", mt: 1 }}>
                      {item?.chapterName}
                    </Typography>
                  </Box>
                  <Box>
                    {item?.bookmark ? (
                      <BookmarkIcon
                        fontSize="medium"
                        sx={{
                          color: "primary.main",
                          cursor: "pointer",
                          "&:hover": {
                            background: "primary.lighter",
                            p: "5px",
                            borderRadius: "50px",
                          },
                        }}
                        onClick={() => !bookmarkLoader && bookmarkupdate(item)}
                      />
                    ) : (
                      <BookmarkBorderIcon
                        sx={{
                          color: "primary.main",
                          cursor: "pointer",
                          "&:hover": {
                            background: "#c8facd",
                            p: "5px",
                            borderRadius: "50px",
                          },
                        }}
                        onClick={() => !bookmarkLoader && bookmarkupdate(item)}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Slider>
    </>
  );
}
