import { Helmet } from "react-helmet-async";
import { Card, FormControl, Grid, TextField, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import React from "react";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import CustomComponentLoader from "components/CustomComponentLoader";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { UploadAvatar } from "components/upload";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import { _initialValues, _validation } from "./utils";
import { useNavigate, useParams } from "react-router";
import { GenerateBase64 } from "utils/convertToBase64";
import { PATH_DASHBOARD } from "routes/paths";
import {
  createWhyYouNeedAsync,
  getWhyYouNeedByIdAsync,
  updateWhyYouNeedByIdAsync,
} from "redux/slices/WhyYouNeedSlice/youNeed.async";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { useEffect } from "react";
import { emptyYouneed } from "redux/slices/WhyYouNeedSlice/youneed.slice";

function AddWhyYouNeed() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { youNeedLoader, youneedadd, youneedId, youneedupdateId } = useSelector(
    (state) => state.youneed
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
      type: "mentor",
      mentorshipId: id,
    };
    if (id) {
      dispatch(updateWhyYouNeedByIdAsync(payload));
      delete payload.mentorshipId;
    } else {
      dispatch(createWhyYouNeedAsync(payload));
    }
  };

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: _validation,
  });

  useEffect(() => {
    if (id) dispatch(getWhyYouNeedByIdAsync(id));
  }, [id]);

  useEffect(() => {
    if (id && youneedId) {
      formik.setFieldValue("image", [youneedId.image]);
      formik.setFieldValue("title", youneedId.title);
      formik.setFieldValue("description", youneedId.description);
    }
  }, [id, youneedId]);

  useEffect(() => {
    if (youneedadd.status === 200) {
      toast.success(youneedadd.message, toastoptions);
      formik.resetForm();
      dispatch(emptyYouneed());
      navigate(PATH_DASHBOARD.whyyouneed);
    }
    if (youneedupdateId.status === 200) {
      toast.success(youneedupdateId.message, toastoptions);
      formik.resetForm();
      dispatch(emptyYouneed());
      navigate(PATH_DASHBOARD.whyyouneed);
    }
  }, [youneedadd, youneedupdateId]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Why You Need | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={Boolean(id) ? "Update Why You Need?" : "Create Why You Need?"}
        links={[
          { name: "Mentorship", href: PATH_DASHBOARD.root },
          { name: "Why You Need", href: PATH_DASHBOARD.whyyouneed },
          { name: Boolean(id) ? "Update Why You Need?" : "Create Why You Need?" },
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
                    youNeedLoader ? (
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
                    youNeedLoader ? (
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
                  loading={youNeedLoader}
                >
                  {id ? "Update Why You Need" : "Create Why You Need"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
export default AddWhyYouNeed;
