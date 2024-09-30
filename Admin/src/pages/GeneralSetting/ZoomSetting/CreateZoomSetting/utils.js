import * as yup from "yup";

export const _initial = {
    name: {},
    zoomApi: "",
    zoomSecret:"",
    authtApi:"",
    authSecret:"",
    
};

export const _validate = yup.object().shape({
    name: yup.object().shape({
        label: yup.string().required("Field is required"),
      }),
    zoomApi: yup.string().required("Field is required"),
    zoomSecret: yup.string().required("Field is required"),
    authtApi: yup.string().required("Field is required"),
    authSecret: yup.string().required("Field is required"),
   
});



