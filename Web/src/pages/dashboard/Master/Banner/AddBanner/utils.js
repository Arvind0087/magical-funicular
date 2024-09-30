import * as yup from "yup";

export const _initialValues = {
    image: "",
    type: "",
    bannerurl: ""
};


export const bannerValidate = yup.object().shape({
    image: yup
        .string()
        .required("Field is required"),
    type: yup
        .string()
        .required("Field is required"),
    bannerurl: yup
        .string()
        .required("Field is required")
});
