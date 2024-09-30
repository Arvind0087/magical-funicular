import * as yup from "yup";

export const _initialValues = {
  course: "",
  board: "",
};

export const BoardValidate = yup.object().shape({
  course: yup.string().required("Field is required"),
  board: yup.string().required("Field is required"),
});
