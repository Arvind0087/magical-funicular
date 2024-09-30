import * as yup from "yup";

export const _initial = {
  name: "",
  courseType: "",
  shortDescription: "",
  image: [],
  brochure: [],
  list: [{ list: "" }],
  sequence: "",
};

export const _validation = yup.object().shape({
  name: yup.string().required("Field is required"),
  courseType: yup.string().required("Field is required"),
  shortDescription: yup.string().required("Field is required"),
  image: yup.array().min(1, "Field is required"),
  list: yup.array().of(
    yup.object({
      list: yup.string().required(),
    })
  ),
});

export const courseTypes = [
  { name: "Subscription", label: "Subscription" },
  { name: "Purchase", label: "Purchase" },
];
