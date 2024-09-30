import * as yup from "yup";

export const _initial = {
  file: [],
  docFormat: {},
};

export const _validate = yup.object().shape({
  file: yup.array().min(1, "Field is required"),
  docFormat: yup.object().shape({
    label: yup.string().required("Field is required"),
  }),
});
