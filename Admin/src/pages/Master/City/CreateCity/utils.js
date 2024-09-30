import * as yup from "yup";

export const _initial = {
  name: "",
  stateId: "",
};

export const _validation = yup.object().shape({
  name: yup.string().required("Field is required"),
  stateId: yup.string().required("Field is required"),
});
