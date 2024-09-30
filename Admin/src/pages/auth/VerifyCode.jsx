import { Helmet } from "react-helmet-async";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Link, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { PATH_AUTH } from "routes/paths";
import Iconify from "components/iconify/Iconify";
import EmailInboxIcon from "assets/icons/EmailInboxIcon";
import {
  generateOtpAsync,
  verifyOtpAsync,
} from "redux/slices/otpslice/otp.async";
import { toastoptions } from "utils/toastoptions";
import { emptyotp } from "redux/slices/otpslice/otp.slice";
import { isNumber } from "utils/isNumber/isNumber";

export default function VerifyCodePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { otpLoader, otpverify, OTP } = useSelector((state) => state.otp);

  const onSubmit = async (values) => {
    let payload;
    if (isNumber(location.state.value)) {
      payload = {
        phone: location.state.value,
        otp: `${values.code1}${values.code2}${values.code3}${values.code4}`,
        type: "admin",
      };
    } else {
      payload = {
        email: location.state.value,
        otp: `${values.code1}${values.code2}${values.code3}${values.code4}`,
        type: "admin",
      };
    }
    dispatch(verifyOtpAsync(payload));
  };

  useEffect(() => {
    if (location.state === null) {
      navigate("/auth/reset-password");
    } else if (!location.state.otp) {
      navigate("/auth/reset-password");
    }
  }, [location]);

  useEffect(() => {
    if (otpverify.status === 200) {
      toast.success(otpverify.message, toastoptions);
      formik.resetForm();
      dispatch(emptyotp());
      navigate("/auth/new-password", {
        state: {
          verified: true,
          token: otpverify.accessToken,
        },
      });
    }
    if (OTP.status === 200) {
      toast.success(OTP.message, toastoptions);
      formik.resetForm();
      dispatch(emptyotp());
    }
  }, [otpverify, OTP]);

  const formik = useFormik({
    initialValues: {
      code1: "",
      code2: "",
      code3: "",
      code4: "",
    },
    onSubmit,
    validationSchema: yup.object().shape({
      code1: yup.string().required(),
      code2: yup.string().required(),
      code3: yup.string().required(),
      code4: yup.string().required(),
    }),
  }); // FOMRIK

  return (
    <>
      <Helmet>
        <title> Verify Code | Minimal UI</title>
      </Helmet>
      <EmailInboxIcon sx={{ mb: 5, height: 96 }} />
      <Typography variant="h5" paragraph>
        Please check your Phone or email!
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 5 }}>
        We have emailed a 4-digit confirmation code to {location?.state?.value}{" "}
        <span
          style={{
            color: "green",
            fontWeight: "600",
            cursor: "pointer",
          }}
          onClick={() => navigate("/auth/reset-password")}
        >
          change
        </span>{" "}
        <br />
        please enter the code in below box to verify.
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            mx: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {["code1", "code2", "code3", "code4"].map((name, index) => {
              const formikValid = {
                code1: formik.touched.code1 && formik.errors.code1,
                code2: formik.touched.code2 && formik.errors.code2,
                code3: formik.touched.code3 && formik.errors.code3,
                code4: formik.touched.code4 && formik.errors.code4,
              };
              return (
                <>
                  <TextField
                    type="number"
                    name={name}
                    onFocus={(event) => event.currentTarget.select()}
                    InputProps={{
                      sx: {
                        width: { xs: 36, sm: 56 },
                        height: { xs: 36, sm: 56 },
                        "& input": { p: 0, textAlign: "center" },
                      },
                    }}
                    onChange={(e) => {
                      formik.handleChange(e);
                      if (
                        e.keyCode !== 8 &&
                        e.target.value.length !== 0 &&
                        index !== 3
                      ) {
                        const nextfield = document.querySelector(
                          `input[name=code${index + 1 + 1}]`
                        );
                        nextfield.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.keyCode === 8 && index !== 0) {
                        if (e.target.value.length === 0) {
                          const prevfield = document.querySelector(
                            `input[name=code${index + 1 - 1}]`
                          );
                          prevfield.focus();
                        }
                      }
                    }}
                    error={Boolean(formikValid[name])}
                  />
                  {index === 3 ? null : (
                    <Typography
                      sx={{
                        display: "block",
                        margin: "auto",
                      }}
                    >
                      -
                    </Typography>
                  )}
                </>
              );
            })}
          </Box>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            sx={{ mt: 3 }}
            loading={otpLoader}
          >
            Verify OTP
          </LoadingButton>
        </Box>
      </form>

      <Typography variant="body2" sx={{ my: 3 }}>
        Don’t have a code? &nbsp;
        <Link
          to="/auth/reset-password"
          component={RouterLink}
          variant="subtitle2"
          sx={{
            cursor: "pointer",
          }}
          onClick={() => {
            let payload;
            if (isNumber(location?.state?.value)) {
              payload = {
                phone: location?.state?.value,
                type: "admin",
              };
            } else {
              payload = {
                email: location?.state?.value,
                type: "admin",
              };
            }
            dispatch(generateOtpAsync(payload));
          }}
        >
          Resend code
        </Link>
      </Typography>

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
        <Iconify icon="eva:chevron-left-fill" width={16} />
        Return to sign in
      </Link>
    </>
  );
}
