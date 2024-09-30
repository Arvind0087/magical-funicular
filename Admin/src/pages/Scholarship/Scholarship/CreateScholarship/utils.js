import * as yup from "yup";

export const _initial = {
  title: "",
  regisDate: "",
};

export const _validate = yup.object().shape({
  title: yup.string().required("Field is required"),
  regisDate: yup.string().required("Field is required"),
});
