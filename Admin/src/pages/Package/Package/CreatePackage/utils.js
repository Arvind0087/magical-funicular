import * as yup from "yup";

export const _initialValues = {
  courseId: "",
  name: "",
  startingPrice: "",
  tag: "",
  list: [{ list: "" }],
  packageType: "",
};

export const _validation = yup.object().shape({
  courseId: yup.string().required("Field is required"),
  name: yup.string().required("Field is required"),
  tag: yup.string().required("Field is required"),
  startingPrice: yup.string().required("Field is required"),
  packageType: yup.string().required("Field is required"),
  list: yup.array().of(
    yup.object({
      list: yup.string().required(),
    })
  ),
});

export const _packagetype = [
  // {
  //   label: "Class Based",
  //   value: "Class",
  // },
  {
    label: "Batch Based",
    value: "Batch",
  },
];
