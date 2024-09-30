import * as yup from "yup";

export const _initialValues = {
  answer: "",
  image: "",
};

export const _validation = yup.object().shape({
  answer: yup.string().required("Field is required"),
});
