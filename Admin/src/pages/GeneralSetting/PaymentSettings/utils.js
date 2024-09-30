import * as yup from "yup";

export const _initialValues = {
  keyid: "",
  secretkey: "",
};

export const _validation = yup.object().shape({
  keyid: yup.string().required("Field is required"),
  secretkey: yup.string().required("Field is required"),
});
