import { Helmet } from "react-helmet-async";
import { Card, FormControl, Grid, TextField, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React, { useEffect } from "react";
import { PATH_DASHBOARD } from "routes/paths";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { UploadAvatar } from "components/upload";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import { _initialValues, _validation } from "./utils";
import {
  createFeatureAsync,
  getFeatureByIdAsync,
  updateFeatureByIdAsync,
} from "redux/slices/FeatureSlice/feature.async";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { emptyfeature } from "redux/slices/FeatureSlice/feature.slice";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { GenerateBase64 } from "utils/convertToBase64";

const AddFeature = ({ }) => {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const { featureLoader, featureadd, featurgetById, featureupdate } =
    useSelector((state) => state.feature);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

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
    const imageBase64 = await GenerateBase64(values.image[0]);
    const payload = {
      title: values.title,
      image: imageBase64,
      type: "feature",
      mentorshipId: id,
    };
    if (id) {
      dispatch(updateFeatureByIdAsync(payload));
    } else {
      delete payload.mentorshipId;
      dispatch(createFeatureAsync(payload));
    }
  };
  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: _validation,
  });

  useEffect(() => {
    if (id) dispatch(getFeatureByIdAsync(id));
  }, [id]);

  useEffect(() => {
    if (id && featurgetById) {
      formik.setFieldValue("image", [featurgetById.image]);
      formik.setFieldValue("title", featurgetById.title);
    }
  }, [id, featurgetById]);

  useEffect(() => {
    if (featureadd.status === 200) {
      toast.success(featureadd.message, toastoptions);
      formik.resetForm();
      dispatch(emptyfeature());
      navigate(PATH_DASHBOARD.feature);
    }
    if (featureupdate.status === 200) {
      toast.success(featureupdate.message, toastoptions);
      formik.resetForm();
      dispatch(emptyfeature());
      navigate(PATH_DASHBOARD.feature);
    }
  }, [featureadd, featureupdate]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Features | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={Boolean(id) ? "Update Features" : "Create Features"}
        links={[
          { name: "Mentorship", href: "" },
          { name: "Features", href: PATH_DASHBOARD.feature },
          { name: Boolean(id) ? "Update Features" : "Create Features" },
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
                      Allowed .jpeg, .jpg, .png, .gif
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
                <FormControl
                  fullWidth
                  sx={{
                    mt: "20px",
                  }}
                >
                  <TextField
                    name="title"
                    label={
                      featureLoader ? (
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

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={featureLoader}
                >
                  {id ? "Update Features" : "Create Features"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AddFeature;
