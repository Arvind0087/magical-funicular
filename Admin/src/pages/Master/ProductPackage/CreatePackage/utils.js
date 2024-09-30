import * as yup from "yup";

export const _initial = {
  course: "",
  boards: "",
  class: "",
  batch: "",
  type: "",
  addressForm: "",
  packageTitle: "",
  thumbnail: [],
  brochure: [],
  sod: "",
  eod: "",
  price: "",
  sprice: "",
  packageDesc: "",
  // packageduration: "",
  list: [{ list: "" }],
  videoTitle: "",
  invoiceTitle: "",
  delivery: "",
};

export const _validate = yup.object().shape({
  course: yup.string().required("Field is required"),
  boards: yup.string().required("Field is required"),
  class: yup.string().required("Field is required"),
  batch: yup.string().required("Field is required"),
  type: yup.string().required("Field is required"),
  sod: yup.string().required("Field is required"),
  eod: yup.string().when("type", {
    is: "Live",
    then: yup.string().required("Field is required"),
    otherwise: yup.string(),
  }),
  packageTitle: yup.string().required("Field is required"),
  price: yup.string().required("Field is required"),
  sprice: yup.string().required("Field is required"),
  // sprice: yup
  //   .number()
  //   .typeError("Field must be a number")
  //   .required("Field is required"),
  // packageduration: yup.string().required("Field is required"),
  // packageDesc: yup.string().required("Field is required"),
  thumbnail: yup.array().min(1, "Field is required"),
  // delivery: yup.array().min(1, "Field is required"),
  // brochure: yup.array().min(1, "Field is required"),
  // list: yup.array().of(
  //   yup.object({
  //     list: yup.string().required(),
  //   })
  // ),
});
