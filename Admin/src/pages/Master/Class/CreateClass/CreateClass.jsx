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
  Box,
  Container,
  Stack,
} from "@mui/material";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { _initial, _validate } from "./utils";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { getcourseAsync } from "redux/course/course.async";
import {
  createClassAsync,
  getClassByIdAsync,
  updateClassByIdAsync,
} from "redux/class/class.async";
import { getBoardsByCourseIdAsync } from "redux/board/board.async";
import { emptyclass } from "redux/class/class.slice";
import { PATH_DASHBOARD } from "routes/paths";

export default function AddClass() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader, boardByCourse } = useSelector((state) => state.board);
  const { classLoader, classadd, classId, classupdate } = useSelector(
    (state) => state.class
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle)

  const onSubmit = (values) => {
    const payload = {
      classId: id,
      courseId: values.courseId,
      boardId: values.boardId,
      name: values.name,
      telegramUrl: values.telegramUrl,
    };
    if (id) {
      dispatch(updateClassByIdAsync(payload));
    } else {
      delete payload.classId;
      dispatch(createClassAsync(payload));
    }
  };

  const getCourseAsync = () => {
    dispatch(getcourseAsync({}));
  };

  useEffect(() => {
    getCourseAsync();
  }, []);

  useEffect(() => {
    if (id) dispatch(getClassByIdAsync(id));
  }, [id]);

  useEffect(() => {
    // VALUE SET
    if (id && classId) {
      formik.setFieldValue("name", classId.name);
      formik.setFieldValue("boardId", classId.boardId);
      formik.setFieldValue("courseId", classId.courseId);
      formik.setFieldValue("telegramUrl", classId.telegramLink);
    }
  }, [classId, id]);

  useEffect(() => {
    if (classadd.status === 200) {
      toast.success(classadd.message, toastoptions);
      dispatch(emptyclass());
      formik.setFieldValue("name", "");
      formik.setFieldValue("telegramUrl", "");
    }
    if (classupdate.status === 200) {
      toast.success(classupdate.message, toastoptions);
      dispatch(emptyclass());
      formik.resetForm();
      navigate(PATH_DASHBOARD.class);
    }
  }, [classadd, classupdate]);

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate,
  }); // FOMRIK

  useEffect(() => {
    if (formik.values.courseId) {
      dispatch(
        getBoardsByCourseIdAsync({
          courseId: formik.values.courseId,
        })
      );
    }
  }, [formik.values.courseId]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Class | {`${tabTitle}`}</title>
      </Helmet>

      <CustomBreadcrumbs
        // heading={id ? "Update Class" : "Create Class"}
        links={[
          { name: "Master", href: "" },
          { name: "Class", href: `${PATH_DASHBOARD.class}` },
          { name: id ? "Update Class" : "Create Class" },
        ]}
      />
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{padding : 3}}>
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
                  sx={{ mt: 1 }}
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
                  sx={{ mt: 1 }}
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

                <FormControl fullWidth>
                  <TextField
                    name="name"
                    label="Class Name"
                    fullWidth
                    {...formik.getFieldProps("name")}
                    onChange={formik.handleChange}
                    error={Boolean(formik.touched.name && formik.errors.name)}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    name="telegramUrl"
                    label="Telegram Url"
                    fullWidth
                    {...formik.getFieldProps("telegramUrl")}
                    onChange={formik.handleChange}
                    error={Boolean(
                      formik.touched.telegramUrl && formik.errors.telegramUrl
                    )}
                  />
                </FormControl>
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3, mr: 0.7 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={classLoader}
                >
                  {id ? "Update Class" : "Create Class"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
