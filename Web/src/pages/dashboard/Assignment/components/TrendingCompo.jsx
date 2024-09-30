import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Slider from "react-slick";
import moment from "moment";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { PATH_DASHBOARD } from "../../../../routes/paths";

function TrendingCarouselSection(props) {
  const { getTests } = props;
  const theme = useTheme();
  const navigate = useNavigate();
  const { studentById } = useSelector((state) => state?.student);

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
          slidesToShow: getTests?.length > 1 ? 2 : getTests?.length,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
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
          initialSlide: 2,
        },
      },
    ],
  };
  const GoToReportPage = (TestId) => {
    navigate(PATH_DASHBOARD.reportSummary, {
      state: {
        userId: studentById?.id,
        testId: TestId,
        type: "my_test",
      },
    });
  };

  const goToPage = (id) => {
    navigate(`${PATH_DASHBOARD.instruction(id)}?type=my_test`);
  };
  if (!getTests) return null;
  return (
    <>
      {getTests?.length > 0 ? (
        <>
          <Slider {...settings}>
            {getTests &&
              getTests?.map((item, index) => {
                return (
                  <Box sx={{ p: 3 }} key={index}>
                    <Card
                      sx={{
                        height: 200,
                        overflow: "hidden",
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        width: getTests.length === 1 ? "50%" : "100%",
                        [theme.breakpoints.down("md")]: {
                          width: getTests.length === 1 ? "50%" : "100%",
                        },
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: "700",
                            pb: 1,
                          }}
                        >
                          {item?.title}
                        </Typography>
                        <Divider />
                        <Box
                          sx={{
                            display: "flex",
                            textAlign: "center",
                            justifyContent: "space-between",
                            mt: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "15px",
                            }}
                          >
                            Questions: {item?.questionCount}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "15px",
                            }}
                          >
                            Time:{" "}
                            {moment.duration(item?.testTime).asMinutes() +
                              " mins"}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            textAlign: "center",
                            justifyContent: "space-between",
                            mt: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "15px",
                            }}
                          >
                            Max Marks: {item?.marks}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "15px",
                              color: "primary.main",
                            }}
                          >
                            Previous Score: {item.score}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{ color: "#fff", borderRadius: "60px" }}
                          onClick={() => goToPage(item?.id)}
                        >
                          Re-attempt
                        </Button>
                        <Box onClick={() => GoToReportPage(item?.id)}>
                          <Typography variant="p" sx={{ color: "blue" }}>
                            View Analysis
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                );
              })}
          </Slider>
        </>
      ) : (
        <Box sx={{ width: "100%", textAlign: "center", marginTop: "80px" }}>
          <Typography variant="h5">No Test Found</Typography>
        </Box>
      )}
    </>
  );
}

export default TrendingCarouselSection;
