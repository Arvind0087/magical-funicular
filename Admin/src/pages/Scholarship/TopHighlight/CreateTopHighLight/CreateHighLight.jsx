import { Helmet } from "react-helmet-async";
import {
  Card,
  FormControl,
  Grid,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
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
import {
  getHighlightByIdAsync,
  updateHighlightByIdAsync,
  createHighlightAsync,
} from "redux/slices/TopHighlightSlice/highlight.async.api";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { useEffect } from "react";
import { emptyhighlight } from "redux/slices/TopHighlightSlice/highlight.slice";
import { PATH_DASHBOARD } from "routes/paths";

function Addonly({ onlyinfo }) {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { highlightLoader, highlightadd, highlightId, highlightupdateId } = useSelector(
    (state) => state.highlight
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file)
    });
    if (file) {
      formik.setFieldValue("image", [newFile]);
    }
  };


  const onSubmit = async (values) => {
    const imageBase64 = await GenerateBase64(values.image[0]);

    let payload = {
      highlightId: id,
      image: imageBase64,
      title: values.title,
      description: values.description
    };

    if (id) {
      dispatch(updateHighlightByIdAsync(payload));
    } else {
      delete payload.Id;
      dispatch(createHighlightAsync(payload));
    }
  };

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: _validation
  });
  useEffect(() => {
    if (id) {
      dispatch(getHighlightByIdAsync(id));
    }
  }, [id]);

  useEffect(() => {
    if (id && highlightId) {
      formik.setFieldValue("image", [highlightId.image]);
      formik.setFieldValue("title", highlightId.title);
      formik.setFieldValue("description", highlightId.description);
    }
  }, [id, highlightId]);

  useEffect(() => {
    if (highlightadd.status === 200) {
      toast.success(highlightadd.message, toastoptions);
      formik.resetForm();
      dispatch(emptyhighlight());
      navigate(PATH_DASHBOARD.tophighlight);
    }
    if (highlightupdateId.status === 200) {
      toast.success(highlightupdateId.message, toastoptions);
      formik.resetForm();
      dispatch(emptyhighlight());
      navigate(PATH_DASHBOARD.tophighlight);
    }
  }, [highlightadd, highlightupdateId]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Top Highlight | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={Boolean(id) ? "Update Top Highlight" : "Create Top Highlight"}
        links={[
          { name: "Scholarship", href: "" },
          { name: "Top Highlight", href: PATH_DASHBOARD.tophighlight },
          { name: Boolean(id) ? "Update Top Highlight" : "Create Top Highlight" }
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
                    "image/*": []
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
                            : "text.secondary"
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
                  sm: "repeat(1, 1fr)"
                }}
              >
                <FormControl fullWidth>
                  <TextField
                    name="title"
                    label={
                      highlightLoader ? (
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
              </Box>

              <FormControl
                fullWidth
                sx={{
                  mt: "20px"
                }}
              >
                <TextField
                  name="description"
                  label={
                    highlightLoader ? (
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
                  loading={highlightLoader}
                >
                  {id ? "Update Top Highlight" : "Create Top Highlight"}
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
