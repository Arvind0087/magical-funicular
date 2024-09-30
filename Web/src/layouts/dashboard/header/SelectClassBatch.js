import { Helmet } from "react-helmet-async";
import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import { useLocation } from "react-router";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import "./AccountStyle.css";
import { CustomToggleButton } from "../../../components/CustomComponents/Button2";
import { useDispatch, useSelector } from "react-redux";
import {
  getBatchByCourseBoardClassAsync,
  getBatchDateByBatchTypeIdAsync,
  getBatchDateByBatchTypeIdForWebAppAsync,
  getBatchTypeByClassIdForWebAppAsync,
  getBoardsByCourseIdAsync,
  getBoardsByCourseIdForWebAppAsync,
  getClassByBoardIdAsync,
  getBatchsByLanguageForWebAppAsync,
  getClassByBoardIdForWebAppAsync,
} from "../../../redux/async.api";
import moment from "moment";
import { Form, Formik } from "formik";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CustomComponentLoader from "../../../components/CustomComponentLoader/CustomComponentLoader";
import { showHiddenSection } from "../../../redux/slices/completeProfileSlice";
import { PATH_AUTH } from "../../../routes/paths";
import Classroom from "../../../assets/images/classroom.png";
import LanguageImage from "../../../assets/images/language.png";
import EnglishImage from "../../../assets/images/englishicon.png";
import { switchProductAsync } from "../../../redux/loggedInInfo/loggedIn.async";
import { setDeviceToken } from "../../../redux/slices/notification.slice";
import { reduxSetUserLoggedInInfo } from "../../../redux/loggedInInfo/loggedIn.slice";
import { getStudentByIdAsync } from "../../../redux/async.api";
import { useNavigate } from "react-router";

export default function SelectClassBatch({ activeCourse, setCourseDialog }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const systemToken = useSelector((state) => state?.notification?.deviceToken);
  const [showButton, setShowButton] = useState(false);
  const [getBoardId, setGetBoardId] = useState("");
  const [getStartDate, setGetStartDate] = useState("");
  const [getClassId, setGetClassId] = useState("");
  const [getBatchType, setGetBatchType] = useState({});
  const [selectBatch, setSelectBatch] = useState({});

  const {
    allBoard,
    boardLoader,
    allClass,
    classLoader,
    classSelectHidden,
    batchTypeHidden,
    batchStartDateHidden,
    batchTypeSelect,
    submitButtonHidden,
    allBatchType,
    batchTypeLoader,
    allBatchDate,
    batchDateLoader,
    batchLoader,
    getAllBatch,
  } = useSelector((state) => state.completeProfile);

  const dispatch = useDispatch();
  const location = useLocation();

  let board = allBoard?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  let classes = allClass?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  let batches = allBatchType?.map((item) => ({
    value: item.id,
    label: item.language,
  }));

  let date = getAllBatch?.map((item) => ({
    value: item.id,
    label: item?.batchName
      ? item?.batchName
      : moment(new Date(item.date)).format("DD/MM/YYYY"),
  }));

  useEffect(() => {
    if (location?.pathname === PATH_AUTH.createAccount) {
      dispatch(getBoardsByCourseIdAsync({ courseId: activeCourse?.id }));
    } else {
      dispatch(
        getBoardsByCourseIdForWebAppAsync({ courseId: activeCourse?.id })
      );
    }
  }, [activeCourse?.id]);

  useEffect(() => {
    if (allBoard[0]?.id) {
      dispatch(showHiddenSection({ hiddentype: "boardSelect" }));
    }
  }, [allBoard[0]?.id]);

  useEffect(() => {
    if (allBoard[0]?.id) {
      setGetBoardId(allBoard[0]?.id);
      dispatch(
        getClassByBoardIdAsync({
          courseId: activeCourse?.id,
          boardId: allBoard[0]?.id,
        })
      );
    }
  }, [allBoard[0]?.id]);

  // const handleClassSelect = (value) => {
  //   if (location?.pathname === PATH_AUTH.createAccount) {
  //     dispatch(
  //       getBatchByCourseBoardClassAsync({
  //         courseId: activeCourse?.id,
  //         boardId: allBoard[0]?.id,
  //         classId: value,
  //       })
  //     );
  //   } else {
  //     dispatch(
  //       getBatchTypeByClassIdForWebAppAsync({
  //         courseId: activeCourse?.id,
  //         boardId: allBoard[0]?.id,
  //         classId: value,
  //       })
  //     );
  //   }
  //   dispatch(showHiddenSection({ hiddentype: "classSelect" }));
  // };

  useEffect(() => {
    if (getClassId) {
      dispatch(
        getBatchTypeByClassIdForWebAppAsync({
          courseId: activeCourse?.id,
          boardId: allBoard[0]?.id,
          classId: getClassId,
        })
      );
    }
  }, [getClassId]);

  const handleBatchTypeSelect = (value) => {
    setGetBatchType(value);

    dispatch(
      getBatchsByLanguageForWebAppAsync({
        courseId: activeCourse?.id,
        boardId: allBoard[0]?.id,
        classId: getClassId,
        language: value.label,
      })
    );

    if (activeCourse?.id == 7 && date?.length > 0) {
      setSelectBatch(date[0]);
    }

    dispatch(showHiddenSection({ hiddentype: "batchTypeSelect" }));
  };

  const handleshowSubmit = (item) => {
    setSelectBatch(item);

    // dispatch(showHiddenSection({ hiddentype: "batchStartDateHidden" }));
  };

  useEffect(() => {
    if (activeCourse?.id !== 1 && activeCourse?.id !== 7 && classes[0]?.value) {
      dispatch(
        getBatchTypeByClassIdForWebAppAsync({
          courseId: activeCourse?.id,
          boardId: allBoard[0]?.id,
          classId: classes[0]?.value,
        })
      );
      setGetClassId(classes[0]?.value);
    }
  }, [classes[0]?.value]);

  useEffect(() => {
    if (allBatchDate[0]?.id) {
      setGetStartDate(allBatchDate[0]?.id);
    }
  }, [allBatchDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      deviceType: "web",
      deviceToken: systemToken,
      batchId: selectBatch?.value,
    };
    dispatch(switchProductAsync(payload)).then((res) => {
      if (res?.payload?.status == 200) {
        dispatch(setDeviceToken(res?.payload?.data?.accessToken));
        localStorage.setItem(
          "auth",
          JSON.stringify({
            accessToken: res?.payload?.data?.accessToken,
            userId: res?.payload?.data?.id,
          })
        );
        dispatch(
          reduxSetUserLoggedInInfo({
            accessToken: res?.payload?.data?.accessToken,
            userId: res?.payload?.data?.id,
            loginStatus: res?.payload?.data?.loginStatus,
          })
        );
        const studentPayload = {
          batchTypeId: selectBatch?.value,
          userId: res?.payload?.data?.id,
        };
        dispatch(getStudentByIdAsync(studentPayload));
        navigate("/app/dashboard");
        setCourseDialog(false);
      }
    });
  };

  return (
    <>
      <Card
        sx={{
          mt: 1,
          p: 3,
          pt: 0,
          height: "70vh",
          [theme.breakpoints.down("md")]: {
            p: 0,
          },
        }}
      >
        <Box sx={{ pt: 0, width: "100%", height: "100%", overflowY: "auto" }}>
          <Grid
            item
            xs={12}
            sx={{
              width: "100%",
              padding: "20px",
              [theme.breakpoints.down("md")]: {
                padding: "0px",
              },
            }}
          >
            {activeCourse?.id == 1 || activeCourse?.id == 7 ? (
              !classSelectHidden ? (
                classLoader ? (
                  <CustomComponentLoader padding="0" size={20} />
                ) : (
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="h4"
                      component="h4"
                      sx={{ ml: 1, mb: 1 }}
                    >
                      Select your Class
                    </Typography>
                    <ToggleButtonGroup sx={{ border: "none" }} color="primary">
                      <Box
                        rowGap={3}
                        columnGap={3}
                        display="grid"
                        gridTemplateColumns={{
                          xs: "repeat(4, 1fr)",
                          sm: "repeat(6, 1fr)",
                          md: "repeat(6, 1fr)",
                        }}
                      >
                        {classes?.length > 0 &&
                          classes?.map((item, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                backgroundColor:
                                  getClassId == item?.value ? "#f0f0f0" : "",
                                borderRadius: "10px",
                                pl: "15px",
                                pr: "15px",
                                border: "1px solid #ccc",
                                boxShadow:
                                  "0px 2px 10px 0px rgba(0, 0, 0, 0.25)",
                              }}
                              onClick={() => setGetClassId(item.value)}
                            >
                              <img
                                src={Classroom}
                                alt="classroom"
                                width="41px"
                                height="48px"
                              />
                              <Typography>{item?.label}</Typography>
                            </Box>
                          ))}
                      </Box>
                    </ToggleButtonGroup>
                  </Box>
                )
              ) : null
            ) : null}

            {activeCourse.id !== 1 && activeCourse.id !== 7 ? (
              batchTypeLoader ? (
                <CustomComponentLoader padding="0" size={20} />
              ) : (
                <Box sx={{ mb: 1 }}>
                  {batches?.length > 0 && (
                    <Typography
                      variant="h4"
                      component="h4"
                      sx={{ ml: 1, mb: 1 }}
                    >
                      Select your Language
                    </Typography>
                  )}
                  <ToggleButtonGroup sx={{ border: "none" }} color="primary">
                    <Box
                      rowGap={3}
                      columnGap={3}
                      display="grid"
                      gridTemplateColumns={{
                        xs: "repeat(4, 1fr)",
                        sm: "repeat(6, 1fr)",
                        md: "repeat(8, 1fr)",
                      }}
                    >
                      {batches?.length > 0 &&
                        batches?.map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              cursor: "pointer",
                              backgroundColor:
                                getBatchType?.value == item?.value
                                  ? "#f0f0f0"
                                  : "",
                              borderRadius: "10px",
                              p: "5px 10px",
                              boxShadow: "0px 2px 10px 0px rgba(0, 0, 0, 0.25)",
                              minWidth: "80px",
                            }}
                            onClick={() => handleBatchTypeSelect(item)}
                          >
                            {item?.label == "English" ? (
                              <img
                                src={EnglishImage}
                                alt="EnglishImage"
                                width="44px"
                                height="42px"
                              />
                            ) : (
                              <img
                                src={LanguageImage}
                                alt="LanguageImage"
                                width="44px"
                                height="42px"
                              />
                            )}
                            <Typography sx={{ mt: "5px", textAlign: "center" }}>
                              {item?.label}
                            </Typography>
                          </Box>
                        ))}
                    </Box>
                  </ToggleButtonGroup>
                </Box>
              )
            ) : batchTypeLoader ? (
              <CustomComponentLoader padding="0" size={20} />
            ) : (
              getClassId !== "" && (
                <Box sx={{ mb: 1 }}>
                  {batches?.length > 0 && (
                    <Typography
                      variant="h4"
                      component="h4"
                      sx={{ ml: 1, mb: 1 }}
                    >
                      Select your Language
                    </Typography>
                  )}
                  <ToggleButtonGroup sx={{ border: "none" }} color="primary">
                    <Box
                      rowGap={3}
                      columnGap={3}
                      display="grid"
                      gridTemplateColumns={{
                        xs: "repeat(4, 1fr)",
                        sm: "repeat(6, 1fr)",
                        md: "repeat(8, 1fr)",
                      }}
                    >
                      {batches?.length > 0 &&
                        batches?.map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              cursor: "pointer",
                              backgroundColor:
                                getBatchType?.value == item?.value
                                  ? "#f0f0f0"
                                  : "",
                              borderRadius: "10px",
                              p: "5px 10px",
                              boxShadow: "0px 2px 10px 0px rgba(0, 0, 0, 0.25)",
                            }}
                            onClick={() => handleBatchTypeSelect(item)}
                          >
                            {item?.label == "English" ? (
                              <img
                                src={EnglishImage}
                                alt="EnglishImage"
                                width="44px"
                                height="42px"
                              />
                            ) : (
                              <img
                                src={LanguageImage}
                                alt="LanguageImage"
                                width="44px"
                                height="42px"
                              />
                            )}
                            <Typography sx={{ mt: "5px" }}>
                              {item?.label}
                            </Typography>
                          </Box>
                        ))}
                    </Box>
                  </ToggleButtonGroup>
                </Box>
              )
            )}

            {activeCourse?.id !== 7 &&
              date?.length > 0 &&
              Object.keys(getBatchType).length > 0 && (
                <Box sx={{ mb: 1 }}>
                  {date?.length > 0 && (
                    <Typography
                      variant="h4"
                      component="h4"
                      sx={{ ml: 1, mb: 1 }}
                    >
                      Select Batch
                    </Typography>
                  )}
                  <ToggleButtonGroup sx={{ border: "none" }} color="primary">
                    <Box
                      rowGap={3}
                      columnGap={3}
                      display="grid"
                      gridTemplateColumns={{
                        xs: "repeat(4, 1fr)",
                        sm: "repeat(6, 1fr)",
                        md: "repeat(8, 1fr)",
                      }}
                    >
                      {date?.length > 0 &&
                        date?.map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              cursor: "pointer",
                              backgroundColor:
                                selectBatch?.value == item?.value
                                  ? "#f0f0f0"
                                  : "",
                              borderRadius: "10px",
                              p: "5px 10px",
                              boxShadow: "0px 2px 10px 0px rgba(0, 0, 0, 0.25)",
                              minWidth: "90px",
                            }}
                            onClick={() => handleshowSubmit(item)}
                          >
                            <img
                              src={LanguageImage}
                              alt="LanguageImage"
                              width="44px"
                              height="42px"
                            />
                            <Typography sx={{ mt: "5px", textAlign: "center" }}>
                              {item?.label}
                            </Typography>
                          </Box>
                        ))}
                    </Box>
                  </ToggleButtonGroup>
                </Box>
              )}

            {Object.keys(getBatchType).length > 0 &&
              Object.keys(selectBatch).length > 0 && (
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    onClick={handleSubmit}
                    sx={{
                      width: "50%",
                      display: "flex",
                      borderRadius: "42px",
                      justifyContent: "center",
                      height: "44px",
                      alignItems: "center",
                      marginTop: "30px",
                      color: "#ffff",
                      [theme.breakpoints.down("sm")]: {
                        width: "100%",
                      },
                    }}
                    variant="contained"
                  >
                    Submit
                  </Button>
                </Grid>
              )}
          </Grid>
        </Box>
      </Card>
    </>
  );
}
