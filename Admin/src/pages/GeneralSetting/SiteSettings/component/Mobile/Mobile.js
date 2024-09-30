import React from "react";
import { Card, FormControl, Grid, TextField, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { useEffect } from "react";
import { MobileValidate, _initialValues } from "./utils";
import { useDispatch } from "react-redux";
import {
  getAllMobileAsync,
  updateWebByIdAsync
} from "redux/slices/SiteSettingsSlice/WebAsync.api";
import { useSelector } from "react-redux";
import { emptymobile } from "redux/slices/SiteSettingsSlice/Mobile.slice";
import { GenerateBase64 } from "utils/convertToBase64";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import UploadBox from "components/CustomUploads/UploadBox";
import { emptyadmin } from "redux/slices/SiteSettingsSlice/Admin.slice";
import { emptyweb } from "redux/slices/SiteSettingsSlice/Web.slice";
import { emptyinstruction } from "redux/slices/SiteSettingsSlice/Instruction.slice";
import { emptyPaymentSettings } from "redux/slices/SiteSettingsSlice/PaymentSetting.slice";

function Web() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { mobileLoader, mobile, updatemobile } = useSelector(
    (state) => state.mobile
  );

  useEffect(() => {
    dispatch(getAllMobileAsync({}));
  }, []);

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file)
    });
    if (file) {
      formik.setFieldValue("mobileLogo", [newFile]);
    }
  };
  const handleDropBoardingOne = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file)
    });
    if (file) {
      formik.setFieldValue("onboardingImage1", [newFile]);
    }
  };
  const handleDropBoardingTwo = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file)
    });
    if (file) {
      formik.setFieldValue("onboardingImage2", [newFile]);
    }
  };

  const handleDropBoardingThree = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file)
    });
    if (file) {
      formik.setFieldValue("onboardingImage3", [newFile]);
    }
  };

  const handleDropHeaderIcon = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file)
    });
    if (file) {
      formik.setFieldValue("HeaderIcon", [newFile]);
    }
  };

  const onSubmit = async (values) => {
    const mobileLogoBase64 = await GenerateBase64(values.mobileLogo[0]);
    const onboardingImage1Base64 = await GenerateBase64(
      values.onboardingImage1[0]
    );
    const onboardingImage2Base64 = await GenerateBase64(
      values.onboardingImage2[0]
    );
    const onboardingImage3Base64 = await GenerateBase64(
      values.onboardingImage3[0]
    );
    const headericonBase64 = await GenerateBase64(values.HeaderIcon[0]);

    const payload = {
      mobileLogo: mobileLogoBase64,
      helpLineNumber: values.helpLineNumber,
      helpEmail: values.helpEmail,
      onboardingImage1: onboardingImage1Base64,
      onboardingImage2: onboardingImage2Base64,
      onboardingImage3: onboardingImage3Base64,
      HeaderIcon: headericonBase64,
      onboardingContent1: values.onboardingContent1,
      onboardingContent2: values.onboardingContent2,
      onboardingContent3: values.onboardingContent3,
      instagramLink: values.instagramLink,
      whatsappLink: values.whatsappLink,
      facebookLink: values.facebookLink,
      youtubeLink: values.youtubeLink,
      linkedinLink: values.linkedinLink,
      applicationName: values.applicationName,
      tagline: values.tagline,
      type: "mobileApp",
      socialContent: values.socialContent,
      androidMobileVersion: String(values.androidMobileVersion),
      iosMobileVersion: String(values.iosMobileVersion),
      androidAppUrl: values.androidAppUrl,
      iosAppUrl: values.iosAppUrl,

      studentAndroidMobileVersion: values.studentAndroidMobileVersion,
      studentIosMobileVersion: values.studentIosMobileVersion,
      parentAndroidMobileVersion: values.parentAndroidMobileVersion,
      parentIosMobileVersion: values.parentIosMobileVersion,
      studentColour: values.studentAppColor,
      parentColour: values.parentColour,
    };
    dispatch(updateWebByIdAsync(payload));
  };

  useEffect(() => {
    if (mobile) {
      formik.setFieldValue("mobileLogo", [mobile.mobileLogo]);
      formik.setFieldValue("helpLineNumber", mobile.helpLineNumber);
      formik.setFieldValue("helpEmail", mobile.helpEmail);
      formik.setFieldValue("onboardingImage1", [mobile.onboardingImage1]);
      formik.setFieldValue("onboardingImage2", [mobile.onboardingImage2]);
      formik.setFieldValue("onboardingImage3", [mobile.onboardingImage3]);
      formik.setFieldValue("onboardingContent1", mobile.onboardingContent1);
      formik.setFieldValue("onboardingContent2", mobile.onboardingContent2);
      formik.setFieldValue("onboardingContent3", mobile.onboardingContent3);
      formik.setFieldValue("instagramLink", mobile.instagramLink);
      formik.setFieldValue("whatsappLink", mobile?.whatsappLink);
      formik.setFieldValue("facebookLink", mobile.facebookLink);
      formik.setFieldValue("youtubeLink", mobile.youtubeLink);
      formik.setFieldValue("linkedinLink", mobile.linkedinLink);
      formik.setFieldValue("HeaderIcon", [mobile.HeaderIcon]);
      formik.setFieldValue("applicationName", mobile.applicationName);
      formik.setFieldValue("tagline", mobile.tagline);
      formik.setFieldValue("socialContent", mobile.socialContent);
      formik.setFieldValue("androidMobileVersion", mobile.androidMobileVersion);
      formik.setFieldValue("iosMobileVersion", mobile.iosMobileVersion);
      formik.setFieldValue("androidAppUrl", mobile.androidAppUrl);
      formik.setFieldValue("iosAppUrl", mobile.iosAppUrl);
      formik.setFieldValue("studentAndroidMobileVersion", mobile.studentAndroidMobileVersion);
      formik.setFieldValue("studentIosMobileVersion", mobile.studentIosMobileVersion);
      formik.setFieldValue("parentAndroidMobileVersion", mobile.parentAndroidMobileVersion);
      formik.setFieldValue("parentIosMobileVersion", mobile.parentIosMobileVersion);
      formik.setFieldValue("parentPrimaryColor", mobile.parentPrimaryColor);
      formik.setFieldValue("parentSecondaryColor", mobile.parentSecondaryColor);
      formik.setFieldValue("parentBgColor", mobile.parentBgColor);
      formik.setFieldValue("studentPrimaryColor", mobile.studentPrimaryColor);
      formik.setFieldValue("studentSecondaryColor", mobile.studentSecondaryColor);
      formik.setFieldValue("studentBgColor", mobile.studentBgColor);
    }
  }, [mobile]);

  useEffect(() => {
    if (updatemobile.status === 200) {
      toast.success(updatemobile.message, toastoptions);
      dispatch(emptyadmin());
      dispatch(emptymobile());
      dispatch(emptyweb());
      dispatch(emptyinstruction());
      dispatch(emptyPaymentSettings());
    }
  }, [updatemobile]);

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: MobileValidate
  }); // FOMRIK

  return (
    <>
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
                    <Typography sx={{ mb: "10px" }}>Mobile Logo</Typography>
                    <UploadBox
                      height={60}
                      label="Mobile Logo"
                      name="mobileLogo"
                      accept={{
                        "image/*": []
                      }}
                      onDrop={handleDrop}
                      file={formik.values.mobileLogo[0]}
                      error={
                        formik.touched.mobileLogo && formik.errors.mobileLogo
                      }
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ mb: "10px" }}>
                      OnBoarding Screen One
                    </Typography>
                    <UploadBox
                      height={60}
                      label="OnBoarding Screen One"
                      name="onboardingImage1"
                      accept={{
                        "image/*": []
                      }}
                      onDrop={handleDropBoardingOne}
                      file={formik.values.onboardingImage1[0]}
                      error={
                        formik.touched.onboardingImage1 &&
                        formik.errors.onboardingImage1
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
                      OnBoarding Screen Two
                    </Typography>
                    <UploadBox
                      height={60}
                      label="OnBoarding Screen Two"
                      name="onboardingImage2"
                      accept={{
                        "image/*": []
                      }}
                      onDrop={handleDropBoardingTwo}
                      file={formik.values.onboardingImage2[0]}
                      error={
                        formik.touched.onboardingImage2 &&
                        formik.errors.onboardingImage2
                      }
                    />
                  </Box>

                  <Box>
                    <Typography sx={{ mb: "10px" }}>
                      {" "}
                      OnBoarding Screen Three
                    </Typography>
                    <UploadBox
                      height={60}
                      label="OnBoarding Screen Three"
                      name="onboardingImage3"
                      accept={{
                        "image/*": []
                      }}
                      onDrop={handleDropBoardingThree}
                      file={formik.values.onboardingImage3[0]}
                      error={
                        formik.touched.onboardingImage3 &&
                        formik.errors.onboardingImage3
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
                    <Typography sx={{ mb: "10px" }}>Header Icon</Typography>
                    <UploadBox
                      height={60}
                      label="Header Icon"
                      name="HeaderIcon"
                      accept={{
                        "image/*": []
                      }}
                      onDrop={handleDropHeaderIcon}
                      file={formik.values.HeaderIcon[0]}
                      error={
                        formik.touched.HeaderIcon && formik.errors.HeaderIcon
                      }
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ mb: "10px" }}>
                      Application Name
                    </Typography>
                    <FormControl fullWidth>
                      <TextField
                        // size="small"
                        name="applicationName"
                        placeholder="Application Name"
                        {...formik.getFieldProps("applicationName")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.applicationName &&
                          formik.errors.applicationName
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
                    <Typography sx={{ mb: "10px" }}>HelpLine Number</Typography>
                    <FormControl fullWidth>
                      <TextField
                        // size="small"
                        name="helpLineNumber"
                        placeholder="phone Number"
                        {...formik.getFieldProps("helpLineNumber")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.helpLineNumber &&
                          formik.errors.helpLineNumber
                        }
                      />
                    </FormControl>
                  </Box>

                  <Box>
                    <Typography sx={{ mb: "10px" }}>HelpLine Email</Typography>
                    <FormControl fullWidth>
                      <TextField
                        // size="small"
                        name="helpEmail"
                        placeholder="Email"
                        {...formik.getFieldProps("helpEmail")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.helpEmail && formik.errors.helpEmail
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
                    sm: "repeat(3, 2fr)"
                  }}
                >
                  <Box>
                    <Typography sx={{ mb: "10px" }}>
                      OnBoarding Content One
                    </Typography>
                    <FormControl fullWidth>
                      <TextField
                        name="onboardingContent1"
                        placeholder="OnBoarding Content One"
                        multiline
                        rows={5}
                        {...formik.getFieldProps("onboardingContent1")}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.onboardingContent1 &&
                          formik.errors.onboardingContent1
                        }
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <Typography sx={{ mb: "10px" }}>
                      OnBoarding Content Two
                    </Typography>
                    <FormControl fullWidth>
                      <TextField
                        name="onboardingContent2"
                        placeholder="OnBoarding Content Two"
                        multiline
                        rows={5}
                        {...formik.getFieldProps("onboardingContent2")}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.onboardingContent2 &&
                          formik.errors.onboardingContent2
                        }
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <Typography sx={{ mb: "10px" }}>
                      OnBoarding Content Three
                    </Typography>
                    <FormControl fullWidth>
                      <TextField
                        name="onboardingContent3"
                        placeholder="OnBoarding Content Three"
                        multiline
                        rows={5}
                        {...formik.getFieldProps("onboardingContent3")}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.onboardingContent3 &&
                          formik.errors.onboardingContent3
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
                    <Typography sx={{ mb: "10px" }}>Tag Line</Typography>
                    <FormControl fullWidth>
                      <TextField
                        // size="small"
                        multiline
                        rows={2}
                        name="tagline"
                        placeholder="Tag Line"
                        {...formik.getFieldProps("tagline")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={formik.touched.tagline && formik.errors.tagline}
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <Typography sx={{ mb: "10px" }}>
                      Social Media Link (Instagram)
                    </Typography>
                    <FormControl fullWidth>
                      <TextField
                        // size="small"
                        multiline
                        rows={2}
                        name="instagramLink"
                        placeholder="Instagram Link "
                        {...formik.getFieldProps("instagramLink")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.instagramLink &&
                          formik.errors.instagramLink
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
                      Social Media Link (What`s App)
                    </Typography>
                    <FormControl fullWidth>
                      <TextField
                        // size="small"
                        multiline
                        rows={2}
                        name="whatsappLink"
                        placeholder="What`s App Link"
                        {...formik.getFieldProps("whatsappLink")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.whatsappLink &&
                          formik.errors.whatsappLink
                        }
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <Typography sx={{ mb: "10px" }}>
                      Social Media Link (Facebook)
                    </Typography>
                    <FormControl fullWidth>
                      <TextField
                        // size="small"
                        multiline
                        rows={2}
                        name="facebookLink"
                        placeholder="Facebook Link"
                        {...formik.getFieldProps("facebookLink")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.facebookLink &&
                          formik.errors.facebookLink
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
                      Social Media Link (YouTube)
                    </Typography>
                    <FormControl fullWidth>
                      <TextField
                        // size="small"
                        multiline
                        rows={2}
                        name="youtubeLink"
                        placeholder="YouTube Link"
                        {...formik.getFieldProps("youtubeLink")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.youtubeLink &&
                          formik.errors.youtubeLink
                        }
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <Typography sx={{ mb: "10px" }}>
                      Social Media Link (LinkedIn)
                    </Typography>
                    <FormControl fullWidth>
                      <TextField
                        // size="small"
                        multiline
                        rows={2}
                        name="linkedinLink"
                        placeholder="LinkedIn Link"
                        {...formik.getFieldProps("linkedinLink")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.linkedinLink &&
                          formik.errors.linkedinLink
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
                      Student Android App Version
                    </Typography>
                    <FormControl fullWidth>
                      <TextField
                        // type="number"
                        name="studentAndroidMobileVersion"
                        placeholder="Student Android App Version"
                        {...formik.getFieldProps("studentAndroidMobileVersion")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.studentAndroidMobileVersion &&
                          formik.errors.studentAndroidMobileVersion
                        }
                      />
                    </FormControl>
                  </Box>

                  <Box>
                    <Typography sx={{ mb: "10px" }}>Student IOS App Version</Typography>
                    <FormControl fullWidth>
                      <TextField
                        // type="number"
                        name="studentIosMobileVersion"
                        placeholder="Student IOS App Version"
                        {...formik.getFieldProps("studentIosMobileVersion")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.studentIosMobileVersion &&
                          formik.errors.studentIosMobileVersion
                        }
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <Typography sx={{ mb: "10px" }}>
                      Parent Android App Version
                    </Typography>
                    <FormControl fullWidth>
                      <TextField
                        // type="number"
                        name="parentAndroidMobileVersion"
                        placeholder="Student Android App Version"
                        {...formik.getFieldProps("parentAndroidMobileVersion")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.parentAndroidMobileVersion &&
                          formik.errors.parentAndroidMobileVersion
                        }
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <Typography sx={{ mb: "10px" }}>Parent IOS App Version</Typography>
                    <FormControl fullWidth>
                      <TextField
                        // type="number"
                        name="parentIosMobileVersion"
                        placeholder="Student IOS App Version"
                        {...formik.getFieldProps("parentIosMobileVersion")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.parentIosMobileVersion &&
                          formik.errors.parentIosMobileVersion
                        }
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <Typography sx={{ mb: "10px" }}>Student App Primary Color : <b>{formik.values.studentPrimaryColor}</b></Typography>
                    <FormControl fullWidth>
                      <TextField
                        type="color"
                        name="studentPrimaryColor"
                        placeholder="Student IOS App Version"
                        {...formik.getFieldProps("studentPrimaryColor")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.studentPrimaryColor &&
                          formik.errors.studentPrimaryColor
                        }
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <Typography sx={{ mb: "10px" }}>Parent App Primary Color : <b>{formik.values.parentPrimaryColor}</b></Typography>
                    <FormControl fullWidth>
                      <TextField
                        type="color"
                        name="parentPrimaryColor"
                        placeholder="Student IOS App Version"
                        {...formik.getFieldProps("parentPrimaryColor")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.parentPrimaryColor &&
                          formik.errors.parentPrimaryColor
                        }
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <Typography sx={{ mb: "10px" }}>Student App Secondary Color : <b>{formik.values.studentSecondaryColor}</b></Typography>
                    <FormControl fullWidth>
                      <TextField
                        type="color"
                        name="studentSecondaryColor"
                        placeholder="Student IOS App Version"
                        {...formik.getFieldProps("studentSecondaryColor")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.studentSecondaryColor &&
                          formik.errors.studentSecondaryColor
                        }
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <Typography sx={{ mb: "10px" }}>Parent App Secondary Color : <b>{formik.values.parentSecondaryColor}</b></Typography>
                    <FormControl fullWidth>
                      <TextField
                        type="color"
                        name="parentSecondaryColor"
                        placeholder="Student IOS App Version"
                        {...formik.getFieldProps("parentSecondaryColor")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.parentSecondaryColor &&
                          formik.errors.parentSecondaryColor
                        }
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <Typography sx={{ mb: "10px" }}>Student App Background Color : <b>{formik.values.studentBgColor}</b></Typography>
                    <FormControl fullWidth>
                      <TextField
                        type="color"
                        name="studentBgColor"
                        placeholder="Student IOS App Version"
                        {...formik.getFieldProps("studentBgColor")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.studentBgColor &&
                          formik.errors.studentBgColor
                        }
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <Typography sx={{ mb: "10px" }}>Parent App Background Color : <b>{formik.values.parentBgColor}</b></Typography>
                    <FormControl fullWidth>
                      <TextField
                        type="color"
                        name="parentBgColor"
                        placeholder="Student IOS App Version"
                        {...formik.getFieldProps("parentBgColor")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.parentBgColor &&
                          formik.errors.parentBgColor
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
                      Android App URL
                    </Typography>
                    <FormControl fullWidth>
                      <TextField
                        // size="small"
                        multiline
                        rows={2}
                        name="androidAppUrl"
                        placeholder=" Android App URL"
                        {...formik.getFieldProps("androidAppUrl")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.androidAppUrl &&
                          formik.errors.androidAppUrl
                        }
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <Typography sx={{ mb: "10px" }}>
                      IOS App URL
                    </Typography>
                    <FormControl fullWidth>
                      <TextField
                        // size="small"
                        multiline
                        rows={2}
                        name="iosAppUrl"
                        placeholder="IOS App URL"
                        {...formik.getFieldProps("iosAppUrl")}
                        onChange={formik.handleChange}
                        fullWidth
                        error={
                          formik.touched.iosAppUrl &&
                          formik.errors.iosAppUrl
                        }
                      />
                    </FormControl>
                  </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ mb: "10px" }}>
                    Social Share Content
                  </Typography>
                  <FormControl fullWidth>
                    <TextField
                      name="socialContent"
                      placeholder="Social Share Content"
                      multiline
                      rows={5}
                      {...formik.getFieldProps("socialContent")}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.socialContent &&
                        formik.errors.socialContent
                      }
                    />
                  </FormControl>
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={mobileLoader}
                  >
                    Save
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Container >
    </>
  );
}

export default Web;
