import { Helmet } from "react-helmet-async";
import React, { useEffect, useState } from "react";
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
  Checkbox,
  Typography,
} from "@mui/material";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { _initial, _validate } from "./utils";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { useNavigate, useParams } from "react-router";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { GenerateBase64 } from "utils/convertToBase64";
import { getcourseAsync } from "redux/course/course.async";
import UploadBox from "components/CustomUploads/UploadBox";
import {
  addsubjectAsync,
  getSubjectByIdAsync,
  updatedSubjectByIdAsync,
} from "redux/subject/subject.async";
import { getBoardsByCourseIdAsync } from "redux/board/board.async";
import { getClassByBoardAndCourseIdAsync } from "redux/class/class.async";
import { getBatchByCourseBoardClassAsync } from "redux/batchtype/batchtype.async";
import { emptysubject } from "redux/subject/subject.slice";
import { PATH_DASHBOARD } from "routes/paths";

export default function CreateSubject() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [getCheckedValue, setCheckedValue] = useState(false);
  const { boardLoader, boardByCourse } = useSelector((state) => state.board);
  const { courseLoader, course } = useSelector((state) => state.course);
  const { subjectLoader, subjectadd, subjectById, subjectupdate } = useSelector(
    (state) => state.subject
  );
  const { classLoader, classbycourseboard } = useSelector(
    (state) => state.class
  );
  const { batchLoader, batchByCourseBoardClass } = useSelector(
    (state) => state.batch
  );
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const getCourseAsync = () => {
    dispatch(
      getcourseAsync({
        page: "",
        limit: "",
      })
    );
  };
  const handleDropThumbnail = (acceptedFiles) => {
    // HANDLE FILES
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    if (file) {
      formik.setFieldValue("image", [newFile]);
    }
  };

  const onSubmit = async (values) => {
    const ImageBase64 = await GenerateBase64(values.image[0]);
    const payload = {
      courseId: values.courseId,
      boardId: values.boardId,
      classId: values.classId,
      batchTypeId: values.batchTypeId,
      subjectId: Number(id),
      name: values.name,
      image: ImageBase64,
      isAllSubject: getCheckedValue,
    };
    if (id) {
      dispatch(updatedSubjectByIdAsync(payload));
    } else {
      delete payload.subjectId;
      dispatch(addsubjectAsync(payload));
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
    if (id) dispatch(getSubjectByIdAsync(id));
  }, [id]);

  useEffect(() => {
    if (id && subjectById) {
      formik.setFieldValue("courseId", subjectById.courseId);
      formik.setFieldValue("boardId", subjectById.boardId);
      formik.setFieldValue("classId", subjectById.classId);
      formik.setFieldValue("batchTypeId", subjectById.batchTypeId);
      formik.setFieldValue("name", subjectById.name);
      formik.setFieldValue(
        "image",
        subjectById?.image ? [subjectById?.image] : []
      );
      setCheckedValue(subjectById?.isAllSubject);
    }
  }, [subjectById, id]);

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

  const handleCheckedAll = (event) => {
    setCheckedValue(event.target.checked);
  };

  useEffect(() => {
    if (subjectadd.status === 200) {
      toast.success(subjectadd.message, toastoptions);
      formik.setFieldValue("name", "");
      formik.setFieldValue("image", []);
      setCheckedValue(false);
      dispatch(emptysubject());
    }
    if (subjectupdate.status === 200) {
      toast.success(subjectupdate.message, toastoptions);
      formik.resetForm();
      dispatch(emptysubject());
      navigate(PATH_DASHBOARD.subject);
    }
  }, [subjectadd, subjectupdate]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Subject | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={id ? "Update Subject" : "Create Subject"}
        links={[
          { name: "Master", href: "" },
          {
            name: "Subject",
            href: `${PATH_DASHBOARD.subject}`,
          },
          {
            name: id ? "Update Subject" : "Create Subject",
          },
        ]}
      />
      <form onSubmit={formik.handleSubmit}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
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
                    label="Batches"
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

                <FormControl fullWidth>
                  <TextField
                    name="name"
                    label="Subject Name"
                    fullWidth
                    {...formik.getFieldProps("name")}
                    onChange={formik.handleChange}
                    error={Boolean(formik.touched.name && formik.errors.name)}
                  />
                </FormControl>
                <UploadBox
                  otherFile={true}
                  label="Thumbnail"
                  height={58}
                  name="image"
                  accept={{
                    "image/*": [],
                  }}
                  onDrop={handleDropThumbnail}
                  file={formik.values.image[0]}
                  error={Boolean(formik.touched.image && formik.errors.image)}
                />

                {/*<Box display="flex" alignItems="center" sx={{ mb: "10px" }}>
                  <Checkbox
                    checked={getCheckedValue}
                    onChange={handleCheckedAll}
                    sx={{
                      p: 0
                    }}

                  />
                  <Typography
                    sx={{
                      ml: "10px",
                      fontWeight: 500
                    }}
                  >
                    Is All Subjects
                  </Typography>
                </Box> */}
              </Box>
            </Grid>

            <Grid item xs={12} md={12}>
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={subjectLoader}
                >
                  {id ? "Update Subject" : "Create Subject"}
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </form>
    </Container>
  );
}
