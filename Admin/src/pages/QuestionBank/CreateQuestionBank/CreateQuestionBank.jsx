import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { Container, Stack, Box } from "@mui/system";
import { LoadingButton } from "@mui/lab";
import Editor from "components/editor/Editor";
import { PATH_DASHBOARD } from "routes/paths";
import { useDispatch, useSelector } from "react-redux";
import { getRevisionTopicAsync } from "redux/async.api";
import {
  createQuestionBankAsync,
  getQuestionByIdAsync,
  updateQuestionAsync,
} from "redux/questionbank/questionbank.async";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { useLocation, useNavigate, useParams } from "react-router";
import { useFormik } from "formik";
import { _correctanswer, _initial, _validate } from "./utils";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { getcourseAsync } from "redux/course/course.async";
import { emptyQuestionBank } from "redux/questionbank/questionbank.slice";
import SelectMenuItem from "components/SelectMenuItem/index";
import BoxGridTwo from "components/BoxGridTwo/BoxGridTwo";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import { getBoardsByCourseIdAsync } from "redux/board/board.async";
import { getClassByBoardAndCourseIdAsync } from "redux/class/class.async";
import { getBatchByCourseBoardClassAsync } from "redux/batchtype/batchtype.async";
import { getSubjectByBatchTypeIdAsync } from "redux/subject/subject.async";
import { getChapterBySubjectId } from "redux/chapter/chapter.async";
import _ from "lodash";

export default function AddQuestionBank() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const [isHeading, setIsHeading] = useState("");
  const [isEdit, setisEdit] = useState(false);

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
  const { revisionLoader, getRevisionTopic } = useSelector(
    (state) => state.revision
  );
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const {
    questionBankLoader,
    createQuestionBank,
    getQuestionById,
    updateQuestion,
  } = useSelector((state) => state.questionbank);

  const onSubmit = async (values) => {
    const payload = {
      questionId: Number(id),
      courseId: values.courseId?.value,
      boardId: values.boardId?.value,
      classId: values.classId?.value,
      batchTypeId: values.batchTypeId?.value,
      subjectId: values.subjectId?.value,
      chapterId: values.chapterId?.value,
      topicId: values.topicId?.value,
      question: values.question,
      option1: values.optiona,
      option2: values.optionb,
      option3: values.optionc,
      option4: values.optiond,
      answer: values.answer,
      explanation: values.explanation,
      difficultyLevel: values.difficulty,
    };
    if (id) {
      delete payload.courseId;
      delete payload.boardId;
      delete payload.classId;
      delete payload.batchTypeId;
      delete payload.subjectId;
      delete payload.chapterId;
      delete payload.topicId;
      dispatch(updateQuestionAsync(payload));
    } else dispatch(createQuestionBankAsync(payload));
  };

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
        getRevisionTopicAsync({
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

  useMemo(() => {
    if (id) dispatch(getQuestionByIdAsync(id));
  }, [id]);

  useEffect(() => {
    if (createQuestionBank.status === 200) {
      toast.success(createQuestionBank.message, toastoptions);
      dispatch(emptyQuestionBank());
      formik.resetForm();
      navigate(PATH_DASHBOARD.questionbank);
    }
    if (updateQuestion.status === 200) {
      toast.success(updateQuestion.message, toastoptions);
      navigate(PATH_DASHBOARD.questionbank);
      dispatch(emptyQuestionBank());
      formik.resetForm();
    }
  }, [createQuestionBank, updateQuestion]);

  useMemo(() => {
    if (Boolean(id && getQuestionById?.course)) {
      formik.setFieldValue("courseId", {
        label: getQuestionById.course,
        value: getQuestionById.courseId,
      });
      formik.setFieldValue("boardId", {
        label: getQuestionById.board,
        value: getQuestionById.boardId,
      });
      formik.setFieldValue("classId", {
        label: getQuestionById.class,
        value: getQuestionById.classId,
      });
      formik.setFieldValue("batchTypeId", {
        label: getQuestionById.batchType,
        value: getQuestionById.batchTypeId,
      });
      formik.setFieldValue("subjectId", {
        label: getQuestionById.subject,
        value: getQuestionById.subjectId,
      });
      formik.setFieldValue("chapterId", {
        label: getQuestionById.chapter,
        value: getQuestionById.chapterId,
      });
      formik.setFieldValue("topicId", {
        label: getQuestionById.topic,
        value: getQuestionById.topicId,
      });
      formik.setFieldValue("difficulty", getQuestionById.difficultyLevel);
      formik.setFieldValue("question", getQuestionById.question);
      formik.setFieldValue("optiona", getQuestionById.option1);
      formik.setFieldValue("optionb", getQuestionById.option2);
      formik.setFieldValue("optionc", getQuestionById.option2);
      formik.setFieldValue("optiond", getQuestionById.option4);
      formik.setFieldValue("answer", getQuestionById.answer);
      formik.setFieldValue("explanation", getQuestionById.explanation);
    }
  }, [id, getQuestionById]);

  useMemo(() => {
    if (Boolean(_.includes(pathname, "edit"))) {
      setIsHeading("Update Question Bank");
      setisEdit(false);
    } else if (Boolean(_.includes(pathname, "create"))) {
      setIsHeading("Create Question Bank");
      setisEdit(false);
    } else {
      setIsHeading("View Question Bank");
      setisEdit(true);
    }
  }, []);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Question Bank | {`${tabTitle}`} </title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={isHeading}
        links={[
          { name: "Question Bank", href: PATH_DASHBOARD.questionbank },
          { name: isHeading },
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
                  options={_.map(course?.data, (ev, In) => {
                    return { label: ev.name, value: ev.id };
                  })}
                  value={formik.values.courseId}
                  onChange={(event, value) => {
                    formik.setFieldValue("courseId", value);
                  }}
                  label="Select Course"
                  error={formik.touched.courseId && formik.errors.courseId}
                  readOnly={isEdit}
                />

                <AutoCompleteCustom
                  name="boardId"
                  loading={boardLoader}
                  options={_.map(boardByCourse, (ev) => {
                    return { label: ev.name, value: ev.id };
                  })}
                  value={formik.values.boardId}
                  onChange={(event, value) =>
                    formik.setFieldValue("boardId", value)
                  }
                  label="Select Board"
                  error={formik.touched.boardId && formik.errors.boardId}
                  readOnly={isEdit}
                />

                <AutoCompleteCustom
                  name="classId"
                  loading={classLoader}
                  options={_.map(classbycourseboard, (ev) => {
                    return { label: ev.name, value: ev.id };
                  })}
                  value={formik.values.classId}
                  onChange={(event, value) =>
                    formik.setFieldValue("classId", value)
                  }
                  label="Select Class"
                  error={formik.touched.classId && formik.errors.classId}
                  readOnly={isEdit}
                />

                <AutoCompleteCustom
                  name="batchTypeId"
                  loading={batchLoader}
                  options={_.map(batchByCourseBoardClass, (ev) => {
                    return { label: ev.name, value: ev.id };
                  })}
                  value={formik.values.batchTypeId}
                  onChange={(event, value) =>
                    formik.setFieldValue("batchTypeId", value)
                  }
                  label="Select Batch Type"
                  error={
                    formik.touched.batchTypeId && formik.errors.batchTypeId
                  }
                  readOnly={isEdit}
                />

                <AutoCompleteCustom
                  name="subject"
                  loading={subjectLoader}
                  options={_.map(subjectCourseBoardClassBatch, (ev) => {
                    return { label: ev.name, value: ev.id };
                  })}
                  value={formik.values.subjectId}
                  onChange={(event, value) =>
                    formik.setFieldValue("subjectId", value)
                  }
                  label="Select Subject Type"
                  error={formik.touched.subjectId && formik.errors.subjectId}
                  readOnly={isEdit}
                />

                <AutoCompleteCustom
                  name="chapterId"
                  loading={chapterLoader}
                  options={_.map(chapterdata, (ev) => {
                    return { label: ev.name, value: ev.id };
                  })}
                  value={formik.values.chapterId}
                  onChange={(event, value) =>
                    formik.setFieldValue("chapterId", value)
                  }
                  label="Select Chapter"
                  error={formik.touched.chapterId && formik.errors.chapterId}
                  readOnly={isEdit}
                />

                <AutoCompleteCustom
                  name="topicId"
                  loading={revisionLoader}
                  options={_.map(getRevisionTopic?.data, (ev) => {
                    return { label: ev.name, value: ev.id };
                  })}
                  value={formik.values.topicId}
                  onChange={(event, value) =>
                    formik.setFieldValue("topicId", value)
                  }
                  label="Select Topic"
                  error={formik.touched.topicId && formik.errors.topicId}
                  readOnly={isEdit}
                />

                <SelectMenuItem
                  fullWidth
                  error={formik.touched.difficulty && formik.errors.difficulty}
                  readOnly={isEdit}
                  InputLabelLabel="Difficulty Level"
                  InputLabelSize={20}
                  label="Difficulty Level"
                  name="difficulty"
                  {...formik.getFieldProps("difficulty")}
                  onChange={formik.handleChange}
                  defaultItemLabel="Select Difficulty Level"
                  data={_.map(["Easy", "Medium", "Hard"], (ev, index) => {
                    return (
                      <MenuItem value={ev} key={index}>
                        {ev}
                      </MenuItem>
                    );
                  })}
                />
              </BoxGridTwo>

              <Box sx={{ mt: "20px" }}>
                <HeadTypoCustom>Question</HeadTypoCustom>
                <Editor
                  id="question"
                  name="question"
                  rows={4}
                  value={formik.values.question}
                  onChange={(e) => {
                    formik.setFieldValue("question", e);
                  }}
                  error={formik.touched.question && formik.errors.question}
                  readOnly={isEdit}
                />
              </Box>

              <BoxGridTwo>
                <Box sx={{ mt: "20px" }}>
                  <HeadTypoCustom>Option A :</HeadTypoCustom>
                  <Editor
                    id="optionOne"
                    name="optiona"
                    rows={4}
                    value={formik.values.optiona}
                    onChange={(e) => {
                      formik.setFieldValue("optiona", e);
                    }}
                    error={formik.touched.optiona && formik.errors.optiona}
                    readOnly={isEdit}
                  />
                </Box>
                <Box sx={{ mt: "20px" }}>
                  <HeadTypoCustom>Option B :</HeadTypoCustom>
                  <Editor
                    id="optionTwo"
                    name="optionb"
                    rows={4}
                    value={formik.values.optionb}
                    onChange={(e) => {
                      formik.setFieldValue("optionb", e);
                    }}
                    error={formik.touched.optionb && formik.errors.optionb}
                    readOnly={isEdit}
                  />
                </Box>
                <Box sx={{ mt: "20px" }}>
                  <HeadTypoCustom>Option C :</HeadTypoCustom>
                  <Editor
                    id="optionThree"
                    name="optionc"
                    rows={4}
                    value={formik.values.optionc}
                    onChange={(e) => {
                      formik.setFieldValue("optionc", e);
                    }}
                    error={formik.touched.optionc && formik.errors.optionc}
                    readOnly={isEdit}
                  />
                </Box>
                <Box sx={{ mt: "20px" }}>
                  <HeadTypoCustom>Option D :</HeadTypoCustom>
                  <Editor
                    id="optionFour"
                    name="optiond"
                    rows={4}
                    value={formik.values.optiond}
                    onChange={(e) => {
                      formik.setFieldValue("optiond", e);
                    }}
                    error={formik.touched.optiond && formik.errors.optiond}
                    readOnly={isEdit}
                  />
                </Box>
              </BoxGridTwo>

              <Box>
                <HeadTypoCustom>Answer</HeadTypoCustom>
                <FormControl
                  fullWidth
                  error={formik.touched.answer && formik.errors.answer}
                >
                  <InputLabel>Answer</InputLabel>
                  <Select
                    label="Answer"
                    name="answer"
                    {...formik.getFieldProps("answer")}
                    onChange={formik.handleChange}
                    readOnly={isEdit}
                  >
                    <MenuItem value="">Select Correct Answer</MenuItem>
                    {_.map(_correctanswer, (ev, In) => {
                      return (
                        <MenuItem value={ev.value} key={In}>
                          {ev.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ mt: "20px" }}>
                <HeadTypoCustom>Explanation :</HeadTypoCustom>
                <Editor
                  id="optionexplanation"
                  name="explanation"
                  rows={4}
                  value={formik.values.explanation}
                  onChange={(e) => {
                    formik.setFieldValue("explanation", e);
                  }}
                  readOnly={isEdit}
                  error={
                    formik.touched.explanation && formik.errors.explanation
                  }
                />
              </Box>
              {!isEdit && (
                <Stack alignItems="flex-end" sx={{ mt: 10 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={questionBankLoader}
                  >
                    {isHeading}
                  </LoadingButton>
                </Stack>
              )}
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

const HeadTypoCustom = ({ children }) => {
  return (
    <Typography
      variant="subtitle2"
      sx={{ color: "text.secondary", mt: "10px", mb: "10px" }}
    >
      {children}
    </Typography>
  );
};
