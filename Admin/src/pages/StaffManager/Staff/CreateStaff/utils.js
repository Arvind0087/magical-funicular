import * as yup from "yup";
export const _initial = {
  name: "",
  url: "",
  email: "",
  phone: "",
  password: "",
  department: "",
  dob: "",
  gender: {},
  avatar: [],
  role: {},
  courseId: {},
  boardId: {},
  classId: [],
  list: [{ list: "" }],
  // batchId: [],
  // subjectId: [],
};

export const _validate = yup.object().shape({
  name: yup.string().required("Field is required"),
  email: yup
    .string()
    .email("Invalid Email Address")
    .required("Field is required"),
  phone: yup
    .number()
    .min(10, "Must be Minimum 10 digits")
    .required("Field is required"),
  dob: yup.string().required("Field is required"),
  gender: yup.object().shape({
    label: yup.string().required("Field is required"),
  }),
  role: yup.object().shape({
    label: yup.string().required("Field is required"),
  }),
  // password: yup
  //   .string()
  //   .required("Field is required")
  //   .min(8, "Must be Minimum 8 charecters"),
  // courseId: yup.object().when("role", {
  //   is: (ev) => ev.label === "Mentor" || ev.label === "Teacher",
  //   then: yup.object().shape({
  //     label: yup.string().required("Field is required"),
  //   }),
  //   otherwise: yup.object(),
  // }),
  // boardId: yup.object().when("role", {
  //   is: (ev) => ev.label === "Mentor" || ev.label === "Teacher",
  //   then: yup.object().shape({
  //     label: yup.string().required("Field is required"),
  //   }),
  //   otherwise: yup.object(),
  // }),
  // classId: yup.array().when("role", {
  //   is: (ev) => ev.label === "Mentor" || ev.label === "Teacher",
  //   then: yup.array().min(1, "Field is required"),
  //   otherwise: yup.array(),
  // }),
});

export const _gender = [
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
  {
    label: "Other",
    value: "other",
  },
];
