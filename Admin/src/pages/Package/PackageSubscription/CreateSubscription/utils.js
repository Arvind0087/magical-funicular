import * as yup from "yup";

export const _initial = {
  packageId: "",
  month: "",
  // days: "",
  title: "",
};

export const _validate = yup.object().shape({
  packageId: yup.string().required("Field is required"),
  month: yup.string().required("Field is required"),
  // days: yup.string().required("Field is required"),
  title: yup.string().required("Field is required"),
});
