import * as yup from "yup";

export const _initialValues = {
  name: "",
  phone: "",
  pincode: "",
  address: "",
  landmark: "",
  city: "",
  state: "",
};

export const _validation = yup.object().shape({
  name: yup.string().required("Field is required"),
  phone: yup.string().required("Field is required"),
  pincode: yup.string().required("Field is required"),
  address: yup.string().required("Field is required"),
  landmark: yup.string().required("Field is required"),
  // city: yup.string().required("Field is required"),
  // state: yup.string().required("Field is required"),
});
