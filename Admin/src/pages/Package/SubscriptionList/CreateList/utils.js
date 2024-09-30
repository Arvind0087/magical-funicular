import * as yup from "yup";

export const _initial = {
  packageId: "",
  subscriptionsId: "",
  boardId: "",
  classId: "",
  batchTypeId: "",
  monthlyPrice: "",
  monthlyDiscountedPrice: "",
  realPrice: "",
  courseId: "",
  batchStartDateId: ""
};

export const _validate = yup.object().shape({
  monthlyPrice: yup.string().required("Field is required"),
  packageId: yup.string().required("Field is required"),
  subscriptionsId: yup.string().required("Field is required"),
  boardId: yup.string().required("Field is required"),
  classId: yup.string().required("Field is required"),
  realPrice: yup.string().required("Field is required"),
  monthlyDiscountedPrice: yup.string().required("Field is required"),
  courseId: yup.string().required("Field is required")
});

export const _batchValidate = yup.object().shape({
  batchTypeId: yup.string().required("Field is required"),
  batchStartDateId: yup.string().required("Field is required"),
  monthlyPrice: yup.string().required("Field is required"),
  packageId: yup.string().required("Field is required"),
  subscriptionsId: yup.string().required("Field is required"),
  boardId: yup.string().required("Field is required"),
  classId: yup.string().required("Field is required"),
  realPrice: yup.string().required("Field is required"),
  monthlyDiscountedPrice: yup.string().required("Field is required"),
  courseId: yup.string().required("Field is required")
});
