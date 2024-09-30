import * as yup from "yup";

export const _initialValues = {
  courseId: "",
  boardId: "",
  classId: "",
  batchTypeId: "",
  name: "",
};

export const subjectValidate = yup.object().shape({
  courseId: yup
    .string()
    .required("Field is required"),
  boardId: yup
    .string()
    .required("Field is required"),
  classId: yup
    .string()
    .required("Field is required"),
  batchTypeId: yup
    .string()
    .required("Field is required"),
  name: yup
    .string()
    .required("Field is required")
});