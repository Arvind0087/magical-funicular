import { Helmet } from "react-helmet-async";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Box, Link, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { PATH_AUTH } from "routes/paths";
import Iconify from "components/iconify/Iconify";
import SentIcon from "assets/icons/SentIcon";
import { updateAdminPasswordAsync } from "redux/slices/otpslice/otp.async";
import { toastoptions } from "utils/toastoptions";
import { emptyotp } from "redux/slices/otpslice/otp.slice";

export default function NewPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { otpLoader, passwordupdate } = useSelector((state) => state.otp);

  const onSubmit = async (values) => {
    dispatch(
      updateAdminPasswordAsync({
        token: location.state.token,
        password: values.password,
      })
    );
  };

  useEffect(() => {
    if (location.state === null) {
      navigate("/auth/reset-password");
    } else if (!location.state.verified || !location.state.token) {
      navigate("/auth/reset-password");
    }
  }, [location]);

  useEffect(() => {
    if (passwordupdate.status === 200) {
      toast.success(passwordupdate.message, toastoptions);
      formik.resetForm();
      dispatch(emptyotp());
      navigate("/auth/login");
    }
  }, [passwordupdate]);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit,
    validationSchema: yup.object().shape({
      password: yup.string().required().min(8, "Must be Minimum 8 charcters"),
      confirmPassword: yup
        .string()
        .required("Confirm Password is required")
        .oneOf([yup.ref("password"), null], "Passwords Not match"),
    }),
  }); // FOMRIK

  return (
    <>
      <Helmet>
        <title> New Password | Minimal UI</title>
      </Helmet>
      <SentIcon sx={{ mb: 5, height: 96 }} />
      <Typography variant="h5" paragraph>
        Enter New Password
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            mx: "20px",
          }}
        >
          <TextField
            fullWidth
            size="large"
            label="Password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            error={Boolean(formik.touched.password && formik.errors.password)}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            size="large"
            name="confirmPassword"
            type="password"
            sx={{
              mt: 2,
            }}
            onChange={formik.handleChange}
            error={Boolean(
              formik.touched.confirmPassword && formik.errors.confirmPassword
            )}
          />
          {formik.touched.password && formik.errors.password ? (
            <Typography
              variant="boy1"
              sx={{
                color: "red",
                fontSize: "12px",
              }}
            >
              {formik.errors.password}
            </Typography>
          ) : formik.touched.confirmPassword &&
            formik.errors.confirmPassword ? (
            <Typography
              variant="boy1"
              sx={{
                color: "red",
                fontSize: "12px",
              }}
            >
              {formik.errors.confirmPassword}
            </Typography>
          ) : null}

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            loading={otpLoader}
          >
            Update Password
          </LoadingButton>
        </Box>
      </form>

      <Link
        to={PATH_AUTH.login}
        component={RouterLink}
        color="inherit"
        variant="subtitle2"
        sx={{
          mx: "auto",
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        <Iconify icon="eva:chevron-left-fill" width={16} sx={{ my: 3 }} />
        Return to sign in
      </Link>
    </>
  );
}
