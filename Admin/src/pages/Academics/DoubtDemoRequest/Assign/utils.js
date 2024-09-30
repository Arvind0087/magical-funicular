import * as yup from "yup";

export const _initial = {
  teacher:"",
  startDate:{},
  // time:""
};

export const _validation = yup.object().shape({
  startDate: yup.object({
    label: yup.string().required(),
  }),
  teacher: yup.string().required("Field is required"),
  // time: yup.string().required("Field is required"),
});

export const _validationNan = yup.object().shape({});