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
import { _initialValues, batchValidate } from "./utils";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import {
  createbatchTypesAsync,
  getBatchTypeByIdAsync,
  getBoardsByCourseIdAsync,
  getClassByBoardAndCourseIdAsync,
  getcourseAsync,
  updatedBatchTypeByIdAsync,
} from "../../../../../redux/async.api";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { toastoptions } from "../../../../../utils/toastoptions";
import { emptybatch } from "../../../../../redux/slices/batch.slice";
import { useNavigate, useParams } from "react-router";
import CustomComponentLoader from "../../../../../components/CustomComponentLoader/CustomComponentLoader";

function AddBatches() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseIdBoard, setCourseIdBoard] = useState("");
  const [boardIdCourse, setBoardIdCourse] = useState("");
  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader, boardByCourse } = useSelector((state) => state.board);
  const { batchLoader, batchadd, batchById, batchupdate } = useSelector(
    (state) => state.batch
  );
  const { classLoader, classbycourseboard } = useSelector(
    (state) => state.class
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
        updatedBatchTypeByIdAsync({
          batchTypeId: id,
          courseId: values.courseId,
          boardId: values.boardId,
          classId: values.classId,
          name: values.name,
        })
      );
    } else {
      dispatch(
        createbatchTypesAsync({
          courseId: values.courseId,
          boardId: values.boardId,
          classId: values.classId,
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
      dispatch(getBatchTypeByIdAsync(id));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      if (batchById) {
        formik.setFieldValue("courseId", batchById.courseId);
        setCourseIdBoard(batchById.courseId);
        formik.setFieldValue("boardId", batchById.boardId);
        setBoardIdCourse(batchById.boardId);
        formik.setFieldValue("classId", batchById.classId);
        formik.setFieldValue("name", batchById.name);
      }
    }
  }, [batchById, id]);

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
    if (batchadd.status === 200) {
      toast.success(batchadd.message, toastoptions);
      formik.setFieldValue("name", "");
      dispatch(emptybatch());
    }
    if (batchupdate.status === 200) {
      toast.success(batchupdate.message, toastoptions);
      navigate("/app/master/batch");
      dispatch(emptybatch());
    }
  }, [batchadd, batchupdate]);

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: batchValidate,
  }); // FOMRIK

  return (
    <>
      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={id ? "Update Batch" : "Create Batch"}
          links={[
            {
              name: "Dashboard",
              href: "/app/master",
            },
            {
              name: "Batch",
              href: "/app/master/batch",
            },
            { name: id ? "Update Batch" : "Create Batch" },
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
                      {formik.touched.classId && formik.errors.classId && (
                        <small className="formikerror">
                          {formik.errors.classId}
                        </small>
                      )}
                    </FormControl>
                  </Box>

                  <FormControl fullWidth>
                    <TextField
                      name="name"
                      label="Batch Name"
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
                    loading={batchLoader}
                  >
                    {id ? "Update Batch" : "Create Batch"}
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

export default AddBatches;
