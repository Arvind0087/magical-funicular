import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Container, Box, Stepper, Step, StepLabel, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import BasicSetting from "../Components/Stepper/BasicSetting";
import { useFormik } from "formik";
import Questions from "../Components/Stepper/Questions";
import Assign from "../Components/Stepper/Assign";
import { useSettingsContext } from "components/settings";
import {
  createAssignmentAsync,
  getAssignmentByIdAsync,
  getChapterByMultipleSubjectIdAsync,
  updateAssignmentAsync
} from "redux/assignment/assignment.async";
import { useDispatch, useSelector } from "react-redux";
import {
  _initial,
  _validateAdvance,
  _validateAssign,
  _validateBasic
} from "./utils";
import Overview from "../Components/Stepper/Overview";
import { toast } from "react-hot-toast";
import { emptyassignment } from "redux/assignment/assignment.slice";
import { toastoptions } from "utils/toastoptions";
import { PATH_DASHBOARD } from "routes/paths";
import { getBoardsByCourseIdAsync } from "redux/board/board.async";
import { getClassByBoardAndCourseIdAsync } from "redux/class/class.async";
import { getBatchByCourseBoardClassAsync } from "redux/batchtype/batchtype.async";
import { getStydentsByCBCBAsync } from "redux/assignment/assignment.async";
import { getcourseAsync } from "redux/course/course.async";
import { getSubjectByBatchTypeIdAsync } from "redux/subject/subject.async";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { GenerateBase64 } from "utils/convertToBase64";
import { getAllQuestionAsync } from "redux/questionbank/questionbank.async";
import CustomBreadcrumbs from "components/custom-breadcrumbs";

export default function CreateAssignment() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const {
    assignmentLoader,
    createAssignment,
    assignmentById,
    updateAssignment
  } = useSelector((state) => state.assignment);
  const steps = ["Basic Settings", "Assign", "Questions", "Overview"];
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    if (formik.values.method === "upload" && activeStep === 3) {
      setActiveStep(1);
    } else if (activeStep !== 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const onSubmit = async (values) => {
    if (activeStep === 2) {
      // dispatch(
      //   getAllQuestionAsync({
      //     subject: JSON.stringify([]),
      //     chapter: JSON.stringify([])
      //   })
      // );
    }
    if (formik.values.method === "upload" && activeStep === 1) {
      setActiveStep(3);
    } else if (activeStep !== 3) {
      handleNext();
    } else {
      let payload = {
        testMethod: values.method,
        selectionProcess: values.selection,
        name: values.name,
        time: values.time,
        type: values.assingmenttype,
        validity: `${values.date}:00`,
        // validity: new Date(values.date),
        boardId: values.boardId,
        classId: values.classId,
        batchTypeId: values.batchId,
        studentIds: values?.students?.map((ev) => ev.value)
      };
      if (values.method === "online") {
        payload = {
          ...payload,
          questionIds: values.questions
        };
      } else if (values.method === "upload") {
        const questionFiles = await GenerateBase64(values.questionFile[0]);
        const answerFiles = await GenerateBase64(values.answerFile[0]);
        payload = {
          ...payload,
          questionFile: questionFiles,
          answerFile: answerFiles,
          subjectIds: values?.subjects?.map((ev) => ev.value),
          chapterIds: values?.chapters?.map((ev) => ev.value)
        };
      }
      if (id) {
        payload.id = id;
        dispatch(updateAssignmentAsync(payload));
      } else {
        dispatch(createAssignmentAsync(payload));
      }
    }
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema:
      activeStep === 0
        ? _validateBasic
        : activeStep === 1
          ? _validateAssign
          : activeStep === 2
            ? _validateAdvance
            : null
  });

  useEffect(() => {
    dispatch(getcourseAsync({}));
  }, []);

  useEffect(() => {
    if (formik.values.courseId) {
      dispatch(
        getBoardsByCourseIdAsync({
          courseId: formik.values.courseId
        })
      );
    }
  }, [formik.values.courseId]);

  useEffect(() => {
    if (formik.values.boardId) {
      dispatch(
        getClassByBoardAndCourseIdAsync({
          courseId: formik.values.courseId,
          boardId: formik.values.boardId
        })
      );
    }
  }, [formik.values.boardId]);

  useEffect(() => {
    if (formik.values.classId) {
      dispatch(
        getBatchByCourseBoardClassAsync({
          courseId: formik.values.courseId,
          boardId: formik.values.boardId,
          classId: formik.values.classId
        })
      );
    }
  }, [formik.values.classId]);

  useEffect(() => {
    if (formik.values.batchId) {
      dispatch(
        getStydentsByCBCBAsync({
          courseId: formik.values.courseId,
          boardId: formik.values.boardId,
          classId: formik.values.classId,
          batchTypeId: formik.values.batchId
        })
      );
      dispatch(
        getSubjectByBatchTypeIdAsync({
          batchTypeId: formik.values.batchId
        })
      );
    }
  }, [formik.values.batchId]);

  useEffect(() => {
    if (formik.values.subjects) {
      dispatch(
        getChapterByMultipleSubjectIdAsync({
          subjectId: formik.values.subjects.map((ev) => ev.value)
        })
      );
    }
  }, [formik.values.subjects]);

  useEffect(() => {
    if (createAssignment.status === 200) {
      toast.success(createAssignment.message, toastoptions);
      formik.resetForm();
      dispatch(emptyassignment());
      navigate(PATH_DASHBOARD.assignment);
    }
    if (updateAssignment.status === 200) {
      toast.success(updateAssignment.message, toastoptions);
      formik.resetForm();
      dispatch(emptyassignment());
      navigate(PATH_DASHBOARD.assignment);
    }
  }, [createAssignment, updateAssignment]);

  useEffect(() => {
    if (id) dispatch(getAssignmentByIdAsync(id));
  }, [id]);

  useEffect(() => {
    if (id && assignmentById) {
      formik.setFieldValue("method", assignmentById.testMethod);
      formik.setFieldValue("name", assignmentById.name);
      formik.setFieldValue("time", assignmentById.time);
      formik.setFieldValue("assingmenttype", assignmentById.type);
      formik.setFieldValue("courseId", assignmentById.courseId);
      formik.setFieldValue("boardId", assignmentById.boardId);
      formik.setFieldValue("classId", assignmentById.classId);
      formik.setFieldValue("batchId", assignmentById.batchTypeId);

      if (assignmentById?.validity) {
        const timestamp = new Date(assignmentById?.validity);
        const formattedDate = timestamp
          .toISOString()
          .substr(0, 16)
          .replace("T", " ");
        formik.setFieldValue("date", formattedDate);
      }

      formik.setFieldValue("validity", assignmentById?.time);
      if (assignmentById.testMethod === "online") {
        formik.setFieldValue("selection", assignmentById.selectionProcess);
        const questions = assignmentById?.questions?.map((ev) => ev.id);
        formik.setFieldValue("questions", questions || []);
      } else {
        formik.setFieldValue("answerFile", [assignmentById.answerFile]);
        formik.setFieldValue("questionFile", [assignmentById.questionFile]);

        const subjects = assignmentById?.subjects?.map((ev) => {
          return { label: ev.subjectName, value: ev.subjectId };
        });
        const chapters = assignmentById?.chapters?.map((ev) => {
          return { label: ev.chapterName, value: ev.chapterId };
        });

        formik.setFieldValue("subjects", subjects || []);
        formik.setFieldValue("chapters", chapters || []);
      }
      const students = assignmentById?.students?.map((ev) => {
        return { label: ev.name, value: ev.id };
      });
      formik.setFieldValue("students", students || []);
    }
  }, [id, assignmentById]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title> Assignment | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={id ? "Update Assignment" : "Create Assignment"}
        links={[
          { name: "Assignment", href: `${PATH_DASHBOARD.assignment}` },
          { name: "Create Assignment" }
        ]}
      />
      <Box sx={{ width: "100%", mt: 4 }}>
        <form onSubmit={formik.handleSubmit}>
          <Stack
            sx={{
              mb: 4,
              display: "flex",
              flexDirection: "row",
              justifyContent: activeStep === 0 ? "end" : 'space-between'
            }}
          >
            <LoadingButton
              variant="contained"
              color="inherit"
              sx={{ display: activeStep === 0 ? 'none' : ' block' }}
              onClick={handleBack}
            >
              Back
            </LoadingButton>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={assignmentLoader}
            >
              {activeStep !== 3
                ? "Next"
                : Boolean(id)
                  ? "Update Assignment"
                  : "Create Assignment"}
            </LoadingButton>
          </Stack>
          <Stepper
            activeStep={activeStep}
            sx={{
              mb: 4
            }}
          >
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {activeStep === 0 ? (
            <BasicSetting formik={formik} />
          ) : activeStep === 1 ? (
            <Assign formik={formik} />
          ) : activeStep === 2 ? (
            <Questions formik={formik} />
          ) : (
            <Overview formik={formik} />
          )}
          {/* <Stack
            sx={{
              mt: "30px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <LoadingButton
              variant="contained"
              color="inherit"
              onClick={handleBack}
            >
              Back
            </LoadingButton>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={assignmentLoader}
            >
              {activeStep !== 3
                ? "Next"
                : Boolean(id)
                ? "Update Assignment"
                : "Create Assignment"}
            </LoadingButton>
          </Stack> */}
        </form>
      </Box>
    </Container>
  );
}
