import * as yup from "yup";

export const _initial = {
  courseId: {},
  boardId: {},
  classId: {},
  batchTypeId: {},
  subjectId: {},
  chapterId: {},
  category: {},
  topic: {},
  list: [
    {
      title: "",
      description: "",
      image: [],
    },
  ],
};

export const _validate = yup.object().shape({
  courseId: yup.object({
    label: yup.string().required(),
  }),
  boardId: yup.object({
    label: yup.string().required(),
  }),
  classId: yup.object({
    label: yup.string().required(),
  }),
  batchTypeId: yup.object({
    label: yup.string().required(),
  }),
  subjectId: yup.object({
    label: yup.string().required(),
  }),
  chapterId: yup.object({
    label: yup.string().required(),
  }),
  category: yup.object({
    label: yup.string().required(),
  }),
  topic: yup.object().when("category", {
    is: (ev) => ev.value === "Quick Bites",
    then: yup.object({
      label: yup.string().required(),
    }),
    otherwise: yup.object({
      // label: yup.string(),
    }),
  }),
  list: yup.array().when("category", {
    is: (ev) => ev.value === "Quick Bites",
    then: yup.array().of(
      yup.object({
        title: yup.string().required(),
        description: yup.string().required(),
        image: yup.array().min(1, "Field is required"),
      })
    ),
    otherwise: yup.array(),
  }),
});

export const _topic = [
  {
    label: "Diagram",
    value: "Diagram",
  },
  {
    label: "Definition",
    value: "Definition",
  },
  {
    label: "Application",
    value: "Application",
  },
];

export const _categories = [
  {
    label: "Quick Bites",
    value: "Quick Bites",
  },
  {
    label: "Summary",
    value: "Summary",
  },
  {
    label: "Questions",
    value: "Questions",
  },
];
