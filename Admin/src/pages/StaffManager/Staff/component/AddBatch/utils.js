import * as yup from "yup";

export const _initial = {
  batchId: [],
  batchStartDateId: [],
  subjectId: []
};

export const _validate = yup.object().shape({
  batchId: yup.array().min(1, "Required"),
  batchStartDateId: yup.array().min(1, "Required"),
  subjectId: yup.array().min(1, "Required"),
});
