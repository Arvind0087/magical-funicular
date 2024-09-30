import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router";
import Iconify from "../../../components/iconify/Iconify";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ShareIcon from "@mui/icons-material/Share";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import Slider from "react-slick";
import { useSettingsContext } from "../../../components/settings";
import ReactHtmlParser from "react-html-parser";
import "../../stylesheet.css";
import {
  getQuestionByIdAsync,
  getRelatedQuestionsByIdAsync,
} from "redux/async.api";
import { addBookmarkAsync } from "redux/bookmark/bookmark.async";
const CarouselData = [
  {
    Question:
      "Which one of the following Directive Principles can be described as Gandhian in character",
    subject: "Physics",
    level: "Easy",
    id: 1,
  },
  {
    Question:
      "Which one of the following Directive Principles can be described as Gandhian in character",
    subject: "Physics",
    level: "Easy",
    id: 1,
  },
  {
    Question:
      "Which one of the following Directive Principles can be described as Gandhian in character",
    subject: "Physics",
    level: "Easy",
    id: 1,
  },
  {
    Question:
      "Which one of the following Directive Principles can be described as Gandhian in character",
    subject: "Physics",
    level: "Medium",
    id: 1,
  },
  {
    Question:
      "Which one of the following Directive Principles can be described as Gandhian in character",
    subject: "Physics",
    level: "Medium",
    id: 1,
  },
  {
    Question:
      "Which one of the following Directive Principles can be described as Gandhian in character",
    subject: "Physics",
    level: "Medium",
    id: 1,
  },
];

const ViewExplanation = () => {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const theme = useTheme();
  const location = useLocation();
  const [bookmarked, setBookmarked] = useState(false);
  const { state } = location;
  const { test } = useSelector((state) => state);
  const {
    getQuestionById,
    getQuestionByIdLoader,
    getRelatedQuestionsById,
    getRelatedQuestionsByIdLoader,
  } = test;
  var settings = {
    dots: true,
    color: "primary.main",
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow:
            getRelatedQuestionsById.length > 2
              ? 3
              : getRelatedQuestionsById.length,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow:
            getRelatedQuestionsById.length > 1
              ? 2
              : getRelatedQuestionsById.length,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  useEffect(() => {
    dispatch(
      getQuestionByIdAsync({
        id: state?.questionId,
      })
    );
    dispatch(
      getRelatedQuestionsByIdAsync({
        questionId: state?.questionId,
      })
    );
  }, [state?.questionId]);

  const handleBookmark = (queId) => {
    const payload = {
      typeId: queId,
      bookmarkType: "question",
      bookmark: bookmarked ? 0 : 1,
    };
    dispatch(addBookmarkAsync(payload));
    setBookmarked(!bookmarked);
  };
  return (
    <>
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Typography variant="h5">View Explanation</Typography>
        <Card sx={{ mt: 4, p: 4 }}>
          <Typography
            variant="h5"
            dangerouslySetInnerHTML={{
              __html: getQuestionById?.question,
            }}
          ></Typography>
          <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
            A.
            <Typography
              dangerouslySetInnerHTML={{
                __html: getQuestionById?.option1,
              }}
            />
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
            B.{" "}
            <Typography
              dangerouslySetInnerHTML={{
                __html: getQuestionById?.option2,
              }}
            />
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
            C.{" "}
            <Typography
              dangerouslySetInnerHTML={{
                __html: getQuestionById?.option3,
              }}
            />
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
            D.{" "}
            <Typography
              dangerouslySetInnerHTML={{
                __html: getQuestionById?.option4,
              }}
            />
          </Grid>
          <Typography sx={{ fontSize: "14px" }}>
            Difficulty level: <b>{getQuestionById?.difficultyLevel}</b>
          </Typography>
          <Box
            sx={{
              mt: "20px",
              width: "150px",
              height: "30px",
              borderRadius: " 26px",
              display: "grid",
              placeItems: "center",
              bgcolor: "primary.lighter",
            }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                textAlign: " center",
                color: "primary.main",
              }}
            >
              Correct Answer is : {getQuestionById?.answer}
            </Typography>
          </Box>
          {/* </Box> */}
        </Card>

        <Accordion sx={{ mt: 3 }}>
          <AccordionSummary
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          >
            <Typography variant="subtitle1">View Solution</Typography>
          </AccordionSummary>

          <AccordionDetails>
            {/*<Typography dangerouslySetInnerHTML={{
                            __html: getQuestionById?.explanation
                        }}></Typography> */}

            <Typography variant="h5">
              {ReactHtmlParser(getQuestionById?.explanation)}
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Typography variant="h5" sx={{ mt: 4 }}>
          Related Questions
        </Typography>

        <Slider {...settings}>
          {getRelatedQuestionsById.map((e, i) => (
            <Box sx={{ p: 3 }}>
              <Card
                sx={{
                  height: 200,
                  overflow: "hidden",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  // justifyContent: "space-between",
                  width: getRelatedQuestionsById.length === 1 ? "35%" : "100%",
                  [theme.breakpoints.down("lg")]: {
                    width: "100%",
                  },
                }}
              >
                <Box
                  sx={{ display: "flex", height: "80%", alignItems: "center" }}
                >
                  <Typography
                    sx={{
                      fontWeight: "400",
                      fontSize: "20px",
                      lineHeight: "20px",
                    }}
                  >
                    Q.
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "400",
                      fontSize: "17px",
                      lineHeight: "20px",
                      marginLeft: "4%",
                      width: "80%",
                      overflow: "hidden",
                      height: "62%",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: e?.question,
                    }}
                  ></Typography>
                  <Typography
                    sx={{
                      color: "primary.main",
                      marginLeft: "4%",
                    }}
                  >
                    <ShareIcon />
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography
                    sx={{
                      color: "primary.main",
                      width: "10%",
                    }}
                  >
                    <MenuBookIcon />
                  </Typography>
                  <Typography
                    sx={{
                      marginLeft: "2%",
                      width: "20%",
                    }}
                  >
                    {e.subject}
                  </Typography>
                  <Typography
                    sx={{
                      color: "primary.main",
                      marginLeft: "10%",
                    }}
                  >
                    <SignalCellularAltIcon />
                  </Typography>
                  <Typography
                    sx={{
                      marginLeft: "2%",
                      width: "20%",
                    }}
                  >
                    {e?.difficultyLevel}
                  </Typography>
                  <Typography
                    onClick={() => {
                      handleBookmark(e?.id);
                    }}
                    sx={{
                      color: "primary.main",
                      marginLeft: "23%",
                    }}
                  >
                    {!bookmarked ? <BookmarkBorderIcon /> : <BookmarkIcon />}
                  </Typography>
                </Box>
              </Card>
            </Box>
          ))}
        </Slider>

        <Grid
          container
          sx={{
            width: "100%",
            borderRadius: "8px",
            mt: 8,
            backgroundColor: "#EEF3FC",
            p: "25px 20px",
          }}
        >
          <Grid item xs={12} md={9}>
            {" "}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5">
                Students who viewed this found these tests helpful as well
              </Typography>
            </Box>
            <Button
              sx={{
                borderRadius: "60px",
                color: "primary.main",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "10px 0px",
                height: "44px",
                width: "15%",
                mt: 2,
                backgroundColor: "primary.lighter",
                [theme.breakpoints.down("md")]: {
                  width: "100%",
                  mt: 2,
                },
              }}
              type="submit"
              variant="contained"
            >
              Explore
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              sx={{
                borderRadius: "60px",
                color: "#ffff",
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
                padding: "10px 15px",
                height: "44px",
                width: "100%",
                mt: 3,
                backgroundColor: "primary.main",
              }}
              type="submit"
              variant="contained"
            >
              <ShareIcon />
              <Typography> Share this question</Typography>
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ViewExplanation;
