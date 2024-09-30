import * as yup from "yup";

export const _initialValues = {
  favicon: [],
  siteLogo: [],
  siteMiniLogo: [],
  sitePreloader: [],
  siteTitle: "",
  siteAuthorName: "",
  loginImage: [],
  siteDescription: "",
  siteKeyword: "",
};

export const AdminValidate = yup.object().shape({
  favicon: yup.array().min(1, "Field is required"),
  siteLogo: yup.array().min(1, "Field is required"),
  siteMiniLogo: yup.array().min(1, "Field is required"),
  sitePreloader: yup.array().min(1, "Field is required"),
  siteTitle: yup.string().required("Field is required"),
  siteAuthorName: yup.string().required("Field is required"),
  loginImage: yup.array().min(1, "Field is required"),
  siteDescription: yup.string().required("Field is required"),
  siteKeyword: yup.string().required("Field is required"),
});
