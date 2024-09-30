import * as yup from "yup";

export const _initialValues = {
  BookmarkedVideos: [],
  BookmarkedQuestions: [],
  DownloadedVideos: []
};

export const AdminValidate = yup.object().shape({
  BookmarkedVideos: yup.array().min(1, "Field is required"),
  BookmarkedQuestions: yup.array().min(1, "Field is required"),
  DownloadedVideos: yup.array().min(1, "Field is required")
});
