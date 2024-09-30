import React, { useState, useEffect } from "react";
import {
  Card,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ListItemIcon,
  Checkbox,
  ListItemText,
  InputAdornment,
} from "@mui/material";
import Iconify from "components/iconify";
import { Helmet } from "react-helmet-async";
import { Container, Stack, Box } from "@mui/system";
import { LoadingButton } from "@mui/lab";
import { Upload } from "components/upload";
import Editor from "components/editor/Editor";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  getBoardsByCourseIdAsync,
  getClassByBoardAndCourseIdAsync,
  getStudentsForNoticeAsync,
  createNoticeAsync,
  getStudentAsync,
} from "redux/async.api";
import { getAllBatchTypes } from "redux/batchtype/batchtype.async";
import { getBatchByCourseBoardClassAsync } from "redux/batchtype/batchtype.async";
import { getAllBackLinkAsync } from "redux/slices/NoticeBackLinkSlice/NoticeBackLinkAsync";
import { getBatchLanguageByClassIdAsync } from "redux/language/language.async";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { useNavigate, useParams } from "react-router";
import { noticePageValidate, _initialValues, noticeTypes } from "./utils";
import { GenerateBase64 } from "utils/convertToBase64";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { emptynotice } from "redux/slices/notice.slice";
import { getcourseAsync } from "redux/course/course.async";
import { PATH_DASHBOARD } from "routes/paths";
import { allCoursePackagesAsync } from "redux/productPackage/productPackage.async";
import MultiselectSearch from "../components/MultiselectSearch";

function Notice() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { studentLoader, students } = useSelector((state) => state.student);
  const [courseIdBoard, setCourseIdBoard] = useState("");
  const [boardIdCourse, setBoardIdCourse] = useState("");
  const [classIdBatch, setClassIdBatch] = useState("");
  const [getBatchID, setBatchID] = useState("");
  const [getCheckedValue, setCheckedValue] = useState([]);
  const [getCheckedAll, setCheckedAll] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [studentData, setStudentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showStartButton, setShowStartButton] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState(new Set());
  const [userSelected, setUserSelected] = useState(true);

  const { langClassLoader, getLanByClass } = useSelector(
    (state) => state?.language
  );

  const { getPackageLoader, getAllPackage } = useSelector(
    (state) => state.package
  );

  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader, boardByCourse } = useSelector((state) => state.board);
  const { classLoader, classbycourseboard } = useSelector(
    (state) => state.class
  );
  const { batchLoader, batchByCourseBoardClass, batches } = useSelector(
    (state) => state.batch
  );

  const { noticeLoader, sendNotice } = useSelector((state) => state.notice);
  const { NoticeBackLinkLoader, NoticeBackLink } = useSelector(
    (state) => state.NoticeBackLink
  );
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const [isother, setIsother] = useState(false);

  let localSelectedOption = [...selectedOptions];

  useEffect(() => {
    dispatch(
      getcourseAsync({
        page: "",
        limit: "",
      })
    );
    dispatch(
      allCoursePackagesAsync({
        page: "",
        limit: "",
      })
    );
  }, []);

  useEffect(() => {
    dispatch(
      getStudentAsync({
        page: 1,
        limit: 20,
        course: "",
        classes: "",
        search: "",
        type: "",
      })
    );
  }, []);

  useEffect(() => {
    dispatch(
      getAllBackLinkAsync({
        page: "",
        limit: "",
      })
    );
  }, []);

  const onSubmit = async (values) => {
    const imageBase64 = await GenerateBase64(values.image[0]);
    let payload;
    if (isother) {
      payload = {
        Id: id,
        image: imageBase64,
        courseId: values?.courseId,
        boardId: values?.boardId,
        classId: values?.classId,
        batchTypeId: formik?.values?.batchLang,
        package: values?.package,
        notice_type: formik?.values?.type,
        title: values.title,
        description: values.description,
        backLinkId: values.backLinkId,
        otherLink: values.otherLink,
      };
    } else {
      payload = {
        image: imageBase64,
        courseId: values?.courseId,
        boardId: values?.boardId,
        classId: values?.classId,
        batchTypeId: formik?.values?.batchLang,
        package: values?.package,
        notice_type: formik?.values?.type,
        title: values.title,
        description: values.description,
        backLinkId: values.backLinkId,
      };
    }

    if (formik?.values?.type == "all") {
      if (localSelectedOption?.length == 0) {
        setUserSelected(false);
        toast.error("Please select Student", toastoptions);
        return false;
      }
      if (getCheckedAll) {
        payload.student = [];
        delete payload.courseId;
        delete payload.package;
        delete payload.boardId;
        delete payload.classId;
        delete payload.batchTypeId;
      } else {
        payload.notice_type = "student";
        // payload.student = values?.student?.map((students) => {
        //   return JSON.parse(students).id;
        // });
        payload.student = localSelectedOption;
        delete payload.courseId;
        delete payload.package;
        delete payload.boardId;
        delete payload.classId;
        delete payload.batchTypeId;
      }
    } else if (formik?.values?.type == "course") {
      delete payload.package;
      delete payload.student;
      delete payload.boardId;
      delete payload.classId;
      delete payload.batchTypeId;
    } else if (formik?.values?.type == "package") {
      delete payload.student;
      delete payload.boardId;
      delete payload.classId;
      delete payload.batchTypeId;
    } else if (formik?.values?.type == "class") {
      delete payload.package;
      delete payload.student;
      delete payload.batchTypeId;
    } else if (formik?.values?.type == "language") {
      delete payload.package;
      delete payload.student;
    }
    dispatch(createNoticeAsync(payload));
  };

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: noticePageValidate,
  });

  useEffect(() => {
    if (formik?.values?.classId) {
      let payload = {
        classes: formik?.values?.classId,
      };
      dispatch(getAllBatchTypes(payload));
    }
  }, [formik?.values?.classId]);

  useEffect(() => {
    if (formik.values.classId) {
      dispatch(getBatchLanguageByClassIdAsync(formik.values.classId));
    }
  }, [formik.values.classId]);

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
    if (
      formik.values.courseId &&
      formik.values.boardId &&
      formik.values.classId &&
      formik?.values?.type == "language"
    ) {
      dispatch(
        getBatchByCourseBoardClassAsync({
          courseId: formik.values.courseId,
          boardId: formik.values.boardId,
          classId: formik.values.classId,
        })
      );
    }
  }, [formik.values.classId]);

  const handleDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    formik.setFieldValue("image", [...formik.values.image, ...newFiles]);
  };

  useEffect(() => {
    if (sendNotice.status === 200) {
      toast.success(sendNotice.message, toastoptions);
      formik.resetForm();
      dispatch(emptynotice());
      navigate(PATH_DASHBOARD.notice);
    }
  }, [sendNotice]);

  useEffect(() => {
    if (NoticeBackLink?.data?.length > 0 && formik.values.backLinkId) {
      setIsother(
        NoticeBackLink?.data?.find((ev) => formik.values.backLinkId === ev.id)
          .backLink === ""
      );
    }
  }, [NoticeBackLink, formik.values]);

  useEffect(() => {
    if (formik?.values?.type == "course") {
      formik.setFieldValue("courseId", "");
    } else if (formik?.values?.type == "package") {
      formik.setFieldValue("package", "");
    } else if (formik?.values?.type == "class") {
      formik.setFieldValue("courseId", "");
      formik.setFieldValue("boardId", "");
      formik.setFieldValue("classId", "");
    } else if (formik?.values?.type == "language") {
      formik.setFieldValue("courseId", "");
      formik.setFieldValue("boardId", "");
      formik.setFieldValue("classId", "");
      formik.setFieldValue("batchLang", "");
    }
  }, [formik?.values?.type]);

  // const fetchInitialData = async () => {
  //   try {
  //     if (students?.data?.length > 0) {
  //       const newData = students?.data?.slice(0, 20);
  //       setStudentData(newData);
  //       let totalPages = Math.ceil(students?.data?.length / 20);
  //       setTotalPages(totalPages);
  //       setShowStartButton(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchInitialData();
  // }, []);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Notice | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={id ? "Update Notice" : "Create Notice"}
        links={[
          { name: "Notice", href: PATH_DASHBOARD.notice },
          { name: id ? "Update Notice" : "Create Notice" },
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
                  error={formik.touched.type && formik.errors.type}
                >
                  <InputLabel>Notice Types</InputLabel>
                  <Select
                    label="type"
                    name="type"
                    {...formik.getFieldProps("type")}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="">Select Types</MenuItem>
                    {noticeTypes?.map((ev, index) => {
                      return (
                        <MenuItem key={ev.index} value={ev.name}>
                          {ev.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                {formik?.values?.type == "all" && (
                  <>
                    <MultiselectSearch
                      students={students?.data}
                      selectedOptions={selectedOptions}
                      setSelectedOptions={setSelectedOptions}
                      setCheckedAll={setCheckedAll}
                      userSelected={userSelected}
                      setUserSelected={setUserSelected}
                    />
                  </>
                )}

                {(formik?.values?.type == "course" ||
                  formik?.values?.type == "class" ||
                  formik?.values?.type == "language") && (
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
                      onChange={(event) => {
                        formik.handleChange(event);
                        setCourseIdBoard(event.target.value);
                      }}
                    >
                      <MenuItem defaultValue value="">
                        Select Course
                      </MenuItem>
                      {course?.data?.map((ev, index) => {
                        return (
                          <MenuItem key={ev.index} value={ev.id}>
                            {ev.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}

                {(formik?.values?.type == "class" ||
                  formik?.values?.type == "language") && (
                  <>
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
                  </>
                )}

                {formik?.values?.type == "language" && (
                  <FormControl
                    fullWidth
                    error={Boolean(
                      formik.touched.batchLang && formik.errors.batchLang
                    )}
                  >
                    <InputLabel>
                      {batchLoader ? (
                        <CustomComponentLoader padding="0 0" size={20} />
                      ) : (
                        "Batch Language"
                      )}
                    </InputLabel>
                    <Select
                      label="Language"
                      name="batchLang"
                      {...formik.getFieldProps("batchLang")}
                      onChange={formik.handleChange}
                    >
                      <MenuItem defaultValue value="">
                        Select Language
                      </MenuItem>
                      {batches?.data?.map((ev, index) => {
                        return (
                          <MenuItem value={ev?.id} key={index}>
                            {ev?.batchTypeName} ({ev.language})
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}

                {formik?.values?.type == "package" && (
                  <FormControl
                    fullWidth
                    disabled={getPackageLoader}
                    error={formik.touched.package && formik.errors.package}
                  >
                    <InputLabel>
                      {getPackageLoader ? (
                        <CustomComponentLoader padding="0 0" size={20} />
                      ) : (
                        "Package"
                      )}
                    </InputLabel>

                    <Select
                      label="Package"
                      name="package"
                      {...formik.getFieldProps("package")}
                      onChange={formik.handleChange}
                    >
                      <MenuItem defaultValue value="">
                        Select Package
                      </MenuItem>
                      {getAllPackage?.data?.map((ev, index) => {
                        return (
                          <MenuItem key={ev.index} value={ev.id}>
                            {ev.package_title}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}

                <FormControl fullWidth>
                  <TextField
                    label="Title"
                    name="title"
                    fullWidth
                    {...formik.getFieldProps("title")}
                    onChange={formik.handleChange}
                    error={formik.touched.title && formik.errors.title}
                  />
                </FormControl>

                <FormControl
                  fullWidth
                  disabled={NoticeBackLinkLoader}
                  error={Boolean(
                    formik.touched.buttonLink && formik.errors.buttonLink
                  )}
                >
                  <InputLabel>
                    {NoticeBackLinkLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "Back Link"
                    )}
                  </InputLabel>
                  <Select
                    label="buttonLink"
                    name="backLinkId"
                    {...formik.getFieldProps("backLinkId")}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="">Select</MenuItem>

                    {NoticeBackLink?.data?.map((ev, index) => {
                      return (
                        <MenuItem key={ev.index} value={ev.id}>
                          {ev.page}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>

              {/* backlink */}
              {isother ? (
                <FormControl
                  fullWidth
                  sx={{ mt: 3 }}
                  error={Boolean(
                    formik.touched.otherLink && formik.errors.otherLink
                  )}
                >
                  <TextField
                    fullWidth
                    label="otherLink"
                    name="otherLink"
                    {...formik.getFieldProps("otherLink")}
                    onChange={formik.handleChange}
                    error={formik.touched.otherLink && formik.errors.otherLink}
                  />
                </FormControl>
              ) : (
                ""
              )}

              <Typography
                variant="subtitle2"
                sx={{ color: "text.secondary", mt: "10px", mb: "10px" }}
              >
                Notice Description
              </Typography>

              <Editor
                name="description"
                value={formik.values.description}
                onChange={(e) => {
                  formik.setFieldValue("description", e);
                }}
                error={formik.touched.description && formik.errors.description}
              />

              <Typography
                variant="subtitle2"
                sx={{ color: "text.secondary", mt: "10px", mb: "10px" }}
              >
                Notice Image
              </Typography>
              <Upload
                name="image"
                multiple
                thumbnail
                maxSize={3145728}
                accept={{ "image/*": [] }}
                files={formik.values.image}
                onDrop={handleDrop}
                onRemove={() => {
                  formik.setFieldValue("image", "");
                }}
                error={formik.touched.image && formik.errors.image}
              />

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={noticeLoader}
                >
                  {id ? "Update Notice" : "Create Notice"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default Notice;
