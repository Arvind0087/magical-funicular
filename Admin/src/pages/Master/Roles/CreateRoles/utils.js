import * as yup from "yup";

export const _initial = {
  role: "",
};

export const _validation = yup.object().shape({
  role: yup.string().required("Field is required"),
});
