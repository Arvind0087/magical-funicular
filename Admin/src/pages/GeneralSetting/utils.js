import * as yup from "yup";

export const _initialValues = {
  instruction: "",
};

export const _validation = yup.object().shape({
  instruction: yup.string().required("Field is required"),
});
