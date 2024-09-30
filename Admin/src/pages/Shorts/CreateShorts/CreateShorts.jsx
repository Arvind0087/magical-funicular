import { Helmet } from "react-helmet-async";
import React, { useEffect, useState } from "react";
import {
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
  Container,
  Stack,
  Checkbox,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { _initial, _validate } from "./utils";
import { useFormik } from "formik";
import {
  addShortsAsync,
  getBoardsByCourseIdAsync,
  getShortsByIdAsync,
  getSubjectByBatchTypeIdAsync,
  updateShortsAsync,
} from "redux/async.api";
import { getClassBatchSubjectByBoardIdAsync } from "redux/board/board.async";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { Upload } from "components/upload";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { emptyshorts } from "redux/slices/shorts.slice";
import { GenerateBase64 } from "utils/convertToBase64";
import { getcourseAsync } from "redux/course/course.async";
import { PATH_DASHBOARD } from "routes/paths";
//
import { formatFileSize, getFileSize } from "utils/getFileSize";
import { decrypt } from "utils/cryptojs";
import { s3uploadFile } from "config/aws";
import { v4 as uuidv4 } from "uuid";
import Label from "components/label/Label";
import { styled } from "@mui/material/styles";
import getFileExtension from "utils/getFileExtension";

export default function CreateShorts() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  // const [videoSourceUrl, setVideoSourceUrl] = useState("");
  // const [videosource, setVideosource] = useState("");
  const [courseIdBoard, setCourseIdBoard] = useState("");
  const [boardIdCourse, setBoardIdCourse] = useState("");
  const [classIdBatch, setClassIdBatch] = useState("");
  const [batchtypeSubject, setBatchtypeSubject] = useState("");
  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader, boardByCourse, getClassBatchSubjectByBoardId } =
    useSelector((state) => state.board);

  const [fileProgress, setFileProgress] = useState(0);
  const [uploadspeed, setuploadspeed] = useState(0);
  const [filesize, setFilesize] = useState(0);
  const [uploadStart, setUploadStart] = useState(false);
  const [completefile, setCompleteFile] = useState(0);
  const [totalfile, settotalfile] = useState(0);
  const [getCheckedValue, setCheckedValue] = useState([]);
  const [getCheckedAll, setCheckedAll] = useState(false);
  //
  const { userinfo } = useSelector((state) => state.userinfo);
  const decryptin = decrypt(userinfo.credentials);
  const { shortsLoader, shortsadd, shortsbyid, shortsupdate } = useSelector(
    (state) => state.shorts
  );

  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const uploadData = [
    // { id: 1, name: "upload" },
    { id: 1, name: "youtube" },
  ];

  // batch with calss
  const classList = getClassBatchSubjectByBoardId;
  const handleCheckedAll = (data) => {
    setCheckedAll(data);
    if (data === true) {
      const ids = classList.map((i) =>
        JSON.stringify({
          id: i.id,
          name: i.name,
          batchTypeName: i.batchTypeName,
          className: i.className,
        })
      );
      setCheckedValue(ids);
      formik.setFieldValue("classBatchSubject", ids);
    } else {
      setCheckedValue([]);
      formik.setFieldValue("classBatchSubject", []);
    }
  };
  const handleChangeCheckbox = (data) => {
    formik.handleChange(data);
    setCheckedAll(false);
    const index = getCheckedValue.indexOf(data);
    if (index === -1) {
      setCheckedValue([...getCheckedValue, data]);
      formik.setFieldValue("classBatchSubject", [...getCheckedValue, data]);
    } else {
      setCheckedValue(getCheckedValue.filter((item) => item != data));
      formik.setFieldValue(
        "classBatchSubject",
        getCheckedValue.filter((item) => item != data)
      );
    }
  };

  useEffect(() => {
    if (id) dispatch(getShortsByIdAsync(id));
  }, [id]);

  useEffect(() => {
    if (id && shortsbyid) {
      formik.setFieldValue("courseId", shortsbyid.courseId);
      setCourseIdBoard(shortsbyid.courseId);
      formik.setFieldValue("boardId", shortsbyid.boardId);
      setBoardIdCourse(shortsbyid.boardId);
      formik.setFieldValue("title", shortsbyid.title);

      // const isVideoMP4 = shortsbyid?.video?.includes(".mp4");
      // formik.setFieldValue("video", isVideoMP4 ? [shortsbyid.video] : []);
      // formik.setFieldValue("sourceURL", isVideoMP4 ? [] : [shortsbyid.video]);

      if (id && shortsbyid.source === "upload") {
        formik.setFieldValue("video", [shortsbyid?.video]);
      } else {
        formik.setFieldValue("sourceURL", shortsbyid?.video);
      }

      formik.setFieldValue("source", shortsbyid?.source);

      formik.setFieldValue(
        "thumbnail",
        shortsbyid.thumbnail ? [shortsbyid.thumbnail] : []
      );
    }
  }, [id, shortsbyid]);

  useEffect(() => {
    if (
      id &&
      shortsbyid?.subject?.length &&
      getClassBatchSubjectByBoardId?.length
    ) {
      const selectedClass = shortsbyid?.subject?.map((ev) => {
        let batch =
          getClassBatchSubjectByBoardId?.find(
            (evv) => evv?.id === ev?.subjectId
          ) || {};
        const { classId, batchTypeId, ...rest } = batch;
        return JSON.stringify(rest);
      });

      formik.setFieldValue("classBatchSubject", selectedClass) || [];
      setCheckedValue(selectedClass);
    }
  }, [id, shortsbyid, getClassBatchSubjectByBoardId]);

  const handleDropThumbnail = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    formik.setFieldValue("thumbnail", newFiles);
  };

  const handleDropShortVideo = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    formik.setFieldValue("video", newFiles);
  };

  // HANDLE SUBMIT

  const onSubmit = async (values) => {
    let ImageBase64 = await GenerateBase64(values.thumbnail[0]);
    let multiple;
    if (values?.video && typeof values?.video[0] !== "string") {
      const totalSize = values.video.reduce((acc, file) => acc + file.size, 0);
      settotalfile(formatFileSize(totalSize));
      let counter = 0;
      for (let evvv of values.video) {
        const extension = getFileExtension(evvv.name);
        const filesize = getFileSize(evvv);
        setFilesize(filesize);
        setUploadStart(true);
        const startTime = new Date().getTime();
        let bytesUploaded = 0;
        const key = `${decryptin.folder.shorts}/${uuidv4()}.${extension}`;
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
          multiple = evv.Key;
          setCompleteFile(counter);
        });
      }
    } else if (values?.video?.length > 0) {
      multiple = values?.video[0];
    }
    const payload = {
      // shortsId: id,
      id: Number(id),
      subjectIds: values.subjectIds,
      subjectIds: values?.classBatchSubject?.map((item) => {
        return JSON.parse(item).id;
      }),
      title: values.title,
      video: values.source === "upload" ? multiple : values.sourceURL,
      thumbnail: ImageBase64,
      source: values.source,
    };
    if (id) {
      dispatch(updateShortsAsync(payload));
    } else {
      delete payload.id;
      dispatch(addShortsAsync(payload));
    }
  };

  useEffect(() => {
    // SUCCESS
    if (shortsadd.status === 200) {
      toast.success(shortsadd.message, toastoptions);
      dispatch(emptyshorts());
      formik.resetForm();
      navigate(PATH_DASHBOARD.short);
    }
    if (shortsupdate.status === 200) {
      toast.success(shortsupdate.message, toastoptions);
      dispatch(emptyshorts());
      formik.resetForm();
      navigate(PATH_DASHBOARD.short);
    }
  }, [shortsadd, shortsupdate]);

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate,
  }); // FOMRIK

  const getCourseAsync = () => {
    dispatch(
      getcourseAsync({
        page: "",
        limit: "",
      })
    );
  };

  useEffect(() => {
    // GET COURSES
    getCourseAsync();
  }, []);

  useEffect(() => {
    if (courseIdBoard) {
      // GET BOARD BY COURSE ID
      dispatch(
        getBoardsByCourseIdAsync({
          courseId: courseIdBoard,
        })
      );
    }
  }, [courseIdBoard]);

  // my code for batch with subject
  useEffect(() => {
    if (formik.values.boardId) {
      let payload = {
        boardId: formik.values.boardId,
      };
      dispatch(getClassBatchSubjectByBoardIdAsync(payload));
    }
  }, [formik.values.boardId]);

  useEffect(() => {
    if (batchtypeSubject) {
      // GET SUBJECT BY COURSE ID AND BOARD ID AND CLASS ID AND BATCHTYPE ID
      dispatch(
        getSubjectByBatchTypeIdAsync({
          courseId: courseIdBoard,
          boardId: boardIdCourse,
          classId: classIdBatch,
          batchTypeId: batchtypeSubject,
        })
      );
    }
  }, [batchtypeSubject]);

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

  const handleCheckedLabel = (ev) => {
    const data = JSON.stringify({
      id: ev.id,
      name: ev.name,
      className: ev.className,
      batchTypeName: ev.batchTypeName,
    });

    formik.handleChange(data);
    setCheckedAll(false);
    const index = getCheckedValue.indexOf(data);
    if (index === -1) {
      setCheckedValue([...getCheckedValue, data]);
      formik.setFieldValue("classBatchSubject", [...getCheckedValue, data]);
    } else {
      setCheckedValue(getCheckedValue.filter((item) => item != data));
      formik.setFieldValue(
        "classBatchSubject",
        getCheckedValue.filter((item) => item != data)
      );
    }
  };

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Shorts | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={id ? "Update Shorts" : "Create Shorts"}
        links={[
          { name: "Shorts", href: "" },
          {
            name: "Shorts List",
            href: `${PATH_DASHBOARD.short}`,
          },
          { name: id ? "Update Shorts" : "Create Shorts" },
        ]}
      />
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
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
                  disabled={courseLoader}
                  error={formik.touched.courseId && formik.errors.courseId}
                >
                  <InputLabel>
                    {courseLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "Courses"
                    )}
                  </InputLabel>
                  <Select
                    label="Course"
                    name="courseId"
                    {...formik.getFieldProps("courseId")}
                    onChange={(e) => {
                      formik.handleChange(e);
                      setCourseIdBoard(e.target.value);
                    }}
                  >
                    <MenuItem defaultValue value="">
                      Select Course
                    </MenuItem>
                    {course?.data?.map((ev, index) => {
                      return (
                        <MenuItem value={ev.id} key={ev.index}>
                          {ev.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  disabled={boardLoader}
                  error={formik.touched.boardId && formik.errors.boardId}
                >
                  <InputLabel>
                    {boardLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "Boards"
                    )}
                  </InputLabel>
                  <Select
                    label="Boards"
                    name="boardId"
                    {...formik.getFieldProps("boardId")}
                    onChange={(e) => {
                      formik.handleChange(e);
                      setBoardIdCourse(e.target.value);
                    }}
                  >
                    <MenuItem defaultValue value="">
                      Select Board
                    </MenuItem>
                    {boardByCourse?.map((ev, index) => {
                      return (
                        <MenuItem value={ev.id} key={ev.index}>
                          {ev.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  error={
                    formik.touched.classBatchSubject &&
                    formik.errors.classBatchSubject
                  }
                >
                  <InputLabel>
                    {boardLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "Select Class"
                    )}
                  </InputLabel>
                  <Select
                    name="classBatchSubject"
                    label="Select Class"
                    select
                    multiple
                    value={getCheckedValue}
                    // onChange={handleCheckedAll}
                    renderValue={(setCheckedValue) =>
                      setCheckedValue
                        .map((item) => {
                          const passedItem = JSON.parse(item);
                          return `${passedItem?.className} (${passedItem.batchTypeName}) (${passedItem.name})`;
                        })
                        .join(" , ")
                    }
                  >
                    <MenuItem>
                      <ListItemIcon>
                        <Checkbox
                          value={getCheckedAll}
                          checked={getCheckedAll}
                          onChange={(event) =>
                            handleCheckedAll(event.target.checked)
                          }
                        />
                        <ListItemText
                          style={{ marginTop: "8px" }}
                          primary="Select All"
                        />
                      </ListItemIcon>
                    </MenuItem>

                    {getClassBatchSubjectByBoardId?.map((ev, index) => (
                      <MenuItem key={ev.id}>
                        <ListItemIcon>
                          <Checkbox
                            value={JSON.stringify({
                              id: ev.id,
                              name: ev.name,
                              className: ev.className,
                              batchTypeName: ev.batchTypeName,
                            })}
                            checked={
                              getCheckedValue?.findIndex(
                                (i) => JSON.parse(i).id == ev.id
                              ) != -1
                            }
                            onChange={(event) =>
                              handleChangeCheckbox(event.target.value)
                            }
                          />
                        </ListItemIcon>
                        <span onClick={() => handleCheckedLabel(ev)}>
                          <ListItemText>
                            {ev.className} {""} ({ev.batchTypeName})({ev.name})
                          </ListItemText>
                        </span>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    name="title"
                    label="Short Title"
                    style={{ color: "transparent !important" }}
                    fullWidth
                    {...formik.getFieldProps("title")}
                    onChange={formik.handleChange}
                    error={formik.touched.title && formik.errors.title}
                  />
                </FormControl>
              </Box>

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                }}
                sx={{ mt: "20px", mb: "10px" }}
              >
                <FormControl
                  fullWidth
                  // disabled={courseLoader}
                >
                  <InputLabel>Upload Files</InputLabel>
                  <Select
                    label="Upload Files"
                    name="source"
                    {...formik.getFieldProps("source")}
                    onChange={formik.handleChange}
                    error={formik.touched.source && formik.errors.source}
                  >
                    <MenuItem defaultValue value="">
                      Upload Files
                    </MenuItem>
                    {uploadData?.map((ev, index) => {
                      return (
                        <MenuItem value={ev.name} key={ev.index}>
                          {ev.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "text.secondary", mt: "10px", mb: "10px" }}
                  >
                    Thumbnail
                  </Typography>

                  <Upload
                    name="thumbnail"
                    multiple
                    thumbnail
                    maxSize={3145728}
                    files={formik.values.thumbnail}
                    accept={{ "image/*": [] }}
                    onDrop={handleDropThumbnail}
                    onRemove={() => {
                      formik.setFieldValue("thumbnail", []);
                    }}
                    error={formik.touched.thumbnail && formik.errors.thumbnail}
                  />
                </Box>

                {formik.values.source == "upload" &&
                  formik.values.source !== "" && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "text.secondary", mt: "10px", mb: "10px" }}
                      >
                        Shorts Video
                      </Typography>
                      <Upload
                        multiple
                        thumbnail
                        name="video"
                        accept={{ "video/*": [] }}
                        files={formik.values.video}
                        onDrop={handleDropShortVideo}
                        maxSize={3145728000000000}
                        onRemove={() => {
                          formik.setFieldValue("video", []);
                        }}
                        error={formik.touched.video && formik.errors.video}
                      />
                    </Box>
                  )}

                {formik.values.source !== "upload" &&
                  formik.values.source !== "" && (
                    <Grid item xs={12} md={12} sx={{ mt: "45px" }}>
                      <FormControl fullWidth>
                        <TextField
                          name="sourceURL"
                          label="Video URL"
                          fullWidth
                          error={
                            formik.touched.sourceURL && formik.errors.sourceURL
                          }
                          {...formik.getFieldProps("sourceURL")}
                          onChange={formik.handleChange}
                        />
                      </FormControl>
                    </Grid>
                  )}
              </Box>

              {uploadStart && (
                <StyledComponent
                  sx={{
                    mt: 2,
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

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={shortsLoader}
                >
                  {id ? "Update Shorts" : "Create Shorts"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
