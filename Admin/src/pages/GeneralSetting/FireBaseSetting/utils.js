import * as yup from "yup";

export const _initialValues = {
  firebaseKey: "",
};

export const _validation = yup.object().shape({
  firebaseKey: yup.string().required("Field is required"),
});
