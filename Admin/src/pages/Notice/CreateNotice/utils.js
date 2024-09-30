import * as yup from "yup";

export const _initialValues = {
  courseId: "",
  boardId: "",
  classId: "",
  batchLang: "",
  // student: [],
  title: "",
  package: "",
  image: [],
  description: "",
  buttonLink: "",
  otherLink: "",
  backLinkId: "",
  type: "",
};

export const noticePageValidate = yup.object().shape({
  type: yup.string().required("Field is required"),
  courseId: yup.string().when("type", {
    is: (value) =>
      value === "class" || value === "language" || value === "course",
    then: yup.string().required("Field is required"),
    otherwise: yup.string(),
  }),
  boardId: yup.string().when("type", {
    is: (value) => value === "class" || value === "language",
    then: yup.string().required("Field is required"),
    otherwise: yup.string(),
  }),
  classId: yup.string().when("type", {
    is: (value) => value === "class" || value === "language",
    then: yup.string().required("Field is required"),
    otherwise: yup.string(),
  }),
  batchLang: yup.string().when("type", {
    is: "language",
    then: yup.string().required("Field is required"),
    otherwise: yup.string(),
  }),
  package: yup.string().when("type", {
    is: "package",
    then: yup.string().required("Field is required"),
    otherwise: yup.string(),
  }),
  // student: yup.array().when("type", {
  //   is: "all",
  //   then: yup.array().min(1, "Field is required"),
  //   otherwise: yup.array(),
  // }),
  title: yup.string().required("Field is required"),
  image: yup.array().min(1, "Field is required"),
  description: yup.string().required("Field is required"),

  otherLink: yup.string().when("type", {
    is: (ev) => ev === "other",
    then: yup.string().required(),
    otherwise: yup.string(),
  }),

  backLinkId: yup.string().when("type", {
    is: (ev) => ev == 16,
    then: yup.string().required(),
    otherwise: yup.string(),
  }),
});

export const noticeTypes = [
  { name: "all", label: "All" },
  { name: "course", label: "Course" },
  { name: "package", label: "Package" },
  { name: "class", label: "Class" },
  { name: "language", label: "Language" },
];

export const options = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];
