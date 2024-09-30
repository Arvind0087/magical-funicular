import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import moment from "moment";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import { getAllEventByStudentIdAsync } from "../../../../redux/async.api";
import CustomComponentLoader from "../../../../components/CustomComponentLoader";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { toast } from "react-hot-toast";
import { toastoptions } from "../../../../utils/toastoptions";
import NoVideo from "../../../../assets/images/NoVideos.svg";
import "./styles.css";

const TABS = [
  {
    value: "yesterday",
    label: "Yesterday",
  },
  {
    value: "today",
    label: "Today",
  },
  {
    value: "tomorrow",
    label: "Tomorrow",
  },
  {
    value: "all",
    label: "View All",
  },
];

const MyEvent = (packageId) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { id, batchTypeId } = useSelector(
    (state) => state?.student?.studentById
  );
  const { getAllEvent, getAllEventLoader } = useSelector(
    (state) => state?.live
  );

  const [currentTab, setCurrentTab] = useState("today");
  const [date, setDate] = useState(moment().format("DD MMM,yyyy"));

  const newdate = moment(date, "DD MMM, YYYY").format("YYYY-MM-DD");

  useEffect(() => {
    dispatch(
      getAllEventByStudentIdAsync({
        date: newdate,
        day: currentTab,
        batchTypeId: batchTypeId,
        packageId: packageId?.packageId ? packageId?.packageId : "",
      })
    );
  }, [currentTab, id, batchTypeId]);

  const handleClick = (event, newValue) => {
    setCurrentTab(newValue);
    switch (newValue) {
      case "yesterday":
        setDate(moment().subtract(1, "days").format("DD MMM,yyyy"));
        break;
      case "today":
        setDate(moment().add(0, "days").format("DD MMM,yyyy"));
        break;
      case "tomorrow":
        setDate(moment().add(1, "days").format("DD MMM,yyyy"));
        break;
      case "all":
        setDate(moment().add(1, "days").format("DD MMM,yyyy"));
        break;
    }
    if (newValue == "all") {
      navigate(PATH_DASHBOARD.myevents, { state: { packageId: packageId } });
      dispatch(
        getAllEventByStudentIdAsync({
          date: "",
          day: "all",
          batchTypeId: batchTypeId,
          packageId: packageId?.packageId ? packageId?.packageId : "",
        })
      );
    }
  };

  const handleViewAll = () => {
    navigate(PATH_DASHBOARD.myevents);
    dispatch(
      getAllEventByStudentIdAsync({
        date: newdate,
        day: "all",
        batchTypeId: batchTypeId,
        packageId: packageId?.packageId ? packageId?.packageId : "",
      })
    );
  };

  const checkLiveEventStatus = (videoData) => {
    if (videoData) {
      let videoDateTime = videoData?.startedBy;
      const splitValue = videoDateTime && videoDateTime.split("T");

      const providedDate = splitValue[0];
      const providedTime = splitValue[1];
      const providedDateTime = moment(
        `${providedDate} ${providedTime}`,
        "YYYY-MM-DD HH:mm:ss"
      );
      const currentDateTime = moment();

      const yesterday = moment().subtract(1, "days").startOf("day");

      if (providedDateTime.isSame(yesterday, "day")) {
        return true;
      } else if (currentDateTime.isSame(providedDateTime, "day")) {
        if (currentDateTime.isSameOrAfter(providedDateTime)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      console.error("Invalid videoDateTime format");
    }
  };

  const videoHandler = (vidData) => {
    const checkStatus = checkLiveEventStatus(vidData);

    if (currentTab !== "tomorrow" && checkStatus === true) {
      navigate(`${PATH_DASHBOARD?.event}/${vidData?.id}`, {
        state: { data: vidData, studentId: id, packageId: packageId },
      });
    } else if (currentTab == "today" && checkStatus !== true) {
      toast.error("Please join on time!", toastoptions);
    } else {
      toast.error("Please join on time!", toastoptions);
    }
  };

  const animationChange = (val, endBy) => {
    const splitEndBy = endBy.split("T");
    const providedEndDate = splitEndBy[0];
    const providedEndTime = splitEndBy[1];
    const providedEndDateTime = moment(
      `${providedEndDate} ${providedEndTime}`,
      "YYYY-MM-DD HH:mm:ss"
    );
    const splitValue = val.split("T");
    const providedDate = splitValue[0];
    const providedTime = splitValue[1];
    const providedDateTime = moment(
      `${providedDate} ${providedTime}`,
      "YYYY-MM-DD HH:mm:ss"
    );
    const currentDateTime = moment();

    if (
      currentDateTime.isSame(providedDateTime, "day") &&
      currentDateTime.isSameOrAfter(providedDateTime) &&
      currentDateTime.isSameOrBefore(providedEndDateTime)
    ) {
      return "blink";
    }
    return "";

    // if (currentDateTime.isSame(providedDateTime, "day")) {
    //   if (currentDateTime.isSameOrAfter(providedDateTime)) {
    //     if (currentDateTime.isSameOrBefore(providedEndDateTime)) {
    //       return "blink";
    //     } else {
    //       return "";
    //     }
    //   } else {
    //     return "";
    //   }
    // } else if (currentDateTime.isAfter(providedDateTime)) {
    //   return "";
    // } else {
    //   return "";
    // }
  };

  return (
    <>
      <Card sx={{ p: 4, pt: 2 }}>
        <Grid container>
          <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
            <CalendarMonthIcon
              sx={{ color: "primary.main", height: "70px", width: "70px" }}
            />
            <Typography variant="h5">
              <b>{date}</b>
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ mt: 0 }}>
            <ToggleButtonGroup
              value={currentTab}
              exclusive
              aria-label="Select"
              sx={{ border: 0 }}
            >
              {TABS &&
                TABS.map((item, index) => (
                  <ToggleButton
                    onClick={handleClick}
                    key={index}
                    value={item.value}
                    aria-label={item.value}
                    sx={{
                      height: 29,
                      borderRadius: "60px",
                      bgcolor:
                        currentTab == item.label ? "primary.lighter" : "",
                      color: "primary.main",
                      fontWeight: "400",
                      marginRight: { xs: "0px", sm: "10px", md: "21px" },
                    }}
                  >
                    <Typography sx={{ fontSize: "12.4px" }}>
                      {item.label}
                    </Typography>
                  </ToggleButton>
                ))}
            </ToggleButtonGroup>
          </Grid>
        </Grid>

        {getAllEvent.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {getAllEventLoader ? (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    color: "primary.main",
                    mt: 10,
                    "&:hover": {
                      backgroundColor: "lightgray",
                    },
                  }}
                >
                  <CustomComponentLoader padding="0" size={50} />
                </Box>
              ) : (
                <>
                  {getAllEvent?.length > 0 ? (
                    <>
                      {getAllEvent &&
                        getAllEvent?.map((item, index) => {
                          return (
                            <>
                              <Grid item xs={12} md={4}>
                                <Card
                                  sx={{
                                    width: "100%",
                                    height: "auto",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    p: "20px 12px",
                                    mt: "30px",
                                    flexDirection: "column",
                                    justifyContent: "space-around",
                                    transition: "background-color 0.8s",
                                    "&:hover": {
                                      backgroundColor: "lightgray",
                                    },
                                  }}
                                  onClick={() => videoHandler(item)}
                                >
                                  <Box sx={{ height: "214px", mb: 2 }}>
                                    <LazyLoadImage
                                      alt="live text"
                                      effect="blur"
                                      src={item?.thumbnail}
                                      width="100%"
                                      height="100%"
                                      objectFit="cover"
                                      style={{ borderRadius: "16px" }}
                                    />
                                  </Box>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: "auto",
                                        height: "auto",
                                        borderRadius: " 26px",
                                        display: "flex",
                                        placeItems: "center",
                                        // bgcolor: "primary.lighter",
                                        backgroundColor:
                                          item?.status == "#F26B35"
                                            ? "#eb4949"
                                            : "green",
                                        padding: "0px 12px",
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: "12px",
                                          textAlign: " center",
                                          // color: "primary.main",
                                          color: "#fff",
                                          p: 0.5,
                                        }}
                                        className={animationChange(
                                          item.startedBy,
                                          item.endBy
                                        )}
                                      >
                                        {item?.status === "#F26B35" ? (
                                          <>
                                            <span
                                              style={{
                                                fontSize: "40px",
                                                verticalAlign: "middle",
                                                lineHeight: "15px",
                                              }}
                                            >
                                              •
                                            </span>{" "}
                                            {item.type}
                                          </>
                                        ) : (
                                          "Recorded Class"
                                        )}
                                      </Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: "12px" }}>
                                      Started By:{" "}
                                      {moment(item.startedBy).format("LT")}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ mt: 2 }}>
                                    <Typography variant="h6">
                                      {item?.title}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        color: "#787A8D",
                                        fontSize: "12px",
                                        mt: 2,
                                      }}
                                    >
                                      {moment.duration(item?.time).asMinutes() +
                                        " Minute"}{" "}
                                      | {item.class} | By{" "}
                                      {item?.teachers
                                        ?.map(
                                          (teacher, index) =>
                                            teacher?.teacherName
                                        )
                                        .filter(Boolean)
                                        .join(", ")}
                                    </Typography>
                                  </Box>
                                </Card>
                              </Grid>
                            </>
                          );
                        })}
                    </>
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        textAlign: "center",
                        marginTop: "80px",
                      }}
                    >
                      <Typography variant="h5">No Event Found</Typography>
                    </Box>
                  )}
                </>
              )}
            </Grid>
          </>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img src={NoVideo} alt="" width="250px" />
              <Typography sx={{ fontWeight: 600, mt: 1 }}>
                No Event Found!
              </Typography>
            </Box>
          </>
        )}
      </Card>
    </>
  );
};

export default MyEvent;
