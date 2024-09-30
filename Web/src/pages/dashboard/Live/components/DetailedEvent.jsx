import React, { useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CustomComponentLoaderBox from "components/CustomComponentLoaderBox/CustomComponentLoaderBox";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { PATH_DASHBOARD } from "../../../../routes/paths";
import {
  getAllEventByStudentStatusIdAsync,
  getAllEventByStudentIdAsync,
} from "redux/async.api";
import { toast } from "react-hot-toast";
import { toastoptions } from "../../../../utils/toastoptions";
import CachedIcon from "@mui/icons-material/Cached";
import NoVideo from "../../../../assets/images/NoVideos.svg";
import "./styles.css";

const DetailedEvent = ({ packageId }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { live } = useSelector((state) => state);
  const { getAllEvent, getAllEventLoader } = live;
  const [bgcolor, setBgcolor] = useState("");
  const { id, batchTypeId } = useSelector(
    (state) => state?.student?.studentById
  );

  const dispatch = useDispatch();

  const videoHandler = (vidData) => {
    if (vidData) {
      let videoDateTime = vidData?.startedBy;
      const splitValue = videoDateTime && videoDateTime.split("T");

      const providedDate = splitValue[0];
      const providedTime = splitValue[1];
      const providedDateTime = moment(
        `${providedDate} ${providedTime}`,
        "YYYY-MM-DD HH:mm:ss"
      );
      const currentDateTime = moment();
      const yesterday = moment().subtract(1, "days").startOf("day");

      if (providedDateTime.isBefore(currentDateTime, "day")) {
        navigate(`${PATH_DASHBOARD?.event}/${vidData?.id}`, {
          state: { data: vidData, studentId: id },
        });
      } else if (providedDateTime.isAfter(currentDateTime, "day")) {
        toast.error("Please join on time!", toastoptions);
      } else if (currentDateTime.isSame(providedDateTime, "day")) {
        if (currentDateTime.isSameOrAfter(providedDateTime)) {
          navigate(`${PATH_DASHBOARD?.event}/${vidData?.id}`, {
            state: { data: vidData, studentId: id },
          });
        } else {
          toast.error("Please join on time!", toastoptions);
        }
      } else {
        toast.error("Please join on time!", toastoptions);
      }
    }
  };

  const eventHandler = (data) => {
    setBgcolor(data);
    const payload = {
      status: data,
      batchTypeId: batchTypeId,
    };
    dispatch(getAllEventByStudentStatusIdAsync(payload));
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
  };

  const resetEvents = () => {
    dispatch(
      getAllEventByStudentIdAsync({
        date: "",
        day: "all",
        batchTypeId: batchTypeId,
        packageId: packageId?.packageId ? packageId?.packageId : "",
      })
    );
    setBgcolor("");
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h5">My Events</Typography>
        <CachedIcon
          sx={{
            color: "green",
            ml: 6,
            cursor: "pointer",
            fontSize: "26px",
            "&:hover": {
              scale: "1.1",
            },
          }}
          onClick={resetEvents}
        />
      </Box>
      <Grid container sx={{ display: "flex", justifyContent: "space-around" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            [theme.breakpoints.down("md")]: {
              display: "flex",
              mt: -1,
              justifyContent: "space-between",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ml: 1,
              cursor: "pointer",
              [theme.breakpoints.down("md")]: {
                ml: 0,
              },
              padding: "10px 15px",
              borderRadius: "10px",
              backgroundColor: bgcolor == "completed" ? "wheat" : "",
            }}
            onClick={() => eventHandler("completed")}
          >
            <Box
              sx={{
                height: "20px",
                width: "20px",
                backgroundColor: "#02B27E",
                borderRadius: "50%",
                mr: 0.5,
              }}
            ></Box>
            <Typography
              sx={{
                [theme.breakpoints.down("md")]: {
                  fontSize: "12px",
                },
              }}
            >
              Completed{" "}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ml: 1,
              cursor: "pointer",
              padding: "10px 15px",
              borderRadius: "10px",
              backgroundColor: bgcolor == "missed" ? "wheat" : "",
            }}
            onClick={() => eventHandler("missed")}
          >
            <Box
              sx={{
                height: "20px",
                width: "20px",
                backgroundColor: "#E70B0B",
                borderRadius: "50%",
                mr: 0.5,
              }}
            ></Box>
            <Typography
              sx={{
                [theme.breakpoints.down("md")]: {
                  fontSize: "12px",
                },
              }}
            >
              Missed
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              backgroundColor: bgcolor == "pending" ? "wheat" : "",
              padding: "10px 15px",
              borderRadius: "10px",
            }}
            onClick={() => eventHandler("pending")}
          >
            <Box
              sx={{
                height: "20px",
                width: "20px",
                backgroundColor: "#FCAD17",
                borderRadius: "50%",
                mr: 0.5,
              }}
            ></Box>
            <Typography
              sx={{
                [theme.breakpoints.down("md")]: {
                  fontSize: "12px",
                },
              }}
            >
              Upcoming
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Grid container spacing={3}>
        {getAllEventLoader ? (
          <>
            <Box
              sx={{
                display: "block",
                justifyContent: "center",
                mt: 24,
                ml: 64,
              }}
            >
              <CustomComponentLoaderBox padding="0 0" size={40} />
            </Box>
          </>
        ) : (
          <>
            {Object.keys(getAllEvent)?.length > 0 ? (
              Object.keys(getAllEvent)?.map((key) => {
                const dateTimeString = key;
                const momentObj = moment(dateTimeString);
                const formattedDate = momentObj.format("DD MMM, yyyy");
                return (
                  <>
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", alignItems: "center", mt: 3 }}
                    >
                      <CalendarMonthIcon
                        sx={{
                          color: "primary.main",
                          height: "70px",
                          width: "70px",
                        }}
                      />
                      <Typography>
                        <b>{formattedDate}</b>
                      </Typography>
                    </Grid>

                    {getAllEvent[key]?.length > 0
                      ? getAllEvent[key]?.map((data) => {
                          return (
                            <Grid item xs={12} md={4} key={data.id}>
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
                                onClick={() => videoHandler(data)}
                              >
                                <Box sx={{ height: "214px", mb: 2 }}>
                                  <LazyLoadImage
                                    alt="live text"
                                    effect="blur"
                                    src={data?.thumbnail}
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
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: "auto",
                                      height: "auto",
                                      borderRadius: " 26px",
                                      display: "grid",
                                      placeItems: "center",
                                      // bgcolor: "primary.main",
                                      backgroundColor:
                                        data?.status == "#F26B35"
                                          ? "#eb4949"
                                          : "green",
                                      padding: "4px 15px",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        textAlign: " center",
                                        color: "#ffff",
                                      }}
                                      className={
                                        data?.status == "#F26B35"
                                          ? animationChange(
                                              data?.startedBy,
                                              data?.endBy
                                            )
                                          : ""
                                      }
                                    >
                                      {data?.status == "#F26B35" ? (
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
                                          {data.type}
                                        </>
                                      ) : (
                                        "Recorded Class"
                                      )}
                                    </Typography>
                                  </Box>
                                  <Typography sx={{ fontSize: "12px" }}>
                                    Started By:{" "}
                                    {moment(data.startedBy).format("LT")}
                                  </Typography>
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                  <Typography variant="h6">
                                    {data.title}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: "#787A8D",
                                      fontSize: "12px",
                                      mt: 2,
                                    }}
                                  >
                                    {moment.duration(data?.time).asMinutes() +
                                      " Minute"}{" "}
                                    | {data.class} | By{" "}
                                    {data?.teachers
                                      ?.map(
                                        (teacher, index) => teacher?.teacherName
                                      )
                                      .filter(Boolean)
                                      .join(", ")}
                                  </Typography>
                                </Box>
                              </Card>
                            </Grid>
                          );
                        })
                      : "No event found!"}
                  </>
                );
              })
            ) : (
              <>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 8,
                  }}
                >
                  <img src={NoVideo} alt="" width="250px" />
                  <Typography sx={{ fontWeight: 600, mt: 1 }}>
                    No Event Found!
                  </Typography>
                </Box>
              </>
            )}
          </>
        )}
      </Grid>
    </>
  );
};

export default DetailedEvent;
