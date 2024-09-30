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
import { _initialValues, classValidate } from "./utils";
import { useFormik } from "formik";
import {
  createClassAsync,
  getBoardsByCourseIdAsync,
  getClassByIdAsync,
  getcourseAsync,
  updateClassByIdAsync,
} from "../../../../../redux/async.api";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toastoptions } from "../../../../../utils/toastoptions";
import { toast } from "react-hot-toast";
import { emptyclass } from "../../../../../redux/slices/class.slice";
import { useNavigate, useParams } from "react-router";
import CustomComponentLoader from "../../../../../components/CustomComponentLoader/CustomComponentLoader";

export default function AddClass() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseIdBoard, setCourseIdBoard] = useState("");
  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader, boardByCourse } = useSelector((state) => state.board);
  const { classLoader, classadd, classId, classupdate } = useSelector(
    (state) => state.class
  );

  const onSubmit = (values) => {
    if (id) {
      dispatch(
        updateClassByIdAsync({
          classId: id,
          courseId: values.courseId,
          boardId: values.boardId,
          name: values.name,
        })
      );
    } else {
      dispatch(
        createClassAsync({
          courseId: values.courseId,
          boardId: values.boardId,
          name: values.name,
        })
      );
    }
  };

  const getCourseAsync = () => {
    dispatch(
      getcourseAsync({
        page: "",
        limit: "",
      })
    );
  };

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
    getCourseAsync();
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(getClassByIdAsync(id));
    }
  }, [id]);

  useEffect(() => {
    // VALUE SET
    if (id) {
      if (classId) {
        formik.setFieldValue("name", classId.name);
        formik.setFieldValue("boardId", classId.boardId);
        formik.setFieldValue("courseId", classId.courseId); 
        setCourseIdBoard(classId.courseId);
      }
    }
  }, [classId, course, id]);

  useEffect(() => {
    if (classadd.status === 200) {
      toast.success(classadd.message, toastoptions);
      dispatch(emptyclass()); // NEED TO CLEAR MESSAGE FROM STATE
      formik.setFieldValue("name", "");
      // formik.setFieldValue("boardId", "");
      // formik.setFieldValue("courseId", "");
    }
    if (classupdate.status === 200) {
      toast.success(classupdate.message, toastoptions);
      dispatch(emptyclass()); // NEED TO CLEAR MESSAGE FROM STATE
      formik.setFieldValue("name", "");
      formik.setFieldValue("boardId", "");
      formik.setFieldValue("courseId", "");
      navigate("/app/master/class");
    }
  }, [classadd, classupdate]);

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: classValidate,
  }); // FOMRIK

  return (
    <>
      <Container maxWidth={themeStretch ? false : "lg"}>
        {/* <LoadingCircle isLoading={false}/> */}
        <CustomBreadcrumbs
          heading={id ? "Update Class" : "Create Class"}
          links={[
            {
              name: "Dashboard",
              href: "/app/master",
            },
            {
              name: "Classes",
              href: "/app/master/class",
            },
            { name: id ? "Update Class" : "Create Class" },
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

                  <FormControl fullWidth>
                    <TextField
                      name="name"
                      label="Class Name"
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
    </>
  );
}
