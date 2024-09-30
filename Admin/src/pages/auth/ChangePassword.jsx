import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { Box, TextField, Typography, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { toastoptions } from "utils/toastoptions";
import { emptychangepassword } from "redux/changepassword/changepassword.slice";
import { changeAdminPasswordAsync } from "redux/changepassword/changepassword.async";

export default function ChangePassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { changePasswordLoader, passwordchange } = useSelector(
    (state) => state.changePassword
  );
  const { userinfoloader, userinfo } = useSelector((state) => state.userinfo);

  const onSubmit = async (values) => {
    dispatch(
      changeAdminPasswordAsync({
        token: userinfo.token,
        password: values.password,
      })
    );
  };

  useEffect(() => {
    if (passwordchange.status === 200) {
      toast.success(passwordchange.message, toastoptions);
      formik.resetForm();
      dispatch(emptychangepassword());
      navigate("/app/dashboard");
    }
  }, [passwordchange]);

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
        <title> Change Password | Minimal UI</title>
      </Helmet>

      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "60vh" }}
      >
        <Typography variant="h5" paragraph>
          Change your Password Here !
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              mx: "20px", maxWidth:"600px"
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
              loading={changePasswordLoader}
            >
              Change Password
            </LoadingButton>
          </Box>
        </form>
      </Stack>
    </>
  );
}
