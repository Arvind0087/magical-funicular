import * as yup from "yup";

export const _initial = {
  courseId: "",
  boardId: "",
  classId: "",
  batchTypeId: "",
  chapterId: "",
  subjectId: "",
  name: "",
};

export const _validate = yup.object().shape({
  courseId: yup.string().required(),
  boardId: yup.string().required(),
  classId: yup.string().required(),
  batchTypeId: yup.string().required(),
  chapterId: yup.string().required(),
  subjectId: yup.string().required(),
  name: yup.string().required(),
});
