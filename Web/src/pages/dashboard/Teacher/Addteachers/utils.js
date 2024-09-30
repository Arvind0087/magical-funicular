import * as yup from "yup";

export const _initialValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  department: "",
  dob: "",
  gender: "",
};

export const signupValidate = yup.object().shape({
  name: yup.string().required("Field is required"),
  email: yup
    .string()
    .email("Invalid Email Address")
    .required("Field is required"),
  phone: yup
    .number()
    .min(10, "Must be Minimum 10 digits")
    .required("Field is required"),
  password: yup
    .string()
    .required("Field is required")
    .min(8, "Must be Minimum 8 charecters"),
  department: yup.string().required("Field is required"),
  dob: yup.string().required("Field is required"),
  gender: yup.string().required("Field is required"),
});
