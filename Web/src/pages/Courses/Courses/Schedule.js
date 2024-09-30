import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import Typography from "@mui/material/Typography";
import moment from "moment";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { LazyLoadImage } from "react-lazy-load-image-component";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  getAllEventByStudentIdAsync,
  getAllSchedulesAsync,
} from "../../../redux/async.api";
import CustomComponentLoader from "../../../components/CustomComponentLoader";
import CustomComponentLoaderBox from "components/CustomComponentLoaderBox/CustomComponentLoaderBox";
import Container from "@mui/material/Container";
import teacher from "../../../assets/images/teacher.png";

function Schedule() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { studentById = {} } = useSelector((state) => state?.student);
  const { getAllEvent, getAllEventLoader } = useSelector(
    (state) => state?.live
  );
  const { getAllSchedule, getAllScheduleLoader } = useSelector(
    (state) => state?.live
  );

  useEffect(() => {
    // dispatch(
    //   getAllEventByStudentIdAsync({
    //     date: "",
    //     day: "all",
    //     batchTypeId: studentById?.batchTypeId,
    //   })
    // );
    dispatch(getAllSchedulesAsync({}));
  }, []);

  const videoHandler = (videoData) => {};

  const hexToRgba = (hex, opacity) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${opacity})`;
  };

  function getTotalMinutes(timeString) {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + seconds / 60;
    return totalMinutes;
  }

  return (
    <Container>
      {getAllScheduleLoader ? (
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
        <Grid container spacing={3}>
          {getAllScheduleLoader ? (
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
              {Object.keys(getAllSchedule)?.length > 0 ? (
                Object.keys(getAllSchedule)?.map((key) => {
                  const dateTimeString = key;
                  const momentObj = moment(dateTimeString);
                  const formattedDate = momentObj.format("DD MMM, yyyy");
                  return (
                    <>
                      <Grid
                        item
                        xs={12}
                        sx={{ display: "flex", alignItems: "center", mt: 6 }}
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
                      {getAllSchedule[key]?.length > 0 &&
                        getAllSchedule[key]?.map((item) => {
                          return (
                            <Grid item xs={12} sm={6} key={item?.id}>
                              <Card
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  overflow: "hidden",
                                  cursor: "pointer",
                                  mt: "30px",
                                  flexDirection: "column",
                                  justifyContent: "space-around",
                                  transition: "background-color 0.8s",
                                  borderRadius: "8px",
                                  backgroundColor: hexToRgba(item?.status, 0.1),
                                }}
                                onClick={() => videoHandler(item)}
                              >
                                <Box
                                  sx={{
                                    width: "100%",
                                    height: "6px",
                                    backgroundColor: "red",
                                  }}
                                ></Box>

                                <Box sx={{ p: "15px" }}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Button
                                      sx={{
                                        backgroundColor: item?.status,
                                        color: "#fff",
                                        "&:hover": {
                                          backgroundColor: item?.status,
                                        },
                                        fontSize: "12px",
                                        padding: "3px 12px",
                                      }}
                                    >
                                      {item?.type}
                                    </Button>
                                    <Typography>
                                      {moment(item?.startedBy).format("h:mm A")}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    sx={{
                                      mt: 3,
                                      mb: 3,
                                      fontSize: "16px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {item?.title}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        color: "#67696C",
                                        fontSize: "15px",
                                      }}
                                    >
                                      {/*getTotalMinutes(item?.time) */}
                                      Class — {item?.class}
                                    </Typography>

                                    <Box
                                      sx={{
                                        display: "flex",
                                        gap: 1,
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          color: "#67696C",
                                          fontSize: "15px",
                                        }}
                                      >
                                        By {item?.teacherName}
                                      </Typography>
                                      <img
                                        src={teacher}
                                        alt="teacher icon"
                                        width="18px"
                                        height="18px"
                                      />
                                    </Box>
                                  </Box>
                                </Box>
                              </Card>
                            </Grid>
                          );
                        })}
                    </>
                  );
                })
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    mt: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                    There's no class today!
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Grid>
      )}
    </Container>
  );
}

export default Schedule;
