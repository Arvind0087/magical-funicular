import {
  FormControl,
  Grid,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { Box, Container, Stack } from "@mui/system";
import React, { useState } from "react";
import CustomComponentLoader from "components/CustomComponentLoader";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { UploadAvatar } from "components/upload";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { _initialValues, _validation } from "./utils";
import { useParams } from "react-router";
import "../student.css";
import { GenerateBase64 } from "utils/convertToBase64";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import moment from "moment/moment";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import {
  getBatchByCourseBoardClassAsync,
  getBoardsByCourseIdAsync,
  getClassByBoardAndCourseIdAsync,
  createStudentAsync,
  getstudentbyidAsync,
  updateStudentByIdAsync,
} from "redux/async.api";
import { getcourseAsync } from "redux/course/course.async";
import { getBatchDateByBatchTypeIdAsync } from "redux/batchdate/batchdate.async";

function BasicDetail({ studentInfo, studentid }) {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { studentLoader, studentById } = useSelector((state) => state.student);
  const { boardLoader, boardByCourse } = useSelector((state) => state.board);
  const { courseLoader, course } = useSelector((state) => state.course);
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const { classLoader, classbycourseboard } = useSelector(
    (state) => state.class
  );
  const { batchLoader, batchByCourseBoardClass } = useSelector(
    (state) => state.batch
  );
  const { batchdateLoader, getBatchDateByBatchTypeId } = useSelector(
    (state) => state.batchdate
  );

  const getCourseAsync = () => {
    dispatch(
      getcourseAsync({
        page: "",
        limit: "",
      })
    );
  };

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    if (file) {
      formik.setFieldValue("avatar", [newFile]);
    }
  };

  const onSubmit = async (values) => {
    const imageBase64 = await GenerateBase64(values.avatar[0]);

    const birthdateMoment = moment(values.dob);
    const currentDateMoment = moment();
    const ageInYears = currentDateMoment.diff(birthdateMoment, "years");

    if (values.phone.toString().length !== 10) {
      toast.error("Phone number should be 10 digits");
      toastoptions;

      return;
    }
    if (values.pincode.toString().length !== 6) {
      toast.error("Pin code should be 6 digit");
      toastoptions;
      return;
    }

    if (values.mPin.toString().length !== 4) {
      toast.error("M-Pin  should be 4 digit");
      toastoptions;
      return;
    }

    if (ageInYears < 9) {
      toast.error(
        "You must be at least 9 years old to register.",
        toastoptions
      );
      return;
    }

    let payload = {
      avatar: imageBase64,
      id: id,
      gender: values.gender,
      courseId: values.courseId,
      boardId: values.boardId,
      classId: values.classId,
      batchTypeId: values.batchTypeId,
      name: values.name,
      dob: values.dob,
      pincode: values.pincode.toString(),
      mPin: values.mPin.toString(),
      phone: values.phone.toString(),
      batchStartDateId: values.batchStartDateId,
      email: values.email,
    };

    if (id) {
      delete payload.phone;
      delete payload.mPin;
      dispatch(updateStudentByIdAsync(payload));
    } else {
      dispatch(createStudentAsync(payload));
    }
  };

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: _validation,
  });

  const randomDate = new Date(formik.values.dob);
  const today = new Date();
  const yearCount = today.getFullYear() - randomDate.getFullYear();
  useEffect(() => {
    getCourseAsync();
  }, []);

  useEffect(() => {
    if (formik.values.courseId) {
      dispatch(
        getBoardsByCourseIdAsync({
          courseId: formik.values.courseId,
        })
      );
    }
  }, [formik.values.courseId]);

  useEffect(() => {
    if (formik.values.boardId) {
      dispatch(
        getClassByBoardAndCourseIdAsync({
          courseId: formik.values.courseId,
          boardId: formik.values.boardId,
        })
      );
    }
  }, [formik.values.boardId]);

  useEffect(() => {
    if (formik.values.classId) {
      dispatch(
        getBatchByCourseBoardClassAsync({
          courseId: formik.values.courseId,
          boardId: formik.values.boardId,
          classId: formik.values.classId,
        })
      );
    }
  }, [formik.values.classId]);
  useEffect(() => {
    if (formik.values.batchTypeId) {
      dispatch(
        getBatchDateByBatchTypeIdAsync({
          courseId: formik.values.courseId,
          boardId: formik.values.boardId,
          classId: formik.values.classId,
          batchTypeId: formik.values.batchTypeId,
        })
      );
    }
  }, [formik.values.batchTypeId]);

  useEffect(() => {
    if (id) {
      const payload = {
        userId: id,
        batchTypeId: "",
      };
      dispatch(getstudentbyidAsync(payload));
    }
  }, [id]);

  useEffect(() => {
    if (id && studentById) {
      formik.setFieldValue("avatar", [studentById.avatar]);
      formik.setFieldValue("gender", studentById.gender);
      formik.setFieldValue("courseId", studentById.courseId);
      formik.setFieldValue("boardId", studentById.boardId);
      formik.setFieldValue("classId", studentById.classId);
      formik.setFieldValue("batchTypeId", studentById.batchTypeId);
      formik.setFieldValue("name", studentById.name);
      formik.setFieldValue("dob", moment(studentById.dob).format("YYYY-MM-DD"));
      formik.setFieldValue("pincode", studentById.pincode);
      formik.setFieldValue("phone", studentById.phone);
      formik.setFieldValue("batchStartDateId", studentById.batchStartDateId);
      formik.setFieldValue("mPin", "null");
      formik.setFieldValue("email", studentById.email);
    }
  }, [id, studentById]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Student Manager | {`${tabTitle}`}</title>
      </Helmet>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 2 }}>
              <UploadAvatar
                name="avatar"
                accept={{
                  "image/*": [],
                }}
                file={formik.values.avatar[0]}
                error={Boolean(formik.touched.avatar && formik.errors.avatar)}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: "auto",
                      display: "block",
                      textAlign: "center",
                      color:
                        formik.touched.avatar && formik.errors.avatar
                          ? "red"
                          : "text.secondary",
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of
                  </Typography>
                }
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={9}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              }}
            >
              <FormControl
                fullWidth
                disabled={courseLoader}
                error={Boolean(
                  formik.touched.courseId && formik.errors.courseId
                )}
              >
                <InputLabel>
                  {courseLoader ? (
                    <CustomComponentLoader padding="0 0" size={20} />
                  ) : (
                    "Courses"
                  )}
                </InputLabel>
                <Select
                  label="Course"
                  name="courseId"
                  {...formik.getFieldProps("courseId")}
                  onChange={formik.handleChange}
                >
                  <MenuItem defaultValue value="">
                    Select Course
                  </MenuItem>
                  {course?.data?.map((ev, index) => {
                    return (
                      <MenuItem value={ev.id} key={ev.index}>
                        {ev.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                disabled={boardLoader}
                error={Boolean(formik.touched.boardId && formik.errors.boardId)}
              >
                <InputLabel>
                  {boardLoader ? (
                    <CustomComponentLoader padding="0 0" size={20} />
                  ) : (
                    "Boards"
                  )}
                </InputLabel>
                <Select
                  label="Boards"
                  name="boardId"
                  {...formik.getFieldProps("boardId")}
                  onChange={formik.handleChange}
                >
                  <MenuItem defaultValue value="">
                    Select Board
                  </MenuItem>
                  {boardByCourse?.map((ev, index) => {
                    return (
                      <MenuItem value={ev.id} key={ev.index}>
                        {ev.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                disabled={classLoader}
                error={Boolean(formik.touched.classId && formik.errors.classId)}
              >
                <InputLabel>
                  {classLoader ? (
                    <CustomComponentLoader padding="0 0" size={20} />
                  ) : (
                    "Classes"
                  )}
                </InputLabel>
                <Select
                  label="Classes"
                  name="classId"
                  {...formik.getFieldProps("classId")}
                  onChange={formik.handleChange}
                >
                  <MenuItem defaultValue value="">
                    Select Class
                  </MenuItem>
                  {classbycourseboard?.map((ev, index) => {
                    return (
                      <MenuItem value={ev.id} key={ev.index}>
                        {ev.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                disabled={batchLoader}
                error={Boolean(
                  formik.touched.batchTypeId && formik.errors.batchTypeId
                )}
              >
                <InputLabel>
                  {batchLoader ? (
                    <CustomComponentLoader padding="0 0" size={20} />
                  ) : (
                    "Batches"
                  )}
                </InputLabel>
                <Select
                  label="Batch Name"
                  name="batchTypeId"
                  {...formik.getFieldProps("batchTypeId")}
                  onChange={formik.handleChange}
                >
                  <MenuItem defaultValue value="">
                    Select Batch
                  </MenuItem>
                  {batchByCourseBoardClass?.map((ev, index) => {
                    return (
                      <MenuItem value={ev.id} key={ev.index}>
                        {ev.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                disabled={batchdateLoader}
                error={
                  formik.touched.batchStartDateId &&
                  formik.errors.batchStartDateId
                }
              >
                <InputLabel id="demo-simple-select-label">
                  {batchdateLoader ? (
                    <CustomComponentLoader padding="0 0" size={20} />
                  ) : (
                    "Batch Start Date"
                  )}
                </InputLabel>
                <Select
                  label="Batch Start Date"
                  name="batchStartDateId"
                  {...formik.getFieldProps("batchStartDateId")}
                  onChange={formik.handleChange}
                >
                  <MenuItem defaultValue value="">
                    Select Date
                  </MenuItem>
                  {getBatchDateByBatchTypeId?.data?.map((ev, index) => {
                    return (
                      <MenuItem value={ev.id} key={ev.index}>
                        {moment(ev.date).format("DD MMMM YYYY")}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  name="name"
                  label={
                    studentLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      " Student Name"
                    )
                  }
                  {...formik.getFieldProps("name")}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.name && formik.errors.name)}
                />
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  type="date"
                  name="dob"
                  label="Date of Birth"
                  style={{ color: id ? "white !important" : null }}
                  fullWidth
                  inputProps={{
                    max: new Date().toISOString().split("T")[0],
                  }}
                  {...formik.getFieldProps("dob")}
                  onChange={formik.handleChange}
                  error={formik.touched.dob && formik.errors.dob}
                />
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  name="email"
                  disabled={Boolean(id) && studentById?.email}
                  label={
                    studentLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "Email"
                    )
                  }
                  {...formik.getFieldProps("email")}
                  onChange={formik.handleChange}
                  error={formik.touched.email && formik.errors.email}
                />
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select Gender
                </InputLabel>
                <Select
                  label="Select Gender Type"
                  name="gender"
                  {...formik.getFieldProps("gender")}
                  onChange={(e) =>
                    formik.setFieldValue("gender", e.target.value)
                  }
                  error={Boolean(formik.touched.gender && formik.errors.gender)}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  name="phone"
                  type="number"
                  minLength={10}
                  // inputProps={{ minLength: 10 }}
                  inputProps={{ maxLength: 10 }}
                  disabled={Boolean(id) && studentById?.phone}
                  label={
                    studentLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "Phone"
                    )
                  }
                  {...formik.getFieldProps("phone")}
                  onChange={(e) => {
                    if (String(e.target.value).length <= 10) {
                      formik.handleChange(e);
                    }
                  }}
                  error={Boolean(formik.touched.phone && formik.errors.phone)}
                />
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  type="number"
                  inputProps={{ maxLength: 6 }}
                  name="pincode"
                  label={
                    studentLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "Pin Code"
                    )
                  }
                  {...formik.getFieldProps("pincode")}
                  onChange={(e) => {
                    if (String(e.target.value).length <= 6) {
                      {
                        formik.handleChange(e);
                      }
                    }
                  }}
                  error={Boolean(
                    formik.touched.pincode && formik.errors.pincode
                  )}
                />
              </FormControl>

              {id ? (
                ""
              ) : (
                <FormControl fullWidth>
                  <TextField
                    name="mPin"
                    type="number"
                    label={
                      studentLoader ? (
                        <CustomComponentLoader padding="0 0" size={20} />
                      ) : (
                        "M-Pin"
                      )
                    }
                    {...formik.getFieldProps("mPin")}
                    onChange={(e) => {
                      if (String(e.target.value).length <= 4) {
                        formik.handleChange(e);
                      }
                    }}
                    error={Boolean(formik.touched.mPin && formik.errors.mPin)}
                  />
                </FormControl>
              )}
            </Box>
            {yearCount >= 9 == true ? (
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={studentLoader}
                >
                  {id ? "Update Student" : "Create Student"}
                </LoadingButton>
              </Stack>
            ) : (
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  variant="contained"
                  loading={studentLoader}
                  onClick={() =>
                    toast.error(
                      "Student account can't be created untill age is 9 years",
                      toastoptions
                    )
                  }
                >
                  {id ? "Update Student" : "Create Student"}
                </LoadingButton>
              </Stack>
            )}
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
export default BasicDetail;
