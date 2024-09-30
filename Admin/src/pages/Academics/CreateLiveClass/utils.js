import * as yup from "yup";

export const _initial = {
  subjectId: "",
  batchTypeId: "",
  teacherId: [],
  courseId: "",
  boardId: "",
  classId: "",
  packageId: "",
  // type: "",
  // category: "",
  attemptBy: "",
  endBy: "",
  time: "",
  title: "",
  date: "",
  linkUrl: "",
  image: [],
  brochure: [],
};

export const _validate = yup.object().shape({
  subjectId: yup.string().required("Field is required"),
  batchTypeId: yup.string().required("Field is required"),
  courseId: yup.string().required("Field is required"),
  boardId: yup.string().required("Field is required"),
  classId: yup.string().required("Field is required"),
  teacherId: yup.array().min(1, "Field is required"),
  image: yup.array().min(1, "Field is required"),
  // type: yup.string().required("Field is required"),
  title: yup.string().required("Field is required"),
  // category: yup.string().required("Field is required"),
  // time: yup.string().required("Field is required"),
  attemptBy: yup.string().required("Field is required"),
  endBy: yup.string().required("Field is required"),
  linkUrl: yup.string().when("category", {
    is: "Youtube",
    then: yup.string().required("Field is required"),
    otherwise: yup.string(),
  }),
});

export const _category = [
  {
    value: "Youtube",
    label: "Youtube",
  },
  {
    value: "Zoom",
    label: "Zoom",
  },
];

export const _type = [
  {
    value: "Free_Live_Class",
    label: "Free Live Class",
  },
  {
    value: "Live Class",
    label: "Live Class",
  },
  {
    value: "Doubt Class",
    label: "Doubt Class",
  },
  {
    value: "Demo Class",
    label: "Demo Class",
  },
  {
    value: "Mentorship",
    label: "Mentorship",
  },
];

export const _time = [
  {
    value: "00:15:00",
    label: "15 mins",
  },
  {
    value: "00:30:00",
    label: "30 mins",
  },
  {
    value: "00:45:00",
    label: "45 mins",
  },
  {
    value: "00:60:00",
    label: "60 mins",
  },
];
