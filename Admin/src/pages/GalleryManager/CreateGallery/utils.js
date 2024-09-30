import * as yup from "yup";

export const _initial = {
  file: [],
  source: "",
  list: [{ list: "" }],
};

export const _validate = yup.object().shape({
  source: yup.string().required("Field is required"),
  list: yup.array().when("source", {
    is: (ev) => ev === "URL",
    then: yup.array().of(
      yup.object({
        list: yup.string().required(),
      })
    ),
    otherwise: yup.array(),
  }),
  file: yup.array().when("source", {
    is: (ev) => ev === "File",
    then: yup.array().min(1, "Field is required"),
    otherwise: yup.array(),
  }),
});

export const _source = [
  {
    label: "File",
    value: "File",
  },
  {
    label: "URL",
    value: "URL",
  },
];
