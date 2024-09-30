import * as yup from "yup";

export const _initial = {
  courseId: "",
  boardId: "",
  classId: "",
  batchTypeId: "",
  name: "",
  subjectId: "",
  sequence: "",
  brochure: [],
  freebrochure: [],
  impquestions: [],
};

export const _validate = yup.object().shape({
  courseId: yup.string().required("Field is required"),
  boardId: yup.string().required("Field is required"),
  classId: yup.string().required("Field is required"),
  batchTypeId: yup.string().required("Field is required"),
  name: yup.string().required("Field is required"),
  subjectId: yup.string().required("Field is required"),
});
