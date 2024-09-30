import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import {
  Card,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ListItemIcon,
  Checkbox,
  ListItemText
} from "@mui/material";
import { Container, Stack, Box } from "@mui/system";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import {
  getBoardsByCourseIdAsync,
  getClassByBoardAndCourseIdAsync
} from "redux/async.api";
import {
  getAllScholorshipAddAsync,
  getBatchByMultipleClassIddAsync,
  getSubjectByMultipleClassIdAsync,
  createScholorshipByClassesAsync,
  getScholorshipClassBasedByIdAsync,
  updateScholarshipClassBAsedAsync
} from "redux/slices/scholorshipSlice/async.api";
import { getcourseAsync } from "redux/course/course.async";
import { PATH_DASHBOARD } from "routes/paths";
import { emptyScholorship } from "redux/slices/scholorshipSlice/scholorship.slice";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { useNavigate, useParams } from "react-router";
import { useFormik } from "formik";
import { _initial, _validate } from "./utils";
import SelectMenuItem from "components/SelectMenuItem/index";
import _ from "lodash";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";

function AddScholorship() {
  const [selected, setSelected] = useState([]);
  const [getSubject, setSubject] = useState([]);
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader, boardByCourse } = useSelector((state) => state.board);
  const { classLoader, classbycourseboard } = useSelector(
    (state) => state.class
  );
  const {
    scholorshipLoader,
    getAllScholorshipAdd,
    getBatchByMultipleClass,
    getSubjectByMultipleClass,
    createScholorshipByClasses,
    getScholorshipOnly,
    updateCBScholarship
  } = useSelector((state) => state.scholorship);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const [errorMessage, setErrorMessage] = useState(null);
  const [scholarshipLoader, setScholarshipLoader] = useState(false);

  useEffect(() => {
    if (id) dispatch(getScholorshipClassBasedByIdAsync(id));
  }, [id]);
  const onSubmit = async (values) => {
    const payload = {
      Id: id,
      scholarshipId: values.title,
      courseId: values.course,
      boardId: values.boards,
      batchTypeId: _.map(values?.batchType, (ev) => ev.value),
      date: values.date,
      classId: values.class.map((ev) => ev.id),
      subjectId: values.subject.map((ev) => ev.id)
    };
    if (values.startTime && values.endTime) {
      if (values.startTime >= values.endTime) {
        toast.error("Start time must be before end time", toastoptions);
      } else {
        payload.startTime = values.startTime;
        payload.endTime = values.endTime;
        if (id) {
          dispatch(updateScholarshipClassBAsedAsync(payload));
        } else {
          delete payload.Id;
          dispatch(createScholorshipByClassesAsync(payload));
        }
      }
    }
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate
  });

  useMemo(() => {
    if (createScholorshipByClasses.status === 200) {
      toast.success(createScholorshipByClasses.message, toastoptions);
      dispatch(emptyScholorship());
      formik.resetForm();
      navigate(PATH_DASHBOARD.scholarshipclass);
    }

    if (updateCBScholarship.status === 200) {
      toast.success(updateCBScholarship.message, toastoptions);
      dispatch(emptyScholorship());
      navigate(PATH_DASHBOARD.scholarshipclass);
      formik.resetForm();
    }
  }, [createScholorshipByClasses, updateCBScholarship]);

  useMemo(() => {
    if (id && getScholorshipOnly.data?.scholarshipId) {
      formik.setFieldValue("title", getScholorshipOnly?.data?.scholarshipId);
      formik.setFieldValue("course", getScholorshipOnly?.data?.courseId);
      formik.setFieldValue("boards", getScholorshipOnly?.data?.boardId);

      if (Array.isArray(getScholorshipOnly?.data?.classes)) {
        formik.setFieldValue("class", getScholorshipOnly?.data?.classes);
        setSelected(getScholorshipOnly?.data?.classes);
      }
      // formik.setFieldValue("batchType", getScholorshipOnly?.data?.batchTypeId);

      const batchIds = _.map(
        getScholorshipOnly?.data?.batchType,
        (ev) => ev.id
      );
      const filtered_ids = _.filter(getBatchByMultipleClass?.data, (ev) => {
        return _.includes(batchIds, ev?.id);
      });
      const batchTypeIn = _.map(filtered_ids, (ev) => {
        return {
          label: `${ev.name} (${ev.class})`,
          value: ev?.id
        };
      });
      formik.setFieldValue("batchType", batchTypeIn);
      if (Array.isArray(getScholorshipOnly?.data?.subjects)) {
        formik.setFieldValue("subject", getScholorshipOnly?.data?.subjects);
        setSubject(getScholorshipOnly?.data?.subjects);
      }
      formik.setFieldValue("date", getScholorshipOnly?.data?.date);
      formik.setFieldValue("startTime", getScholorshipOnly?.data?.startTime);
      formik.setFieldValue("endTime", getScholorshipOnly?.data?.endTime);
    }
  }, [id, getScholorshipOnly]);

  useEffect(() => {
    dispatch(getAllScholorshipAddAsync({}));
  }, []);

  useMemo(() => {
    if (formik.values.title) {
      dispatch(getcourseAsync({}));
    }
  }, [formik.values.title]);

  useMemo(() => {
    if (formik.values.course) {
      dispatch(
        getBoardsByCourseIdAsync({
          courseId: formik.values.course
        })
      );
    }
  }, [formik.values.course]);

  useMemo(() => {
    if (formik.values.boards) {
      dispatch(
        getClassByBoardAndCourseIdAsync({
          courseId: formik.values.course,
          boardId: formik.values.boards
        })
      );
    }
  }, [formik.values.boards]);

  useMemo(() => {
    if (formik.values.class) {
      dispatch(
        getBatchByMultipleClassIddAsync({
          courseId: formik.values.course,
          boardId: formik.values.boards,
          classId: formik.values.class?.map((ev) => ev.id) || []
        })
      );
    }
  }, [formik.values.class]);

  useMemo(() => {
    if (formik.values.batchType) {
      dispatch(
        getSubjectByMultipleClassIdAsync({
          courseId: formik.values.course,
          boardId: formik.values.boards,
          classId: formik.values.class?.map((ev) => ev.id) || [],
          // batchTypeId: formik.values.batchType,
          batchTypeId: formik.values?.batchType?.map((ev) => ev.value) || []
        })
      );
    }
  }, [formik.values.batchType]);

  const handleChangeClass = (value) => {
    const check = selected.findIndex((item) => item.id === value.id);
    if (check !== -1 && selected.length > 0) {
      const removefilter = selected.filter((item) => item.id !== value.id);
      setSelected(removefilter);
      formik.setFieldValue("class", removefilter);
    } else {
      formik.setFieldValue("class", [...selected, value]);
      setSelected([...selected, value]);
    }
  };

  const handleChangeSubject = (value) => {
    const check = getSubject.findIndex((item) => item.id === value.id);
    if (check !== -1 && getSubject.length > 0) {
      const removefilter = getSubject.filter((item) => item.id !== value.id);
      setSubject(removefilter);
      formik.setFieldValue("subject", removefilter);
    } else {
      formik.setFieldValue("subject", [...getSubject, value]);
      setSubject([...getSubject, value]);
    }
  };

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Scholarship Class | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={id ? "Update Scholarship Class " : " Create Scholarship Class"}
        links={[
          { name: "Scholarship", href: "" },
          { name: "Scholarship Class", href: `${PATH_DASHBOARD.scholarshipclass}` },
          { name: id ? "Update Scholarship" : "Create Scholarship Class" }
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
                  sm: "repeat(2, 1fr)"
                }}
              >
                <SelectMenuItem
                  fullWidth
                  disabled={scholorshipLoader}
                  error={formik.touched.title && formik.errors.title}
                  InputLabelLoader={scholorshipLoader}
                  InputLabelLabel="Scholarship"
                  InputLabelSize={20}
                  label="Scholarship"
                  name="title"
                  {...formik.getFieldProps("title")}
                  onChange={formik.handleChange}
                  defaultItemLabel="Select Scholarship"
                  data={_.map(getAllScholorshipAdd?.data, (ev, index) => {
                    return (
                      <MenuItem key={ev.index} value={ev.id}>
                        {ev.title}
                      </MenuItem>
                    );
                  })}
                />
                <SelectMenuItem
                  fullWidth
                  disabled={courseLoader}
                  error={formik.touched.course && formik.errors.course}
                  InputLabelLoader={courseLoader}
                  InputLabelLabel="Courses"
                  InputLabelSize={20}
                  label="Courses"
                  name="course"
                  {...formik.getFieldProps("course")}
                  onChange={formik.handleChange}
                  defaultItemLabel="Select Courses"
                  data={_.map(course?.data, (ev, index) => {
                    return (
                      <MenuItem key={ev.index} value={ev.id}>
                        {ev.name}
                      </MenuItem>
                    );
                  })}
                />
                <SelectMenuItem
                  fullWidth
                  disabled={boardLoader}
                  error={formik.touched.boards && formik.errors.boards}
                  InputLabelLoader={boardLoader}
                  InputLabelLabel="Board"
                  InputLabelSize={20}
                  label="Board"
                  name="boards"
                  {...formik.getFieldProps("boards")}
                  onChange={formik.handleChange}
                  defaultItemLabel="Select Board"
                  data={_.map(boardByCourse, (ev, index) => {
                    return (
                      <MenuItem key={ev.index} value={ev.id}>
                        {ev.name}
                      </MenuItem>
                    );
                  })}
                />
                <FormControl
                  fullWidth
                  error={formik.touched.class && formik.errors.class}
                  disabled={classLoader}
                >
                  <InputLabel>
                    {classLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "Class"
                    )}
                  </InputLabel>
                  <Select
                    label="Class"
                    name="class"
                    select
                    multiple
                    value={selected}
                    renderValue={(selected) =>
                      selected.map((i) => i.name).join(",")
                    }
                  >
                    <MenuItem defaultValue value="">
                      Select Class
                    </MenuItem>
                    {classbycourseboard?.map((option) => (
                      <MenuItem
                        key={option.key}
                        value={{ id: option.id, name: option.name }}
                        onClick={() => handleChangeClass(option)}
                      >
                        <ListItemIcon>
                          <Checkbox
                            checked={
                              selected?.filter((i) => i.id === option.id)
                                .length > 0
                            }
                          />
                        </ListItemIcon>
                        <ListItemText primary={option.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* <SelectMenuItem
                  fullWidth
                  disabled={scholorshipLoader}
                  error={formik.touched.batchType && formik.errors.batchType}
                  InputLabelLoader={scholorshipLoader}
                  InputLabelLabel="Batch Type"
                  InputLabelSize={20}
                  label="Batch Type"
                  name="batchType"
                  {...formik.getFieldProps("batchType")}
                  onChange={formik.handleChange}
                  defaultItemLabel="Select Batch Type"
                  data={_.map(getBatchByMultipleClass?.data, (ev, index) => {
                    return (
                      <MenuItem key={ev.index} value={ev.id}>
                        {ev.name}
                      </MenuItem>
                    );
                  })}
                /> */}

                {/* for multiple batch type*/}
                <AutoCompleteCustom
                  multiple={true}
                  // loading={batchLoader}
                  disabled={scholorshipLoader}
                  InputLabelLoader={scholorshipLoader}
                  name="batchType"
                  options={_.map(getBatchByMultipleClass?.data, (ev) => {
                    return {
                      label: `${ev.name} (${ev.class})`,
                      value: ev.id
                    };
                  })}
                  value={formik.values.batchType}
                  onChange={(event, value) =>
                    formik.setFieldValue("batchType", value)
                  }
                  error={formik.touched.batchType && formik.errors.batchType}
                  label="Select Batch Type"
                />
                {/* for multiple board */}
                <FormControl
                  fullWidth
                  disabled={scholorshipLoader}
                  error={formik.touched.subject && formik.errors.subject}
                >
                  <InputLabel>
                    {scholorshipLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "Subject"
                    )}
                  </InputLabel>
                  <Select
                    label="Subject"
                    name="subject"
                    select
                    multiple
                    value={getSubject}
                    renderValue={(getSubject) =>
                      getSubject.map((i) => i.name).join(",")
                    }
                  >
                    <MenuItem defaultValue value="">
                      Select Subject
                    </MenuItem>
                    {getSubjectByMultipleClass?.data?.map((option) => (
                      <MenuItem
                        key={option.key}
                        value={{ id: option.id, name: option.name }}
                        onClick={() => handleChangeSubject(option)}
                      >
                        <ListItemIcon>
                          <Checkbox
                            checked={
                              getSubject.filter((i) => i.id === option.id)
                                .length > 0
                            }
                          />
                        </ListItemIcon>
                        <ListItemText primary={option.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  name="date"
                  type="date"
                  // label="Registration Start Date"
                  label="Exam Date"
                  {...formik.getFieldProps("date")}
                  onChange={formik.handleChange}
                  error={formik.touched.date && formik.errors.date}
                  inputProps={{ min: new Date().toISOString().split("T")[0] }}
                />
                <TextField
                  InputLabelProps={{ shrink: true }}
                  name="startTime"
                  type="time"
                  label="Exam Start Time"
                  style={{ color: "transparent !important" }}
                  fullWidth
                  {...formik.getFieldProps("startTime")}
                  onChange={formik.handleChange}
                  error={formik.touched.startTime && formik.errors.startTime}
                />
                <TextField
                  InputLabelProps={{ shrink: true }}
                  name="endTime"
                  type="time"
                  label="Exam End Time"
                  style={{ color: "transparent !important" }}
                  fullWidth
                  {...formik.getFieldProps("endTime")}
                  onChange={formik.handleChange}
                  error={formik.touched.endTime && formik.errors.endTime}
                />
              </Box>
              <Stack alignItems="flex-end">
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={scholorshipLoader}
                >
                  {id ? "Update Scholarship Class" : "Create Scholarship Class"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default AddScholorship;
