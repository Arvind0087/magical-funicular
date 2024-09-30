import {
  Card,
  FormControl,
  Grid,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { Box, Container, Stack } from "@mui/system";
import React, { useState } from "react";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import CustomComponentLoader from "components/CustomComponentLoader";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { UploadAvatar } from "components/upload";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { _initialValues, _validation } from "./utils";
import { useNavigate, useParams } from "react-router";
import { GenerateBase64 } from "utils/convertToBase64";
import { useDispatch } from "react-redux";
import { getAllBackLinkAsync } from "redux/slices/NoticeBackLinkSlice/NoticeBackLinkAsync";

import {
  createOnlyForYouAsync,
  getOnlyForYouByIdAsync,
  updateOnlyForYouByIdAsync,
} from "redux/async.api";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { useEffect } from "react";
import { emptyonly } from "redux/slices/only.slice";
import { PATH_DASHBOARD } from "routes/paths";

function Addonly({ onlyinfo }) {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { onlyLoader, onlyadd, onlyId, onlyupdateId, only } = useSelector(
    (state) => state.only
  );
  const { NoticeBackLinkLoader, NoticeBackLink } = useSelector(
    (state) => state.NoticeBackLink
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const [isother, setIsother] = useState(false);
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
        title: values.title,
        description: values.description,
        buttonText: values.buttonText,
        buttonLinkId: values.buttonLinkId,
        otherLink: values.otherLink,
      };
    } else {
      payload = {
        Id: id,
        image: imageBase64,
        title: values.title,
        description: values.description,
        buttonText: values.buttonText,
        buttonLinkId: values.buttonLinkId,
      };
    }

    if (id) {
      dispatch(updateOnlyForYouByIdAsync(payload));
    } else {
      delete payload.Id;
      dispatch(createOnlyForYouAsync(payload));
    }
  };
  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: _validation,
  });


  useEffect(() => {
    if (id) {
      dispatch(getOnlyForYouByIdAsync(id));
    }
  }, [id]);

  useEffect(() => {
    if (id && onlyId) {
      formik.setFieldValue("image", [onlyId.image]);
      formik.setFieldValue("title", onlyId.title);
      formik.setFieldValue("description", onlyId.description);
      formik.setFieldValue("buttonText", onlyId.buttonText);

      formik.setFieldValue("buttonLinkId", onlyId?.buttonLinkId);

      formik.setFieldValue("otherLink", onlyId?.otherLink);
    }
  }, [id, onlyId]);

  useEffect(() => {
    if (onlyadd.status === 200) {
      toast.success(onlyadd.message, toastoptions);
      formik.resetForm();
      dispatch(emptyonly());
      navigate(PATH_DASHBOARD.onlyforyou);
    }
    if (onlyupdateId.status === 200) {
      toast.success(onlyupdateId.message, toastoptions);
      formik.resetForm();
      dispatch(emptyonly());
      navigate(PATH_DASHBOARD.onlyforyou);
    }
  }, [onlyadd, onlyupdateId]);
  useEffect(() => {
    if (NoticeBackLink?.data?.length > 0 && formik.values.buttonLinkId) {
      setIsother(
        NoticeBackLink?.data?.find((ev) => formik.values.buttonLinkId === ev.id)
          // .backLink === "Other"
          .backLink === ""
      );
    }
  }, [NoticeBackLink, formik.values]);
  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Only For You | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={Boolean(id) ? "Update Only For You" : "Create Only For You"}
        links={[
          { name: "Only For You", href: PATH_DASHBOARD.onlyforyou },
          { name: Boolean(id) ? "Update Only For You" : "Create Only For You" },
        ]}
      />

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
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

          <Grid item xs={12} md={9}>
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
                <FormControl fullWidth>
                  <TextField
                    name="title"
                    label={
                      onlyLoader ? (
                        <CustomComponentLoader padding="0 0" size={20} />
                      ) : (
                        "Title"
                      )
                    }
                    {...formik.getFieldProps("title")}
                    onChange={formik.handleChange}
                    error={formik.touched.title && formik.errors.title}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    name="buttonText"
                    label={
                      onlyLoader ? (
                        <CustomComponentLoader padding="0 0" size={20} />
                      ) : (
                        "Button Text"
                      )
                    }
                    {...formik.getFieldProps("buttonText")}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.buttonText && formik.errors.buttonText
                    }
                  />
                </FormControl>
              </Box>

              <FormControl
                sx={{
                  mt: "20px",
                }}
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
                  name="buttonLinkId"
                  {...formik.getFieldProps("buttonLinkId")}
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
              {/* backlink */}
              {isother ? (
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <TextField
                    label="otherLink"
                    name="otherLink"
                    {...formik.getFieldProps("otherLink")}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.otherLink && formik.errors.otherLink
                    }
                  />
                </FormControl>
              ) : (
                ""
              )}

              <FormControl
                fullWidth
                sx={{
                  mt: "20px",
                }}
              >
                <TextField
                  name="description"
                  label={
                    onlyLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "Description"
                    )
                  }
                  multiline
                  rows={5}
                  {...formik.getFieldProps("description")}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.description && formik.errors.description
                  }
                />
              </FormControl>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={onlyLoader}
                >
                  {id ? "Update Only For You" : "Create Only For You"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
export default Addonly;
