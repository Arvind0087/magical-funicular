import * as yup from "yup";

export const _initial = {
  fromDate: "",
  toDate: "",
  breakTime: "",
  duration: "",
};

export const _validate = yup.object().shape({
  fromDate: yup.string().required(),
  toDate: yup.string().required(),
  breakTime: yup.string().required(),
  duration: yup.string().required(),
});
