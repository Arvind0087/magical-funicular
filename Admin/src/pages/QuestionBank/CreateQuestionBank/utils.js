import * as yup from "yup";

export const _initial = {
  courseId: {},
  boardId: {},
  classId: {},
  batchTypeId: {},
  subjectId: {},
  chapterId: {},
  topicId: {},
  difficulty: "",
  question: "",
  optiona: "",
  optionb: "",
  optionc: "",
  optiond: "",
  answer: "",
  explanation: "",
};

export const _validate = yup.object().shape({
  courseId: yup.object().shape({
    label: yup.string().required("Field is required"),
  }),
  boardId: yup.object().shape({
    label: yup.string().required("Field is required"),
  }),
  classId: yup.object().shape({
    label: yup.string().required("Field is required"),
  }),
  batchTypeId: yup.object().shape({
    label: yup.string().required("Field is required"),
  }),
  subjectId: yup.object().shape({
    label: yup.string().required("Field is required"),
  }),
  chapterId: yup.object().shape({
    label: yup.string().required("Field is required"),
  }),
  // topicId: yup.object().shape({
  //   label: yup.string().required("Field is required"),
  // }),
  difficulty: yup.string().required("Field is required"),
  question: yup.string().required("Field is required"),
  optiona: yup.string().required("Field is required"),
  optionb: yup.string().required("Field is required"),
  optionc: yup.string().required("Field is required"),
  optiond: yup.string().required("Field is required"),
  answer: yup.string().required("Field is required"),
  explanation: yup.string().required("Field is required"),
});

export const _correctanswer = [
  {
    label: "Option A",
    value: "A",
  },
  {
    label: "Option B",
    value: "B",
  },
  {
    label: "Option C",
    value: "C",
  },
  {
    label: "Option D",
    value: "D",
  },
];
