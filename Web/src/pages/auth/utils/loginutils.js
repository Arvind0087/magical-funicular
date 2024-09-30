import * as yup from "yup";

export const _initialValues = {
  email: "",
  password: "",
};

export const LoginValidate = yup.object().shape({
  email: yup
    .string()
    .email("Invalid Email Address")
    .required("Field is required"),
  password: yup
    .string()
    .required("Field is required")
    .min(8, "Must be Minimum 8 charecters"),
});
