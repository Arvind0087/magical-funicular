import { Helmet } from "react-helmet-async";
import React, { useEffect } from "react";
import {
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { _initial, _validate, langData } from "./utils";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { useNavigate, useParams } from "react-router";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { getcourseAsync } from "redux/course/course.async";
import {
  createbatchTypesAsync,
  getBatchTypeByIdAsync,
  updatedBatchTypeByIdAsync,
} from "redux/batchtype/batchtype.async";
import { getBatchLanguageByClassIdAsync } from "redux/language/language.async";
// import { emptybatch } from "redux/batchtype/batchtype.slice";
import { getBoardsByCourseIdAsync } from "redux/board/board.async";
import { getClassByBoardAndCourseIdAsync } from "redux/class/class.async";
import { emptybatch } from "redux/batchtype/batchtype.slice";
import { PATH_DASHBOARD } from "routes/paths";

function AddBatches() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader, boardByCourse } = useSelector((state) => state.board);
  const { batchLoader, batchadd, batchById, batchupdate } = useSelector(
    (state) => state.batch
  );
  const { classLoader, classbycourseboard } = useSelector(
    (state) => state.class
  );
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );
  const { langClassLoader, getLanByClass } = useSelector(
    (state) => state?.language
  );

  const getCourseAsync = () => {
    dispatch(
      getcourseAsync({
        page: "",
        limit: "",
      })
    );
  };

  const onSubmit = (values) => {
    const payload = {
      batchTypeId: id,
      courseId: values.courseId,
      boardId: values.boardId,
      classId: values.classId,
      name: values.name,
      language: values.batchLang,
      startDate: values.startDate,
      endDate: values.endDate,
    };
    if (id) {
      dispatch(updatedBatchTypeByIdAsync(payload));
    } else {
      delete payload.batchTypeId;
      dispatch(createbatchTypesAsync(payload));
    }
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate,
  });

  useEffect(() => {
    if (formik.values.classId) {
      dispatch(getBatchLanguageByClassIdAsync(formik.values.classId));
    }
  }, [formik.values.classId]);

  useEffect(() => {
    getCourseAsync();
  }, []);

  useEffect(() => {
    if (id) dispatch(getBatchTypeByIdAsync(id));
  }, [id]);

  useEffect(() => {
    if (id && batchById) {
      formik.setFieldValue("courseId", batchById.courseId);
      formik.setFieldValue("boardId", batchById.boardId);
      formik.setFieldValue("classId", batchById.classId);
      formik.setFieldValue("name", batchById.name);
      formik.setFieldValue("batchLang", batchById.language);
      formik.setFieldValue("startDate", batchById?.startDate?.split("T")[0]);
      formik.setFieldValue("endDate", batchById?.endDate?.split("T")[0]);
    }
  }, [batchById, id]);

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
    if (batchadd.status === 200) {
      toast.success(batchadd.message, toastoptions);
      formik.setFieldValue("name", "");
      formik.setFieldValue("startDate", "");
      formik.setFieldValue("endDate", "");
      dispatch(emptybatch());
    }
    if (batchupdate.status === 200) {
      toast.success(batchupdate.message, toastoptions);
      navigate(PATH_DASHBOARD.batchtype);
      dispatch(emptybatch());
    }
  }, [batchadd, batchupdate]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Batch Type | {`${tabTitle}`}</title>
      </Helmet>

      <CustomBreadcrumbs
        links={[
          { name: "Master", href: "" },
          {
            name: "Batch Type",
            href: `${PATH_DASHBOARD.batchtype}`,
          },
          { name: id ? "Update Batch Type" : "Create Batch Type" },
        ]}
      />

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
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
                  error={Boolean(
                    formik.touched.boardId && formik.errors.boardId
                  )}
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
                  error={Boolean(
                    formik.touched.classId && formik.errors.classId
                  )}
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
                  error={Boolean(
                    formik.touched.batchLang && formik.errors.batchLang
                  )}
                >
                  <InputLabel>
                    {langClassLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "Batch Language"
                    )}
                  </InputLabel>
                  <Select
                    label="Language"
                    name="batchLang"
                    {...formik.getFieldProps("batchLang")}
                    onChange={formik.handleChange}
                  >
                    <MenuItem defaultValue value="">
                      Select Language
                    </MenuItem>
                    {getLanByClass?.data?.map((ev, index) => {
                      return (
                        <MenuItem value={ev?.language} key={index}>
                          {ev?.language}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    name="name"
                    label="Batch Name"
                    fullWidth
                    {...formik.getFieldProps("name")}
                    onChange={formik.handleChange}
                    error={Boolean(formik.touched.name && formik.errors.name)}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    type="date"
                    name="startDate"
                    label="Start Date"
                    inputProps={{
                      min: new Date().toISOString().slice(0, 10),
                      max: "9999-12-31T23:59",
                    }}
                    style={{ color: id ? "white !important" : null }}
                    fullWidth
                    {...formik.getFieldProps("startDate")}
                    onChange={formik.handleChange}
                    error={Boolean(
                      formik.touched.startDate && formik.errors.startDate
                    )}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    type="date"
                    name="endDate"
                    label="End Date"
                    inputProps={{
                      min: formik?.values?.batchDate
                        ? formik?.values?.batchDate
                        : new Date().toISOString().slice(0, 10),
                      max: "9999-12-31T23:59",
                    }}
                    style={{ color: id ? "white !important" : null }}
                    fullWidth
                    {...formik.getFieldProps("endDate")}
                    onChange={formik.handleChange}
                    error={Boolean(
                      formik.touched.endDate && formik.errors.endDate
                    )}
                  />
                </FormControl>
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={batchLoader}
                >
                  {id ? "Update Batch Type" : "Create Batch Type"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default AddBatches;
