import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { isJson } from "../../../utils/isJson";
import Avatar from "@mui/material/Avatar";
import "./AccountStyle.css";

const CourseCard = (props) => {
  const { course, setActiveTab, formik } = props;
  const items = isJson(course.list) && JSON.parse(course?.list);
  const [showMore, setShowMore] = useState(false);
  const handleClick = () => {
    setShowMore(!showMore);
  };
  const itemsToShow = showMore
    ? items
    : items.length > 3
    ? items.slice(0, 3)
    : items;

  return (
    <>
      <Grid item xs={12} md={6} key={course.id} sx={{ bgcolor: "white" }}>
        <Card
          sx={{
            height: "100%",
            marginLeft: "12px",
            marginRight: "12px",
            cursor: "pointer",
          }}
          onClick={() => {
            setActiveTab({
              activeIndex: 2,
              activeTitle: "Basic Details",
              activeProgress: 25,
            });
            formik.setFieldValue("courseId", course?.id);
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box sx={{ width: "25%", padding: "10px" }}>
              <Avatar
                alt="avatar"
                src={course?.image}
                sx={{ width: 60, height: 60 }}
              />
            </Box>
            <Box
              sx={{
                width: "80%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <Typography variant="h6" component="h6">
                {course?.name}
              </Typography>
              <Typography
                dangerouslySetInnerHTML={{
                  __html: course?.shortDescription,
                }}
              ></Typography>
            </Box>
          </Box>

          {/*<CardHeader
            avatar={
              <img
                src={course?.image}
                style={{ height: "60px", width: "60px" }}
              />
            }
            action={
              <Box
                sx={{
                  borderRadius: "50%",
                  width: "45px",
                  height: "45px",
                  bgcolor: "primary.lighter",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  color: "primary.main",
                  mt: 2,
                }}
                onClick={() => {
                  setActiveTab({
                    activeIndex: 2,
                    activeTitle: "Basic Details",
                    activeProgress: 25,
                  });
                  formik.setFieldValue("courseId", course?.id);
                }}
              >
                <ArrowForwardIosIcon />
              </Box>
            }
            subheader={course?.shortDescription}
            title={course?.name}
          />

          <CardContent sx={{ pb: "0", pt: "0" }}>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                component="h6"
                dangerouslySetInnerHTML={{
                  __html: course?.shortDescription,
                }}
              ></Typography>
            </Grid>
          </CardContent> */}

          {/* <CardContent sx={{ pt: 0, pl: 5, pb: 1 }}>
            <p>
              <ul style={{}}>
                {itemsToShow?.length > 0 &&
                  itemsToShow?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
              </ul>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {items?.length > 3 ? (
                  <Button
                    onClick={handleClick}
                    endIcon={
                      showMore ? (
                        <ArrowDropUpIcon sx={{ mr: "-1px !important" }} />
                      ) : (
                        <ArrowDropDownIcon />
                      )
                    }
                    variant="text"
                    sx={{ width: "130px" }}
                  >
                    {showMore ? "Show less" : "Read more"}
                  </Button>
                ) : (
                  ""
                )}
              </Box>
            </p>
          </CardContent> */}
        </Card>
      </Grid>
    </>
  );
};
export default CourseCard;
