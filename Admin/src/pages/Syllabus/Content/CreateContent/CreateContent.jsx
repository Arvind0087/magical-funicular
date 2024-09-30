import { Box, Container, Stack } from "@mui/system";
import {
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  _initial,
  _tag,
  _topic,
  _validate,
  helpContentType,
  _validateAllClass,
  _validateAllBatch,
  _validateAllSubject,
  _validateAllChapter,
  _validateAllTopic,
} from "./utils";
import {
  addSyllabusContentAsync,
  getAllSyllabusTopicAsync,
  getChapterByMultipleClassBatchSubjectAsync,
  getSubjectByMultipleClassBatchAsync,
  getSyllausContentByIdAsync,
  getTopicByMultipleClassBatchSubjectChapterAsync,
  updateSyllabusContentAsync,
} from "redux/syllabuus/syllabus.async";
import {
  getBatchByCourseBoardClassAsync,
  getBoardsByCourseIdAsync,
  getChapterBySubjectId,
  getClassByBoardAndCourseIdAsync,
  getSubjectByBatchTypeIdAsync,
} from "redux/async.api";
import { useDispatch, useSelector } from "react-redux";

import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import CustomCheckboxDropdown from "components/CustomCheckboxDropdown/CustomCheckboxDropdown";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import { GenerateBase64 } from "utils/convertToBase64";
import { Helmet } from "react-helmet-async";
import Label from "components/label/Label";
import { LoadingButton } from "@mui/lab";
import { PATH_DASHBOARD } from "routes/paths";
import UploadBox from "components/CustomUploads/UploadBox";
import UploadMultipleCustom from "components/CustomUploads/UploadMultiple";
import _ from "lodash";
import { decrypt } from "utils/cryptojs";
import { emptysyllabusTopic } from "redux/syllabuus/syllabus.slice";
import { getBatchByMultipleClassIddAsync } from "redux/slices/scholorshipSlice/async.api";
import getFileExtension from "utils/getFileExtension";
import { getFileSize } from "utils/getFileSize";
import { getTopicBySubjecIdAsync } from "redux/slices/TopicSlice/Topic.async";
import { getcourseAsync } from "redux/course/course.async";
import { isJson } from "utils/isJson";
import { s3uploadFile } from "config/aws";
import { styled } from "@mui/material/styles";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { useSettingsContext } from "components/settings";
import { v4 as uuidv4 } from "uuid";
function CreateContent() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [getSelectedClass, setSelectedClass] = useState([]);
  const [getSelectedBatch, setSelectedBatch] = useState([]);
  const [getSelectedSubject, setSelectedSubject] = useState([]);
  const [getSelectedChapter, setSelectedChapter] = useState([]);
  const [getSelectedTopic, setSelectedTopic] = useState([]);
  const [isDisplay, setIsDisplay] = useState({
    isBatch: true,
    isSubject: true,
    isChapter: true,
    isTopic: true,
    classIds: "",
    batchIds: "",
    subjectIds: "",
    chapterIds: "",
    topicIds: "",
  });
  const [getClassButtonColor, setClassButtonColor] = useState("grey");
  const [getBatchButtonColor, setBatchButtonColor] = useState("grey");
  const [getSubjectButtonColor, setSubjectButtonColor] = useState("grey");
  const [getChapterButtonColor, setChapterButtonColor] = useState("grey");
  const [getTopicButtonColor, setTopicButtonColor] = useState("grey");

  const [vidseq, setVidseq] = useState("");

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
    SubjectByMultipleClassBatch,
    chapterByMultipleClassBatchSubject,
    TopicByMultipleClassBatchSubjectChapter,
  } = useSelector((state) => state.syllabus);
  const { scholorshipLoader, getBatchByMultipleClass } = useSelector(
    (state) => state.scholorship
  );
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

  const onSubmit = async (values) => {
    // if (id) {
    //   setVidseq(values.videoSeq);
    // }
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
      const key = `${decryptin.folder.videoManager}/${uuidv4()}.${extension}`;
      const fileuploads3 = s3uploadFile(
        key,
        values.sourceFile[0],
        decryptin,
        extension
      );
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
          courseId: values.courseId?.value,
          boardId: values.boardId?.value,

          classId: isDisplay.classIds
            ? isDisplay.classIds
            : values.classId.map((ev) => JSON.parse(ev).id),

          batchTypeId:
            isDisplay.batchIds === "all" && isDisplay.classIds === "all"
              ? ""
              : isDisplay.batchIds === "all"
              ? "all"
              : values.batchTypeId.map((ev) => JSON.parse(ev).id),

          subjectId:
            isDisplay.subjectIds === "all" && isDisplay.batchIds === "all"
              ? ""
              : isDisplay.subjectIds === "all"
              ? "all"
              : values.subjectId.map((ev) => JSON.parse(ev).id),

          chapterId:
            isDisplay.chapterIds === "all" && isDisplay.subjectIds === "all"
              ? ""
              : isDisplay.chapterIds === "all"
              ? "all"
              : values.chapterId.map((ev) => JSON.parse(ev).id),

          topicId:
            isDisplay.topicIds === "all" && isDisplay.chapterIds === "all"
              ? ""
              : isDisplay.topicIds === "all"
              ? "all"
              : values.topicId.map((ev) => JSON.parse(ev).id),

          tag: values.tag,
          thumbnailFile: thumbnail,
          source: values.source,
          resourceType: getHelpingResourser,
          resourceFile: resourceFiles,
          sourceFile: evv.Key,
          // ORDERSEQ: values?.videoSeq || "",
        };
        if (id) {
          dispatch(updateSyllabusContentAsync(payload));
        } else {
          delete payload.Id;
          // delete payload.ORDERSEQ;
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
        courseId: values.courseId?.value,
        boardId: values.boardId?.value,

        classId: isDisplay.classIds
          ? isDisplay.classIds
          : values.classId.map((ev) => JSON.parse(ev).id),

        batchTypeId:
          isDisplay.batchIds === "all" && isDisplay.classIds === "all"
            ? ""
            : isDisplay.batchIds === "all"
            ? "all"
            : values.batchTypeId.map((ev) => JSON.parse(ev).id),

        subjectId:
          isDisplay.subjectIds === "all" && isDisplay.batchIds === "all"
            ? ""
            : isDisplay.subjectIds === "all"
            ? "all"
            : values.subjectId.map((ev) => JSON.parse(ev).id),

        chapterId:
          isDisplay.chapterIds === "all" && isDisplay.subjectIds === "all"
            ? ""
            : isDisplay.chapterIds === "all"
            ? "all"
            : values.chapterId.map((ev) => JSON.parse(ev).id),

        topicId:
          isDisplay.topicIds === "all" && isDisplay.chapterIds === "all"
            ? ""
            : isDisplay.topicIds === "all"
            ? "all"
            : values.topicId.map((ev) => JSON.parse(ev).id),

        tag: values.tag,
        source: values.source,
        thumbnailFile: thumbnail,
        resourceType: getHelpingResourser,
        resourceFile: resourceFiles,
        sourceFile:
          values.source !== "upload" ? values.sourceURL : values.sourceFile[0],
        // ORDERSEQ: values?.videoSeq || "",
      };

      if (id) {
        dispatch(updateSyllabusContentAsync(payload));
      } else {
        delete payload.Id;
        delete payload.ORDERSEQ;
        dispatch(addSyllabusContentAsync(payload)).then((res) => {
          if (!id && res.payload.status == 200) {
            formik.setFieldValue("sourceURL", "");
          }
        });
      }
    }
  };

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
      // navigate(PATH_DASHBOARD.content);
      dispatch(emptysyllabusTopic());
    }
    if (syllabuscontentupdate.status === 200) {
      toast.success(syllabuscontentupdate.message, toastoptions);
      formik.resetForm();
      dispatch(emptysyllabusTopic());
      navigate(PATH_DASHBOARD.content);
    }
  }, [syllabuscontentcreate, syllabuscontentupdate]);

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema:
      isDisplay.classIds === "all"
        ? _validateAllClass
        : isDisplay.batchIds === "all"
        ? _validateAllBatch
        : isDisplay.subjectIds === "all"
        ? _validateAllSubject
        : isDisplay.chapterIds === "all"
        ? _validateAllChapter
        : _validateAllTopic,
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
    if (formik.values.classId?.length) {
      dispatch(
        getBatchByMultipleClassIddAsync({
          courseId: formik.values.courseId?.value,
          boardId: formik.values.boardId?.value,
          classId: formik.values.classId?.map((ev) =>
            isJson(ev) ? JSON?.parse(ev)?.id : null
          ),
        })
      );
    }
  }, [formik.values.classId]);

  useEffect(() => {
    if (formik.values.batchTypeId.length) {
      dispatch(
        getSubjectByMultipleClassBatchAsync({
          courseId: formik.values.courseId?.value,
          boardId: formik.values.boardId?.value,
          classId: formik.values.classId?.map((ev) => JSON?.parse(ev)?.id),
          batchTypeId: formik.values?.batchTypeId?.map(
            (ev) => JSON?.parse(ev)?.id
          ),
        })
      );
    }
  }, [formik.values.batchTypeId]);

  useEffect(() => {
    if (formik.values.subjectId.length) {
      dispatch(
        getChapterByMultipleClassBatchSubjectAsync({
          courseId: formik.values.courseId?.value,
          boardId: formik.values.boardId?.value,
          classId: formik.values.classId?.map((ev) => JSON?.parse(ev)?.id),
          batchTypeId: formik.values.batchTypeId?.map(
            (ev) => JSON?.parse(ev)?.id
          ),
          subjectId: formik.values.subjectId.map((ev) => JSON.parse(ev).id),
        })
      );
    }
  }, [formik.values.subjectId]);

  useEffect(() => {
    if (formik.values.chapterId.length) {
      dispatch(
        getTopicByMultipleClassBatchSubjectChapterAsync({
          courseId: formik.values.courseId?.value,
          boardId: formik.values.boardId?.value,
          classId: formik.values.classId?.map((ev) => JSON?.parse(ev)?.id),
          batchTypeId: formik.values.batchTypeId?.map(
            (ev) => JSON?.parse(ev)?.id
          ),
          subjectId: formik.values.subjectId.map((ev) => JSON.parse(ev).id),
          chapterId: formik.values.chapterId.map((ev) => JSON.parse(ev).id),
        })
      );
    }
  }, [formik.values.chapterId]);

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
      // if (syllabuscontentById.ORDERSEQ !== null) {
      //   formik.setFieldValue("videoSeq", syllabuscontentById?.ORDERSEQ);
      // }

      if (id && syllabuscontentById?.classes?.length) {
        let classStateValue = syllabuscontentById?.classes.map((ev) => {
          return JSON.stringify({ id: ev.classId, name: ev.class });
        });
        setSelectedClass(classStateValue);
        formik.setFieldValue("classId", classStateValue);
      }
      formik.setFieldValue("tag", syllabuscontentById.tag);
      formik.setFieldValue("thumbnail", [syllabuscontentById.thumbnailFile]);
      formik.setFieldValue("source", syllabuscontentById.source);
      if (id && syllabuscontentById.source === "upload") {
        formik.setFieldValue("sourceFile", [syllabuscontentById?.sourceFiles]);
      } else {
        formik.setFieldValue("sourceURL", syllabuscontentById?.sourceFiles);
      }
      // resourceFile Removed For Now
      // formik.setFieldValue("resources", syllabuscontentById.resourceFile);

      setHelpingResourse(syllabuscontentById?.resourceType);
      formik.setFieldValue(
        "helpingResourceType",
        syllabuscontentById?.resourceType
      );
    }
  }, [id, syllabuscontentById]);

  useEffect(() => {
    if (
      id &&
      syllabuscontentById?.batch?.length > 0 &&
      getBatchByMultipleClass?.data?.length > 0 &&
      formik.values.classId?.length > 0
    ) {
      let batchStateValue = syllabuscontentById?.batch?.map((evv) => {
        let batch =
          getBatchByMultipleClass?.data?.find(
            (ev) => evv?.batchTypeId === ev?.id
          ) || [];
        const { classId, ...rest } = batch;
        return JSON.stringify(rest);
      });
      setSelectedBatch(batchStateValue);
      formik.setFieldValue("batchTypeId", batchStateValue);
    }
  }, [
    id,
    syllabuscontentById?.batch?.length,
    getBatchByMultipleClass?.data?.length,
    formik.values.classId,
  ]);

  useEffect(() => {
    if (
      id &&
      formik.values.classId?.length > 0 &&
      formik.values.batchTypeId?.length > 0 &&
      syllabuscontentById?.subject?.length > 0 &&
      SubjectByMultipleClassBatch?.length > 0
    ) {
      let subjectStateValue = syllabuscontentById?.subject.map((evv) => {
        let subject =
          SubjectByMultipleClassBatch?.find(
            (ev) => evv?.subjectId === ev?.id
          ) || [];
        const { classId, ...rest } = subject;
        return JSON.stringify(rest);
      });
      setSelectedSubject(subjectStateValue);
      formik.setFieldValue("subjectId", subjectStateValue);
    }
  }, [
    id,
    syllabuscontentById?.subject?.length,
    SubjectByMultipleClassBatch?.length,
    formik.values.batchTypeId?.length,
  ]);

  useEffect(() => {
    if (
      id &&
      formik.values.classId?.length > 0 &&
      formik.values.batchTypeId?.length > 0 &&
      formik.values.subjectId?.length > 0 &&
      syllabuscontentById?.chpater?.length > 0 &&
      chapterByMultipleClassBatchSubject?.length > 0
    ) {
      let chapterStateValue = syllabuscontentById?.chpater.map((evv) => {
        let chapter =
          chapterByMultipleClassBatchSubject.find(
            (ev) => evv?.chapterId === ev?.id
          ) || [];
        const { classId, ...rest } = chapter;
        return JSON.stringify(rest);
      });
      setSelectedChapter(chapterStateValue);
      formik.setFieldValue("chapterId", chapterStateValue);
    }
  }, [
    id,
    syllabuscontentById?.chpater?.length,
    chapterByMultipleClassBatchSubject?.length,
    formik.values.subjectId?.length,
  ]);

  useEffect(() => {
    if (
      id &&
      formik.values.classId?.length > 0 &&
      formik.values.batchTypeId?.length > 0 &&
      formik.values.subjectId?.length > 0 &&
      formik.values.chapterId?.length > 0 &&
      syllabuscontentById?.topic?.length > 0 &&
      TopicByMultipleClassBatchSubjectChapter?.length > 0
    ) {
      let topicStateValue = syllabuscontentById?.topic.map((evv) => {
        let topic =
          TopicByMultipleClassBatchSubjectChapter.find(
            (ev) => evv?.topicId === ev?.id
          ) || [];
        const { classId, ...rest } = topic;
        return JSON.stringify(rest);
      });
      setSelectedTopic(topicStateValue);
      formik.setFieldValue("topicId", topicStateValue);
    }
  }, [
    id,
    syllabuscontentById?.topic?.length > 0,
    TopicByMultipleClassBatchSubjectChapter?.length > 0,
    formik.values.chapterId?.length,
  ]);

  useEffect(() => {
    if (getClassButtonColor === "green") {
      setIsDisplay({
        isBatch: false,
        isSubject: false,
        isChapter: false,
        isTopic: false,
        classIds: "all",
        batchIds: "all",
        subjectIds: "all",
        chapterIds: "all",
        topicIds: "all",
      });
    } else {
      setIsDisplay({
        isBatch: true,
        isSubject: true,
        isChapter: true,
        isTopic: true,
        classIds: "",
        batchIds: "",
        subjectIds: "",
        chapterIds: "",
        topicIds: "",
      });
    }
  }, [getClassButtonColor]);

  useEffect(() => {
    if (getBatchButtonColor === "green") {
      setIsDisplay({
        isBatch: true,
        isSubject: false,
        isChapter: false,
        isTopic: false,
        batchIds: "all",
        subjectIds: "all",
        chapterIds: "all",
        topicIds: "all",
      });
    } else {
      setIsDisplay({
        isBatch: true,
        isSubject: true,
        isChapter: true,
        isTopic: true,
        batchIds: "",
        subjectIds: "",
        chapterIds: "",
        topicIds: "",
      });
    }
  }, [getBatchButtonColor]);

  useEffect(() => {
    if (getSubjectButtonColor === "green") {
      setIsDisplay({
        isBatch: true,
        isSubject: true,
        isChapter: false,
        isTopic: false,
        subjectIds: "all",
        chapterIds: "all",
        topicIds: "all",
      });
    } else {
      setIsDisplay({
        isBatch: true,
        isSubject: true,
        isChapter: true,
        isTopic: true,
        subjectIds: "",
        chapterIds: "",
        topicIds: "",
      });
    }
  }, [getSubjectButtonColor]);

  useEffect(() => {
    if (getChapterButtonColor === "green") {
      setIsDisplay({
        isBatch: true,
        isSubject: true,
        isChapter: true,
        isTopic: false,
        chapterIds: "all",
        topicIds: "all",
      });
    } else {
      setIsDisplay({
        isBatch: true,
        isSubject: true,
        isChapter: true,
        isTopic: true,
        chapterIds: "",
        topicIds: "",
      });
    }
  }, [getChapterButtonColor]);

  useEffect(() => {
    if (
      formik.values.topicId.length &&
      TopicByMultipleClassBatchSubjectChapter
    ) {
      if (
        formik.values.topicId.length ===
        TopicByMultipleClassBatchSubjectChapter?.length
      ) {
        setIsDisplay({
          isBatch: true,
          isSubject: true,
          isChapter: true,
          isTopic: true,
          topicIds: "all",
        });
      } else {
        setIsDisplay({
          isBatch: true,
          isSubject: true,
          isChapter: true,
          isTopic: true,
          topicIds: "",
        });
      }
    }
  }, [formik.values.topicId]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Video Manager | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={id ? "Update Video Manager" : "Create Video Manager"}
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
          <Grid item xs={12} md={6}>
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
          </Grid>
          <Grid item xs={12} md={6}>
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
            />{" "}
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <CustomCheckboxDropdown
                label={"Select Class"}
                formikName={"classId"}
                widthparameter="90%"
                formik={formik}
                loader={classLoader}
                arrayName={classbycourseboard}
                getCheckedValue={getSelectedClass}
                setCheckedValue={setSelectedClass}
                error={formik.touched.classId && formik.errors.classId}
              />
              <Button
                sx={{
                  backgroundColor: getClassButtonColor,
                  color: "white",
                  borderRadius: "1px 15px 15px 1px",
                  border: "1px solid black",
                  ml: -0.7,
                  "&:hover": {
                    backgroundColor: "darkgreen",
                    cursor: "pointer",
                  },
                }}
                loading={classLoader}
                onClick={() =>
                  setClassButtonColor((prevState) =>
                    prevState === "grey" ? "green" : "grey"
                  )
                }
              >
                All
              </Button>
            </Box>
          </Grid>
          {isDisplay.isBatch && (
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <CustomCheckboxDropdown
                  label={"Select Batch"}
                  formikName={"batchTypeId"}
                  widthparameter="90%"
                  formik={formik}
                  loader={scholorshipLoader}
                  arrayName={getBatchByMultipleClass?.data}
                  getCheckedValue={getSelectedBatch}
                  setCheckedValue={setSelectedBatch}
                  error={
                    formik.touched.batchTypeId && formik.errors.batchTypeId
                  }
                />
                <Button
                  sx={{
                    backgroundColor: getBatchButtonColor,
                    color: "white",
                    borderRadius: "1px 15px 15px 1px",
                    border: "1px solid black",
                    ml: -0.7,
                    "&:hover": {
                      backgroundColor: "darkgreen",
                      cursor: "pointer",
                    },
                  }}
                  loading={classLoader}
                  onClick={() =>
                    setBatchButtonColor((prevState) =>
                      prevState === "grey" ? "green" : "grey"
                    )
                  }
                >
                  All
                </Button>
              </Box>
            </Grid>
          )}
          {isDisplay.isSubject && (
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <CustomCheckboxDropdown
                  label={"Select Subject"}
                  formikName={"subjectId"}
                  widthparameter="90%"
                  formik={formik}
                  loader={scholorshipLoader}
                  arrayName={SubjectByMultipleClassBatch}
                  getCheckedValue={getSelectedSubject}
                  setCheckedValue={setSelectedSubject}
                  error={formik.touched.subjectId && formik.errors.subjectId}
                />
                <Button
                  sx={{
                    backgroundColor: getSubjectButtonColor,
                    color: "white",
                    borderRadius: "1px 15px 15px 1px",
                    border: "1px solid black",
                    ml: -0.7,
                    "&:hover": {
                      backgroundColor: "darkgreen",
                      cursor: "pointer",
                    },
                  }}
                  loading={classLoader}
                  onClick={() =>
                    setSubjectButtonColor((prevState) =>
                      prevState === "grey" ? "green" : "grey"
                    )
                  }
                >
                  All
                </Button>
              </Box>
            </Grid>
          )}{" "}
          {isDisplay.isChapter && (
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <CustomCheckboxDropdown
                  label={"Select Chapter"}
                  formikName={"chapterId"}
                  widthparameter="90%"
                  formik={formik}
                  loader={scholorshipLoader}
                  arrayName={chapterByMultipleClassBatchSubject}
                  getCheckedValue={getSelectedChapter}
                  setCheckedValue={setSelectedChapter}
                  error={formik.touched.chapterId && formik.errors.chapterId}
                />
                <Button
                  sx={{
                    backgroundColor: getChapterButtonColor,
                    color: "white",
                    borderRadius: "1px 15px 15px 1px",
                    border: "1px solid black",
                    ml: -0.7,
                    "&:hover": {
                      backgroundColor: "darkgreen",
                      cursor: "pointer",
                    },
                  }}
                  loading={classLoader}
                  onClick={() =>
                    setChapterButtonColor((prevState) =>
                      prevState === "grey" ? "green" : "grey"
                    )
                  }
                >
                  All
                </Button>
              </Box>
            </Grid>
          )}{" "}
          {isDisplay.isTopic && (
            <Grid item xs={12} md={6}>
              <CustomCheckboxDropdown
                label={"Select Topic"}
                formikName={"topicId"}
                widthparameter="100%"
                formik={formik}
                loader={scholorshipLoader}
                arrayName={TopicByMultipleClassBatchSubjectChapter}
                getCheckedValue={getSelectedTopic}
                setCheckedValue={setSelectedTopic}
                error={formik.touched.topicId && formik.errors.topicId}
              />
            </Grid>
          )}{" "}
          <Grid item xs={12} md={6}>
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
            </FormControl>{" "}
          </Grid>
          <Grid item xs={12} md={6}>
            <UploadBox
              height={58}
              name="thumbnail"
              accept={{
                "image/*": [],
              }}
              label="Thumbnail"
              file={formik.values.thumbnail[0]}
              onDrop={handleDrop}
              error={Boolean(
                formik.touched.thumbnail && formik.errors.thumbnail
              )}
            />{" "}
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Video Source</InputLabel>{" "}
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
                {formik.values.tag === "Help Resource"
                  ? _.map(_topic, (ev) => {
                      return (
                        <MenuItem value={ev.value} disabled={ev.disabled}>
                          {ev.label}
                        </MenuItem>
                      );
                    })
                  : _.map(
                      _topic.filter((ev) => ev.label !== "Upload"),
                      (ev) => {
                        return (
                          <MenuItem value={ev.value} disabled={ev.disabled}>
                            {ev.label}
                          </MenuItem>
                        );
                      }
                    )}
              </Select>
            </FormControl>{" "}
          </Grid>
          {/* When sourse = "upload"*/}
          {formik.values.source !== "upload" && formik.values.source !== "" && (
            <Grid item xs={12} md={6}>
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
                  error={formik.touched.sourceURL && formik.errors.sourceURL}
                />
              </FormControl>
            </Grid>
          )}{" "}
          {/* When sourse = upload and tag = Helping Resourse */}
          {/*formik.values.source === "upload" &&
            formik.values.tag != "Help Resource" && (
              <Grid item xs={12} md={6}>
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
              </Grid>
                ) */}
          {/*For Help Resourse Type When sourse = upload and tag = Help Resourse */}
          {formik.values.source === "upload" &&
            formik.values.tag === "Help Resource" && (
              <Grid item xs={12} md={6}>
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
                      return <MenuItem value={evv.value}>{evv.label}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Grid>
            )}{" "}
          {/*For Help Resourse Type When sourse = upload and tag = Help Resourse and Help Resourse = image*/}
          {formik.values.source === "upload" &&
            formik.values.tag === "Help Resource" &&
            getHelpingResourser === "image" && (
              <Grid item xs={12} md={6}>
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
              </Grid>
            )}{" "}
          {/*For Help Resourse Type When sourse = upload and tag = Help Resourse and Help Resourse = video*/}
          {formik.values.source === "upload" &&
            formik.values.tag === "Help Resource" &&
            getHelpingResourser === "video" && (
              <Grid item xs={12} md={6}>
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
              </Grid>
            )}{" "}
          {/*For Help Resourse Type When sourse = upload and tag = Help Resourse and Help Resourse = pdf*/}
          {formik.values.source === "upload" &&
            formik.values.tag === "Help Resource" &&
            getHelpingResourser === "pdf" && (
              <Grid item xs={12} md={6}>
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
              </Grid>
            )}{" "}
          {/* {id && (
            <Grid item xs={12} md={6}>
              <TextField
                name="videoSeq"
                label="Video Sequence"
                type="number"
                value={formik.values.videoSeq}
                onChange={(event, value) => {
                  formik.setFieldValue("videoSeq", event.target.value);
                }}
              />
            </Grid>
              )} */}
          <Grid item xs={12} md={6}>
            {/*For Help Resourse Type When sourse = upload and tag = Help Resourse and Help Resourse = doc*/}
            {/* No Need For Now */}
            {/* {formik.values.source === "upload" && formik.values.tag === "Help Resource" && getHelpingResourser === 'doc' && (
                  <Grid item xs={12} md={6}>
                    <UploadBox
                      otherFile={true}
                      height={58}
                      name="sourceFile"
                      accept={{
                        "application/msword": [],
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": []
                      }}
                      label="DOC"
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
                 </Grid>
                )} */}
            {/* </Box> */}

            {/* Minimul Upload Box To Upload Resourses, Hidden For Now */}
            {/* <Box sx={{ mt: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary", mt: "10px", mb: "10px" }}
                >
                  Resource Documents
                </Typography>
                <UploadMultipleCustom
                  label="Resource Documents"
                  name="resources"
                  multiple
                  files={formik.values.resources}
                  onDrop={handleResourceDrop}
                  error={formik.touched.resources && formik.errors.resources}
                  onRemove={(e) => {
                    const filtered = formik.values.resources.filter(
                      (file) => file !== e
                    );
                    formik.setFieldValue("resources", filtered);
                  }}
                />
              </Box> */}
          </Grid>
        </Grid>
        <Stack alignItems="flex-end" sx={{ mt: 1 }}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={formik.values.source !== "upload" && syllabusLoader}
            disabled={formik.values.source === "upload" && uploadStart}
          >
            {id ? "Update Video Manager" : "Create Video Manager"}
          </LoadingButton>
        </Stack>
      </form>
    </Container>
  );
}

export default CreateContent;

const ComponentLoaderInputLabel = ({ loader, label }) => {
  return loader ? <CustomComponentLoader padding="0 0" size={20} /> : label;
};
