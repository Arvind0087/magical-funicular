import { Helmet } from "react-helmet-async";
import { Card, FormControl, Grid, TextField, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React, { useEffect } from "react";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import CustomComponentLoader from "components/CustomComponentLoader";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { UploadAvatar } from "components/upload";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import { _initial, _validate } from "./utils";
import { useNavigate, useParams } from "react-router";
import { GenerateBase64 } from "utils/convertToBase64";
import {
  createHelpsAsync,
  getHelpsByIdAsync,
  updateHelpsByIdAsync,
} from "redux/slices/Helps/helps.async";
import { toast } from "react-hot-toast";
import { PATH_DASHBOARD } from "routes/paths";
import { toastoptions } from "utils/toastoptions";
import { emptyHelps } from "redux/slices/Helps/helps.slice";

function AddHelps() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { helpsLoader, helpsadd, helpsId, helpsupdateId } = useSelector(
    (state) => state.helps
  );
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
    let payload = {
      image: imageBase64,
      title: values.title,
      description: values.description,
      type: "help",
      mentorshipId: id,
    };
    if (id) {
      dispatch(updateHelpsByIdAsync(payload));
    } else {
      delete payload.mentorshipId;
      dispatch(createHelpsAsync(payload));
    }
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate,
  });

  useEffect(() => {
    if (id) dispatch(getHelpsByIdAsync(id));
  }, [id]);

  useEffect(() => {
    if (id && helpsId) {
      formik.setFieldValue("image", [helpsId.image]);
      formik.setFieldValue("title", helpsId.title);
      formik.setFieldValue("description", helpsId.description);
    }
  }, [id, helpsId]);

  useEffect(() => {
    if (helpsadd.status === 200) {
      toast.success(helpsadd.message, toastoptions);
      dispatch(emptyHelps());
      formik.resetForm();
      navigate(PATH_DASHBOARD.howithelp);
    }
    if (helpsupdateId.status === 200) {
      toast.success(helpsupdateId.message, toastoptions);
      dispatch(emptyHelps());
      formik.resetForm();
      navigate(PATH_DASHBOARD.howithelp);
    }
  }, [helpsadd, helpsupdateId]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>How It Helps? | {`${tabTitle}`} </title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={Boolean(id) ? "Update  How It Helps?" : " Create How It Helps?"}
        links={[
          { name: "Mentorship", href: "" },
          { name: "How It Helps ?", href: PATH_DASHBOARD.howithelp, },
          { name: Boolean(id) ? "Update How It Helps" : "Create How It Helps" },
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
              <FormControl
                fullWidth
                sx={{
                  mt: "20px",
                }}
              >
                <TextField
                  name="title"
                  label={
                    helpsLoader ? (
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
              <FormControl
                fullWidth
                sx={{
                  mt: "20px",
                }}
              >
                <TextField
                  name="description"
                  label={
                    helpsLoader ? (
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
                  loading={helpsLoader}
                >
                  {id ? "Update how it helps" : "Create how it helps"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
export default AddHelps;
