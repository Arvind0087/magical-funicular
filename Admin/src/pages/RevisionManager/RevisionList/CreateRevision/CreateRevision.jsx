import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Grid,
  Typography,
  Button,
  Container,
  Stack,
  Box,
  IconButton
} from "@mui/material";
import { Helmet } from "react-helmet-async";

import { LoadingButton } from "@mui/lab";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import { Upload } from "components/upload";
import UploadBox from "components/CustomUploads/UploadBox";
import { PATH_DASHBOARD } from "routes/paths";
import Editor from "components/editor/Editor";
import { useDispatch, useSelector } from "react-redux";
import {
  getBoardsByCourseIdAsync,
  getClassByBoardAndCourseIdAsync,
  getBatchByCourseBoardClassAsync,
  getSubjectByBatchTypeIdAsync,
  getChapterBySubjectId,
  getRevisionTopicAsync,
  createRevisionAsync,
  getRevisionByIdAsync,
  updateRevisionAsync
} from "redux/async.api";
import { emptyRevision } from "redux/slices/revision.slice";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { useNavigate, useParams } from "react-router";
import { useFormik } from "formik";
import { _validate, _initial, _categories, _topic } from "./utils";
import { GenerateBase64 } from "utils/convertToBase64";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { getcourseAsync } from "redux/course/course.async";
import BoxGridTwo from "components/BoxGridTwo/BoxGridTwo";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import TextFieldCustom from "components/TextFieldCustom/TextFieldCustom";
import Iconify from "components/iconify/Iconify";
import UploadMultipleCustom from "components/CustomUploads/UploadMultiple";

export default function CreateRevision() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );
  const { chapterLoader, chapterdata } = useSelector((state) => state.chapter);
  const {
    revisionLoader,
    getRevisionTopic,
    createRevision,
    getRevisionById,
    updateRevision
  } = useSelector((state) => state.revision);

  const onSubmit = async (values) => {
    const listIn = [];
    for (let ev of values.list) {
      const newImageList = await GenerateBase64(ev.image[0]);
      listIn.push({
        ...ev,
        image: newImageList
      });
    }
    let payload = {
      id: id,
      courseId: values.courseId?.value,
      boardId: values.boardId?.value,
      classId: values.classId?.value,
      batchTypeId: values.batchTypeId?.value,
      subjectId: values.subjectId?.value,
      chapaterId: values.chapterId?.value,
      category: values.category?.value,
      topic: values.topic?.value,
      list: listIn
    };
    if (values.category?.value !== "Quick Bites") {
      delete payload.topic;
    }
    if (id) {
      dispatch(updateRevisionAsync(payload));
    } else {
      delete payload.id;
      dispatch(createRevisionAsync(payload));
    }
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate
  });
  useEffect(() => {
    dispatch(getcourseAsync({}));
  }, []);

  useMemo(() => {
    if (formik.values.courseId?.value) {
      dispatch(
        getBoardsByCourseIdAsync({
          courseId: formik.values.courseId?.value
        })
      );
    }
  }, [formik.values.courseId]);

  useMemo(() => {
    if (formik.values.boardId?.value) {
      dispatch(
        getClassByBoardAndCourseIdAsync({
          courseId: formik.values.courseId?.value,
          boardId: formik.values.boardId?.value
        })
      );
    }
  }, [formik.values.boardId]);

  useMemo(() => {
    if (formik.values.classId?.value) {
      dispatch(
        getBatchByCourseBoardClassAsync({
          courseId: formik.values.courseId?.value,
          boardId: formik.values.boardId?.value,
          classId: formik.values.classId?.value
        })
      );
    }
  }, [formik.values.classId]);

  useMemo(() => {
    if (formik.values.batchTypeId?.value) {
      dispatch(
        getSubjectByBatchTypeIdAsync({
          courseId: formik.values.courseId?.value,
          boardId: formik.values.boardId?.value,
          classId: formik.values.classId?.value,
          batchTypeId: formik.values.batchTypeId?.value
        })
      );
    }
  }, [formik.values.batchTypeId]);

  useMemo(() => {
    if (formik.values.subjectId?.value) {
      dispatch(
        getChapterBySubjectId({
          courseId: formik.values.courseId?.value,
          boardId: formik.values.boardId?.value,
          classId: formik.values.classId?.value,
          batchTypeId: formik.values.batchTypeId?.value,
          subjectId: formik.values.subjectId?.value
        })
      );
    }
  }, [formik.values.subjectId]);

  useEffect(() => {
    if (createRevision.status === 200) {
      toast.success(createRevision.message, toastoptions);
      dispatch(emptyRevision());
      formik.resetForm();
      navigate(PATH_DASHBOARD.revision);
    }

    if (updateRevision.status === 200) {
      toast.success(updateRevision.message, toastoptions);
      dispatch(emptyRevision());
      formik.resetForm();
      navigate(PATH_DASHBOARD.revision);
    }
  }, [createRevision, updateRevision]);

  useMemo(() => {
    if (id) dispatch(getRevisionByIdAsync(id));
  }, [id]);

  useEffect(() => {
    if (Boolean(id && getRevisionById?.courseId)) {
      const Ids = getRevisionById;
      formik.setFieldValue("courseId", {
        label: Ids.courseName,
        value: Ids.courseId
      });
      formik.setFieldValue("boardId", {
        label: Ids.boardName,
        value: Ids.boardId
      });
      formik.setFieldValue("classId", {
        label: Ids.className,
        value: Ids.classId
      });
      formik.setFieldValue("batchTypeId", {
        label: Ids.batchTypeName,
        value: Ids.batchTypeId
      });
      formik.setFieldValue("subjectId", {
        label: Ids.subjectName,
        value: Ids.subjectId
      });
      formik.setFieldValue("chapterId", {
        label: Ids.chapaterName,
        value: Ids.chapaterId
      });
      formik.setFieldValue("category", {
        label: Ids.category,
        value: Ids.category
      });
      formik.setFieldValue("topic", {
        label: Ids.topic,
        value: Ids.topic
      });
      formik.setFieldValue(
        "list",
        _.map(Ids.list, (evv) => {
          return { ...evv, image: evv?.image ? [evv.image] : null };
        })
      );
    }
  }, [getRevisionById, id]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Revision | {`${tabTitle}`} </title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={Boolean(id) ? "Update Revision" : "Create Revision"}
        links={[
          { name: "Revision List", href: PATH_DASHBOARD.revision },
          { name: id ? "Update Revision" : "Create Revision" }
        ]}
      />
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <BoxGridTwo>
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

                <AutoCompleteCustom
                  name="classId"
                  loading={classLoader}
                  options={_.map(classbycourseboard, (ev) => {
                    return { label: ev.name, value: ev.id };
                  })}
                  value={formik.values.classId}
                  onChange={(event, value) => {
                    formik.setFieldValue("classId", value);
                  }}
                  label="Select Class"
                  error={formik.touched.classId && formik.errors.classId}
                />

                <AutoCompleteCustom
                  name="batchTypeId"
                  loading={batchLoader}
                  options={_.map(batchByCourseBoardClass, (ev) => {
                    return { label: ev.name, value: ev.id };
                  })}
                  value={formik.values.batchTypeId}
                  onChange={(event, value) => {
                    formik.setFieldValue("batchTypeId", value);
                  }}
                  label="Select Batch Type"
                  error={
                    formik.touched.batchTypeId && formik.errors.batchTypeId
                  }
                />

                <AutoCompleteCustom
                  name="subjectId"
                  loading={subjectLoader}
                  options={_.map(subjectCourseBoardClassBatch, (ev) => {
                    return { label: ev.name, value: ev.id };
                  })}
                  value={formik.values.subjectId}
                  onChange={(event, value) => {
                    formik.setFieldValue("subjectId", value);
                  }}
                  label="Select Subject"
                  error={formik.touched.subjectId && formik.errors.subjectId}
                />

                <AutoCompleteCustom
                  name="chapterId"
                  loading={chapterLoader}
                  options={_.map(chapterdata, (ev) => {
                    return { label: ev.name, value: ev.id };
                  })}
                  value={formik.values.chapterId}
                  onChange={(event, value) => {
                    formik.setFieldValue("chapterId", value);
                  }}
                  label="Select Chapter"
                  error={formik.touched.chapterId && formik.errors.chapterId}
                />

                <AutoCompleteCustom
                  name="category"
                  options={_categories}
                  value={formik.values.category}
                  onChange={(event, value) => {
                    formik.setFieldValue("category", value);
                  }}
                  label="Select Category"
                  error={formik.touched.category && formik.errors.category}
                />

                {Boolean(formik.values.category?.value === "Quick Bites") && (
                  <AutoCompleteCustom
                    name="topic"
                    options={_topic}
                    value={formik.values.topic}
                    onChange={(event, value) => {
                      formik.setFieldValue("topic", value);
                    }}
                    label="Select Topic"
                    error={formik.touched.topic && formik.errors.topic}
                  />
                )}
              </BoxGridTwo>

              <Box sx={{ mt: 5 }}>
                {Boolean(formik.values.category?.value === "Quick Bites") && (
                  <QuickbitesSection
                    {...{
                      formik
                    }}
                  />
                )}
                {Boolean(formik.values.category?.value === "Summary") && (
                  <SummarySection {...{ formik }} />
                )}
                {Boolean(formik.values.category?.value === "Questions") && (
                  <QuestionSection {...{ formik }} />
                )}
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={revisionLoader}
                >
                  {Boolean(id) ? "Update Revision" : "Create Revision"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

const QuickbitesSection = ({ formik }) => {
  return (
    <>
      {Boolean(formik.values.topic?.value) &&
        formik.values.list.map((listI, index) => (
          <>
            <Box display="flex" mt={2} key={index}>
              <TextFieldCustom
                sx={{ mixWidth: "25%", mr: "10px" }}
                name="title"
                label="Title"
                fullWidth
                error={formik?.touched?.list && formik?.errors?.list}
                value={listI.title}
                onChange={(e) => {
                  formik.values.list[index][e.target.name] = e.target.value;
                  formik.setFieldValue("list", formik.values.list);
                }}
              />
              <TextFieldCustom
                sx={{ mixWidth: "25%", mr: "10px" }}
                name="description"
                label="Description"
                fullWidth
                error={formik?.touched?.list && formik?.errors?.list}
                value={listI?.description}
                onChange={(e) => {
                  formik.values.list[index][e.target.name] = e.target.value;
                  formik.setFieldValue("list", formik?.values?.list);
                }}
              />
              <UploadBox
                sx={{ mixWidth: "25%" }}
                height={56}
                label="Thumbnail"
                file={listI?.image[0]}
                accept={{ "image/*": [] }}
                onDrop={(evv) => {
                  const newFile = Object?.assign(evv[0], {
                    preview: URL?.createObjectURL(evv[0] || [])
                  });
                  if (evv[0]) {
                    formik.values.list[index]["image"] = [newFile];
                    formik.setFieldValue("list", formik?.values?.list);
                  }
                }}
                error={formik?.touched?.list && formik?.errors?.list}
              />
              <Box
                display="flex"
                justifyContent="end"
                sx={{ mixWidth: "25%", ml: "10px" }}
              >
                <Button
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  sx={{ mr: "3px" }}
                  onClick={() =>
                    formik.setFieldValue("list", [
                      ...formik?.values?.list,
                      {
                        title: "",
                        description: "",
                        image: []
                      }
                    ])
                  }
                >
                  Add
                </Button>
                <Button
                  startIcon={<Iconify icon="eva:trash-2-outline" />}
                  sx={{ ml: "3px" }}
                  disabled={Boolean(formik.values.list.length === 0)}
                  onClick={() => {
                    if (formik.values.list.length > 1) {
                      formik.values.list.splice(index, 1);
                      formik.setFieldValue("list", formik.values.list);
                    }
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </>
        ))}
    </>
  );
};

const SummarySection = ({ formik }) => {
  return (
    <>
      {formik.values.list.map((ev, index) => (
        <Box key={index}>
          <TypographyCustom label="Title" />
          <Editor
            id={`summary-question${index}`}
            name="title"
            value={ev.title}
            onChange={(e) => {
              formik.values.list[index]["title"] = e;
              formik.setFieldValue("list", formik.values.list);
            }}
            error={formik?.touched?.list && formik?.errors?.list}
          />
          <TypographyCustom label="Description" />
          <Editor
            id={`summary-answer${index}`}
            name="description"
            value={ev.description}
            onChange={(e) => {
              formik.values.list[index]["description"] = e;
              formik.setFieldValue("list", formik.values.list);
            }}
            error={formik?.touched?.list && formik?.errors?.list}
          />
          <TypographyCustom label="Image" />
          <UploadMultipleCustom
            label="Image"
            name="image"
            multiple
            files={ev.image}
            onDrop={(evv) => {
              const newFile = Object.assign(evv[0], {
                preview: URL.createObjectURL(evv[0])
              });
              if (evv[0]) {
                formik.values.list[index]["image"] = [newFile];
                formik.setFieldValue("list", formik.values.list);
              }
            }}
            error={formik.touched.list && formik.errors.list}
          />
        </Box>
      ))}
    </>
  );
};

const QuestionSection = ({ formik }) => {
  return (
    <>
      {formik.values.list.map((ev, index) => (
        <Box key={index}>
          <TypographyCustom label="Title" />
          <Editor
            id={`question-question${index}`}
            name="title"
            value={ev.title}
            onChange={(e) => {
              formik.values.list[index]["title"] = e;
              formik.setFieldValue("list", formik.values.list);
            }}
            error={formik?.touched?.list && formik?.errors?.list}
          />
          <TypographyCustom label="Description" />
          <Editor
            id={`question-answer${index}`}
            name="description"
            value={ev.description}
            onChange={(e) => {
              formik.values.list[index]["description"] = e;
              formik.setFieldValue("list", formik.values.list);
            }}
            error={formik?.touched?.list && formik?.errors?.list}
          />
          <TypographyCustom label="Image" />
          <UploadMultipleCustom
            label="Image"
            name="image"
            multiple
            files={ev.image}
            onDrop={(evv) => {
              const newFile = Object.assign(evv[0], {
                preview: URL.createObjectURL(evv[0])
              });
              if (evv[0]) {
                formik.values.list[index]["image"] = [newFile];
                formik.setFieldValue("list", formik.values.list);
              }
            }}
            error={formik.touched.list && formik.errors.list}
          />
        </Box>
      ))}
    </>
  );
};

const TypographyCustom = ({ label }) => {
  return (
    <Typography
      variant="subtitle2"
      sx={{
        color: "text.secondary",
        mt: "10px",
        mb: "10px"
      }}
    >
      {label}
    </Typography>
  );
};
