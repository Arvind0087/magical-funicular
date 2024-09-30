import * as yup from "yup";

export const _initial = {
  courseId: "",
  boardId: "",
  classId: "",
  // name: "",
  batchLang: "",
};

export const _validate = yup.object().shape({
  courseId: yup.string().required("Field is required"),
  batchLang: yup.string().required("Field is required"),
  boardId: yup.string().required("Field is required"),
  classId: yup.string().required("Field is required"),
  // name: yup.string().required("Field is required"),
});

export const langData = [
  { name: "Hindi", value: "Hindi" },
  { name: "English", value: "English" },
  { name: "Bilingual", value: "Bilingual" },
];
