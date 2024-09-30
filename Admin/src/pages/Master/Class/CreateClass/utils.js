import * as yup from "yup";


export const _initial = {
  name: "",
  boardId: "",
  courseId: "",
  telegramUrl: "",
};

export const _validate = yup.object().shape({
  name: yup.string().required("Field is required"),
  boardId: yup.string().required("Field is required"),
  courseId: yup.string().required("Field is required"),
  telegramUrl: yup.string().required("Field is required"),
});
