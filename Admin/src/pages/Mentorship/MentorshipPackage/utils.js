import * as yup from "yup";

export const _initial = {
  subscriptionType: "",
  amount: "",
  sessionAllocated: "",
};

export const _validate = yup.object().shape({
  subscriptionType: yup.string().required("Field is required"),
  amount: yup.string().required("Field is required"),
  sessionAllocated: yup.string().required("Field is required"),
});
