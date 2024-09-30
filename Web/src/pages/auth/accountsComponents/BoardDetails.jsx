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
import { _initialValues } from "../utils/profileUtils";
import { CustomToggleButton } from "../../../components/CustomComponents/Button2";
import { useDispatch, useSelector } from "react-redux";
import {
  getBatchByCourseBoardClassAsync,
  getBatchDateByBatchTypeIdAsync,
  getBatchDateByBatchTypeIdForWebAppAsync,
  getBatchsByLanguageForWebAppAsync,
  getBatchTypeByClassIdForWebAppAsync,
  getBoardsByCourseIdAsync,
  getBoardsByCourseIdForWebAppAsync,
  getClassByBoardIdAsync,
  getClassByBoardIdForWebAppAsync,
} from "../../../redux/async.api";
import moment from "moment";
import CustomComponentLoader from "../../../components/CustomComponentLoader/CustomComponentLoader";
import { showHiddenSection } from "../../../redux/slices/completeProfileSlice";
import { PATH_AUTH } from "../../../routes/paths";

export default function BoardDetails(props) {
  const theme = useTheme();
  const {
    activeTab,
    setActiveTab,
    formik,
    setGetBoardId,
    setGetStartDate,
    setGetClassId,
  } = props;

  const [showButton, setShowButton] = useState(false);

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

  let board = allBoard.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  let classes = allClass.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  let batches = allBatchType.map((item) => ({
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
      dispatch(getBoardsByCourseIdAsync({ courseId: formik.values.courseId }));
    } else {
      dispatch(
        getBoardsByCourseIdForWebAppAsync({ courseId: formik.values.courseId })
      );
    }
  }, []);

  useEffect(() => {
    if (allBoard[0]?.id) {
      dispatch(showHiddenSection({ hiddentype: "boardSelect" }));
    }
  }, [allBoard[0]?.id]);

  useEffect(() => {
    if (allBoard[0]?.id) {
      setGetBoardId(allBoard[0]?.id);
      dispatch(
        getClassByBoardIdForWebAppAsync({
          courseId: formik.values.courseId,
          boardId: allBoard[0]?.id,
        })
      );
    }
  }, [allBoard[0]?.id]);

  // const handleBoardSelect = (value) => {
  //   if (location?.pathname === PATH_AUTH.createAccount) {
  //     dispatch(
  //       getClassByBoardIdAsync({
  //         courseId: formik.values.courseId,
  //         boardId: value,
  //       })
  //     );
  //   } else {
  //     dispatch(
  //       getClassByBoardIdForWebAppAsync({
  //         courseId: formik.values.courseId,
  //         boardId: value,
  //       })
  //     );
  //   }
  //   dispatch(showHiddenSection({ hiddentype: "boardSelect" }));
  // };

  const handleClassSelect = (value) => {
    if (location?.pathname === PATH_AUTH.createAccount) {
      dispatch(
        getBatchTypeByClassIdForWebAppAsync({
          courseId: formik.values.courseId,
          boardId: allBoard[0]?.id,
          classId: value,
        })
      );
    } else {
      dispatch(
        getBatchTypeByClassIdForWebAppAsync({
          courseId: formik.values.courseId,
          boardId: allBoard[0]?.id,
          classId: value,
        })
      );
    }
    dispatch(showHiddenSection({ hiddentype: "classSelect" }));
    setShowButton(false);
  };

  const handleBatchTypeSelect = (value) => {
    const currentLang = batches?.filter((item) => item?.value == value);
    if (location?.pathname === PATH_AUTH.createAccount) {
      dispatch(
        getBatchsByLanguageForWebAppAsync({
          courseId: formik.values.courseId,
          boardId: allBoard[0]?.id,
          classId: formik.values.classId
            ? formik.values.classId
            : classes[0]?.value,
          // batchTypeId: value,
          language: currentLang[0]?.label,
        })
      );
    } else {
      dispatch(
        getBatchsByLanguageForWebAppAsync({
          courseId: formik.values.courseId,
          boardId: allBoard[0]?.id,
          classId: formik.values.classId
            ? formik.values.classId
            : classes[0]?.value,
          // batchTypeId: value,
          language: currentLang[0]?.label,
        })
      );
    }

    dispatch(showHiddenSection({ hiddentype: "batchTypeSelect" }));
    if (formik.values.courseId == 7) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const handleshowSubmit = () => {
    dispatch(showHiddenSection({ hiddentype: "batchStartDateHidden" }));
    setShowButton(true);
  };

  useEffect(() => {
    if (
      formik?.values?.courseId !== 1 &&
      formik?.values?.courseId !== 7 &&
      classes[0]?.value
    ) {
      dispatch(
        getBatchTypeByClassIdForWebAppAsync({
          courseId: formik.values.courseId,
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

  return (
    <>
      <Card
        sx={{
          mt: 2,
          p: 3,
          pt: 0,
          height: "70vh",
          [theme.breakpoints.down("md")]: {
            p: 0,
          },
        }}
      >
        <Box sx={{ pt: 2, width: "100%", height: "100%", overflowY: "auto" }}>
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
            {/*boardLoader ? (
              <CustomComponentLoader padding="0" size={20} />
            ) : (
              <Box sx={{ mb: 1 }}>
                <Typography variant="h5" component="h5">
                  Select Board
                </Typography>
                <CustomToggleButton
                  sx={{ width: "300px" }}
                  formik={formik}
                  buttons={board}
                  name="boardId"
                  onChange={handleBoardSelect}
                />
              </Box>
            )*/}

            {formik?.values?.courseId == 1 || formik?.values?.courseId == 7 ? (
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
                    <CustomToggleButton
                      formik={formik}
                      buttons={classes}
                      type="class"
                      name="classId"
                      onChange={handleClassSelect}
                    />
                  </Box>
                )
              ) : null
            ) : null}

            {!batchTypeHidden ? (
              batchTypeLoader ? (
                <CustomComponentLoader padding="0" size={20} />
              ) : (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="h4" component="h4" sx={{ ml: 1, mb: 1 }}>
                    Select your Language
                  </Typography>
                  <CustomToggleButton
                    formik={formik}
                    buttons={batches}
                    name="batchTypeId"
                    onChange={handleBatchTypeSelect}
                  />
                </Box>
              )
            ) : null}

            {formik?.values?.courseId !== 1 &&
              formik?.values?.courseId !== 7 && (
                <Box sx={{ mb: 1 }}>
                  <Typography pography variant="h5" component="h5">
                    Select Your Language
                  </Typography>
                  <CustomToggleButton
                    formik={formik}
                    buttons={batches}
                    name="batchTypeId"
                    onChange={handleBatchTypeSelect}
                  />
                </Box>
              )}

            {(!batchStartDateHidden && formik?.values?.courseId == 1) ||
            (!batchStartDateHidden && formik?.values?.courseId == 2) ? (
              batchDateLoader ? (
                <CustomComponentLoader padding="0" size={20} />
              ) : (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="h5" component="h5">
                    Select Batch
                  </Typography>
                  <CustomToggleButton
                    formik={formik}
                    buttons={date}
                    name="batchStartDateId"
                    onChange={handleshowSubmit}
                  />
                </Box>
              )
            ) : null}

            {!submitButtonHidden && formik?.values?.courseId !== 7 ? (
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  type="submit"
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
            ) : null}

            {formik?.values?.courseId == 7 && showButton ? (
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  type="submit"
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
            ) : null}
          </Grid>
        </Box>
      </Card>
    </>
  );
}
