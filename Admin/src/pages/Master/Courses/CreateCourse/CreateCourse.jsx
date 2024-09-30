import {
  Card,
  FormControl,
  Grid,
  InputAdornment,
  TextField,
  Box,
  Container,
  Stack,
  Typography,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useEffect } from "react";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import Iconify from "components/iconify/Iconify";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { isJson } from "utils/isJson";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { GenerateBase64 } from "utils/convertToBase64";
import Editor from "components/editor/Editor";

import {
  createcourseAsync,
  getcoursebyidAsync,
  updatecoursebyidAsync,
} from "redux/course/course.async";
import { emptycourse } from "redux/course/course.slice";
import UploadBox from "components/CustomUploads/UploadBox";
import { useFormik } from "formik";
import { _initial, _validation, courseTypes } from "./utils";
import { PATH_DASHBOARD } from "routes/paths";

const AddCourses = ({}) => {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const { courseLoader, courseadd, courseId, updateId } = useSelector(
    (state) => state.course
  );
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const filesName = file.path.includes(".pdf");

    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    if (file) {
      if (filesName == true) {
        formik.setFieldValue("brochure", [newFile]);
      } else {
        formik.setFieldValue("image", [newFile]);
      }
    }
  };

  const onSubmit = async (values) => {
    const ImageBase64 = await GenerateBase64(values.image[0]);
    const listinfo = [];
    for (let value of values.list) {
      if (value.list !== "") {
        listinfo.push(value.list);
      }
    }

    const payload = {
      courseId: Number(id),
      name: values.name,
      shortDescription: values.shortDescription,
      image: ImageBase64,
      list: JSON.stringify(listinfo),
      type: values?.courseType,
      ORDERSEQ: values?.sequence ? values?.sequence : 0,
    };
    if (id) {
      dispatch(updatecoursebyidAsync(payload));
    } else {
      delete payload.courseId;
      dispatch(createcourseAsync(payload));
    }
  };

  useEffect(() => {
    if (id) dispatch(getcoursebyidAsync(id));
  }, []);

  useEffect(() => {
    if (id && courseId) {
      if (isJson(courseId.list)) {
        const maplist = JSON.parse(courseId.list).map((ev) => {
          return {
            list: ev,
          };
        });
        formik.setFieldValue("list", maplist);
      }
      formik.setFieldValue("image", [courseId.image]);
      formik.setFieldValue("name", courseId.name);
      formik.setFieldValue("shortDescription", courseId.shortDescription);
      formik.setFieldValue("courseType", courseId?.type);
      formik.setFieldValue("sequence", courseId?.ORDERSEQ);
    }
  }, [courseId, id]);

  useEffect(() => {
    if (courseadd.status === 200) {
      toast.success(courseadd.message, toastoptions);
      dispatch(emptycourse());
      formik.resetForm();
      formik.setFieldValue("list", [{ list: "" }]);
      formik.setFieldValue("sequence", "");
    }
    if (updateId.status === 200) {
      toast.success(updateId.message, toastoptions);
      dispatch(emptycourse());
      formik.resetForm();
      navigate(PATH_DASHBOARD.courses);
    }
  }, [courseadd, updateId]);

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validation,
  });

  const classbycourseboard = [
    {
      id: 1,
      name: "Course 1",
    },
    {
      id: 2,
      name: "Course 2",
    },
    {
      id: 3,
      name: "Course 3",
    },
  ];

  const educatorList = [
    {
      id: 1,
      name: "Educator 1",
    },
    {
      id: 2,
      name: "Educator 2",
    },
    {
      id: 3,
      name: "Educator 3",
    },
  ];

  return (
    <>
      <Container maxWidth={themeStretch ? "lg" : false}>
        <CustomBreadcrumbs
          links={[
            { name: "Master", href: "" },
            {
              name: "Course",
              href: "/app/master/course",
            },
            { name: Boolean(id) ? "Update Course" : "Create Course" },
          ]}
        />

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth disabled={courseLoader}>
                        <TextField
                          sx={{ mb: "15px" }}
                          name="name"
                          label={
                            courseLoader ? (
                              <CustomComponentLoader padding="0 0" size={20} />
                            ) : (
                              "Course Name"
                            )
                          }
                          fullWidth
                          {...formik.getFieldProps("name")}
                          onChange={formik.handleChange}
                          error={Boolean(
                            formik.touched.name && formik.errors.name
                          )}
                        />
                      </FormControl>

                      <Box sx={{ mb: "15px" }}>
                        <FormControl
                          fullWidth
                          // disabled={courseLoader}
                          error={Boolean(
                            formik.touched.courseType &&
                              formik.errors.courseType
                          )}
                        >
                          <InputLabel>{"Course Type"}</InputLabel>
                          <Select
                            label="Course Type"
                            name="courseType"
                            {...formik.getFieldProps("courseType")}
                            onChange={formik.handleChange}
                          >
                            <MenuItem defaultValue value="">
                              Select Course Type
                            </MenuItem>
                            {courseTypes?.map((ev, index) => {
                              return (
                                <MenuItem value={ev.name} key={ev.index}>
                                  {ev.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Box>

                      <Box sx={{ mb: "15px" }}>
                        <UploadBox
                          height={58}
                          name="image"
                          label="Thumbnail"
                          accept={{
                            "image/*": [],
                          }}
                          onDrop={handleDrop}
                          file={formik.values.image[0]}
                          error={Boolean(
                            formik.touched.image && formik.errors.image
                          )}
                        />
                      </Box>

                      <FormControl fullWidth sx={{ mb: "15px" }}>
                        <TextField
                          name="sequence"
                          label="Add Sequence"
                          type="number"
                          style={{ color: "transparent !important" }}
                          fullWidth
                          {...formik.getFieldProps("sequence")}
                          onChange={formik.handleChange}
                          error={Boolean(
                            formik.touched.sequence && formik.errors.sequence
                          )}
                        />
                      </FormControl>

                      {formik.values.list.map((listI, index) => (
                        <Box key={index} sx={{ mb: "15px" }}>
                          <Grid item xs={12} md={12}>
                            <FormControl fullWidth disabled={courseLoader}>
                              <TextField
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      {formik.values.list.length !== 0 && (
                                        <div>
                                          {index !== 0 ||
                                          formik.values.list.length > 1 ? (
                                            <Iconify
                                              icon="eva:trash-2-outline"
                                              onClick={() => {
                                                if (
                                                  formik.values.list.length > 1
                                                ) {
                                                  formik.values.list.splice(
                                                    index,
                                                    1
                                                  );
                                                  formik.setFieldValue(
                                                    "list",
                                                    formik.values.list
                                                  );
                                                }
                                              }}
                                              style={{
                                                cursor: "pointer",
                                                marginRight: "10px",
                                              }}
                                            />
                                          ) : null}
                                          {formik.values.list.length - 1 ===
                                            index && (
                                            <Iconify
                                              icon="eva:plus-fill"
                                              onClick={() => {
                                                formik.setFieldValue("list", [
                                                  ...formik.values.list,
                                                  { list: "" },
                                                ]);
                                              }}
                                              style={{
                                                cursor: "pointer",
                                              }}
                                            />
                                          )}
                                        </div>
                                      )}
                                    </InputAdornment>
                                  ),
                                }}
                                fullWidth
                                label={
                                  courseLoader ? (
                                    <CustomComponentLoader
                                      padding="0 0"
                                      size={20}
                                    />
                                  ) : (
                                    "List*"
                                  )
                                }
                                sx={{ background: "#F9F9F9" }}
                                name="list"
                                type="text"
                                value={listI.list}
                                onChange={(e) => {
                                  formik.values.list[index][e.target.name] =
                                    e.target.value;
                                  formik.setFieldValue(
                                    "list",
                                    formik.values.list
                                  );
                                }}
                                error={Boolean(
                                  formik.touched.list && formik.errors.list
                                )}
                              />
                            </FormControl>
                          </Grid>
                        </Box>
                      ))}
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "text.secondary", mb: "10px" }}
                      >
                        Short Description
                      </Typography>
                      <Editor
                        id="shortDescription"
                        name="shortDescription"
                        value={formik.values.shortDescription}
                        onChange={(e) => {
                          formik.setFieldValue("shortDescription", e);
                        }}
                        error={
                          formik.touched.shortDescription &&
                          formik.errors.shortDescription
                        }
                      />
                    </Grid>

                    {/*<Grid item xs={12} md={6}>
                      <FormControl
                        fullWidth
                        // disabled={classLoader}
                        error={Boolean(
                          formik.touched.prodId && formik.errors.prodId
                        )}
                      >
                        <InputLabel>Product</InputLabel>
                        <Select
                          label="Product"
                          name="prodId"
                          {...formik.getFieldProps("prodId")}
                          onChange={formik.handleChange}
                        >
                          <MenuItem defaultValue value="">
                            Select Product
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
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          sx={{ mb: "15px" }}
                          name="courseTitle"
                          label={
                            courseLoader ? (
                              <CustomComponentLoader padding="0 0" size={20} />
                            ) : (
                              "Course Title"
                            )
                          }
                          fullWidth
                          {...formik.getFieldProps("courseTitle")}
                          onChange={formik.handleChange}
                          error={Boolean(
                            formik.touched.courseTitle &&
                              formik.errors.courseTitle
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          sx={{ mb: "15px" }}
                          name="amount"
                          label={
                            courseLoader ? (
                              <CustomComponentLoader padding="0 0" size={20} />
                            ) : (
                              "Course Amount"
                            )
                          }
                          fullWidth
                          {...formik.getFieldProps("amount")}
                          onChange={formik.handleChange}
                          error={Boolean(
                            formik.touched.amount && formik.errors.amount
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl
                        fullWidth
                        // disabled={classLoader}
                        error={Boolean(
                          formik.touched.educator && formik.errors.educator
                        )}
                      >
                        <InputLabel>Educator</InputLabel>
                        <Select
                          label="Educator"
                          name="educator"
                          {...formik.getFieldProps("educator")}
                          onChange={formik.handleChange}
                        >
                          <MenuItem defaultValue value="">
                            Select Educator
                          </MenuItem>
                          {educatorList?.map((ev, index) => {
                            return (
                              <MenuItem value={ev.id} key={ev.index}>
                                {ev.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: "15px" }}>
                        <UploadBox
                          height={58}
                          name="brochure"
                          label="Brochure"
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
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          sx={{ mb: "15px" }}
                          name="duration"
                          label={
                            courseLoader ? (
                              <CustomComponentLoader padding="0 0" size={20} />
                            ) : (
                              "Course Duration"
                            )
                          }
                          fullWidth
                          {...formik.getFieldProps("duration")}
                          onChange={formik.handleChange}
                          error={Boolean(
                            formik.touched.duration && formik.errors.duration
                          )}
                        />
                      </FormControl>
                    </Grid> */}
                  </Grid>
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={courseLoader}
                  >
                    {id ? "Update Course" : "Create Course"}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
};

export default AddCourses;
