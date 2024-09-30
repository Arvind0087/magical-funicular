import * as yup from "yup";

export const _initial = {
  month: "",
  SubscriptionType: ""
};

export const _validation = yup.object().shape({
  SubscriptionType: yup.string().required("Field is required"),

  SubscriptionType: yup.string().when("Free", {
    is: (ev) => ev === "Free",
    then: yup.array().of(
      yup.object({
        days: yup.string().required()
      })
    ),
    otherwise: yup.string()
  })
});
