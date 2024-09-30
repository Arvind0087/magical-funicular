import * as yup from "yup";

export const _initialValues = {
  name: '',
  dob: '',
  gender: '',
  pinCode: '',
  mPin:'',
  recommendReferralCode:'',
  batchStartDateId:'',
  courseId: '',
  boardId: '',
  batchTypeId: '',
  classId: '',
};

export const BasicDetailsValidate = yup.object().shape({
  name: yup
    .string()
    .required("Name is required"),
  dob: yup
    .string()
    .required("Date of Birth is required")
  ,
  gender: yup
    .string()
    .required("Gender is required"),
  pinCode: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .required("Pincode is required")
    .min(6,'Must be exactly 6 digits')
    .max(6, 'Must be exactly 6 digits'),
  mPin: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(4, 'Must be exactly 4 digits')
    .max(4, 'Must be exactly 4 digits')
    .required("MPin is required") 
});

