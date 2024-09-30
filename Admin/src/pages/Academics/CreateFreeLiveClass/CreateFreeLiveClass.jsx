import { Helmet } from "react-helmet-async";
import React, { useEffect, useState } from "react";
import {
  Card,
  Grid,
  MenuItem,
  TextField,
  Box,
  Container,
  Stack,
  Select,
  FormControl,
  ListItemIcon,
  InputLabel,
  Checkbox,
  ListItemText,
} from "@mui/material";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import {
  _initial,
  _initialValues,
  _time,
  _type,
  _category,
  _validate,
  _validation,
} from "./utils";
import { useFormik } from "formik";
import {
  createLiveEventAsync,
  getLiveEventByIdAsync,
  updateLiveEventByIdAsync,
  getSubjectByOnlyBatchTypeIdAsync,
  getChapterByOnlySubjectIdAsync,
} from "redux/liveclass/liveclass.async";
import { getAllStaffsAsync } from "redux/staff/staff.async";
import { useSelector, useDispatch } from "react-redux";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
import { emptyliveclass } from "redux/liveclass/liveclass.slice";
import { useNavigate, useParams } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";
import SelectMenuItem from "components/SelectMenuItem/index";
import { getCoursePackagesAsync } from "redux/productPackage/productPackage.async";
import { getcourseAsync } from "redux/course/course.async";
import { getBoardsByCourseIdAsync } from "redux/board/board.async";
import { getClassByBoardAndCourseIdAsync } from "redux/class/class.async";
import _ from "lodash";
import { getAllBatchTypes } from "redux/batchtype/batchtype.async";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import UploadBox from "components/CustomUploads/UploadBox";
import { GenerateBase64 } from "utils/convertToBase64";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";

export default function CreateLiveClass() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [getChapterChecked, setChapterChecked] = useState([]);
  const [getChapterCheckedAll, setChapterCheckedAll] = useState(false);
  const [getSubjectChecked, setSubjectChecked] = useState([]);
  const [getSubjectCheckedAll, setSubjectCheckedAll] = useState(false);
  const [getTeacherChecked, setTeacherChecked] = useState([]);
  const [getTeacherCheckedAll, setTeacherCheckedAll] = useState(false);
  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader, boardByCourse } = useSelector((state) => state.board);
  const { classLoader, classbycourseboard } = useSelector(
    (state) => state.class
  );
  const { batchLoader, batchadd, batchById, batchupdate, batches } =
    useSelector((state) => state.batch);

  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const { userinfo } = useSelector((state) => state.userinfo);
  const { getPackageLoader, getAllPackage, allPackagesLoader, allPackages } =
    useSelector((state) => state.package);

  const { staffLoader, staffs } = useSelector((state) => state.staff);

  const {
    liveclassLoader,
    liveclassadd,
    liveclassId,
    liveclassUpdate,
    liveclassSubjectId,
    liveclassChapterId,
  } = useSelector((state) => state.liveclass);

  const handleDrop = (acceptedFiles) => {
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

    let brochureBase64 = " ";
    if (values.brochure[0] !== null) {
      brochureBase64 = await GenerateBase64(values.brochure[0]);
    } else {
      brochureBase64 = "";
    }

    const selectedDateTime = new Date(values.attemptBy);
    const currentDateTime = new Date();

    if (selectedDateTime <= currentDateTime && !id) {
      toast.error(
        "The selected date and time is earlier than the current date and time.",
        toastoptions
      );
      return;
    }

    const payload = {
      eventId: id,
      batchTypeId: values.batchTypeId,
      subjectId: values.subjectId,
      // chapterId: values?.chapterId?.value,
      teacherId: getTeacherChecked,
      type: "Free_Live_Class",
      attemptBy: `${values.attemptBy}:00`,
      endBy: `${values.endBy}:00`,
      // time: values.time,
      url: values.linkUrl,
      category: "Youtube",
      thumbnail: ImageBase64,
      title: values.title,
      packageId: values?.packageId,
      note: brochureBase64,
    };
    if (id) {
      dispatch(updateLiveEventByIdAsync(payload));
    } else {
      delete payload.eventId;
      dispatch(createLiveEventAsync(payload));
    }
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate,
  });

  const currentDateTimeCheck = () => {
    const selectedDate = new Date(formik?.values?.attemptBy);
    const currentDate = new Date();
    if (selectedDate < currentDate && id) {
      return true;
    } else {
      return false;
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
    const payload = {
      classes: formik?.values?.classId,
    };
    dispatch(getAllBatchTypes(payload));
  }, [formik?.values?.classId]);

  useEffect(() => {
    dispatch(
      getAllStaffsAsync({
        page: "",
        limit: "",
        search: "",
        department: 4,
        classes: "",
      })
    );
    getCourseAsync();
  }, []);

  useEffect(() => {
    if (formik?.values?.batchTypeId) {
      dispatch(
        getSubjectByOnlyBatchTypeIdAsync({
          batchTypeId: formik?.values?.batchTypeId,
        })
      );
    }
  }, [formik?.values?.batchTypeId]);

  useEffect(() => {
    if (formik.values.subjectId) {
      dispatch(
        getChapterByOnlySubjectIdAsync({
          subjectId: formik.values?.subjectId?.value,
        })
      );
    }
  }, [formik.values.subjectId]);

  useEffect(() => {
    dispatch(
      getCoursePackagesAsync({
        batchId: "",
      })
    );
  }, []);

  useEffect(() => {
    if (formik?.values?.batchTypeId) {
      dispatch(
        getCoursePackagesAsync({
          batchId: formik?.values?.batchTypeId,
        })
      );
    }
  }, [formik?.values?.batchTypeId]);

  useEffect(() => {
    if (id) dispatch(getLiveEventByIdAsync(id));
  }, [id]);

  useEffect(() => {
    if (id && liveclassId) {
      formik.setFieldValue("courseId", liveclassId?.courseId);
      formik.setFieldValue("boardId", liveclassId?.boardId);
      formik.setFieldValue("classId", liveclassId?.classId);
      formik.setFieldValue("batchTypeId", liveclassId?.batchTypeId);
      formik.setFieldValue("subjectId", liveclassId?.subjectId);
      formik.setFieldValue("linkUrl", liveclassId?.url);
      formik.setFieldValue("image", [liveclassId?.thumbnail]);
      formik.setFieldValue("title", liveclassId?.title);
      formik.setFieldValue("brochure", [liveclassId?.note]);
      formik.setFieldValue("packageId", liveclassId?.packageId);

      let teachersId = [];

      if (liveclassId?.teachers?.length > 0) {
        teachersId = liveclassId?.teachers?.map((item) => item?.teacherId);
      }

      formik.setFieldValue("teacherId", teachersId);
      setTeacherChecked(teachersId);

      if (teacherList?.length == teachersId?.length) {
        setTeacherCheckedAll(true);
      } else {
        setTeacherCheckedAll(false);
      }

      if (liveclassId?.attemptBy) {
        const attempt = liveclassId?.attemptBy?.split(":");
        formik.setFieldValue("attemptBy", `${attempt[0]}:${attempt[1]}`);
      }

      if (liveclassId?.endBy) {
        const endByAttemp = liveclassId?.endBy?.split(":");
        formik.setFieldValue("endBy", `${endByAttemp[0]}:${endByAttemp[1]}`);
      }
    }
  }, [liveclassId, id]);

  useEffect(() => {
    if (liveclassadd.status === 200) {
      toast.success(liveclassadd.message, toastoptions);
      dispatch(emptyliveclass());
      formik.resetForm();
      navigate(PATH_DASHBOARD.freeliveclass);
    }
    if (liveclassUpdate.status === 200) {
      toast.success(liveclassUpdate.message, toastoptions);
      dispatch(emptyliveclass());
      navigate(PATH_DASHBOARD.freeliveclass);
    }
  }, [liveclassadd, liveclassUpdate]);

  const handleDropNew = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const filesName = file.path.includes(".pdf");

    if (file.size > 5 * 1024 * 1024) {
      toast.error("The file size should not exceed 5 MB.", toastoptions);
      return false;
    }

    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    if (file) {
      if (filesName == true) {
        formik.setFieldValue("brochure", [newFile]);
      } else {
        formik.setFieldValue("thumbnail", [newFile]);
      }
    }
  };

  const teacherList = staffs?.data;

  const handleChangeTeacherCheckbox = (data) => {
    formik.handleChange(data);
    setTeacherCheckedAll(false);
    const id = JSON.parse(data).id;
    const index = getTeacherChecked.indexOf(id);
    let updatedCheckedValue;

    if (index === -1) {
      updatedCheckedValue = [...getTeacherChecked, id];
    } else {
      updatedCheckedValue = getTeacherChecked.filter((item) => item !== id);
    }

    setTeacherChecked(updatedCheckedValue);
    formik.setFieldValue("teacherId", updatedCheckedValue);

    if (
      teacherList?.length > 0 &&
      updatedCheckedValue.length === teacherList.length
    ) {
      setTeacherCheckedAll(true);
    } else {
      setTeacherCheckedAll(false);
    }
  };

  const handleCheckedTeacherAll = (data) => {
    setTeacherCheckedAll(data);
    if (data) {
      const ids = teacherList?.map((i) => i.id);
      setTeacherChecked(ids);
      formik.setFieldValue("teacherId", ids);
    } else {
      setTeacherChecked([]);
      formik.setFieldValue("teacherId", []);
    }
  };

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Free Live Class | {`${tabTitle}`}</title>
      </Helmet>

      <CustomBreadcrumbs
        links={[
          { name: "Academic", href: "" },
          {
            name: "Free Live Class",
            href: PATH_DASHBOARD.freeliveclass,
          },
          { name: id ? "Update Free Live Class" : "Create Free Live Class" },
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
                  disabled={batchLoader}
                  error={Boolean(
                    formik.touched.batchTypeId && formik.errors.batchTypeId
                  )}
                >
                  <InputLabel>
                    {classLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "Batch Type"
                    )}
                  </InputLabel>
                  <Select
                    label="Batch Type"
                    name="batchTypeId"
                    {...formik.getFieldProps("batchTypeId")}
                    onChange={formik.handleChange}
                  >
                    <MenuItem defaultValue value="" disabled>
                      {batches?.data?.length > 0 ? "Batch Type" : "No Batch"}
                    </MenuItem>
                    {batches?.data?.map((ev, index) => {
                      return (
                        <MenuItem value={ev.id} key={ev.index}>
                          {`${ev?.batchTypeName} (${ev?.course}) (${ev?.class})`}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  disabled={allPackagesLoader}
                  error={Boolean(
                    formik.touched.packageId && formik.errors.packageId
                  )}
                >
                  <InputLabel>
                    {allPackagesLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "Package"
                    )}
                  </InputLabel>
                  <Select
                    label="Package"
                    name="packageId"
                    {...formik.getFieldProps("packageId")}
                    onChange={formik.handleChange}
                  >
                    <MenuItem defaultValue value="" disabled>
                      {allPackages?.data?.length > 0
                        ? "Select Package"
                        : "No package"}
                    </MenuItem>
                    {allPackages?.data?.map((ev, index) => {
                      return (
                        <MenuItem value={ev.id} key={ev.index}>
                          {`${ev?.package_title}`}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  disabled={liveclassLoader}
                  error={Boolean(
                    formik.touched.subjectId && formik.errors.subjectId
                  )}
                >
                  <InputLabel>
                    {liveclassLoader ? (
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
                    <MenuItem defaultValue value="" disabled>
                      {liveclassSubjectId?.data?.length > 0
                        ? "Select Subject"
                        : "No Subject"}
                    </MenuItem>
                    {liveclassSubjectId?.data?.map((ev, index) => {
                      return (
                        <MenuItem value={ev.id} key={ev.index}>
                          {`${ev?.name}`}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <UploadBox
                  height={58}
                  name="image"
                  label="Thumbnail"
                  accept={{
                    "image/*": [],
                  }}
                  onDrop={handleDrop}
                  file={formik.values.image[0]}
                  error={Boolean(formik.touched.image && formik.errors.image)}
                />
                <FormControl fullWidth>
                  <TextField
                    name="title"
                    type="text"
                    label={"Title"}
                    {...formik.getFieldProps("title")}
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                    error={Boolean(formik.touched.title && formik.errors.title)}
                    InputProps={{ sx: { height: "55px" } }}
                  />
                </FormControl>

                <TextField
                  InputLabelProps={{ shrink: true }}
                  name="attemptBy"
                  type="datetime-local"
                  label="Starts By"
                  inputProps={{
                    // min: new Date().toISOString().slice(0, 16),
                    max: "9999-12-31T23:59",
                  }}
                  disabled={currentDateTimeCheck()}
                  fullWidth
                  {...formik.getFieldProps("attemptBy")}
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.attemptBy && formik.errors.attemptBy
                  )}
                />
                <TextField
                  InputLabelProps={{ shrink: true }}
                  name="endBy"
                  type="datetime-local"
                  label="Ends By"
                  disabled={currentDateTimeCheck()}
                  inputProps={{
                    min: formik?.values?.attemptBy
                      ? formik?.values?.attemptBy
                      : new Date().toISOString().slice(0, 16),
                    max: "9999-12-31T23:59",
                  }}
                  fullWidth
                  {...formik.getFieldProps("endBy")}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.endBy && formik.errors.endBy)}
                />

                {/* <SelectMenuItem
                  fullWidth
                  error={formik.touched.time && formik.errors.time}
                  InputLabelLabel="Live Class Duration"
                  InputLabelSize={20}
                  label="Live Class Duration"
                  name="time"
                  {...formik.getFieldProps("time")}
                  onChange={formik.handleChange}
                  defaultItemLabel="Select Duration"
                  data={_.map(_time, (ev, index) => {
                    return (
                      <MenuItem value={ev.value} key={index}>
                        {ev.label}
                      </MenuItem>
                    );
                  })}
                /> */}

                <FormControl
                  fullWidth
                  error={
                    formik.touched.teacherId && Boolean(formik.errors.teacherId)
                  }
                >
                  <InputLabel>
                    {staffLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "Teacher(s)"
                    )}
                  </InputLabel>
                  <Select
                    name="teacherId"
                    label="Teacher(s)"
                    select
                    multiple
                    value={getTeacherChecked}
                    renderValue={(selected) =>
                      selected
                        .map((id) => {
                          const foundItem = teacherList?.find(
                            (item) => item.id === id
                          );
                          return foundItem ? foundItem?.name : "";
                        })
                        .join(", ")
                    }
                  >
                    {teacherList?.length > 0 ? (
                      <>
                        <MenuItem>
                          <ListItemIcon>
                            <Checkbox
                              value={getTeacherCheckedAll}
                              checked={getTeacherCheckedAll}
                              onChange={(event) =>
                                handleCheckedTeacherAll(event.target.checked)
                              }
                            />
                            <ListItemText
                              style={{ marginTop: "8px" }}
                              primary="Select All"
                            />
                          </ListItemIcon>
                        </MenuItem>
                        {teacherList?.map((ev) => (
                          <MenuItem key={ev.id}>
                            <ListItemIcon>
                              <Checkbox
                                value={JSON.stringify({
                                  id: ev.id,
                                  name: ev.name,
                                })}
                                checked={getTeacherChecked.includes(ev.id)}
                                onChange={(event) =>
                                  handleChangeTeacherCheckbox(
                                    event.target.value
                                  )
                                }
                              />
                            </ListItemIcon>
                            <ListItemText>{ev.name}</ListItemText>
                          </MenuItem>
                        ))}
                      </>
                    ) : (
                      <MenuItem disabled>
                        <ListItemText primary="No teachers available" />
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    name="linkUrl"
                    type="text"
                    label={"Url"}
                    {...formik.getFieldProps("linkUrl")}
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                    error={Boolean(
                      formik.touched.linkUrl && formik.errors.linkUrl
                    )}
                    InputProps={{ sx: { height: "55px" } }}
                  />
                </FormControl>

                <UploadBox
                  height={58}
                  name="brochure"
                  label="Notes"
                  accept={{
                    "pdf/*": [],
                  }}
                  onDrop={handleDropNew}
                  file={formik?.values?.brochure[0]}
                  // error={Boolean(
                  //   formik.touched.brochure && formik.errors.brochure
                  // )}
                />
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={liveclassLoader}
                >
                  {Boolean(id)
                    ? "Update Free Live Class"
                    : "Create Free Live Class"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
