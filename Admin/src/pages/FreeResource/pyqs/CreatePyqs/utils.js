import * as yup from "yup";

export const _initial = {
  courseId: "",
  // boardId: "",
  classId: "",
  batchTypeId: "",
  year: "",
  title: "",
  pdftitle: "",
  videotitle: "",
  videourl: "",
  orderseq: "",
  brochure: [],
};

export const _validate = yup.object().shape({
  courseId: yup.string().required(),
  // boardId: yup.string().required(),
  classId: yup.string().required(),
  batchTypeId: yup.string().required(),
  // year: yup.string().required(),
  pdftitle: yup.string().required(),
  title: yup.string().required(),
  brochure: yup.array().min(1, "Field is required"),
});
