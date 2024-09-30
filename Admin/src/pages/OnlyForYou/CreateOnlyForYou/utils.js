import * as yup from "yup";

export const _initialValues = {
  image: [],
  title: "",
  description: "",
  buttonText: "",
  buttonLink:"",
  otherLink: "",
  buttonLinkId:"",
};



export const _validation = yup.object().shape({
  image: yup.array().min(1, "Field is required"),
  title: yup.string().required("Field is required"),
  buttonLinkId: yup.string().required("Field is required"),
  description: yup.string().required("Field is required"),
  buttonText: yup.string().required("Field is required"),
  // buttonLink: yup.string().required("Field is required"),
  otherLink: yup.string().when("type",{
    is: (ev) => ev === "other",
    then:yup.string().required(),
    otherwise: yup.string().nullable()
  }),
  buttonLinkId: yup.string().when("type",{
    is: (ev) => ev === "other",
    then:yup.string().required(),
    otherwise: yup.string()
  }),
});

