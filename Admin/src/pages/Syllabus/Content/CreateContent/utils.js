import * as yup from "yup";

export const _initial = {
  courseId: {},
  boardId: {},
  classId: [],
  batchTypeId: [],
  subjectId: [],
  chapterId: [],
  topicId: [],
  tag: "",
  thumbnail: [],
  source: "",
  sourceURL: "",
  sourceFile: [],
  resources: [],
  helpingResourceType: '',
  videoSeq:"",
};

export const _validate = yup.object().shape({
  tag: yup.string().required(),
  videoSeq: yup.string().required(),
  source: yup.string().required(),
  thumbnail: yup.array().min(1, "Required"),
  sourceURL: yup.string().when("source", {
    is: (ev) => ev !== "upload",
    then: yup.string().required(),
    otherwise: yup.string(),
  }),
  sourceFile: yup.array().when("source", {
    is: (ev) => ev === "upload",
    then: yup.array().min(1),
    otherwise: yup.array(),
  }),
  // resources: yup.array().min(1, "Required"),
  topicId: yup.array().min(1, "Required"),
  courseId: yup.object({
    label: yup.string().required(),
  }),
  boardId: yup.object({
    label: yup.string().required(),
  }),
  classId: yup.array().min(1, "Required"),
  batchTypeId: yup.array().min(1, "Required"),
  subjectId: yup.array().min(1, "Required"),
  chapterId: yup.array().min(1, "Required"),
  // helpingResourceType: yup.object({
  //   label: yup.string().required(),
  // }),
});

export const _validateAllClass = yup.object().shape({
  courseId: yup.object({
    label: yup.string().required(),
  }),
  boardId: yup.object({
    label: yup.string().required(),
  }),
  classId: yup.array().min(1, "Required"),
  tag: yup.string().required(),
  source: yup.string().required(),
  sourceFile: yup.array().when("source", {
    is: (ev) => ev === "upload",
    then: yup.array().min(1),
    otherwise: yup.array(),
  }),
  sourceURL: yup.string().when("source", {
    is: (ev) => ev !== "upload",
    then: yup.string().required(),
    otherwise: yup.string(),
  }),
  thumbnail: yup.array().min(1, "Required"),
  // resources: yup.array().min(1, "Required"),
  // helpingResourceType: yup.object({
  //   label: yup.string().required(),
  // }),
});
export const _validateAllBatch = yup.object().shape({
  courseId: yup.object({
    label: yup.string().required(),
  }),
  boardId: yup.object({
    label: yup.string().required(),
  }),
  classId: yup.array().min(1, "Required"),
  batchTypeId: yup.array().min(1, "Required"),
  tag: yup.string().required(),
  source: yup.string().required(),
  sourceFile: yup.array().when("source", {
    is: (ev) => ev === "upload",
    then: yup.array().min(1),
    otherwise: yup.array(),
  }),
  sourceURL: yup.string().when("source", {
    is: (ev) => ev !== "upload",
    then: yup.string().required(),
    otherwise: yup.string(),
  }),
  thumbnail: yup.array().min(1, "Required"),
  // resources: yup.array().min(1, "Required"),
  // helpingResourceType: yup.object({
  //   label: yup.string().required(),
  // }),
});
export const _validateAllSubject = yup.object().shape({
  courseId: yup.object({
    label: yup.string().required(),
  }),
  boardId: yup.object({
    label: yup.string().required(),
  }),
  classId: yup.array().min(1, "Required"),
  batchTypeId: yup.array().min(1, "Required"),
  subjectId: yup.array().min(1, "Required"),
  tag: yup.string().required(),
  source: yup.string().required(),
  sourceFile: yup.array().when("source", {
    is: (ev) => ev === "upload",
    then: yup.array().min(1),
    otherwise: yup.array(),
  }),
  sourceURL: yup.string().when("source", {
    is: (ev) => ev !== "upload",
    then: yup.string().required(),
    otherwise: yup.string(),
  }),
  thumbnail: yup.array().min(1, "Required"),
  // resources: yup.array().min(1, "Required"),
  // helpingResourceType: yup.object({
  //   label: yup.string().required(),
  // }),
});
export const _validateAllChapter = yup.object().shape({
  courseId: yup.object({
    label: yup.string().required(),
  }),
  boardId: yup.object({
    label: yup.string().required(),
  }),
  classId: yup.array().min(1, "Required"),
  batchTypeId: yup.array().min(1, "Required"),
  subjectId: yup.array().min(1, "Required"),
  chapterId: yup.array().min(1, "Required"),
  tag: yup.string().required(),
  source: yup.string().required(),
  sourceFile: yup.array().when("source", {
    is: (ev) => ev === "upload",
    then: yup.array().min(1),
    otherwise: yup.array(),
  }),
  sourceURL: yup.string().when("source", {
    is: (ev) => ev !== "upload",
    then: yup.string().required(),
    otherwise: yup.string(),
  }),
  thumbnail: yup.array().min(1, "Required"),
  // resources: yup.array().min(1, "Required"),
  // helpingResourceType: yup.object({
  //   label: yup.string().required(),
  // }),
});
export const _validateAllTopic = yup.object().shape({
  courseId: yup.object({
    label: yup.string().required(),
  }),
  boardId: yup.object({
    label: yup.string().required(),
  }),
  classId: yup.array().min(1, "Required"),
  batchTypeId: yup.array().min(1, "Required"),
  subjectId: yup.array().min(1, "Required"),
  chapterId: yup.array().min(1, "Required"),
  topicId: yup.array().min(1, "Required"),
  tag: yup.string().required(),
  source: yup.string().required(),
  sourceFile: yup.array().when("source", {
    is: (ev) => ev === "upload",
    then: yup.array().min(1),
    otherwise: yup.array(),
  }),
  sourceURL: yup.string().when("source", {
    is: (ev) => ev !== "upload",
    then: yup.string().required(),
    otherwise: yup.string(),
  }),
  thumbnail: yup.array().min(1, "Required"),
  // resources: yup.array().min(1, "Required"),
  // helpingResourceType: yup.object({
  //   label: yup.string().required(),
  // }),
});




































export const _topic = [
  {
    value: "youtube",
    label: "Youtube",
  },
  // {
  //   value: "vimeo",
  //   label: "Vimeo",
  //   disabled: true,
  // },
  {
    value: "upload",
    label: "Upload",
    // disabled: true,
  },
  {
    value: "gallerymanager",
    label: "Gallery Manager",
    // disabled: true,
  },
];

export const _tag = [
  {
    value: "Learning Content",
    label: "Learning Content",
  },
  {
    value: "Recorded Live Session",
    label: "Recorded Live Session",
  },
  {
    value: "Help Resource",
    label: "Help Resource",
  },
];


export const helpContentType = [
  {
    value: "image",
    label: "Image"
  },
  // {
  //   value: "video",
  //   label: "Video"
  // },
  {
    value: "pdf",
    label: "PDF"
  },
  // {
  //   value: "doc",
  //   label: "DOC"
  // },
];