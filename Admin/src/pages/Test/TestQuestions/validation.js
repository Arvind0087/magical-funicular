import * as yup from "yup";

export const _initial = {
  courseId: {},
  boardId: {},
  classId: {},
  batchTypeId: [],
  batchStartDateId: [],
};

export const _validate = yup.object().shape({
  courseId: yup.object().shape({
    label: yup.string().required("Field is required"),
  }),
  boardId: yup.object().shape({
    label: yup.string().required("Field is required"),
  }),
  classId: yup.object().shape({
    label: yup.string().required("Field is required"),
  }),
  batchTypeId: yup.array().min(1, "Field is required"),
  // batchStartDateId: yup.array().min(1, "Field is required"),
});
