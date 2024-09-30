import React from "react";
import { Card, FormControl, Grid, TextField, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { useEffect } from "react";
import { AdminValidate, _initialValues } from "./utils";
import { useDispatch } from "react-redux";
import {
  getAllAdminAsync,
  updateWebByIdAsync
} from "redux/slices/SiteSettingsSlice/WebAsync.api";
import { useSelector } from "react-redux";
import { emptyadmin } from "redux/slices/SiteSettingsSlice/Admin.slice";
import UploadBox from "components/CustomUploads/UploadBox";
import { GenerateBase64 } from "utils/convertToBase64";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { emptymobile } from "redux/slices/SiteSettingsSlice/Mobile.slice";
import { emptyweb } from "redux/slices/SiteSettingsSlice/Web.slice";
import { emptyinstruction } from "redux/slices/SiteSettingsSlice/Instruction.slice";
import { emptyPaymentSettings } from "redux/slices/SiteSettingsSlice/PaymentSetting.slice";

function Admin() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { adminLoader, admin, updateadmin } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(getAllAdminAsync({}));
  }, []);

  const handleDrop = (acceptedFiles) => {
    // HANDLE FILES
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file)
    });
    if (file) {
      formik.setFieldValue("favicon", [newFile]);
    }
  };
  const handleDropLogo = (acceptedFiles) => {
    // HANDLE FILES
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file)
    });
    if (file) {
      formik.setFieldValue("siteLogo", [newFile]);
    }
  };
  const handleDropMiniLogo = (acceptedFiles) => {
    // HANDLE FILES
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file)
    });
    if (file) {
      formik.setFieldValue("siteMiniLogo", [newFile]);
    }
  };

  const handleDropPreloader = (acceptedFiles) => {
    // HANDLE FILES
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file)
    });
    if (file) {
      formik.setFieldValue("sitePreloader", [newFile]);
    }
  };
  const handleDropLoginimage = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file)
    });
    if (file) {
      formik.setFieldValue("loginImage", [newFile]);
    }
  };

  const onSubmit = async (values) => {
    const faviconBase64 = await GenerateBase64(values.favicon[0]);
    const siteLogoBase64 = await GenerateBase64(values.siteLogo[0]);
    const siteMiniLogoBase64 = await GenerateBase64(values.siteMiniLogo[0]);
    const sitePreloaderBase64 = await GenerateBase64(values.sitePreloader[0]);
    const loginImageBase64 = await GenerateBase64(values.loginImage[0]);
    const payload = {
      favicon: faviconBase64,
      siteLogo: siteLogoBase64,
      siteMiniLogo: siteMiniLogoBase64,
      sitePreloader: sitePreloaderBase64,
      siteTitle: values.siteTitle,
      siteAuthorName: values.siteAuthorName,
      loginImage: loginImageBase64,
      siteDescription: values.siteDescription,
      siteKeyword: values.siteKeyword,
      type: "admin"
    };
    dispatch(updateWebByIdAsync(payload));
  };

  useEffect(() => {
    if (admin) {
      formik.setFieldValue("favicon", [admin.favicon]);
      formik.setFieldValue("siteLogo", [admin.siteLogo]);
      formik.setFieldValue("siteMiniLogo", [admin.siteMiniLogo]);
      formik.setFieldValue("sitePreloader", [admin.sitePreloader]);
      formik.setFieldValue("siteTitle", admin.siteTitle);
      formik.setFieldValue("siteAuthorName", admin.siteAuthorName);
      formik.setFieldValue("loginImage", [admin.loginImage]);
      formik.setFieldValue("siteDescription", admin.siteDescription);
      formik.setFieldValue("siteKeyword", admin.siteKeyword);
    }
  }, [admin]);

  useEffect(() => {
    if (updateadmin.status === 200) {
      toast.success(updateadmin.message, toastoptions);
      dispatch(emptyadmin());
      dispatch(emptymobile());
      dispatch(emptyweb());
      dispatch(emptyinstruction());
      dispatch(emptyPaymentSettings());
    }
  }, [updateadmin]);

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: AdminValidate
  }); // FOMRIK
  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3, direction: "start" }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)"
                }}
              >
                <Box>
                  <Typography sx={{ mb: "10px" }}>Favicon</Typography>
                  <UploadBox
                    height={60}
                    label="Favicon"
                    name="favicon"
                    accept={{
                      "image/*": []
                    }}
                    onDrop={handleDrop}
                    file={formik.values.favicon[0]}
                    error={formik.touched.favicon && formik.errors.favicon}
                  />
                </Box>

                <Box>
                  <Typography sx={{ mb: "10px" }}>Site Logo</Typography>
                  <UploadBox
                    height={60}
                    label="Site Logo"
                    name="siteLogo"
                    accept={{
                      "image/*": []
                    }}
                    onDrop={handleDropLogo}
                    file={formik.values.siteLogo[0]}
                    error={formik.touched.siteLogo && formik.errors.siteLogo}
                  />
                </Box>
              </Box>
              <Box
                rowGap={3}
                columnGap={2}
                mt={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)"
                }}
              >
                <Box>
                  <Typography sx={{ mb: "10px" }}>Site Mini Logo</Typography>
                  <UploadBox
                    height={60}
                    label="Site Mini Logo"
                    name="siteMiniLogo"
                    accept={{
                      "image/*": []
                    }}
                    onDrop={handleDropMiniLogo}
                    file={formik.values.siteMiniLogo[0]}
                    error={
                      formik.touched.siteMiniLogo &&
                      formik.errors.siteMiniLogo
                    }
                  />
                </Box>
                <Box>
                  <Typography sx={{ mb: "10px" }}>Site Preloader</Typography>
                  <UploadBox
                    height={60}
                    label="Site Preloader"
                    name="sitePreloader"
                    accept={{
                      "image/*": []
                    }}
                    onDrop={handleDropPreloader}
                    file={formik.values.sitePreloader[0]}
                    error={
                      formik.touched.sitePreloader &&
                      formik.errors.sitePreloader
                    }
                  />
                </Box>
              </Box>
              <Box
                rowGap={3}
                mt={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)"
                }}
              >
                <Box>
                  <Typography sx={{ mb: "10px" }}>
                    Login page Image
                  </Typography>
                  <UploadBox
                    height={60}
                    label="Login Page Image"
                    name="loginImage"
                    accept={{
                      "image/*": []
                    }}
                    onDrop={handleDropLoginimage}
                    file={formik.values.loginImage[0]}
                    error={
                      formik.touched.loginImage && formik.errors.loginImage
                    }
                  />
                </Box>

                <Box>
                  <Typography sx={{ mb: "10px" }}>Site Keywords</Typography>
                  <FormControl fullWidth>
                    <TextField
                      name="siteKeyword"
                      placeholder="Site Keywords"
                      {...formik.getFieldProps("siteKeyword")}
                      onChange={formik.handleChange}
                      fullWidth
                      error={
                        formik.touched.siteKeyword &&
                        formik.errors.siteKeyword
                      }
                    />
                  </FormControl>
                </Box>
              </Box>

              <Box
                rowGap={3}
                mt={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)"
                }}
              >
                <Box>
                  <Typography sx={{ mb: "10px" }}>Site Title</Typography>
                  <FormControl fullWidth>
                    <TextField
                      // size="small"
                      name="siteTitle"
                      placeholder="Site Title"
                      {...formik.getFieldProps("siteTitle")}
                      onChange={formik.handleChange}
                      fullWidth
                      error={
                        formik.touched.siteTitle && formik.errors.siteTitle
                      }
                    />
                  </FormControl>
                </Box>

                <Box>
                  <Typography sx={{ mb: "10px" }}>
                    Site Author Name
                  </Typography>
                  <FormControl fullWidth>
                    <TextField
                      // size="small"
                      name="siteAuthorName"
                      placeholder="Site Author Name"
                      {...formik.getFieldProps("siteAuthorName")}
                      onChange={formik.handleChange}
                      fullWidth
                      error={
                        formik.touched.siteAuthorName &&
                        formik.errors.siteAuthorName
                      }
                    />
                  </FormControl>
                </Box>
              </Box>

              <Box
                rowGap={3}
                mt={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)"
                }}
              >
                <Box>
                  <Typography sx={{ mb: "10px" }}>
                    Site Description
                  </Typography>
                  <FormControl fullWidth>
                    <TextField
                      name="siteDescription"
                      placeholder="Site Description"
                      multiline
                      rows={5}
                      {...formik.getFieldProps("siteDescription")}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.siteDescription &&
                        formik.errors.siteDescription
                      }
                    />
                  </FormControl>
                </Box>
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={adminLoader}
                >
                  Save
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default Admin;
