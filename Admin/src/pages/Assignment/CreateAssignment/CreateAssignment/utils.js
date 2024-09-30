import * as yup from "yup";

export const _initial = {
  method: "online",
  selection: "",
  name: "",
  time: "",
  assingmenttype: "",
  courseId: "",
  boardId: "",
  classId: "",
  batchId: "",
  date: "",
  students: [],
  questions: [],
  subjects: [],
  chapters: [],
  questionFile: [],
  answerFile: [],
};

export const _validateBasic = yup.object().shape({
  method: yup.string().required("Field is required"),
  selection: yup.string().when("method", {
    is: (ev) => ev === "online",
    then: yup.string().required(1),
    otherwise: yup.string(),
  }),
  name: yup.string().required("Field is required"),
  time: yup.string().required("Field is required"),
  answerFile: yup.array().when("method", {
    is: (ev) => ev === "upload",
    then: yup.array().min(1, "Field is required"),
    otherwise: yup.array(),
  }),
  questionFile: yup.array().when("method", {
    is: (ev) => ev === "upload",
    then: yup.array().min(1, "Field is required"),
    otherwise: yup.array(),
  }),
});

export const _validateAssign = yup.object().shape({
  assingmenttype: yup.string().required("Field is required"),
  courseId: yup.string().required("Field is required"),
  boardId: yup.string().required("Field is required"),
  classId: yup.string().required("Field is required"),
  batchId: yup.string().required("Field is required"),
  date: yup.string().required("Field is required"),
  students: yup.array().min(1, "Field is required"),
  subjects: yup.array().when("method", {
    is: (ev) => ev === "upload",
    then: yup.array().min(1, "Field is required"),
    otherwise: yup.array(),
  }),
  chapters: yup.array().when("method", {
    is: (ev) => ev === "upload",
    then: yup.array().min(1, "Field is required"),
    otherwise: yup.array(),
  }),
});

export const _validateAdvance = yup.object().shape({
  questions: yup.array().min(1, "Field is required"),
});
