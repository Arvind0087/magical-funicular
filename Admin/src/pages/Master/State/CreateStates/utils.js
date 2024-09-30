import * as yup from "yup";

export const _initial = {
  name: "",
};

export const _validation = yup.object().shape({
  name: yup.string().required("Field is required"),
});
