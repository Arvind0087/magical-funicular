import React, { useEffect, useMemo, useState } from "react";
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
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import {
  getBatchByCourseBoardClassAsync,
  getBoardsByCourseIdAsync,
  getChapterBySubjectId,
  getClassByBoardAndCourseIdAsync,
  getSubjectByBatchTypeIdAsync,
} from "redux/async.api";
import {
  addPyqsAsync,
  updatePyqsByIdAsync,
  getPyqsByIdAsync,
} from "redux/freeResource/freeresource.async";
import { useDispatch, useSelector } from "react-redux";
import { _initial, _validate } from "./utils";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { useParams } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";
import { getcourseAsync } from "redux/course/course.async";
import { GenerateBase64 } from "utils/convertToBase64";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { emptyfreeresourceSlice } from "redux/freeResource/freeresource.slice";
import { useNavigate } from "react-router-dom";
import UploadBox from "components/CustomUploads/UploadBox";

export default function AddTopics() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { themeStretch } = useSettingsContext();
  const [yearValue, setYearValue] = useState(dayjs(null));
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  const previousYear = currentYear - 1;
  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader, boardByCourse } = useSelector((state) => state.board);
  const { classLoader, classbycourseboard } = useSelector(
    (state) => state.class
  );
  const { batchLoader, batchByCourseBoardClass } = useSelector(
    (state) => state.batch
  );
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const {
    createPyqsLoader,
    createPyqs,
    updatePyqsLoader,
    updatePyqs,
    getByIdPyqsLoader,
    getByIdPyqs,
  } = useSelector((state) => state.freeresource);

  const onSubmit = async (values) => {
    let brochureBase64 = " ";
    if (values.brochure[0] !== null) {
      brochureBase64 = await GenerateBase64(values.brochure[0]);
    } else {
      brochureBase64 = "";
    }

    const payload = {
      Id: Number(id),
      batchTypeId: values.batchTypeId,
      year: yearValue.year(),
      pdf_title: values.pdftitle,
      video_title: values.videotitle,
      title: values.title,
      pdf: brochureBase64,
      video: values.videourl,
      ORDERSEQ: values.orderseq || 0,
    };
    if (id) {
      dispatch(updatePyqsByIdAsync(payload));
    } else {
      delete payload.Id;
      dispatch(addPyqsAsync(payload));
    }
  };

  useEffect(() => {
    dispatch(getcourseAsync({}));
  }, []);

  useMemo(() => {
    if (id) dispatch(getPyqsByIdAsync(id));
  }, [id]);

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate,
  });

  const handleDrop = (acceptedFiles) => {
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

  useEffect(() => {
    if (formik.values.courseId) {
      dispatch(
        getBoardsByCourseIdAsync({
          courseId: formik.values.courseId,
        })
      ).then((res) => {
        if (res?.payload?.status == 200) {
          if (res?.payload?.data?.length > 0 && res?.payload.data[0]) {
            dispatch(
              getClassByBoardAndCourseIdAsync({
                courseId: formik.values.courseId,
                boardId: res?.payload.data[0]?.id,
              })
            );
          }
        }
      });
    }
    if (id && getByIdPyqs?.data?.courseId) {
      dispatch(
        getBoardsByCourseIdAsync({
          courseId: getByIdPyqs?.data?.courseId,
        })
      );
    }
  }, [formik.values.courseId, id, getByIdPyqs?.data?.courseId]);

  // useEffect(() => {
  //   if (formik.values.boardId) {
  //     dispatch(
  //       getClassByBoardAndCourseIdAsync({
  //         courseId: formik.values.courseId,
  //         boardId: formik.values.boardId,
  //       })
  //     );
  //   }
  // }, [formik.values.boardId]);

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

  const handleYearChange = (newValue) => {
    setYearValue(newValue);
  };

  useEffect(() => {
    if (id && getByIdPyqs) {
      formik.setFieldValue("courseId", getByIdPyqs?.data?.courseId);
      formik.setFieldValue("boardId", getByIdPyqs?.data?.boardId);
      formik.setFieldValue("classId", getByIdPyqs?.data?.classId);
      formik.setFieldValue("batchTypeId", getByIdPyqs?.data?.batchTypeId);
      // formik.setFieldValue("year", getByIdPyqs?.data?.year);

      let yearData = getByIdPyqs?.data?.year;
      if (yearData) {
        setYearValue(dayjs(`${yearData}-01-01`));
      } else {
        setYearValue(null);
      }

      formik.setFieldValue("pdftitle", getByIdPyqs?.data?.pdf_title);
      formik.setFieldValue("videotitle", getByIdPyqs?.data?.video_title);
      formik.setFieldValue("title", getByIdPyqs?.data?.title);
      formik.setFieldValue("videourl", getByIdPyqs?.data?.video);
      formik.setFieldValue("orderseq", getByIdPyqs?.data?.ORDERSEQ);
      formik.setFieldValue("brochure", [getByIdPyqs?.data?.pdf]);
    }
  }, [getByIdPyqs, id]);

  useEffect(() => {
    if (createPyqs.status === 200) {
      toast.success(createPyqs.message, toastoptions);
      dispatch(emptyfreeresourceSlice());
      navigate(PATH_DASHBOARD.pyqslist);
    }
    if (updatePyqs.status === 200) {
      toast.success(updatePyqs.message, toastoptions);
      formik.resetForm();
      dispatch(emptyfreeresourceSlice());
      navigate(PATH_DASHBOARD.pyqslist);
    }
  }, [createPyqs, updatePyqs]);

  useEffect(() => {
    setCurrentYear(dayjs().year());
  }, []);

  return (
    <>
      <Helmet>
        <title>Free Resource | {`${tabTitle}`}</title>
      </Helmet>
      <Container maxWidth={themeStretch ? "lg" : false}>
        <CustomBreadcrumbs
          links={[
            { name: "Free Resource", href: "" },
            { name: "PYQs", href: `${PATH_DASHBOARD.pyqslist}` },
            { name: id ? "Update PYQs" : "Create PYQs" },
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
                    error={formik.touched.courseId && formik.errors.courseId}
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
                      {course?.data?.map((ev) => {
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
                    disabled={boardLoader}
                    error={formik.touched.boardId && formik.errors.boardId}
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
                      {boardByCourse?.map((ev) => {
                        return (
                          <MenuItem value={ev.id} key={ev.index}>
                            {ev.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl> */}

                  <FormControl
                    fullWidth
                    disabled={classLoader}
                    error={formik.touched.classId && formik.errors.classId}
                  >
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
                      onChange={formik.handleChange}
                    >
                      <MenuItem defaultValue value="">
                        Select Class
                      </MenuItem>
                      {classbycourseboard?.map((ev) => {
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
                    error={
                      formik.touched.batchTypeId && formik.errors.batchTypeId
                    }
                  >
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
                      name="title"
                      label="PYQs Title"
                      style={{ color: "transparent !important" }}
                      fullWidth
                      {...formik.getFieldProps("title")}
                      onChange={formik.handleChange}
                      error={formik.touched.title && formik.errors.title}
                    />
                  </FormControl>

                  {/*<FormControl fullWidth>
                    <TextField
                      name="year"
                      label="Year"
                      // type="number"
                      style={{ color: "transparent !important" }}
                      fullWidth
                      {...formik.getFieldProps("year")}
                      onChange={formik.handleChange}
                      error={formik.touched.year && formik.errors.year}
                    />
                  </FormControl> */}

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Select Year"
                      views={["year"]}
                      value={yearValue}
                      onChange={handleYearChange}
                      renderInput={(params) => <TextField {...params} />}
                      // shouldDisableYear={(year) => year <= currentYear}
                    />
                  </LocalizationProvider>

                  <FormControl fullWidth>
                    <TextField
                      name="pdftitle"
                      label="Pdf Title"
                      style={{ color: "transparent !important" }}
                      fullWidth
                      {...formik.getFieldProps("pdftitle")}
                      onChange={formik.handleChange}
                      error={formik.touched.pdftitle && formik.errors.pdftitle}
                    />
                  </FormControl>

                  <Box sx={{ mb: "0px" }}>
                    <UploadBox
                      height={58}
                      name="brochure"
                      label="Pdf"
                      accept={{
                        "pdf/*": [],
                      }}
                      onDrop={handleDrop}
                      file={formik.values.brochure[0]}
                      error={Boolean(
                        formik.touched.brochure && formik.errors.brochure
                      )}
                    />
                  </Box>

                  <FormControl fullWidth>
                    <TextField
                      name="videotitle"
                      label="Video Title"
                      style={{ color: "transparent !important" }}
                      fullWidth
                      {...formik.getFieldProps("videotitle")}
                      onChange={formik.handleChange}
                      // error={formik.touched.videotitle && formik.errors.videotitle}
                    />
                  </FormControl>

                  <FormControl fullWidth>
                    <TextField
                      name="videourl"
                      label="Video Url"
                      style={{ color: "transparent !important" }}
                      fullWidth
                      {...formik.getFieldProps("videourl")}
                      onChange={formik.handleChange}
                      error={formik.touched.videourl && formik.errors.videourl}
                    />
                  </FormControl>

                  <FormControl fullWidth>
                    <TextField
                      name="orderseq"
                      label="Sequence"
                      type="number"
                      style={{ color: "transparent !important" }}
                      fullWidth
                      {...formik.getFieldProps("orderseq")}
                      onChange={formik.handleChange}
                      error={formik.touched.orderseq && formik.errors.orderseq}
                    />
                  </FormControl>
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={createPyqsLoader}
                  >
                    {id ? "Update PYQs" : "Create PYQs"}
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
