import * as yup from "yup";

export const _initial = {
  image: [],
  title: "",
  description: "",
};

export const _validate = yup.object().shape({
  image: yup.array().min(1, "Field is required"),
  title: yup.string().required("Field is required"),
  description: yup.string().required("Field is required"),
});
