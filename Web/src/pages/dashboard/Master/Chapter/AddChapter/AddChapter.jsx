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
import { chapterValidate, _initialValues } from "./utils";
import { useFormik } from "formik";
import {
  addChapterAsync,
  getBatchByCourseBoardClassAsync,
  getBoardsByCourseIdAsync,
  getChapterByIdAsync,
  getClassByBoardAndCourseIdAsync,
  getSubjectByBatchTypeIdAsync,
  getcourseAsync,
  updateChapterAsync,
} from "../../../../../redux/async.api";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { toastoptions } from "../../../../../utils/toastoptions";
import { emptychapter } from "../../../../../redux/slices/chapter.slice";
import { useNavigate, useParams } from "react-router";
import CustomComponentLoader from "../../../../../components/CustomComponentLoader/CustomComponentLoader";

function AddChapter() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseIdBoard, setCourseIdBoard] = useState("");
  const [boardIdCourse, setBoardIdCourse] = useState("");
  const [classIdBatch, setClassIdBatch] = useState("");
  const [batchtypeSubject, setBatchtypeSubject] = useState("");
  const { chapterLoader, chapteradd, chapterById, chapterupdate } = useSelector(
    (state) => state.chapter
  );
  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader, boardByCourse } = useSelector((state) => state.board);
  const { subjectLoader, subjectCourseBoardClassBatch } = useSelector(
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
        updateChapterAsync({
          courseId: values.courseId,
          boardId: values.boardId,
          classId: values.classId,
          batchTypeId: values.batchTypeId,
          subjectId: values.subjectId,
          chapterId: id,
          name: values.name,
        })
      );
    } else {
      dispatch(
        addChapterAsync({
          courseId: values.courseId,
          boardId: values.boardId,
          classId: values.classId,
          batchTypeId: values.batchTypeId,
          subjectId: values.subjectId,
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
      dispatch(getChapterByIdAsync(id));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      if (chapterById) {
        formik.setFieldValue("courseId", chapterById.courseId);
        setCourseIdBoard(chapterById.courseId);
        formik.setFieldValue("boardId", chapterById.boardId);
        setBoardIdCourse(chapterById.boardId);
        formik.setFieldValue("classId", chapterById.classId);
        setClassIdBatch(chapterById.classId);
        formik.setFieldValue("batchTypeId", chapterById.batchTypeId);
        setBatchtypeSubject(chapterById.batchTypeId);
        formik.setFieldValue("subjectId", chapterById.subjectId);
        formik.setFieldValue("name", chapterById.name);
      }
    }
  }, [chapterById, id]);

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
    if (batchtypeSubject) {
      dispatch(
        getSubjectByBatchTypeIdAsync({
          courseId: courseIdBoard,
          boardId: boardIdCourse,
          classId: batchtypeSubject,
          batchTypeId: batchtypeSubject,
        })
      );
    }
  }, [batchtypeSubject]);

  useEffect(() => {
    if (chapteradd.status === 200) {
      toast.success(chapteradd.message, toastoptions);
      formik.setFieldValue("name", "");
      dispatch(emptychapter());
    }
    if (chapterupdate.status === 200) {
      toast.success(chapterupdate.message, toastoptions);
      dispatch(emptychapter());
      navigate("/app/master/chapter");
    }
  }, [chapteradd, chapterupdate]);

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: chapterValidate,
  }); // FOMRIK

  return (
    <>
      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={id ? "Update Chapter" : "Create Chapter"}
          links={[
            {
              name: "Dashboard",
              href: "/app/master",
            },
            {
              name: "Chapters",
              href: "/app/master/chapter",
            },
            { name: id ? "Update Chapter" : "Create Chapter" },
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
                        {" "}
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
                        label="Class"
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
                        label="Batch"
                        name="batchTypeId"
                        {...formik.getFieldProps("batchTypeId")}
                        onChange={(e) => {
                          formik.handleChange(e);
                          setBatchtypeSubject(e.target.value);
                        }}
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

                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth disabled={subjectLoader}>
                      <InputLabel>
                        {subjectLoader ? (
                          <CustomComponentLoader padding="0 0" size={20} />
                        ) : (
                          "Subject"
                        )}
                      </InputLabel>
                      <Select
                        label="Subject"
                        name="subjectId"
                        {...formik.getFieldProps("subjectId")}
                        onChange={formik.handleChange}
                      >
                        <MenuItem defaultValue value="">
                          Select Subject
                        </MenuItem>
                        {subjectCourseBoardClassBatch?.map((ev, index) => {
                          return (
                            <MenuItem value={ev.id} key={ev.index}>
                              {ev.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {formik.touched.subjectId && formik.errors.subjectId && (
                        <small className="formikerror">
                          {formik.errors.subjectId}
                        </small>
                      )}
                    </FormControl>
                  </Box>

                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <TextField
                        name="name"
                        label="Chapter"
                        style={{ color: "transparent !important" }}
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
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={chapterLoader}
                  >
                    {id ? "Update Chapter" : "Create Chapter"}
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

export default AddChapter;
