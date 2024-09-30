import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import  IconButton from "@mui/material/IconButton";
import  InputAdornment from "@mui/material/InputAdornment";
import  Stack from "@mui/material/Stack";
import  TextField from "@mui/material/TextField";
import  Typography from "@mui/material/Typography";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import LoginLayout from "../../layouts/login/LoginLayout";
import Iconify from "../../components/iconify";
import { getloginAsync } from "../../redux/async.api";
import { toast } from "react-hot-toast";
import { toastoptions } from "../../utils/toastoptions";
import { emptylogin } from "../../redux/slices/login.slice";
import { LoginValidate, _initialValues } from "./utils/loginutils";
import "./LoginPage.css";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { loginLoader, login, loginError } = useSelector(
    (state) => state.login
  );

  const onSubmit = async (values) => {
    dispatch(
      getloginAsync({
        email: values.email,
        password: values.password,
      })
    );
  };

  useEffect(() => {
    if (login.status === 200) {
      toast.success(login.message, toastoptions);
      dispatch(emptylogin());
      navigate("/app/dashboard");
    }
  }, [login, loginError]);

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: LoginValidate,
  }); // FOMRIK

  return (
    <>
      {/* <Helmet>
        <title>Login | Lecture Dekho</title>
      </Helmet> */}

      <LoginLayout>
        <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
            }}
          >
            Sign in to Veda Academy
          </Typography>
        </Stack>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            type="email"
            name="email"
            label="Email address"
            fullWidth
            sx={{
              marginTop: "15px",
            }}
            {...formik.getFieldProps("email")}
            onChange={formik.handleChange}
          />
          {formik.touched.email && formik.errors.email && (
            <small className="formikerror">{formik.errors.email}</small>
          )}
          <TextField
            type={showPassword ? "text" : "password"}
            name="password"
            label="Password"
            fullWidth
            sx={{
              marginTop: "15px",
            }}
            {...formik.getFieldProps("password")}
            onChange={formik.handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    <Iconify
                      icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {formik.touched.password && formik.errors.password && (
            <small className="formikerror">{formik.errors.password}</small>
          )}
          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={loginLoader}
            sx={{
              bgcolor: "text.primary",
              color: (theme) =>
                theme.palette.mode === "light" ? "common.white" : "grey.800",
              "&:hover": {
                bgcolor: "text.primary",
                color: (theme) =>
                  theme.palette.mode === "light" ? "common.white" : "grey.800",
              },
              marginTop: "15px",
              borderRadius:"30px"
            }}
          >
            Login
          </LoadingButton>
        </form>
      </LoginLayout>
    </>
  );
}
