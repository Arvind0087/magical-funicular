import * as yup from "yup";

export const _initialValues = {
  question: "",
  answer: "",
  type: "",
};

export const signupValidate = yup.object().shape({
  question: yup.string().required("Field is required"),
  answer: yup.string().required("Field is required"),
  type: yup.string().required("Field is required")
});
