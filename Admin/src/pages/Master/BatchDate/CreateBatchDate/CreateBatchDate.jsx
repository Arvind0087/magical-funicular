import { Helmet } from "react-helmet-async";
import React, { useState } from "react";
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
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { getcourseAsync } from "redux/course/course.async";
import {
  addBatchDateAsync,
  getBatchDateByIdAsync,
  updatedBatchDateByIdAsync,
} from "redux/batchdate/batchdate.async";
import { getBoardsByCourseIdAsync } from "redux/board/board.async";
import { getClassByBoardAndCourseIdAsync } from "redux/class/class.async";
import {
  getBatchByCourseBoardClassAsync,
  getAllBatchTypes,
} from "redux/batchtype/batchtype.async";
import { emptybatchdate } from "redux/batchdate/batchdate.slice";
import { PATH_DASHBOARD } from "routes/paths";

function AddBatchDate() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader, boardByCourse } = useSelector((state) => state.board);
  const { classLoader, classbycourseboard } = useSelector(
    (state) => state.class
  );
  const { batchLoader, batches, batchByCourseBoardClass } = useSelector(
    (state) => state.batch
  );

  const [batchData, setBatchData] = useState({});

  const {
    batchdate,
    batchdateLoader,
    batchdateadd,
    batchDateById,
    batchDateupdate,
  } = useSelector((state) => state.batchdate);
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

  const onSubmit = (values) => {
    const payload = {
      batchDateId: id,
      courseId: values.course,
      boardId: values.boards,
      classId: values.class,
      batchTypeId: values.batchName,
      // batchName: values.name,
      batchName: batchData?.batchTypeName,
      date: values.batchDate,
      endDate: values.endDate,
    };
    if (id) {
      dispatch(updatedBatchDateByIdAsync(payload));
    } else {
      delete payload.batchDateId;
      dispatch(addBatchDateAsync(payload));
    }
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate,
  });

  useEffect(() => {
    const payload = {
      page: "",
      limit: "",
      classes: "",
      search: "",
      status: "all",
    };
    dispatch(getAllBatchTypes(payload));
  }, []);

  useEffect(() => {
    getCourseAsync();
  }, []);

  useEffect(() => {
    if (id) dispatch(getBatchDateByIdAsync(id));
  }, [id]);

  useEffect(() => {
    if (!id && batchData) {
      formik.setFieldValue("course", batchData?.courseId);
      formik.setFieldValue("boards", batchData?.boardId);
      formik.setFieldValue("class", batchData?.classId);
    }
  }, [formik?.values?.batchName]);

  useEffect(() => {
    if (id && batchDateById) {
      formik.setFieldValue("course", batchDateById?.courseId);
      formik.setFieldValue("boards", batchDateById?.boardId);
      formik.setFieldValue("class", batchDateById?.classId);
      // formik.setFieldValue("batch", batchDateById?.batchTypeId);
      // formik.setFieldValue("name", batchDateById?.batchName);
      formik.setFieldValue("batchName", batchDateById?.batchTypeId);
      formik.setFieldValue("batchDate", batchDateById?.date?.split("T")[0]);
      formik.setFieldValue("endDate", batchDateById?.endDate?.split("T")[0]);
    }
  }, [batchDateById, id]);

  useEffect(() => {
    if (formik.values.course) {
      dispatch(
        getBoardsByCourseIdAsync({
          courseId: formik.values.course,
        })
      );
    }
  }, [formik.values.course]);

  useEffect(() => {
    if (formik.values.boards) {
      dispatch(
        getClassByBoardAndCourseIdAsync({
          courseId: formik.values.course,
          boardId: formik.values.boards,
        })
      );
    }
  }, [formik.values.boards]);

  useEffect(() => {
    if (formik.values.class) {
      dispatch(
        getBatchByCourseBoardClassAsync({
          courseId: formik.values.course,
          boardId: formik.values.boards,
          classId: formik.values.class,
        })
      );
    }
  }, [formik.values.class]);

  useEffect(() => {
    if (batchdateadd.status === 200) {
      toast.success(batchdateadd.message, toastoptions);
      dispatch(emptybatchdate());
      formik.setFieldValue("batchDate", "");
      formik.setFieldValue("endDate", "");
      navigate(PATH_DASHBOARD.batchdate);
    }
    if (batchDateupdate.status === 200) {
      toast.success(batchDateupdate.message, toastoptions);
      dispatch(emptybatchdate());
      navigate(PATH_DASHBOARD.batchdate);
    }
  }, [batchdateadd, batchDateupdate]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Batch Date | {`${tabTitle}`}</title>
      </Helmet>

      <CustomBreadcrumbs
        links={[
          { name: "Master", href: "" },
          {
            name: "Batch Date",
            href: `${PATH_DASHBOARD.batchdate}`,
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
                <FormControl
                  fullWidth
                  disabled={!id ? batchLoader : true}
                  error={Boolean(
                    formik.touched.batchName && formik.errors.batchName
                  )}
                >
                  <InputLabel id="demo-simple-select-label">
                    {batchLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "Batch Name"
                    )}
                  </InputLabel>
                  <Select
                    label="Batch Name"
                    name="batchName"
                    {...formik.getFieldProps("batchName")}
                    onChange={formik.handleChange}
                  >
                    <MenuItem defaultValue value="">
                      Select Batch Name
                    </MenuItem>
                    {batches?.data?.map((ev, index) => {
                      return (
                        <MenuItem
                          value={ev.id}
                          key={ev.index}
                          onClick={() => setBatchData(ev)}
                        >
                          {`(${ev.course}) (${ev.class})  ${
                            ev.language ? `(${ev.language})` : ""
                          } (${ev.id} - ${ev.batchTypeName})`}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  // disabled={courseLoader}
                  disabled={true}
                  error={Boolean(formik.touched.course && formik.errors.course)}
                >
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
                  // disabled={boardLoader}
                  disabled={true}
                  error={Boolean(formik.touched.boards && formik.errors.boards)}
                >
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
                  // disabled={classLoader}
                  disabled={true}
                  error={Boolean(formik.touched.class && formik.errors.class)}
                >
                  <InputLabel id="demo-simple-select-label">
                    {classLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "Classes"
                    )}
                  </InputLabel>
                  <Select
                    label="Classes"
                    name="class"
                    {...formik.getFieldProps("class")}
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

                {/*<FormControl
                  fullWidth
                  disabled={batchLoader}
                  error={Boolean(formik.touched.batch && formik.errors.batch)}
                >
                  <InputLabel id="demo-simple-select-label">
                    {batchLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "Batch Types"
                    )}
                  </InputLabel>
                  <Select
                    label="Batch Types"
                    name="batch"
                    {...formik.getFieldProps("batch")}
                    onChange={formik.handleChange}
                  >
                    <MenuItem defaultValue value="">
                      Select Batch Type
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
                    label="Batch Name"
                    fullWidth
                    {...formik.getFieldProps("name")}
                    onChange={formik.handleChange}
                    error={Boolean(formik.touched.name && formik.errors.name)}
                    value={formik?.values?.name}
                  />
                </FormControl> */}

                <FormControl fullWidth>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    type="date"
                    name="batchDate"
                    label="Start Date"
                    inputProps={{
                      min: new Date().toISOString().slice(0, 10),
                      max: "9999-12-31T23:59",
                    }}
                    style={{ color: id ? "white !important" : null }}
                    fullWidth
                    {...formik.getFieldProps("batchDate")}
                    onChange={formik.handleChange}
                    error={Boolean(
                      formik.touched.batchDate && formik.errors.batchDate
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
  );
}

export default AddBatchDate;
