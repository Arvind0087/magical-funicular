import * as yup from "yup";

export const _initial = {
  courseId: "",
  boardId: "",
  classBatchSubject: [],
  title: "",
  video: [],
  thumbnail: [],
  source: "",
  sourceURL: "",
};

export const _validate = yup.object().shape({
  source: yup.string().required("Field is required"),
  
  // sourceURL: yup.string().required("Field is required"),
  sourceURL: yup.string().when("source", {
    is: (ev) => ev !== "upload",
    then: yup.string().required(),
    otherwise: yup.string(),
  }),

  courseId: yup.string().required("Field is required"),
  boardId: yup.string().required("Field is required"),
  classBatchSubject: yup.array().min(1, "Field is required"),
  title: yup.string().required("Field is required"),

  // video: yup.array().min(1, "Field is min"),
  video: yup.array().when("source", {
    is: (ev) => ev === "upload",
    then: yup.array().min(1),
    otherwise: yup.array(),
  }),

  thumbnail: yup.array().min(1, "Field is required"),
});
