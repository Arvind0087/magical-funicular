import * as yup from "yup";

export const _initial = {
  courseId: "",
  boardId: "",
  classId: "",
  batchTypeId: "",
  name: "",
  description: "",
  discount: "",
  package: "",
  startDate: "",
  endDate: "",
  voucherType: "",
  showVoucher: "",
};

export const _validate = yup.object().shape({
  name: yup.string().required("Field is required"),
  description: yup.string().required("Field is required"),
  courseId: yup.string().required("Field is required"),
  discount: yup.string().required("Field is required"),
  voucherType: yup.string().required("Field is required"),
  package: yup.string().when("voucherType", {
    is: "Package",
    then: yup.string().required("Field is required"),
    otherwise: yup.string().notRequired(),
  }),
  startDate: yup.string().required("Field is required"),
  endDate: yup.string().required("Field is required"),

  // boardId: yup.string().required("Field is required"),
  // classId: yup.string().required("Field is required"),
  // batchTypeId: yup.string().required("Field is required"),
});
