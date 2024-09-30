import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Container,
  Grid,
  Card,
  MenuItem,
  FormControl,
  TextField,
  Box,
  InputAdornment,
} from "@mui/material";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useSettingsContext } from "components/settings";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "routes/paths";
import { styled } from "@mui/material/styles";
import SelectMenuItem from "components/SelectMenuItem";
import { _initial, _source, _validate } from "./utils";
import UploadMultipleCustom from "components/CustomUploads/UploadMultiple";
import Iconify from "components/iconify/Iconify";
import BoxGridTwo from "components/BoxGridTwo/BoxGridTwo";
import getFileExtension from "utils/getFileExtension";
import { formatFileSize, getFileSize } from "utils/getFileSize";
import { decrypt } from "utils/cryptojs";
import { s3uploadFile } from "config/aws";
import { v4 as uuidv4 } from "uuid";
import { LoadingButton } from "@mui/lab";
import Label from "components/label/Label";
import {
  createGalleryAsync,
  updateGalleryByIdAsync,
} from "redux/slices/GallerySlice/gallery.async.api";
import { emptygallery } from "redux/slices/GallerySlice/gallery.slice";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { useNavigate, useParams } from "react-router-dom";

export default function AddGallery() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fileProgress, setFileProgress] = useState(0);
  const [uploadspeed, setuploadspeed] = useState(0);
  const [filesize, setFilesize] = useState(0);
  const [uploadStart, setUploadStart] = useState(false);
  const [completefile, setCompleteFile] = useState(0);
  const [totalfile, settotalfile] = useState(0);

  const { userinfo } = useSelector((state) => state.userinfo);
  const decryptin = decrypt(userinfo.credentials);

  const { galleryLoader, galleryadd } = useSelector((state) => state.gallery);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const onSubmit = async (values) => {
    const multiple = [];
    if (values.source === "File") {
      const totalSize = values.file.reduce((acc, file) => acc + file.size, 0);
      settotalfile(formatFileSize(totalSize));
      let counter = 0;
      for (let evvv of values.file) {
        const extension = getFileExtension(evvv.name);
        const filesize = getFileSize(evvv);
        setFilesize(filesize);
        setUploadStart(true);
        const startTime = new Date().getTime();
        let bytesUploaded = 0;
        const key = `${decryptin.folder.gallary}/${uuidv4()}.${extension}`;
        const fileuploads3 = s3uploadFile(key, evvv, decryptin);
        fileuploads3.on("httpUploadProgress", (progress) => {
          setFileProgress(Math.round((progress.loaded / progress.total) * 100));
          bytesUploaded = progress.loaded;
          const elapsedTime = new Date().getTime() - startTime;
          const uploadSpeed = (bytesUploaded / elapsedTime) * 1000;
          setuploadspeed(Math.ceil(uploadSpeed / 1000000));
        });
        await fileuploads3.done().then((evv) => {
          counter += 1;
          multiple.push({
            label: evvv.name,
            value: evv.Key
          });
          setCompleteFile(counter);
        });
      }
    } else {
      for (let evv of values.list) {
        multiple.push({
          label: evv.list,
          value: evv.list
        });
      }
    }
    let payload = {
      id: id,
      source: values.source,
      multiple: multiple,
    };
    if (id) {
      payload.id = id;
      dispatch(updateGalleryByIdAsync(payload));
    } else {
      dispatch(createGalleryAsync(payload));
    }
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate,
  });

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

  const handleDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    formik.setFieldValue("file", [...formik.values.file, ...newFiles]);
  };

  useEffect(() => {
    if (galleryadd.status === 200) {
      toast.success(galleryadd.message, toastoptions);
      formik.resetForm();
      dispatch(emptygallery());
      navigate(PATH_DASHBOARD.gallery);
    }
  }, [galleryadd]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Gallery Manager | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Create Gallery Manager"
        links={[
          { name: "Gallery Manager", href: PATH_DASHBOARD.gallery },
          { name: "Create Gallery Manager" },
        ]}
      />
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <Card sx={{ direction: "start", p: 2 }}>
              <SelectMenuItem
                fullWidth
                error={formik.touched.source && formik.errors.source}
                InputLabelLabel="Source"
                InputLabelSize={20}
                label="Source"
                name="source"
                sx={{ mb: "15px" }}
                {...formik.getFieldProps("source")}
                onChange={formik.handleChange}
                defaultItemLabel="Select Source"
                data={_.map(_source, (ev, index) => {
                  return (
                    <MenuItem value={ev.value} key={index}>
                      {ev.label}
                    </MenuItem>
                  );
                })}
              />
              {formik.values.source === "URL" && (
                <BoxGridTwo rowGap={0}>
                  {formik.values.list.map((listI, index) => (
                    <Box key={index} sx={{ mb: "15px" }}>
                      <Grid item xs={12} md={12}>
                        <FormControl fullWidth>
                          <TextField
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  {formik.values.list.length !== 0 && (
                                    <div>
                                      {index !== 0 ||
                                        formik.values.list.length > 1 ? (
                                        <Iconify
                                          icon="eva:trash-2-outline"
                                          onClick={() => {
                                            if (
                                              formik.values.list.length > 1
                                            ) {
                                              formik.values.list.splice(
                                                index,
                                                1
                                              );
                                              formik.setFieldValue(
                                                "list",
                                                formik.values.list
                                              );
                                            }
                                          }}
                                          style={{
                                            cursor: "pointer",
                                            marginRight: "10px",
                                          }}
                                        />
                                      ) : null}
                                      {formik.values.list.length - 1 ===
                                        index && (
                                          <Iconify
                                            icon="eva:plus-fill"
                                            onClick={() => {
                                              formik.setFieldValue("list", [
                                                ...formik.values.list,
                                                { list: "" },
                                              ]);
                                            }}
                                            style={{
                                              cursor: "pointer",
                                            }}
                                          />
                                        )}
                                    </div>
                                  )}
                                </InputAdornment>
                              ),
                            }}
                            fullWidth
                            label="URL"
                            sx={{ background: "#F9F9F9" }}
                            name="list"
                            type="text"
                            value={listI.list}
                            onChange={(e) => {
                              formik.values.list[index][e.target.name] =
                                e.target.value;
                              formik.setFieldValue(
                                "list",
                                formik.values.list
                              );
                            }}
                            error={Boolean(
                              formik.touched.list && formik.errors.list
                            )}
                          />
                        </FormControl>
                      </Grid>
                    </Box>
                  ))}
                </BoxGridTwo>
              )}
              {formik.values.source === "File" && (
                <UploadMultipleCustom
                  label="File"
                  name="image"
                  multiple
                  // thumbnail
                  files={formik.values.file}
                  onDrop={handleDrop}
                  onRemove={(ev) => {
                    const filtered = formik.values.file.filter(
                      (file) => file !== ev
                    );
                    formik.setFieldValue("file", filtered);
                  }}
                  error={formik.touched.file && formik.errors.file}
                />
              )}
              {uploadStart && (
                <StyledComponent
                  sx={{
                    mb: 2,
                  }}
                >
                  <Label
                    variant="contained"
                    sx={{ textTransform: "capitalize", mr: 1 }}
                  >
                    File Size {filesize}
                  </Label>
                  <Label
                    variant="contained"
                    sx={{ textTransform: "capitalize", mr: 1 }}
                  >
                    Uploading File {fileProgress}%
                  </Label>
                  <Label
                    variant="contained"
                    sx={{ textTransform: "capitalize", mr: 1 }}
                  >
                    Completed Uploading Speed {uploadspeed} mbps
                  </Label>
                  <Label
                    variant="contained"
                    sx={{ textTransform: "capitalize", mr: 1 }}
                  >
                    {completefile} File Uploaded
                  </Label>
                  <Label
                    variant="contained"
                    sx={{ textTransform: "capitalize", mr: 1 }}
                  >
                    Total File Size {totalfile}
                  </Label>
                </StyledComponent>
              )}
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
                  disabled={uploadStart}
                >
                  Upload to gallery
                </LoadingButton>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
