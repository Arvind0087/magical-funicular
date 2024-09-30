import * as yup from "yup";

export const _initial = {
  course: "",
  board: "",
};

export const _validate = yup.object().shape({
  course: yup.string().required("Field is required"),
  board: yup.string().required("Field is required"),
});
