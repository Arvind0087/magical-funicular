import { Helmet } from "react-helmet-async";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { PATH_AUTH } from "routes/paths";
import Iconify from "components/iconify/Iconify";
import PasswordIcon from "assets/icons/PasswordIcon";
import { isNumber } from "utils/isNumber/isNumber";
import { generateOtpAsync } from "redux/slices/otpslice/otp.async";
import { toastoptions } from "utils/toastoptions";
import { emptyotp } from "redux/slices/otpslice/otp.slice";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { otpLoader, OTP } = useSelector((state) => state.otp);

  const onSubmit = (values) => {
    let payload;
    if (isNumber(values.value)) {
      payload = {
        phone: values.value,
        type: "admin",
      };
    } else {
      payload = {
        email: values.value,
        type: "admin",
      };
    }
    dispatch(generateOtpAsync(payload));
  };

  useEffect(() => {
    if (OTP.status === 200) {
      toast.success(OTP.message, toastoptions);
      formik.resetForm();
      dispatch(emptyotp());
      navigate("/auth/verify", {
        state: {
          otp: true,
          value: formik.values.value,
        },
      });
    }
  }, [OTP]);

  const formik = useFormik({
    initialValues: {
      value: "",
    },
    onSubmit,
    validationSchema: yup.object().shape({
      value: yup.string().required(),
    }),
  }); // FOMRIK

  return (
    <>
      <Helmet>
        <title> Reset Password | Minimal UI</title>
      </Helmet>
      <PasswordIcon sx={{ mb: 5, height: 96 }} />
      <Typography variant="h3" paragraph>
        Forgot your password?
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 5 }}>
        Please enter the Email Address or Phone Number associated with your
        account and We will send you a link to reset your password.
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          name="value"
          value={formik.values.value}
          label="Email or Phone"
          onChange={formik.handleChange}
          error={Boolean(formik.touched.value && formik.errors.value)}
        />
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          sx={{ mt: 3 }}
          loading={otpLoader}
        >
          Request OTP
        </LoadingButton>
      </form>
      <Link
        to={PATH_AUTH.login}
        component={RouterLink}
        color="inherit"
        variant="subtitle2"
        sx={{
          mt: 3,
          mx: "auto",
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        <Iconify icon="eva:chevron-left-fill" width={16} />
        Return to sign in
      </Link>
    </>
  );
}
