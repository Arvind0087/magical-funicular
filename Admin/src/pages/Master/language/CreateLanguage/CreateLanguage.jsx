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
import {
  addBatchLanguageAsync,
  getBatchLanguageByIdAsync,
  updateBatchLanguageByIdAsync,
} from "redux/language/language.async";
import { getBoardsByCourseIdAsync } from "redux/board/board.async";
import { getClassByBoardAndCourseIdAsync } from "redux/class/class.async";
import { PATH_DASHBOARD } from "routes/paths";
import { emptylanguage } from "redux/language/language.slice";

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
  const {
    getLangByIdLoader,
    getLanguageById,
    languageLoader,
    addLanguage,
    updateLoader,
    updateLanguage,
  } = useSelector((state) => state.language);

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
      courseId: values.courseId,
      boardId: values.boardId,
      classId: values.classId,
      language: values.batchLang,
      LanguageId: id,
    };
    if (id) {
      dispatch(updateBatchLanguageByIdAsync(payload));
    } else {
      delete payload.LanguageId;
      dispatch(addBatchLanguageAsync(payload));
    }
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate,
  });

  useEffect(() => {
    getCourseAsync();
  }, []);

  useEffect(() => {
    if (id) dispatch(getBatchLanguageByIdAsync(id));
  }, [id]);

  useEffect(() => {
    if (id && getLanguageById) {
      formik.setFieldValue("courseId", getLanguageById?.data?.courseId);
      formik.setFieldValue("boardId", getLanguageById?.data?.boardId);
      formik.setFieldValue("classId", getLanguageById?.data?.classId);
      formik.setFieldValue("batchLang", getLanguageById?.data?.language);
    }
  }, [getLanguageById, id]);

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
    if (addLanguage.status === 200) {
      toast.success(addLanguage.message, toastoptions);
      formik.setFieldValue("batchLang", "");
      dispatch(emptylanguage());
    }
    if (updateLanguage.status === 200) {
      toast.success(updateLanguage.message, toastoptions);
      navigate(PATH_DASHBOARD.language);
      dispatch(emptylanguage());
    }
  }, [addLanguage, updateLanguage]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Batch Type | {`${tabTitle}`}</title>
      </Helmet>

      <CustomBreadcrumbs
        links={[
          { name: "Master", href: "" },
          {
            name: "Language",
            href: `${PATH_DASHBOARD.language}`,
          },
          { name: id ? "Update Language" : "Create Language" },
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
                  <InputLabel>Batch Language</InputLabel>
                  <Select
                    label="Language"
                    name="batchLang"
                    {...formik.getFieldProps("batchLang")}
                    onChange={formik.handleChange}
                  >
                    <MenuItem defaultValue value="">
                      Select Language
                    </MenuItem>
                    {langData?.map((ev, index) => {
                      return (
                        <MenuItem value={ev.value} key={ev.index}>
                          {ev.value}
                        </MenuItem>
                      );
                    })}
                  </Select>
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
