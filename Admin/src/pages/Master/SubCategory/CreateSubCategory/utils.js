import * as yup from "yup";

export const _initial = {
  subCategory: "",
  categoryId: "",
};

export const _validation = yup.object().shape({
  subCategory: yup.string().required(),
  categoryId: yup.string().required(),
});
