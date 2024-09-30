import * as yup from "yup";

export const _initialValues = {
  avatar: [],
  gender: "",
  courseId: "",
  boardId: "",
  classId: "",
  batchTypeId: "",
  name: "",
  dob: "",
  pincode: "",
  mPin: "",
  phone: "",
  batchStartDateId: "",
  email: ""
};

export const _validation = yup.object().shape({
  // avatar: yup.array().min(1, "Field is required"),
  name: yup.string().required("Field is required"),
  dob: yup.string().required("Field is required"),
  pincode: yup.string().required("Field is required"),

  mPin: yup.string().required("Field is required"),
  gender: yup.string().required("Field is required"),

  courseId: yup.string().required("Field is required"),
  boardId: yup.string().required("Field is required"),
  classId: yup.string().required("Field is required"),
  batchTypeId: yup.string().required("Field is required"),
  batchStartDateId: yup.string().required("Field is required"),
  email: yup.string().required("Field is required")
});
