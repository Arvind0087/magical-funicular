import { Helmet } from "react-helmet-async";
import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Link,
  Container
} from "@mui/material";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import LoginLayout from "layouts/login/LoginLayout";
import { getloginAsync } from "redux/async.api";
import { toastoptions } from "utils/toastoptions";
import { emptylogin } from "redux/slices/login.slice";
import Iconify from "components/iconify/Iconify";
import { PATH_AUTH, PATH_DASHBOARD } from "routes/paths";
import { getMenuAsync } from "redux/slices/permission/permission.async";
import { useSettingsContext } from "components/settings";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  const [showPassword, setShowPassword] = useState(false);
  const { adminSetting } = useSelector((state) => state.admin);
  const { permissionLoader, menusPermission } = useSelector(
    (state) => state.permission
  );

  const { loginLoader, login, loginError } = useSelector(
    (state) => state.login
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

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
      localStorage.setItem("auth", JSON.stringify(login.data));
      toast.success(login.message, toastoptions);
      dispatch(getMenuAsync(login.data.id)).then((ev) => {
        if (ev.payload.status === 200) {
          localStorage.setItem(
            "auth",
            JSON.stringify({
              ...login.data,
              route: ev.payload.data,
            })
          );
          navigate(PATH_DASHBOARD.app);
        }
      });
      dispatch(emptylogin());
    }
  }, [login, loginError]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit,
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .email("Invalid Email Address")
        .required("Field is required"),
      password: yup
        .string()
        .required("Field is required")
        .min(8, "Must be Minimum 8 charecters"),
    }),
  }); // FOMRIK

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Login | {`${tabTitle}`}</title>
      </Helmet>

      <LoginLayout>
        <Stack spacing={2} sx={{ mb: 2, position: "relative" }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
            }}
          >
            {adminSetting?.siteTitle}
          </Typography>
        </Stack>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            type="email"
            name="email"
            label="Email Address"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{
              marginTop: "15px",
            }}
            {...formik.getFieldProps("email")}
            onChange={formik.handleChange}
            error={Boolean(formik.touched.email && formik.errors.email)}
          />
          <TextField
            type={showPassword ? "text" : "password"}
            name="password"
            label="Password"
            fullWidth
            InputLabelProps={{ shrink: true }}
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
            error={Boolean(formik.touched.password && formik.errors.password)}
          />
          <Stack alignItems="flex-end" sx={{ my: 2 }}>
            <Link
              to={PATH_AUTH.resetPassword}
              component={RouterLink}
              variant="body2"
              color="inherit"
              underline="always"
            >
              Forgot password?
            </Link>
          </Stack>
          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={loginLoader || permissionLoader}
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
            }}
          >
            Login
          </LoadingButton>
        </form>
      </LoginLayout>
    </Container>
  );
}
