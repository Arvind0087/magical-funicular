import * as yup from "yup";

export const _initial = {
  mpin: "",
  confirmMpin: "",
};

export const _validation = yup.object().shape({
  mpin: yup.string().required().min(4, " Must be exactly 4 digits"),
  confirmMpin: yup
        .string()
        .required("Confirm m-pin is required")
        .oneOf([yup.ref("mpin"), null], "m-pin not match"),
});
