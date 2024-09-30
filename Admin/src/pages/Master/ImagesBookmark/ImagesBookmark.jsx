import React from "react";
import { Card, Grid, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { Box, Container, Stack } from "@mui/system";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { useEffect } from "react";
import { AdminValidate, _initialValues } from "./utils";
import { useDispatch } from "react-redux";
import {
  updateWebByIdAsync,
  getAllBookmarkImagesAsync
} from "redux/slices/SiteSettingsSlice/WebAsync.api";
import { useSelector } from "react-redux";
import { emptyadmin } from "redux/slices/SiteSettingsSlice/Admin.slice";
import UploadBox from "components/CustomUploads/UploadBox";
import { GenerateBase64 } from "utils/convertToBase64";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";

function ImagesBookmark() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { adminLoader, admin, updateadmin, getAllBookmarkImages } = useSelector(
    (state) => state.admin
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle)

  useEffect(() => {
    dispatch(getAllBookmarkImagesAsync({}));
  }, []);

  const handleDrop = (acceptedFiles) => {
    // HANDLE FILES
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file)
    });
    if (file) {
      formik.setFieldValue("BookmarkedVideos", [newFile]);
    }
  };

  const handleDropLogo = (acceptedFiles) => {
    // HANDLE FILES
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file)
    });
    if (file) {
      formik.setFieldValue("BookmarkedQuestions", [newFile]);
    }
  };
  const handleDropMiniLogo = (acceptedFiles) => {
    // HANDLE FILES
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file)
    });
    if (file) {
      formik.setFieldValue("DownloadedVideos", [newFile]);
    }
  };

  const onSubmit = async (values) => {
    const BookmarkedVideosBase64 = await GenerateBase64(
      values.BookmarkedVideos[0]
    );
    const BookmarkedQuestionsBase64 = await GenerateBase64(
      values.BookmarkedQuestions[0]
    );
    const DownloadedVideosBase64 = await GenerateBase64(
      values.DownloadedVideos[0]
    );

    const payload = {
      bookmarkVideoImage: BookmarkedVideosBase64,
      bookmarkQuestionImage: BookmarkedQuestionsBase64,
      downloadVideoImage: DownloadedVideosBase64,
      type: "bookmarkImages"
    };
    dispatch(updateWebByIdAsync(payload));
  };

  useEffect(() => {
    if (getAllBookmarkImages) {
      formik.setFieldValue("BookmarkedVideos", [
        getAllBookmarkImages.bookmarkVideoImage
      ]);
      formik.setFieldValue("BookmarkedQuestions", [
        getAllBookmarkImages.bookmarkQuestionImage
      ]);
      formik.setFieldValue("DownloadedVideos", [
        getAllBookmarkImages.downloadVideoImage
      ]);
    }
  }, [getAllBookmarkImages]);

  useEffect(() => {
    if (updateadmin.status === 200) {
      toast.success(updateadmin.message, toastoptions);
      dispatch(emptyadmin());
      //   dispatch(getAllBookmarkImagesAsync());
    }
  }, [updateadmin]);

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: AdminValidate
  }); // FOMRIK
  return (
    <>
     <Helmet>
        <title>Images | {`${tabTitle}`}</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : "lg"}>
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
                    <Typography sx={{ mb: "10px" }}>
                      Bookmarked Videos
                    </Typography>
                    <UploadBox
                      height={60}
                      label="Bookmarked Videos"
                      name="BookmarkedVideos"
                      accept={{
                        "image/*": []
                      }}
                      onDrop={handleDrop}
                      file={formik.values.BookmarkedVideos[0]}
                      error={
                        formik.touched.BookmarkedVideos &&
                        formik.errors.BookmarkedVideos
                      }
                    />
                  </Box>

                  <Box>
                    <Typography sx={{ mb: "10px" }}>
                      Bookmarked Questions
                    </Typography>
                    <UploadBox
                      height={60}
                      label="Bookmarked Questions"
                      name="BookmarkedQuestions"
                      accept={{
                        "image/*": []
                      }}
                      onDrop={handleDropLogo}
                      file={formik.values.BookmarkedQuestions[0]}
                      error={
                        formik.touched.BookmarkedQuestions &&
                        formik.errors.BookmarkedQuestions
                      }
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
                    <Typography sx={{ mb: "10px" }}>
                      Downloaded Videos
                    </Typography>
                    <UploadBox
                      height={60}
                      label="Downloaded Videos"
                      name="DownloadedVideos"
                      accept={{
                        "image/*": []
                      }}
                      onDrop={handleDropMiniLogo}
                      file={formik.values.DownloadedVideos[0]}
                      error={
                        formik.touched.DownloadedVideos &&
                        formik.errors.DownloadedVideos
                      }
                    />
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
    </>
  );
}

export default ImagesBookmark;
