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
  Box,
  Container,
  Stack,
  ListItemIcon,
  Checkbox,
  ListItemText,
} from "@mui/material";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { PATH_DASHBOARD } from "routes/paths";
import { useDispatch, useSelector } from "react-redux";
import {
  addSyllabusContentAsync,
  getAllSyllabusTopicAsync,
  getSyllausContentByIdAsync,
  updateSyllabusContentAsync,
} from "redux/syllabuus/syllabus.async";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import UploadBox from "components/CustomUploads/UploadBox";
import UploadMultipleCustom from "components/CustomUploads/UploadMultiple";
import { useFormik } from "formik";
import { _initial, _tag, _topic, _validate, helpContentType } from "./utils";
import { GenerateBase64 } from "utils/convertToBase64";
import { useParams } from "react-router";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { useNavigate } from "react-router-dom";
import { emptysyllabusTopic } from "redux/syllabuus/syllabus.slice";
import _ from "lodash";
import { styled } from "@mui/material/styles";
import Label from "components/label/Label";
import { s3uploadFile } from "config/aws";
import getFileExtension from "utils/getFileExtension";
import { v4 as uuidv4 } from "uuid";
import { getFileSize } from "utils/getFileSize";
import { decrypt } from "utils/cryptojs";

import {
  getBoardsByCourseIdAsync,
  getClassByBoardAndCourseIdAsync,
  getBatchByCourseBoardClassAsync,
  getSubjectByBatchTypeIdAsync,
  getChapterBySubjectId,
} from "redux/async.api";
import { getcourseAsync } from "redux/course/course.async";
import { getTopicBySubjecIdAsync } from "redux/slices/TopicSlice/Topic.async";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import CustomCheckboxDropdown from "components/CustomCheckboxDropdown/CustomCheckboxDropdown";

export default function TestNewNew() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [fileProgress, setFileProgress] = useState(0);
  const [uploadspeed, setuploadspeed] = useState(0);
  const [filesize, setFilesize] = useState(0);
  const [uploadStart, setUploadStart] = useState(false);
  const [getHelpingResourser, setHelpingResourse] = useState("");
  const { themeStretch } = useSettingsContext();
  const {
    syllabusLoader,
    syllabustopic,
    syllabuscontentcreate,
    syllabuscontentupdate,
    syllabuscontentById,
  } = useSelector((state) => state.syllabus);
  const { courseLoader, course } = useSelector((state) => state.course);
  const { boardLoader, boardByCourse } = useSelector((state) => state.board);
  const { classLoader, classbycourseboard } = useSelector(
    (state) => state.class
  );
  const { batchLoader, batchByCourseBoardClass } = useSelector(
    (state) => state.batch
  );
  const { subjectLoader, subjectCourseBoardClassBatch } = useSelector(
    (state) => state.subject
  );
  const { chapterLoader, chapterdata } = useSelector((state) => state.chapter);
  const { TopicLoader, TopicBySubjecId } = useSelector((state) => state.Topic);
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
      formik.setFieldValue("thumbnail", [newFile]);
    }
  };
  const handleThumbnailDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    if (file) {
      formik.setFieldValue("sourceFile", [newFile]);
    }
  };
  const handleResourceDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    formik.setFieldValue("resources", [
      ...formik.values.resources,
      ...newFiles,
    ]);
  };

  const onSubmit = async (values) => {
    if (
      values.source === "upload" &&
      typeof values.sourceFile[0] !== "string"
    ) {
      const extension = getFileExtension(values.sourceFile[0]?.name);
      const filesize = getFileSize(values.sourceFile[0]);
      setFilesize(filesize);
      setUploadStart(true);
      const startTime = new Date().getTime();
      let bytesUploaded = 0;
      const key = `${decryptin.folder.subject}/${uuidv4()}.${extension}`;
      const fileuploads3 = s3uploadFile(key, values.sourceFile[0], decryptin);
      fileuploads3.on("httpUploadProgress", (progress) => {
        setFileProgress(Math.round((progress.loaded / progress.total) * 100));
        bytesUploaded = progress.loaded;
        const elapsedTime = new Date().getTime() - startTime;
        const uploadSpeed = (bytesUploaded / elapsedTime) * 1000;
        setuploadspeed(Math.ceil(uploadSpeed / 1000000));
      });
      await fileuploads3.done().then(async (evv) => {
        const resourceFiles = [];
        const thumbnail = await GenerateBase64(values.thumbnail[0]);
        for (let ev of values.resources) {
          const resources = await GenerateBase64(ev);
          resourceFiles.push(resources);
        }
        let payload = {
          Id: id,
          topicId: values.topicId?.value,
          tag: values.tag,
          source: values.source,
          resourceFile: resourceFiles,
          thumbnailFile: thumbnail,
          sourceFile: evv.Key,
          courseId: values.courseId?.value,
          boardId: values.boardId?.value,
          classId: values.classId?.value,
          batchTypeId: values.batchTypeId?.value,
          subjectId: values.subjectId?.value,
          chapterId: values.chapterId?.value,
          resourceType: getHelpingResourser,
        };

        if (id) {
          dispatch(updateSyllabusContentAsync(payload));
        } else {
          delete payload.Id;
          dispatch(addSyllabusContentAsync(payload));
        }
      });
    } else {
      const resourceFiles = [];
      const thumbnail = await GenerateBase64(values.thumbnail[0]);
      for (let ev of values.resources) {
        const resources = await GenerateBase64(ev);
        resourceFiles.push(resources);
      }
      let payload = {
        Id: id,
        topicId: values.topicId?.value,
        courseId: values.courseId?.value,
        boardId: values.boardId?.value,
        classId: values.classId?.value,
        batchTypeId: values.batchTypeId?.value,
        subjectId: values.subjectId?.value,
        chapterId: values.chapterId?.value,
        tag: values.tag,
        source: values.source,
        resourceType: getHelpingResourser,
        resourceFile: resourceFiles,
        thumbnailFile: thumbnail,

        sourceFile:
          values.source !== "upload" ? values.sourceURL : values.sourceFile[0],
      };

      if (id) {
        dispatch(updateSyllabusContentAsync(payload));
      } else {
        delete payload.Id;
        dispatch(addSyllabusContentAsync(payload));
      }
    }
  };

  useEffect(() => {
    if (id) dispatch(getSyllausContentByIdAsync(id));
  }, []);

  useEffect(() => {
    if (id && syllabuscontentById) {
      formik.setFieldValue("courseId", {
        label: syllabuscontentById?.course,
        value: syllabuscontentById?.courseId,
      });
      formik.setFieldValue("boardId", {
        label: syllabuscontentById?.board,
        value: syllabuscontentById?.boardId,
      });
      formik.setFieldValue("classId", {
        label: syllabuscontentById?.class,
        value: syllabuscontentById?.classId,
      });
      formik.setFieldValue("batchTypeId", {
        label: syllabuscontentById?.batchType,
        value: syllabuscontentById?.batchTypeId,
      });
      formik.setFieldValue("subjectId", {
        label: syllabuscontentById?.subject,
        value: syllabuscontentById?.subjectId,
      });
      formik.setFieldValue("chapterId", {
        label: syllabuscontentById?.chapter,
        value: syllabuscontentById?.chapterId,
      });

      formik.setFieldValue("topicId", {
        label: syllabuscontentById?.topic,
        value: syllabuscontentById?.topicId,
      });

      formik.setFieldValue("tag", syllabuscontentById.tag);
      formik.setFieldValue("thumbnail", [syllabuscontentById.thumbnailFile]);
      formik.setFieldValue("source", syllabuscontentById.source);
      if (syllabuscontentById.source === "upload") {
        formik.setFieldValue("sourceFile", [syllabuscontentById.sourceFile]);
      } else {
        formik.setFieldValue("sourceURL", syllabuscontentById.sourceFile);
      }
      formik.setFieldValue("resources", syllabuscontentById.resourceFile);

      formik.setFieldValue(
        "helpingResourceType",
        syllabuscontentById?.resourceType
      );
      setHelpingResourse(syllabuscontentById?.resourceType);
    }
  }, [id, syllabuscontentById]);

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate,
  });

  useEffect(() => {
    dispatch(getcourseAsync({}));
  }, []);

  useEffect(() => {
    if (formik.values.courseId?.value) {
      dispatch(
        getBoardsByCourseIdAsync({
          courseId: formik.values.courseId?.value,
        })
      );
    }
  }, [formik.values.courseId]);

  useEffect(() => {
    if (formik.values.boardId?.value) {
      dispatch(
        getClassByBoardAndCourseIdAsync({
          courseId: formik.values.courseId?.value,
          boardId: formik.values.boardId?.value,
        })
      );
    }
  }, [formik.values.boardId]);

  useEffect(() => {
    if (formik.values.classId?.value) {
      dispatch(
        getBatchByCourseBoardClassAsync({
          courseId: formik.values.courseId?.value,
          boardId: formik.values.boardId?.value,
          classId: formik.values.classId?.value,
        })
      );
    }
  }, [formik.values.classId]);

  useEffect(() => {
    if (formik.values.batchTypeId?.value) {
      dispatch(
        getSubjectByBatchTypeIdAsync({
          courseId: formik.values.courseId?.value,
          boardId: formik.values.boardId?.value,
          classId: formik.values.classId?.value,
          batchTypeId: formik.values.batchTypeId?.value,
        })
      );
    }
  }, [formik.values.batchTypeId]);

  useEffect(() => {
    if (formik.values.subjectId?.value) {
      dispatch(
        getChapterBySubjectId({
          courseId: formik.values.courseId?.value,
          boardId: formik.values.boardId?.value,
          classId: formik.values.classId?.value,
          batchTypeId: formik.values.batchTypeId?.value,
          subjectId: formik.values.subjectId?.value,
        })
      );
    }
  }, [formik.values.subjectId]);

  useEffect(() => {
    if (formik.values.chapterId?.value) {
      dispatch(
        getTopicBySubjecIdAsync({
          courseId: formik.values.courseId?.value,
          boardId: formik.values.boardId?.value,
          classId: formik.values.classId?.value,
          batchTypeId: formik.values.batchTypeId?.value,
          subjectId: formik.values.subjectId?.value,
          chapterId: formik.values.chapterId?.value,
        })
      );
    }
  }, [formik.values.chapterId]);

  useEffect(() => {
    if (syllabuscontentcreate.status === 200) {
      toast.success(syllabuscontentcreate.message, toastoptions);
      formik.setFieldValue("name", "");
      formik.setFieldValue("tag", "");
      formik.setFieldValue("thumbnail", []);
      formik.setFieldValue("resources", []);
      formik.setFieldValue("source", "");
      setHelpingResourse("");
      formik.setFieldValue("sourceFile", []);
      setUploadStart(false);
      dispatch(emptysyllabusTopic());
    }
    if (syllabuscontentupdate.status === 200) {
      toast.success(syllabuscontentupdate.message, toastoptions);
      formik.resetForm();
      dispatch(emptysyllabusTopic());
      navigate(PATH_DASHBOARD.content);
    }
  }, [syllabuscontentcreate, syllabuscontentupdate]);

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

  // For Class --------------------------------------------------------------------
  const [selected, setSelected] = useState([]);
  const optionsClass = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
  const isAllSelected =
    optionsClass.length > 0 && selected.length === optionsClass.length;

  const handleChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelected(selected.length === optionsClass.length ? [] : optionsClass);
      return;
    }
    setSelected(value);
  };
  // For Class --------------------------------------------------------------------

  // For Batch Type---------------------------------------------------------------
  const [selectedBatch, setSelectedBatch] = useState([]);

  const allBatch = [
    "Class 6(English)",
    "Class 6(Hindi)",
    "Class 7(English)",
    "Class 7(Hindi)",
    "Class 8(English)",
    "Class 8(Hindi)",
    "Class 9(English)",
    "Class 9(Hindi)",
    "Class 10(English)",
    "Class 10(Hindi)",
  ];
  const optionsBatch = allBatch.filter((ev) => {
    for (const matchingBatch of selected) {
      if (ev.includes(matchingBatch)) {
        return true;
      }
    }
    return false;
  });

  const isAllSelectedBatch =
    optionsBatch.length > 0 && selectedBatch.length === optionsBatch.length;

  const handleChangeBatch = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelectedBatch(
        selectedBatch.length === optionsBatch.length ? [] : optionsBatch
      );
      return;
    }
    setSelectedBatch(value);
  };

  // For Batch Type---------------------------------------------------------------

  // For Chapter Type---------------------------------------------------------------
  const [selectedSubject, setSelectedSubject] = useState([]);

  const allSubject = [
    "Class 6(English)(ALL)",
    "Class 6(Hindi)(ALL)",
    "Class 7(English)(ALL)",
    "Class 7(Hindi)(ALL)",
    "Class 8(English)(ALL)",
    "Class 8(Hindi)(ALL)",
    "Class 9(English)(ALL)",
    "Class 9(Hindi)(ALL)",
    "Class 10(English)(ALL)",
    "Class 10(Hindi)(ALL)",
    "Class 10(Hindi)(ALL)",
    "Class 6(English)(Subject 01)",
    "Class 6(English)(Subject 02)",
    "Class 6(English)(Subject 03)",
    "Class 6(Hindi)(Subject 01)",
    "Class 6(Hindi)(Subject 02)",
    "Class 6(Hindi)(Subject 03)",
    "Class 7(English)(Subject 01)",
    "Class 7(English)(Subject 02)",
    "Class 7(English)(Subject 03)",
    "Class 7(Hindi)(Subject 01)",
    "Class 7(Hindi)(Subject 02)",
    "Class 7(Hindi)(Subject 03)",
    "Class 8(English)(Subject 01)",
    "Class 8(English)(Subject 02)",
    "Class 8(English)(Subject 03)",
    "Class 8(Hindi)(Subject 01)",
    "Class 8(Hindi)(Subject 02)",
    "Class 8(Hindi)(Subject 03)",
    "Class 9(English)(Subject 01)",
    "Class 9(English)(Subject 02)",
    "Class 9(English)(Subject 03)",
    "Class 9(Hindi)(Subject 01)",
    "Class 9(Hindi)(Subject 02)",
    "Class 9(Hindi)(Subject 03)",
    "Class 10(English)(Subject 01)",
    "Class 10(English)(Subject 02)",
    "Class 10(English)(Subject 03)",
    "Class 10(Hindi)(Subject 01)",
    "Class 10(Hindi)(Subject 02)",
    "Class 10(Hindi)(Subject 03)",
  ];
  const optionSubject = allSubject.filter((ev) => {
    for (const matchingSubject of selectedBatch) {
      if (ev.includes(matchingSubject)) {
        return true;
      }
    }
    return false;
  });

  const isAllSelectedSubject =
    optionSubject.length > 0 && selectedSubject.length === optionSubject.length;

  const handleChangeSubject = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelectedSubject(
        selectedSubject.length === optionSubject.length ? [] : optionSubject
      );
      return;
    }
    setSelectedSubject(value);
  };
  // For Chapter Type---------------------------------------------------------------

  // For Chapter---------------------------------------------------------------
  const [selectedChapter, setSelectedChapter] = useState([]);

  const allChapters = [
    "Class 6(English)(ALL)(Chapter)",
    "Class 6(English)(Subject 01)(Chapter)",
    "Class 6(English)(Subject 02)(Chapter)",
    "Class 6(English)(Subject 03)(Chapter)",
    "Class 6(Hindi)(ALL)(Chapter)",
    "Class 6(Hindi)(Subject 01)(Chapter)",
    "Class 6(Hindi)(Subject 02)(Chapter)",
    "Class 6(Hindi)(Subject 03)(Chapter)",
    "Class 7(English)(ALL)(Chapter)",
    "Class 7(English)(Subject 01)(Chapter)",
    "Class 7(English)(Subject 02)(Chapter)",
    "Class 7(English)(Subject 03)(Chapter)",
    "Class 7(Hindi)(ALL)(Chapter)",
    "Class 7(Hindi)(Subject 01)(Chapter)",
    "Class 7(Hindi)(Subject 02)(Chapter)",
    "Class 7(Hindi)(Subject 03)(Chapter)",
    "Class 8(English)(ALL)(Chapter)",
    "Class 8(English)(Subject 01)(Chapter)",
    "Class 8(English)(Subject 02)(Chapter)",
    "Class 8(English)(Subject 03)(Chapter)",
    "Class 8(Hindi)(ALL)(Chapter)",
    "Class 8(Hindi)(Subject 01)(Chapter)",
    "Class 8(Hindi)(Subject 02)(Chapter)",
    "Class 8(Hindi)(Subject 03)(Chapter)",
    "Class 9(English)(ALL)(Chapter)",
    "Class 9(English)(Subject 01)(Chapter)",
    "Class 9(English)(Subject 02)(Chapter)",
    "Class 9(English)(Subject 03)(Chapter)",
    "Class 9(Hindi)(ALL)(Chapter)",
    "Class 9(Hindi)(Subject 01)(Chapter)",
    "Class 9(Hindi)(Subject 02)(Chapter)",
    "Class 9(Hindi)(Subject 03)(Chapter)",
    "Class 10(English)(ALL)(Chapter)",
    "Class 10(English)(Subject 01)(Chapter)",
    "Class 10(English)(Subject 02)(Chapter)",
    "Class 10(English)(Subject 03)(Chapter)",
    "Class 10(Hindi)(ALL)(Chapter)",
    "Class 10(Hindi)(Subject 01)(Chapter)",
    "Class 10(Hindi)(Subject 02)(Chapter)",
    "Class 10(Hindi)(Subject 03)(Chapter)",
  ];
  const optionChapter = allChapters.filter((ev) => {
    for (const matchingChapter of selectedSubject) {
      if (ev.includes(matchingChapter)) {
        return true;
      }
    }
    return false;
  });

  const isAllSelectedChapter =
    optionChapter.length > 0 && selectedChapter.length === optionChapter.length;

  const handleChangeChapter = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelectedChapter(
        selectedChapter.length === optionChapter.length ? [] : optionChapter
      );
      return;
    }
    setSelectedChapter(value);
  };

  // For Chapter---------------------------------------------------------------

  // For Topic ---------------------------------------------------------------
  const [selectedTopic, setSelectedTopic] = useState([]);

  const optionTopic = [
    "Class 6(English)(ALL)(Chapter)(Topic)",
    "Class 6(English)(Subject 01)(Chapter)(Topic)",
    "Class 6(English)(Subject 02)(Chapter)(Topic)",
    "Class 6(English)(Subject 03)(Chapter)(Topic)",
    "Class 6(Hindi)(ALL)(Chapter)(Topic)",
    "Class 6(Hindi)(Subject 01)(Chapter)(Topic)",
    "Class 6(Hindi)(Subject 02)(Chapter)(Topic)",
    "Class 6(Hindi)(Subject 03)(Chapter)(Topic)",
    "Class 7(English)(ALL)(Chapter)(Topic)",
    "Class 7(English)(Subject 01)(Chapter)(Topic)",
    "Class 7(English)(Subject 02)(Chapter)(Topic)",
    "Class 7(English)(Subject 03)(Chapter)(Topic)",
    "Class 7(Hindi)(ALL)(Chapter)(Topic)",
    "Class 7(Hindi)(Subject 01)(Chapter)(Topic)",
    "Class 7(Hindi)(Subject 02)(Chapter)(Topic)",
    "Class 7(Hindi)(Subject 03)(Chapter)(Topic)",
    "Class 8(English)(ALL)(Chapter)(Topic)",
    "Class 8(English)(Subject 01)(Chapter)(Topic)",
    "Class 8(English)(Subject 02)(Chapter)(Topic)",
    "Class 8(English)(Subject 03)(Chapter)(Topic)",
    "Class 8(Hindi)(ALL)(Chapter)(Topic)",
    "Class 8(Hindi)(Subject 01)(Chapter)(Topic)",
    "Class 8(Hindi)(Subject 02)(Chapter)(Topic)",
    "Class 8(Hindi)(Subject 03)(Chapter)(Topic)",
    "Class 9(English)(ALL)(Chapter)(Topic)",
    "Class 9(English)(Subject 01)(Chapter)(Topic)",
    "Class 9(English)(Subject 02)(Chapter)(Topic)",
    "Class 9(English)(Subject 03)(Chapter)(Topic)",
    "Class 9(Hindi)(ALL)(Chapter)(Topic)",
    "Class 9(Hindi)(Subject 01)(Chapter)(Topic)",
    "Class 9(Hindi)(Subject 02)(Chapter)(Topic)",
    "Class 9(Hindi)(Subject 03)(Chapter)(Topic)",
    "Class 10(English)(ALL)(Chapter)(Topic)",
    "Class 10(English)(Subject 01)(Chapter)(Topic)",
    "Class 10(English)(Subject 02)(Chapter)(Topic)",
    "Class 10(English)(Subject 03)(Chapter)(Topic)",
    "Class 10(Hindi)(ALL)(Chapter)(Topic)",
    "Class 10(Hindi)(Subject 01)(Chapter)(Topic)",
    "Class 10(Hindi)(Subject 02)(Chapter)(Topic)",
    "Class 10(Hindi)(Subject 03)(Chapter)(Topic)",
  ];

  const isAllSelectedTopic =
    optionTopic.length > 0 && selectedTopic.length === optionTopic.length;

  const handleChangeTopic = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelectedTopic(
        selectedTopic.length === optionTopic.length ? [] : optionTopic
      );
      return;
    }
    setSelectedTopic(value);
  };

  // For Topic ---------------------------------------------------------------

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Video Manager | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        links={[
          { name: "Syllabus", href: "" },
          {
            name: "Video Manager",
            href: `${PATH_DASHBOARD.content}`,
          },
          { name: id ? "Update Video Manager" : "Create Video Manager" },
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
                {/* ------------------------------------------------Course Start */}
                <AutoCompleteCustom
                  name="courseId"
                  loading={courseLoader}
                  options={_.map(course?.data, (ev) => {
                    return { label: ev.name, value: ev.id };
                  })}
                  value={formik.values.courseId}
                  onChange={(event, value) => {
                    formik.setFieldValue("courseId", value);
                  }}
                  label="Select Course"
                  error={formik.touched.courseId && formik.errors.courseId}
                />
                {/* -------------------------------------------------Course End */}

                {/* --------------------------------------------------Board Start */}
                <AutoCompleteCustom
                  name="boardId"
                  loading={boardLoader}
                  options={_.map(boardByCourse, (ev) => {
                    return { label: ev.name, value: ev.id };
                  })}
                  value={formik.values.boardId}
                  onChange={(event, value) => {
                    formik.setFieldValue("boardId", value);
                  }}
                  label="Select Board"
                  error={formik.touched.boardId && formik.errors.boardId}
                />
                {/* ----------------------------------------------------Board End */}

                {/* ------------------------------------------------Dummy Class Start */}

                <FormControl>
                  <InputLabel id="mutiple-select-label">
                    Select Class
                  </InputLabel>
                  <Select
                    labelId="mutiple-select-label"
                    label=" Select Class"
                    multiple
                    value={selected}
                    onChange={handleChange}
                    renderValue={(selected) => selected.join(", ")}
                  >
                    <MenuItem value="all">
                      <ListItemIcon>
                        <Checkbox
                          checked={isAllSelected}
                          indeterminate={
                            selected.length > 0 &&
                            selected.length < optionsClass.length
                          }
                        />
                      </ListItemIcon>
                      <ListItemText primary="Select All" />
                    </MenuItem>
                    {optionsClass.map((option) => (
                      <MenuItem key={option} value={option}>
                        <ListItemIcon>
                          <Checkbox checked={selected.indexOf(option) > -1} />
                        </ListItemIcon>
                        <ListItemText primary={option} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* -------------------------------------------------Dummy Class End */}

                {/* -------------------------------------------Dummy Batch Type Start */}

                <FormControl>
                  <InputLabel id="mutiple-select-label">
                    Select Batch
                  </InputLabel>
                  <Select
                    labelId="mutiple-select-label"
                    label=" Select Batch"
                    multiple
                    value={selectedBatch}
                    onChange={handleChangeBatch}
                    renderValue={(selectedBatch) => selectedBatch.join(", ")}
                  >
                    <MenuItem value="all">
                      <ListItemIcon>
                        <Checkbox
                          checked={isAllSelectedBatch}
                          indeterminate={
                            selectedBatch.length > 0 &&
                            selectedBatch.length < optionsBatch.length
                          }
                        />
                      </ListItemIcon>
                      <ListItemText primary="Select All" />
                    </MenuItem>
                    {optionsBatch.map((option) => (
                      <MenuItem key={option} value={option}>
                        <ListItemIcon>
                          <Checkbox
                            checked={selectedBatch.indexOf(option) > -1}
                          />
                        </ListItemIcon>
                        <ListItemText primary={option} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* -------------------------------------------Dummy Batch Type Start */}

                {/* -----------------------------------------------------Subject start */}
                <FormControl>
                  <InputLabel id="mutiple-select-label">
                    Select Subject
                  </InputLabel>
                  <Select
                    labelId="mutiple-select-label"
                    label=" Select Subject"
                    multiple
                    value={selectedSubject}
                    onChange={handleChangeSubject}
                    renderValue={(selectedSubject) =>
                      selectedSubject.join(", ")
                    }
                  >
                    <MenuItem value="all">
                      <ListItemIcon>
                        <Checkbox
                          checked={isAllSelectedSubject}
                          indeterminate={
                            selectedSubject.length > 0 &&
                            selectedSubject.length < optionSubject.length
                          }
                        />
                      </ListItemIcon>
                      <ListItemText primary="Select All" />
                    </MenuItem>
                    {optionSubject.map((option) => (
                      <MenuItem key={option} value={option}>
                        <ListItemIcon>
                          <Checkbox
                            checked={selectedSubject.indexOf(option) > -1}
                          />
                        </ListItemIcon>
                        <ListItemText primary={option} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* -----------------------------------------------------Subject End */}

                {/* ----------------------------------------------------Chapter Start */}

                <FormControl>
                  <InputLabel id="mutiple-select-label">
                    Select Chapter
                  </InputLabel>
                  <Select
                    labelId="mutiple-select-label"
                    label=" Select Chapter"
                    multiple
                    value={selectedChapter}
                    onChange={handleChangeChapter}
                    renderValue={(selectedChapter) =>
                      selectedChapter.join(", ")
                    }
                  >
                    <MenuItem value="all">
                      <ListItemIcon>
                        <Checkbox
                          checked={isAllSelectedChapter}
                          indeterminate={
                            selectedChapter.length > 0 &&
                            selectedChapter.length < optionChapter.length
                          }
                        />
                      </ListItemIcon>
                      <ListItemText primary="Select All" />
                    </MenuItem>
                    {optionChapter.map((option) => (
                      <MenuItem key={option} value={option}>
                        <ListItemIcon>
                          <Checkbox
                            checked={selectedChapter.indexOf(option) > -1}
                          />
                        </ListItemIcon>
                        <ListItemText primary={option} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* ----------------------------------------------------Chapter End */}

                {/* --------------------------------------------------Topic Start */}

                <FormControl>
                  <InputLabel id="mutiple-select-label">
                    Select Topic
                  </InputLabel>
                  <Select
                    labelId="mutiple-select-label"
                    label="Select Topic"
                    multiple
                    value={selectedTopic}
                    onChange={handleChangeTopic}
                    renderValue={(selectedTopic) => selectedTopic.join(", ")}
                  >
                    <MenuItem value="all">
                      <ListItemIcon>
                        <Checkbox
                          checked={isAllSelectedTopic}
                          indeterminate={
                            selectedTopic.length > 0 &&
                            selectedTopic.length < optionTopic.length
                          }
                        />
                      </ListItemIcon>
                      <ListItemText primary="Select All" />
                    </MenuItem>
                    {optionTopic.map((option) => (
                      <MenuItem key={option} value={option}>
                        <ListItemIcon>
                          <Checkbox
                            checked={selectedTopic.indexOf(option) > -1}
                          />
                        </ListItemIcon>
                        <ListItemText primary={option} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <CustomCheckboxDropdown
                  label={"Select Topic"}
                  formikName={"courseId"}
                  loader={courseLoader}
                  useStateVariableName={selectedTopic}
                  useStateFunctionName={setSelectedTopic}
                  arrayName={optionTopic}
                  error={formik.touched.courseId && formik.errors.courseId}
                />

                {/* --------------------------------------------------Topic End */}

                <FormControl fullWidth>
                  <InputLabel>Tag</InputLabel>
                  <Select
                    label="Tag"
                    name="tag"
                    {...formik.getFieldProps("tag")}
                    onChange={formik.handleChange}
                    error={formik.touched.tag && formik.errors.tag}
                  >
                    <MenuItem defaultValue value="">
                      Select Tag
                    </MenuItem>
                    {_.map(_tag, (ev) => {
                      return <MenuItem value={ev.value}>{ev.label}</MenuItem>;
                    })}
                  </Select>
                </FormControl>

                <UploadBox
                  height={58}
                  name="image"
                  accept={{
                    "image/*": [],
                  }}
                  label="Thumbnail"
                  file={formik.values.thumbnail[0]}
                  onDrop={handleDrop}
                  error={Boolean(
                    formik.touched.thumbnail && formik.errors.thumbnail
                  )}
                />

                <FormControl fullWidth>
                  <InputLabel>Select Video Source</InputLabel>
                  <Select
                    label="Select Video Source"
                    name="source"
                    {...formik.getFieldProps("source")}
                    onChange={formik.handleChange}
                    error={formik.touched.source && formik.errors.source}
                  >
                    <MenuItem defaultValue value="">
                      Select Topic
                    </MenuItem>
                    {_.map(_topic, (ev) => {
                      return (
                        <MenuItem value={ev.value} disabled={ev.disabled}>
                          {ev.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                {formik.values.source !== "upload" &&
                  formik.values.source !== "" && (
                    <FormControl fullWidth>
                      <TextField
                        name="sourceURL"
                        label={
                          formik.values.source === "gallarymanager"
                            ? "File Location"
                            : "Video URL"
                        }
                        fullWidth
                        {...formik.getFieldProps("sourceURL")}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.sourceURL && formik.errors.sourceURL
                        }
                      />
                    </FormControl>
                  )}
                {formik.values.source === "upload" &&
                  formik.values.tag != "Help Resource" && (
                    <>
                      <UploadBox
                        otherFile={true}
                        height={58}
                        name="sourceFile"
                        accept={{
                          "video/*": [],
                        }}
                        label="Video"
                        file={formik.values.sourceFile[0]}
                        onDrop={handleThumbnailDrop}
                        error={Boolean(
                          formik.touched.sourceFile && formik.errors.sourceFile
                        )}
                      />
                      {uploadStart && (
                        <StyledComponent>
                          <Label
                            variant="contained"
                            sx={{ textTransform: "capitalize" }}
                          >
                            File Size {filesize} Uploading File {fileProgress}%
                            Completed Uploading Speed {uploadspeed} mbps
                          </Label>
                        </StyledComponent>
                      )}
                    </>
                  )}
                {formik.values.source === "upload" &&
                  formik.values.tag === "Help Resource" && (
                    <FormControl
                      fullWidth
                      error={
                        formik.touched.helpingResourceType &&
                        formik.errors.helpingResourceType
                      }
                    >
                      <InputLabel>Help Resource Type</InputLabel>
                      <Select
                        name="helpingResourceType"
                        label="Help Resource Type"
                        value={getHelpingResourser}
                        onChange={(e) => {
                          formik.handleChange(e);
                          setHelpingResourse(e.target.value);
                        }}
                      >
                        <MenuItem value="">Help Resource Type</MenuItem>
                        {_.map(helpContentType, (evv) => {
                          return (
                            <MenuItem value={evv.value}>{evv.label}</MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                {formik.values.source === "upload" &&
                  formik.values.tag === "Help Resource" &&
                  getHelpingResourser === "image" && (
                    <>
                      <UploadBox
                        otherFile={true}
                        height={58}
                        name="sourceFile"
                        accept={{
                          "image/*": [],
                        }}
                        label="Image"
                        file={formik.values.sourceFile[0]}
                        onDrop={handleThumbnailDrop}
                        error={Boolean(
                          formik.touched.sourceFile && formik.errors.sourceFile
                        )}
                      />
                      {uploadStart && (
                        <StyledComponent>
                          <Label
                            variant="contained"
                            sx={{ textTransform: "capitalize" }}
                          >
                            File Size {filesize} Uploading File {fileProgress}%
                            Completed Uploading Speed {uploadspeed} mbps
                          </Label>
                        </StyledComponent>
                      )}
                    </>
                  )}
                {formik.values.source === "upload" &&
                  formik.values.tag === "Help Resource" &&
                  getHelpingResourser === "video" && (
                    <>
                      <UploadBox
                        otherFile={true}
                        height={58}
                        name="sourceFile"
                        accept={{
                          "video/*": [],
                        }}
                        label="Video"
                        file={formik.values.sourceFile[0]}
                        onDrop={handleThumbnailDrop}
                        error={Boolean(
                          formik.touched.sourceFile && formik.errors.sourceFile
                        )}
                      />
                      {uploadStart && (
                        <StyledComponent>
                          <Label
                            variant="contained"
                            sx={{ textTransform: "capitalize" }}
                          >
                            File Size {filesize} Uploading File {fileProgress}%
                            Completed Uploading Speed {uploadspeed} mbps
                          </Label>
                        </StyledComponent>
                      )}
                    </>
                  )}
                {formik.values.source === "upload" &&
                  formik.values.tag === "Help Resource" &&
                  getHelpingResourser === "pdf" && (
                    <>
                      <UploadBox
                        otherFile={true}
                        height={58}
                        name="sourceFile"
                        accept={{
                          "application/pdf": [],
                        }}
                        label="PDF"
                        file={formik.values.sourceFile[0]}
                        onDrop={handleThumbnailDrop}
                        error={Boolean(
                          formik.touched.sourceFile && formik.errors.sourceFile
                        )}
                      />
                      {uploadStart && (
                        <StyledComponent>
                          <Label
                            variant="contained"
                            sx={{ textTransform: "capitalize" }}
                          >
                            File Size {filesize} Uploading File {fileProgress}%
                            Completed Uploading Speed {uploadspeed} mbps
                          </Label>
                        </StyledComponent>
                      )}
                    </>
                  )}
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={formik.values.source !== "upload" && syllabusLoader}
                  disabled={formik.values.source === "upload" && uploadStart}
                >
                  {id ? "Update Video Manager" : "Create Video Manager"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

const ComponentLoaderInputLabel = ({ loader, label }) => {
  return loader ? <CustomComponentLoader padding="0 0" size={20} /> : label;
};
