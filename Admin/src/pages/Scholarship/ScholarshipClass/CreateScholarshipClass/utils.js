import * as yup from "yup";

export const _initial = {
  title: "",
  course: "",
  boards: "",
  class: [],
  // batchType: "",
  batchType: [],
  subject: [],
  date: "",
  startTime: "",
  endTime: "",
};

export const _validate = yup.object().shape({
  title: yup.string().required("Field is required"),
  course: yup.string().required("Field is required"),
  boards: yup.string().required("Field is required"),
  class: yup.array().min(1, "Field is required"),
  batchType: yup.array().min(1, "Field is required"),
  subject: yup.array().min(1, "Field is required"),
  date: yup.string().required("Field is required"),
  startTime: yup.string().required("Field is required"),
  endTime: yup.string().required("Field is required"),
});
