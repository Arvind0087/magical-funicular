import * as yup from "yup";

export const _initialValues = {
    file: [],
};

export const _validation = yup.object().shape({
    file: yup.array().min(1, "Field is required"),
});
