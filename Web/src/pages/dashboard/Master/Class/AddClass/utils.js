import * as yup from "yup";

export const _initialValues = {
  name: "",
  boardId: "",
  courseId: "",
};


export const classValidate = yup.object().shape({
  name: yup
    .string()
    .required("Field is required"),
  boardId: yup
    .string()
    .required("Field is required"),
  courseId: yup
    .string()
    .required("Field is required")
});
