import * as yup from "yup";

export const _initial = {
  method: "",
  selection: "manual",
  name: {},
  courseId: "",
  boardId: "",
  classId: {},
  questions: []
};

export const _validateBasic = yup.object().shape({
  name: yup.object({
    label: yup.string().required()
  }),

  selection: yup.string().required("Field is required")
});

export const _validateAssign = yup.object().shape({
  classId: yup.object({
    label: yup.string().required()
  })
});

export const _validateAdvance = yup.object().shape({
  questions: yup.array().min(1, "Field is required")
});
