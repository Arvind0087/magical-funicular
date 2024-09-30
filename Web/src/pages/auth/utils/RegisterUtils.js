import * as yup from "yup";

export const _phoneInitial = {
  phone: "",
};

export const _phoneValidate = yup.object().shape({
  phone: yup
    .string()
    .required("Phone number is required")
    .min(12, "Must be exactly 10 digits"),
});
export const _mPinLoginInitial = {
  phone: "",
  mPin: ""
};

export const _mPinLoginValidate = yup.object().shape({
  phone: yup
    .string()
    .required("Phone number is required")
    .min(12, "Must be exactly 10 digits"),
  mPin: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(4, 'Must be exactly 4 digits')
    .max(4, 'Must be exactly 4 digits')
    .required("MPin is required")
});

export const _otpInitial = {
  code1: "",
  code2: "",
  code3: "",
  code4: "",
};

export const _otpValidate = yup.object().shape({
  code1: yup.string().required(),
  code2: yup.string().required(),
  code3: yup.string().required(),
  code4: yup.string().required(),
});
