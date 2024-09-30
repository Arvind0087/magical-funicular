import * as yup from "yup";

export const _initial = {
  papertype: "",
  papername: "",
  time: "",
};

export const _validate = yup.object().shape({
  papertype: yup.string().required("Field is required"),
  papername: yup.string().required("Field is required"),
  time: yup.string().required("Field is required"),
});

export const _time = [
  {
    value: "00:15:00",
    label: "15 mins",
  },
  {
    value: "00:30:00",
    label: "30 mins",
  },
  {
    value: "00:45:00",
    label: "45 mins",
  },
  {
    value: "01:00:00",
    label: "60 mins",
  },
];

export const _papertype = [
  {
    value: "Trending Tests",
    label: "Trending Tests",
  },
  {
    value: "Test Series",
    label: "Test Series",
  },
  {
    value: "Mock Tests",
    label: "Mock Tests",
  }
];
