import React from "react";
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
import { batchDateValidate, _initialValues } from "./utils";
import { useFormik } from "formik";
import "./style.css";
import {
  // getBatchTypeByIdAsync,
  addBatchDateAsync,
  getBatchByCourseBoardClassAsync,
  getClassByBoardAndCourseIdAsync,
  getBoardsByCourseIdAsync,
  getcourseAsync,
  getBatchDateByIdAsync,
  updatedBatchDateByIdAsync,
} from "../../../../../redux/async.api";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import CustomComponentLoader from "../../../../../components/CustomComponentLoader/CustomComponentLoader";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { toastoptions } from "../../../../../utils/toastoptions";
import { emptybatchdate } from "../../../../../redux/slices/batchdate.slice";

function AddBatchDate() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseIdBoard, setCourseIdBoard] = useState("");
  const [boardIdCourse, setBoardIdCourse] = useState("");
  const [classIdBatch, setClassIdBatch] = useState("");
  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader, boardByCourse } = useSelector((state) => state.board);
  const { classLoader, classbycourseboard } = useSelector(
    (state) => state.class
  );
  const { batchLoader, batchByCourseBoardClass } = useSelector(
    (state) => state.batch
  );
  const {
    batchdate,
    batchdateLoader,
    batchdateadd,
    batchDateById,
    batchDateupdate,
  } = useSelector((state) => state.batchdate);

  const getCourseAsync = () => {
    dispatch(
      getcourseAsync({
        page: "",
        limit: "",
      })
    );
  };

  const onSubmit = (values) => {
    console.log("userData", values && values);
    if (id) {
      dispatch(
        updatedBatchDateByIdAsync({
          batchDateId: id,
          courseId: values.course,
          boardId: values.boards,
          classId: values.class,
          batchTypeId: values.batch,
          date: values.batchDate,
        })
      );
    } else {
      dispatch(
        addBatchDateAsync({
          courseId: values.course,
          boardId: values.boards,
          classId: values.class,
          batchTypeId: values.batch,
          date: values.batchDate,
        })
      );
    }
  };

  useEffect(() => {
    getCourseAsync();
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(getBatchDateByIdAsync(id));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      if (batchDateById) {
        formik.setFieldValue("course", batchDateById.courseId);
        setCourseIdBoard(batchDateById.courseId);
        formik.setFieldValue("boards", batchDateById.boardId);
        setBoardIdCourse(batchDateById.boardId);
        formik.setFieldValue("class", batchDateById.classId);
        setClassIdBatch(batchDateById.classId);
        formik.setFieldValue("batch", batchDateById.batchTypeId);
        formik.setFieldValue("batchDate", batchDateById?.date?.split("T")[0]);
      }
    }
  }, [batchDateById, id]);
  console.log(batchDateById);

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
    if (batchdateadd.status === 200) {
      toast.success(batchdateadd.message, toastoptions);
      dispatch(emptybatchdate()); // NEED TO CLEAR MESSAGE FROM STATE
      formik.setFieldValue("batchDate", "");
    }
    if (batchDateupdate.status === 200) {
      toast.success(batchDateupdate.message, toastoptions);
      dispatch(emptybatchdate()); // NEED TO CLEAR MESSAGE FROM STATE
      navigate("/app/master/batchDate");
    }
  }, [batchdateadd, batchDateupdate]);

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: batchDateValidate,
  }); // FOMRIK

  return (
    <>
      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={id ? "Update Batch Date" : "Create Batch Date"}
          links={[
            {
              name: "Dashboard",
              href: "/app/master",
            },
            {
              name: "Batch Date",
              href: "/app/master/batchDate",
            },
            { name: id ? "Update Batch Date" : "Create Batch Date" },
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
                      <InputLabel id="demo-simple-select-label">
                        {courseLoader ? (
                          <CustomComponentLoader padding="0 0" size={20} />
                        ) : (
                          "Courses"
                        )}
                      </InputLabel>
                      <Select
                        label="Course"
                        name="course"
                        {...formik.getFieldProps("course")}
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
                      {formik.touched.course && formik.errors.course ? (
                        <small className="formikerror">
                          {formik.errors.course}
                        </small>
                      ) : null}
                    </FormControl>
                  </Box>

                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth disabled={boardLoader}>
                      <InputLabel id="demo-simple-select-label">
                        {boardLoader ? (
                          <CustomComponentLoader padding="0 0" size={20} />
                        ) : (
                          "Boards"
                        )}
                      </InputLabel>
                      <Select
                        label="Boards"
                        name="boards"
                        {...formik.getFieldProps("boards")}
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
                      {formik.touched.boards && formik.errors.boards && (
                        <small className="formikerror">
                          {formik.errors.boards}
                        </small>
                      )}
                    </FormControl>
                  </Box>

                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth disabled={classLoader}>
                      <InputLabel id="demo-simple-select-label">
                        {classLoader ? (
                          <CustomComponentLoader padding="0 0" size={20} />
                        ) : (
                          "Classes"
                        )}
                      </InputLabel>
                      <Select
                        label="Class"
                        name="class"
                        {...formik.getFieldProps("class")}
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
                      {formik.touched.class && formik.errors.class && (
                        <small className="formikerror">
                          {formik.errors.class}
                        </small>
                      )}
                    </FormControl>
                  </Box>

                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth disabled={batchLoader}>
                      <InputLabel id="demo-simple-select-label">
                        {batchLoader ? (
                          <CustomComponentLoader padding="0 0" size={20} />
                        ) : (
                          "Batches"
                        )}
                      </InputLabel>
                      <Select
                        label="Batch"
                        name="batch"
                        {...formik.getFieldProps("batch")}
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
                      {formik.touched.batch && formik.errors.batch && (
                        <small className="formikerror">
                          {formik.errors.batch}
                        </small>
                      )}
                    </FormControl>
                  </Box>

                  <FormControl fullWidth>
                    <TextField
                      type="date"
                      name="batchDate"
                      label="Batch Date"
                      style={{ color: id ? "white !important" : null }}
                      fullWidth
                      {...formik.getFieldProps("batchDate")}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.batchDate && formik.errors.batchDate && (
                      <small className="formikerror">
                        {formik.errors.batchDate}
                      </small>
                    )}
                  </FormControl>
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={batchdateLoader}
                  >
                    {id ? "Update Batch Date" : "Create Batch Date"}
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

export default AddBatchDate;
