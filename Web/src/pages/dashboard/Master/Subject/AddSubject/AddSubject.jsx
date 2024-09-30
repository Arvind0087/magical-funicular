import React, { useEffect, useState } from "react";
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
import CustomBreadcrumbs from "../../../../../components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "../../../../../components/settings";
import { LoadingButton } from "@mui/lab";
import { _initialValues, subjectValidate } from "./utils";
import { useFormik } from "formik";
import {
  addsubjectAsync,
  getBatchByCourseBoardClassAsync,
  getBoardsByCourseIdAsync,
  getClassByBoardAndCourseIdAsync,
  getSubjectByIdAsync,
  getcourseAsync,
  updatedSubjectByIdAsync,
} from "../../../../../redux/async.api";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { toastoptions } from "../../../../../utils/toastoptions";
import { emptysubject } from "../../../../../redux/slices/subject.slice";
import { useNavigate, useParams } from "react-router";
import CustomComponentLoader from "../../../../../components/CustomComponentLoader/CustomComponentLoader";

function AddSubject() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseIdBoard, setCourseIdBoard] = useState("");
  const [boardIdCourse, setBoardIdCourse] = useState("");
  const [classIdBatch, setClassIdBatch] = useState("");
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

  const getCourseAsync = () => {
    dispatch(
      getcourseAsync({
        page: "",
        limit: "",
      })
    );
  };

  const onSubmit = (values) => {
    if (id) {
      dispatch(
        updatedSubjectByIdAsync({
          courseId: values.courseId,
          boardId: values.boardId,
          classId: values.classId,
          batchTypeId: values.batchTypeId,
          subjectId: id,
          name: values.name,
        })
      );
    } else {
      dispatch(
        addsubjectAsync({
          courseId: values.courseId,
          boardId: values.boardId,
          classId: values.classId,
          batchTypeId: values.batchTypeId,
          name: values.name,
        })
      );
    }
  };

  useEffect(() => {
    getCourseAsync();
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(getSubjectByIdAsync(id));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      if (subjectById) {
        formik.setFieldValue("courseId", subjectById.courseId);
        setCourseIdBoard(subjectById.courseId);
        formik.setFieldValue("boardId", subjectById.boardId);
        setBoardIdCourse(subjectById.boardId);
        formik.setFieldValue("classId", subjectById.classId);
        setClassIdBatch(subjectById.classId);
        formik.setFieldValue("batchTypeId", subjectById.batchTypeId);
        formik.setFieldValue("name", subjectById.name);
      }
    }
  }, [subjectById, id]);

  useEffect(() => {
    if (courseIdBoard) {
      dispatch(
        getBoardsByCourseIdAsync({
          courseId: courseIdBoard,
        })
      );
    }
  }, [courseIdBoard]);

  useEffect(() => {
    if (classIdBatch) {
      dispatch(
        getBatchByCourseBoardClassAsync({
          courseId: courseIdBoard,
          boardId: boardIdCourse,
          classId: classIdBatch,
        })
      );
    }
  }, [classIdBatch]);

  useEffect(() => {
    if (boardIdCourse) {
      dispatch(
        getClassByBoardAndCourseIdAsync({
          courseId: courseIdBoard,
          boardId: boardIdCourse,
        })
      );
    }
  }, [boardIdCourse]);

  useEffect(() => {
    if (subjectadd.status === 200) {
      toast.success(subjectadd.message, toastoptions);
      formik.setFieldValue("name", "");
      dispatch(emptysubject());
    }
    if (subjectupdate.status === 200) {
      toast.success(subjectupdate.message, toastoptions);
      formik.setFieldValue("courseId", "");
      formik.setFieldValue("boardId", "");
      formik.setFieldValue("classId", "");
      formik.setFieldValue("batchTypeId", "");
      formik.setFieldValue("name", "");
      dispatch(emptysubject());
      navigate("/app/master/subject");
    }
  }, [subjectadd, subjectupdate]);

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: subjectValidate,
  }); // FOMRIK

  return (
    <>
      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={id ? "Update Subject" : "Create Subject"}
          links={[
            {
              name: "Dashboard",
              href: "/app/master",
            },
            {
              name: "Subject",
              href: "/app/master/subject",
            },
            {
              name: id ? "Update Subject" : "Create Subject",
            },
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
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth disabled={courseLoader}>
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
                        onChange={(e) => {
                          formik.handleChange(e);
                          setCourseIdBoard(e.target.value);
                        }}
                      >
                        <MenuItem defaultValue value="">
                          Select Course
                        </MenuItem>
                        {course?.rows?.map((ev, index) => {
                          return (
                            <MenuItem value={ev.id} key={ev.index}>
                              {ev.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {formik.touched.courseId && formik.errors.courseId && (
                        <small className="formikerror">
                          {formik.errors.courseId}
                        </small>
                      )}
                    </FormControl>
                  </Box>

                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth disabled={boardLoader}>
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
                        onChange={(e) => {
                          formik.handleChange(e);
                          setBoardIdCourse(e.target.value);
                        }}
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
                      {formik.touched.boardId && formik.errors.boardId && (
                        <small className="formikerror">
                          {formik.errors.boardId}
                        </small>
                      )}
                    </FormControl>
                  </Box>

                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth disabled={classLoader}>
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
                        onChange={(e) => {
                          formik.handleChange(e);
                          setClassIdBatch(e.target.value);
                        }}
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
                      {formik.touched.classId && formik.errors.classId && (
                        <small className="formikerror">
                          {formik.errors.classId}
                        </small>
                      )}
                    </FormControl>
                  </Box>

                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth disabled={batchLoader}>
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
                      {formik.touched.batchTypeId &&
                        formik.errors.batchTypeId && (
                          <small className="formikerror">
                            {formik.errors.batchTypeId}
                          </small>
                        )}
                    </FormControl>
                  </Box>

                  <FormControl fullWidth>
                    <TextField
                      name="name"
                      label="Subject Name"
                      fullWidth
                      {...formik.getFieldProps("name")}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <small className="formikerror">
                        {formik.errors.name}
                      </small>
                    )}
                  </FormControl>
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={subjectLoader}
                  >
                    {id ? "Update Subject" : "Create Subject"}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
}

export default AddSubject;
