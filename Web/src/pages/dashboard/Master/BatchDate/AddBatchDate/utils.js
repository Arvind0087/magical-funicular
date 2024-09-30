import * as yup from 'yup';

export const _initialValues = {
  class: '',
  boards: '',
  course: '',
  batch: '',
  batchDate: ''
};

export const batchDateValidate = yup.object().shape({
  course: yup
    .string()
    .required("Field is required"),
  boards: yup
    .string()
    .required("Field is required"),
  class: yup
    .string()
    .required("Field is required"),
  batch: yup
    .string()
    .required("Field is required"),
  batchDate: yup
    .string()
    .required("Field is required")
});