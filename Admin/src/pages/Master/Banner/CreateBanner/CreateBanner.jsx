import React, { useState } from "react";
import {
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
  Container,
  Stack,
  Checkbox,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { useNavigate, useParams } from "react-router";
import { UploadAvatar } from "components/upload";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { GenerateBase64 } from "utils/convertToBase64";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import {
  createBannerAsync,
  getBannerByIdAsync,
  updateBannerAsync,
} from "redux/banner/banner.async";
import { getBoardsByCourseIdAsync } from "redux/async.api";
import { getBatchByBoardIdAsync } from "redux/batchtype/batchtype.async";
import { getcourseAsync } from "redux/course/course.async";
import { emptybanner } from "redux/banner/banner.slice";
import { PATH_DASHBOARD } from "routes/paths";
import { useFormik } from "formik";
import { _initial, _validate, _isCheckedValidate } from "./utils";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { typeOf } from "../../../../../node_modules/react-read-more-read-less/build/index";

export default function CreateBanner() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bannerLoader, bannerById, banneradd, bannerupdate } = useSelector(
    (state) => state.banner
  );

  const { getBatchByBoardId } = useSelector((state) => state.batch);
  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader, boardByCourse } = useSelector((state) => state.board);
  const { classLoader } = useSelector((state) => state.class);

  const [getCheckedValue, setCheckedValue] = useState([]);
  const [getCheckedAll, setCheckedAll] = useState(false);

  const classList = getBatchByBoardId;
  const handleCheckedAll = (data) => {
    setCheckedAll(data);
    if (data === true) {
      const ids = classList.map((i) =>
        JSON.stringify({ id: i.id, name: i.name, class: i.class })
      );
      setCheckedValue(ids);
      formik.setFieldValue("classId", ids);
    } else {
      setCheckedValue([]);
      formik.setFieldValue("classId", []);
    }
  };
  const handleChangeCheckbox = (data) => {
    formik.handleChange(data);
    setCheckedAll(false);
    const index = getCheckedValue.indexOf(data);
    if (index === -1) {
      setCheckedValue([...getCheckedValue, data]);
      formik.setFieldValue("classId", [...getCheckedValue, data]);
    } else {
      setCheckedValue(getCheckedValue.filter((item) => item != data));
      formik.setFieldValue(
        "classId",
        getCheckedValue.filter((item) => item != data)
      );
    }
  };

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    if (file) {
      formik.setFieldValue("image", [newFile]);
    }
  };

  useEffect(() => {
    if (id && bannerById) {
      formik.setFieldValue("image", [bannerById.image]);
      formik.setFieldValue("title", bannerById.title);
      formik.setFieldValue("type", bannerById?.type);
      formik.setFieldValue("bannerurl", bannerById?.backLink);
      formik.setFieldValue("courseId", {
        label: bannerById?.courseName,
        value: bannerById?.courseId,
      });
      formik.setFieldValue("boardId", {
        label: bannerById?.boardName,
        value: bannerById?.boardId,
      });
    }
  }, [id, bannerById]);

  useEffect(() => {
    if (id && bannerById?.batch?.length && getBatchByBoardId?.length) {
      const selectedClass = bannerById?.batch?.map((ev) => {
        let batch =
          getBatchByBoardId?.find((evv) => evv?.id === ev?.batchId) || {};
        const { classId, ...rest } = batch;
        return JSON.stringify(rest);
      });
      formik.setFieldValue("classId", selectedClass) || [];
      setCheckedValue(selectedClass);
    }
  }, [id, bannerById, getBatchByBoardId]);

  useEffect(() => {
    if (banneradd.status === 200) {
      toast.success(banneradd.message, toastoptions);
      formik.resetForm();
      dispatch(emptybanner());
      navigate(PATH_DASHBOARD.banner);
    }
    if (bannerupdate.status === 200) {
      toast.success(bannerupdate.message, toastoptions);
      formik.resetForm();
      dispatch(emptybanner());
      navigate(PATH_DASHBOARD.banner);
    }
  }, [banneradd, bannerupdate]);

  const onSubmit = async (values) => {
    const ImageBase64 = await GenerateBase64(values.image[0]);

    let payload = {
      id: Number(id),
      image: ImageBase64,
      title: values.title,
      backLink: values.bannerurl,
      type: values.type,

      courseId: values.courseId.value,
      boardId: values.boardId.value,
      batchTypeIds: values?.classId?.map((item) => {
        return JSON.parse(item).id;
      }),
    };

    if (id) {
      dispatch(updateBannerAsync(payload));
    } else {
      delete payload.id;
      dispatch(createBannerAsync(payload));
    }
  };

  useEffect(() => {
    if (id) {
      // GET INFORMATION BY ID
      dispatch(getBannerByIdAsync(id));
    }
  }, [id]);

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate,
  });

  useEffect(() => {
    dispatch(getcourseAsync({}));
  }, []);

  useEffect(() => {
    if (formik.values.courseId?.value) {
      dispatch(
        getBoardsByCourseIdAsync({
          courseId: formik.values.courseId?.value,
        })
      );
    }
  }, [formik.values.courseId]);

  useEffect(() => {
    if (formik.values.boardId?.value) {
      let payload = {
        boardId: formik.values.boardId?.value,
      };
      dispatch(getBatchByBoardIdAsync(payload));
    }
  }, [formik.values.boardId]);

  const handleCheckedLabel = (ev) => {
    const data = JSON.stringify({
      id: ev.id,
      name: ev.name,
      class: ev.class,
    });

    formik.handleChange(data);
    setCheckedAll(false);
    const index = getCheckedValue.indexOf(data);
    if (index === -1) {
      setCheckedValue([...getCheckedValue, data]);
      formik.setFieldValue("classId", [...getCheckedValue, data]);
    } else {
      setCheckedValue(getCheckedValue.filter((item) => item != data));
      formik.setFieldValue(
        "classId",
        getCheckedValue.filter((item) => item != data)
      );
    }
  };

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <CustomBreadcrumbs
        // heading={id ? "Update Banner" : "Create Banner"}
        links={[
          { name: "Master", href: "" },
          {
            name: "Banner",
            href: `${PATH_DASHBOARD.banner}`,
          },
          { name: id ? "Update Banner" : "Create Banner" },
        ]}
      />
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <>
              <AutoCompleteCustom
                sx={{ mt: 2, mb: 3 }}
                name="courseId"
                loading={courseLoader}
                options={_.map(course?.data, (ev) => {
                  return { label: ev.name, value: ev.id };
                })}
                value={formik.values.courseId}
                onChange={(event, value) => {
                  formik.setFieldValue("courseId", value);
                }}
                label="Select Course"
                error={formik.touched.courseId && formik.errors.courseId}
              />

              <FormControl
                fullWidth
                error={formik.touched.classId && formik.errors.classId}
              >
                <InputLabel>
                  {classLoader ? (
                    <CustomComponentLoader padding="0 0" size={20} />
                  ) : (
                    "Select Class"
                  )}
                </InputLabel>
                <Select
                  name="classId"
                  label="Select Class"
                  select
                  multiple
                  value={getCheckedValue}
                  // onChange={handleCheckedAll}
                  renderValue={(setCheckedValue) =>
                    setCheckedValue
                      .map((item) => {
                        const passedItem = JSON.parse(item);
                        return `${passedItem.class} (${passedItem.name})`;
                      })
                      .join(" , ")
                  }
                >
                  <MenuItem>
                    <ListItemIcon>
                      <Checkbox
                        value={getCheckedAll}
                        checked={getCheckedAll}
                        onChange={(event) =>
                          handleCheckedAll(event.target.checked)
                        }
                      />
                      <ListItemText
                        style={{ marginTop: "8px" }}
                        primary="Select All"
                      />
                    </ListItemIcon>
                  </MenuItem>

                  {getBatchByBoardId?.map((ev, index) => (
                    <MenuItem key={ev.id}>
                      <ListItemIcon>
                        <Checkbox
                          value={JSON.stringify({
                            id: ev.id,

                            name: ev.name,
                            class: ev.class,
                          })}
                          checked={
                            getCheckedValue?.findIndex(
                              (i) => JSON.parse(i).id == ev.id
                            ) != -1
                          }
                          onChange={(event) =>
                            handleChangeCheckbox(event.target.value)
                          }
                        />
                      </ListItemIcon>
                      <span onClick={() => handleCheckedLabel(ev)}>
                        <ListItemText>
                          {ev.class} {""}({ev.name})
                        </ListItemText>
                      </span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>

            <Card sx={{ pt: 5, pb: 3, px: 3 }}>
              <Box sx={{ mb: 2 }}>
                <UploadAvatar
                  name="image"
                  accept={{
                    "image/*": [],
                  }}
                  file={formik.values.image[0]}
                  error={formik.touched.image && formik.errors.image}
                  onDrop={handleDrop}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: "auto",
                        display: "block",
                        textAlign: "center",
                        color:
                          formik.touched.image && formik.errors.image
                            ? "red"
                            : "text.secondary",
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of
                    </Typography>
                  }
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(1, 1fr)",
                }}
              >
                <>
                  <AutoCompleteCustom
                    name="boardId"
                    loading={boardLoader}
                    options={_.map(boardByCourse, (ev) => {
                      return { label: ev.name, value: ev.id };
                    })}
                    value={formik.values.boardId}
                    onChange={(event, value) => {
                      formik.setFieldValue("boardId", value);
                    }}
                    label="Select Board"
                    error={formik.touched.boardId && formik.errors.boardId}
                  />
                </>

                <FormControl fullWidth>
                  <TextField
                    name="title"
                    fullWidth
                    label="Title"
                    {...formik.getFieldProps("title")}
                    onChange={formik.handleChange}
                    error={formik.touched.title && formik.errors.title}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Banner Type</InputLabel>

                  <Select
                    label="Banner Type"
                    name="type"
                    {...formik.getFieldProps("type")}
                    onChange={formik.handleChange}
                    error={formik.touched.type && formik.errors.type}
                  >
                    <MenuItem value="Home">Home</MenuItem>
                    <MenuItem value="Assessment">Assessment</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    name="bannerurl"
                    label="Banner URL"
                    {...formik.getFieldProps("bannerurl")}
                    onChange={formik.handleChange}
                    error={formik.touched.bannerurl && formik.errors.bannerurl}
                  />
                </FormControl>
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={bannerLoader}
                >
                  {id ? "Update Banner" : "Create Banner"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
