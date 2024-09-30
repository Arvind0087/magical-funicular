import * as yup from "yup";

export const _initial = {
  category: "",
};

export const _validation = yup.object().shape({
  category: yup.string().required("Field is required"),
});
