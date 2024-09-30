import * as yup from "yup";

export const _initialValues = {
  fatherName: "",
  parentNumber: "",
  occupation: "",
  schoolName: "",
  address: "",
  state: "",
  city: "",
  wantsToBe: "",
  referralCode: "",
};

export const _validation = yup.object().shape({
  // fatherName: yup.string().required("Field is required"),
  // parentNumber: yup.string().required("Field is required"),
  // occupation: yup.string().required("Field is required"),
  // schoolName: yup.string().required("Field is required"),
  // address: yup.string().required("Field is required"),
  // state: yup.string().required("Field is required"),
  // city: yup.string().required("Field is required"),
  // wantsToBe: yup.string().required("Field is required")
});
