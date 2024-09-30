import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  Container,
  Grid,
  Card,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { _validation, _initialValues } from "./utils";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import {
  createGalleryAsync,
  getGalleryByIdAsync,
  updateGalleryByIdAsync,
} from "redux/slices/GallerySlice/gallery.async.api";
import { useDispatch } from "react-redux";
import { GenerateBase64 } from "utils/convertToBase64";
import {
  emptygallery,
  emptygalleryId,
} from "redux/slices/GallerySlice/gallery.slice";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import UploadBox from "components/CustomUploads/UploadBox";
import { useSettingsContext } from "components/settings";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "routes/paths";
import { useNavigate, useParams } from "react-router";
import Label from "components/label/Label";
import { styled } from "@mui/material/styles";
import { s3uploadFile } from "config/aws";
import getFileExtension from "utils/getFileExtension";
import { v4 as uuidv4 } from "uuid";
import { getFileSize } from "utils/getFileSize";
import { decrypt } from "utils/cryptojs";
import { isJson } from "utils/isJson";

function AddGallery() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [fileProgress, setFileProgress] = useState(0);
  const [uploadspeed, setuploadspeed] = useState(0);
  const [filesize, setFilesize] = useState(0);
  const [uploadStart, setUploadStart] = useState(false);

  const { galleryLoader, galleryId, galleryupdateId, galleryadd } = useSelector(
    (state) => state.gallery
  );
  const { userinfo } = useSelector((state) => state.userinfo);
  const decryptin = decrypt(userinfo.credentials);
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    if (file) {
      formik.setFieldValue("image", [newFile]);
    }
  };
  const VideohandleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    if (file) {
      formik.setFieldValue("video", [newFile]);
    }
  };

  const onSubmit = async (values) => {
    let payload;
    if (values.type === "image") {
      const ImageBase64 = await GenerateBase64(values.image[0]);
      payload = {
        title: values.title,
        type: "image",
        url: ImageBase64,
      };
    } else if (values.type === "video") {
      payload = {
        title: values.title,
        type: "video",
        source: values.source,
      };
      if (values.source !== "file") {
        payload = {
          ...payload,
          url: values.url,
        };
      }
    }
    if (
      values.type === "image" ||
      (values.type === "video" && values.source !== "file")
    ) {
      if (id) {
        payload.id = id;
        dispatch(updateGalleryByIdAsync(payload));
      } else {
        dispatch(createGalleryAsync(payload));
      }
    } else if (values.type === "video" && values.source === "file") {
      if (typeof values.video[0] === "object") {
        const extension = getFileExtension(values.video[0]?.name);
        const filesize = getFileSize(values.video[0]);
        setFilesize(filesize);
        setUploadStart(true);
        const startTime = new Date().getTime();
        let bytesUploaded = 0;
        const key = `${decryptin.folder.gallary}/${uuidv4()}.${extension}`;
        const fileuploads3 = s3uploadFile(key, values.video[0], decryptin);
        fileuploads3.on("httpUploadProgress", (progress) => {
          setFileProgress(Math.round((progress.loaded / progress.total) * 100));
          bytesUploaded = progress.loaded;
          const elapsedTime = new Date().getTime() - startTime;
          const uploadSpeed = (bytesUploaded / elapsedTime) * 1000;
          setuploadspeed(Math.ceil(uploadSpeed / 1000000));
        });
        await fileuploads3.done().then(async (evv) => {
          payload.url = evv.Key;
          if (id) {
            payload.id = id;
            dispatch(updateGalleryByIdAsync(payload));
          } else {
            dispatch(createGalleryAsync(payload));
          }
        });
      } else {
        payload.url = values.video[0];
        if (id) {
          payload.id = id;
          dispatch(updateGalleryByIdAsync(payload));
        } else {
          dispatch(createGalleryAsync(payload));
        }
      }
    }
  };

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: _validation,
  });

  useEffect(() => {
    if (id) dispatch(getGalleryByIdAsync(id));
  }, [id]);

  useEffect(() => {
    if (galleryId.title) {
      formik.setFieldValue("title", galleryId?.title);
      formik.setFieldValue("type", galleryId?.type);
      if (galleryId?.type === "image") {
        formik.setFieldValue("image", [galleryId?.url]);
      } else if (galleryId?.type === "video") {
        formik.setFieldValue("source", galleryId?.source);
        if (galleryId?.source === "url") {
          formik.setFieldValue("url", galleryId?.url);
        } else {
          formik.setFieldValue("video", [galleryId?.url]);
        }
      }
    }
  }, [galleryId]);

  useEffect(() => {
    if (galleryadd.status === 200) {
      toast.success(galleryadd.message, toastoptions);
      formik.resetForm();
      dispatch(emptygallery());
      navigate(PATH_DASHBOARD.gallery);
    }
    if (galleryupdateId.status === 200) {
      toast.success(galleryupdateId.message, toastoptions);
      formik.resetForm();
      dispatch(emptygallery());
      navigate(PATH_DASHBOARD.gallery);
    }
  }, [galleryadd, galleryupdateId]);

  const StyledComponent = styled("div")(({ theme }) => ({
    width: "100%",
    fontSize: 24,
    height: "58px",
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    margin: theme.spacing(0),
    color: theme.palette.text.disabled,
    borderRadius: theme.shape.borderRadius,
    border: `solid 1px ${theme.palette.divider}`,
    "&:hover": {
      opacity: 0.72,
    },
    paddingLeft: "20px",
  }));

  return (
    <>
      <Helmet>
        <title>Gallery Manager | {`${tabTitle}`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={
            Boolean(id) ? "Update Gallery Manager" : "Create Gallery Manager"
          }
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            {
              name: " Gallery Manager",
              href: PATH_DASHBOARD.gallery,
            },
            {
              name: Boolean(id)
                ? "Update Gallery Manager"
                : "Create Gallery Manager",
            },
          ]}
        />
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <Card sx={{ direction: "start", p: 2 }}>
              <form onSubmit={formik.handleSubmit}>
                <Box
                  sx={{ mt: 2 }}
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(1, 1fr)",
                  }}
                >
                  <FormControl fullWidth>
                    <TextField
                      name="title"
                      label="Title"
                      style={{ color: "transparent !important" }}
                      fullWidth
                      {...formik.getFieldProps("title")}
                      onChange={formik.handleChange}
                      error={formik.touched.title && formik.errors.title}
                    />
                  </FormControl>
                  <Box>
                    <FormControl
                      sx={{
                        mb: 1,
                      }}
                      fullWidth
                      error={formik.touched.type && formik.errors.type}
                    >
                      <InputLabel>Type</InputLabel>
                      <Select
                        label="Type"
                        name="type"
                        {...formik.getFieldProps("type")}
                        onChange={formik.handleChange}
                      >
                        <MenuItem defaultValue value="">
                          Select Type
                        </MenuItem>
                        <MenuItem value="image">Image</MenuItem>
                        <MenuItem value="video">Video</MenuItem>;
                      </Select>
                    </FormControl>
                    <Box>
                      {formik.values.type === "image" ? (
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
                      ) : formik.values.type === "video" ? (
                        <FormControl
                          fullWidth
                          error={formik.touched.source && formik.errors.source}
                          sx={{
                            my: "12px",
                          }}
                        >
                          <InputLabel>Source</InputLabel>
                          <Select
                            label="source"
                            name="source"
                            {...formik.getFieldProps("source")}
                            onChange={(e) =>
                              formik.setFieldValue("source", e.target.value)
                            }
                            error={
                              formik.touched.source && formik.errors.source
                            }
                          >
                            <MenuItem defaultValue value="">
                              Select File Source
                            </MenuItem>
                            <MenuItem value="file">File</MenuItem>
                            <MenuItem value="url">URL</MenuItem>
                          </Select>
                        </FormControl>
                      ) : null}

                      {formik.values.source === "file" &&
                      formik.values.type != "image" &&
                      formik.values.type != "" ? (
                        <>
                          <UploadBox
                            otherFile={true}
                            height={58}
                            name="video"
                            label="Video"
                            accept={{
                              "video/*": [],
                            }}
                            onDrop={VideohandleDrop}
                            file={formik.values?.video[0]}
                            error={Boolean(
                              formik.touched.video && formik.errors.video
                            )}
                          />
                          {uploadStart && (
                            <StyledComponent
                              sx={{
                                mt: 2,
                              }}
                            >
                              <Label
                                variant="contained"
                                sx={{ textTransform: "capitalize" }}
                              >
                                File Size {filesize} Uploading File{" "}
                                {fileProgress}% Completed Uploading Speed{" "}
                                {uploadspeed} mbps
                              </Label>
                            </StyledComponent>
                          )}
                        </>
                      ) : null}

                      {formik.values.source === "url" &&
                      formik.values.type != "image" &&
                      formik.values.type != "" ? (
                        <FormControl fullWidth>
                          <TextField
                            name="url"
                            label="Video URL"
                            style={{ color: "transparent !important" }}
                            fullWidth
                            {...formik.getFieldProps("url")}
                            onChange={formik.handleChange}
                            error={formik.touched.url && formik.errors.url}
                          />
                        </FormControl>
                      ) : null}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                        mt: 3,
                        mb: 3,
                      }}
                    >
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={galleryLoader}
                      >
                        {Boolean(id)
                          ? "Update Gallery Manager"
                          : "Create Gallery Manager"}
                      </LoadingButton>
                    </Box>
                  </Box>
                </Box>
              </form>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default AddGallery;
