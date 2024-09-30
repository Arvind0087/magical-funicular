import { Helmet } from "react-helmet-async";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { LoadingButton } from "@mui/lab";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { firebaseConfig } from "../../firebase";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
// import { getToken } from "firebase/messaging";
import {
  _mPinLoginInitial,
  _mPinLoginValidate,
  _otpInitial,
  _otpValidate,
  _phoneInitial,
  _phoneValidate,
} from "./utils/RegisterUtils";
import LoginLayout from "../../layouts/login/LoginLayout";
import "./RegisterPage.css";
import {
  generateOtpAsync,
  loginSelectedUserAsync,
  loginWithMPinAsync,
  verifyOtpAsync,
} from "../../redux/register/register.async";
import { toast } from "react-hot-toast";
import { toastoptions } from "../../utils/toastoptions";
import {
  emptyregister,
  SystemToken,
} from "../../redux/register/register.slice";
import Modal from "@mui/material/Modal";
import { getStudentByIdAsync } from "../../redux/async.api";
import { reduxSetUserLoggedInInfo } from "../../redux/loggedInInfo/loggedIn.slice";
import { PATH_AUTH } from "../../routes/paths";
import { setDeviceToken } from "redux/slices/notification.slice";

export default function RegisterPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOTP, setIsOTP] = useState(false);
  const [isMpinLogin, setIsMpinLogin] = useState(false);
  const [isOTPNumber, setIsOTPNumber] = useState("");
  const [isPhone, setIsPhone] = useState("");
  const [userModal, setUserModal] = useState(false);
  const [systemToken, setSystemToken] = useState("");
  const {
    registerLoader,
    register,
    otpVerifyResponce = {},
    IdWithLogin,
    mPinResponce = {},
    mPinLoader,
  } = useSelector((state) => state.register);
  const { getOnlySiteSettingLoader, getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { siteLogo, siteAuthorName, favicon, siteTitle } =
    getOnlySiteSettingData;

  // async function requestPermission() {
  //   const permission = await Notification.requestPermission()
  //   if (permission === 'granted') {
  //     const app = initializeApp(firebaseConfig);
  //     const messaging = getMessaging(app);

  //     const systemToken = await getToken(messaging, { vapidKey: process.env.VAPI_KEY
  //      });
  //     dispatch(setDeviceToken(systemToken));
  //     setSystemToken(systemToken)
  //     console.log('systemToken', systemToken)
  //   } else if (permission === 'denied') {
  //     alert('You denied the permission');
  //   }
  // }

  async function requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const app = initializeApp(firebaseConfig);
        const messaging = getMessaging(app);
        const systemToken = await getToken(messaging, {
          vapidKey: process.env.VAPI_KEY,
        });
        dispatch(setDeviceToken(systemToken));
        setSystemToken(systemToken);
      } else if (permission === "denied") {
        alert("You denied the permission");
      }
    } catch (error) {
      // Handle any errors that occur during the execution of the code
      // Perform appropriate error handling, such as logging or showing a user-friendly error message
      // Example: alert('An error occurred: ' + error.message);
    }
  }

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    dispatch(setDeviceToken(systemToken));
  }, [systemToken]);

  const onSubmit = async (values) => {
    if (!isOTP) {
      setIsPhone(values.phone);
      const phoneNoIs = values.phone.substring(2);
      if (isMpinLogin) {
        const payload = {
          ...values,
          phone: phoneNoIs,
          deviceType: "Web",
          deviceToken: systemToken,
        };
        dispatch(loginWithMPinAsync(payload)).then((res) => {
          if (!res?.payload?.registeredUser && res?.payload?.status !== 200) {
            dispatch(
              generateOtpAsync({
                phone: phoneNoIs,
              })
            );
          }
        });
      } else {
        dispatch(
          generateOtpAsync({
            phone: phoneNoIs,
          })
        );
      }
    } else {
      const otpIs =
        "" + values.code1 + values.code2 + values.code3 + values.code4;
      dispatch(
        verifyOtpAsync({
          phone: isPhone.substring(2),
          otp: otpIs,
          deviceType: "Web",
          deviceToken: systemToken,
        })
      );
    }
  };

  const formik = useFormik({
    initialValues: isOTP
      ? _otpInitial
      : isMpinLogin
      ? _mPinLoginInitial
      : _phoneInitial,
    onSubmit,
    validationSchema: isOTP
      ? _otpValidate
      : isMpinLogin
      ? _mPinLoginValidate
      : _phoneValidate,
  });

  useEffect(() => {
    if (register.status === 200) {
      toast.success(register.message, toastoptions);
      // setIsOTPNumber(register.data);
      setIsOTP(true);
      dispatch(emptyregister());
    }
    if (otpVerifyResponce?.status === 200) {
      toast.success(otpVerifyResponce?.message, toastoptions);
      if (otpVerifyResponce?.loginStatus) {
        if (otpVerifyResponce?.data) {
          if (otpVerifyResponce?.data.length > 0) {
            setUserModal(true);
          }
        } else if (otpVerifyResponce?.accessToken) {
          localStorage.setItem(
            "auth",
            JSON.stringify({
              accessToken: otpVerifyResponce?.accessToken,
              userId: otpVerifyResponce?.userId,
            })
          );
          dispatch(
            reduxSetUserLoggedInInfo({
              accessToken: otpVerifyResponce?.accessToken,
              userId: otpVerifyResponce?.userId,
              loginStatus: otpVerifyResponce?.loginStatus,
            })
          );
          dispatch(emptyregister());
          const payload = {
            userId: otpVerifyResponce?.userId,
            batchTypeId: "",
          };
          dispatch(getStudentByIdAsync(payload)); // for display all users
          navigate("/app/dashboard");
        }
      } else {
        dispatch(
          reduxSetUserLoggedInInfo({
            accessToken: otpVerifyResponce?.accessToken,
            userId: 0,
            loginStatus: otpVerifyResponce?.loginStatus,
          })
        );
        dispatch(emptyregister());
        navigate("/auth/create-account", {
          state: {
            phone: isPhone,
          },
        });
      }
    }
  }, [register, otpVerifyResponce]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleSelectUser = (ev) => {
    dispatch(
      loginSelectedUserAsync({
        userId: ev.id,
        studentType: ev.studentType,
        deviceType: "Web",
        deviceToken: systemToken,
      })
    );
  };

  useEffect(() => {
    if (IdWithLogin.status === 200) {
      toast.success(IdWithLogin.message, toastoptions);
      dispatch(
        reduxSetUserLoggedInInfo({
          accessToken: IdWithLogin.accessToken,
          userId: IdWithLogin.data,
          loginStatus: IdWithLogin?.loginStatus,
        })
      );
      const payload = {
        userId: IdWithLogin.data,
        batchTypeId: "",
      };
      dispatch(getStudentByIdAsync(payload)); // for display all users
      dispatch(emptyregister());
      navigate(PATH_AUTH.base);
    }
  }, [IdWithLogin]);

  // for MPin Login
  useEffect(() => {
    if (mPinResponce.status === 200) {
      toast.success(mPinResponce.message, toastoptions);
      dispatch(
        reduxSetUserLoggedInInfo({
          accessToken: mPinResponce?.data?.accessToken,
          userId: mPinResponce?.data?.Id,
          loginStatus: mPinResponce?.data?.loginStatus,
        })
      );
      const payload = {
        userId: mPinResponce?.data?.Id,
        batchTypeId: "",
      };
      dispatch(getStudentByIdAsync(payload)); // for display all users
      dispatch(emptyregister());
      navigate(PATH_AUTH.base);
    }
  }, [mPinResponce]);

  return (
    <>
      <Helmet>
        <title> Register | {`${siteTitle}`}</title>
      </Helmet>
      <LoginLayout title="Manage the job more effectively with Minimal">
        {!isOTP ? (
          <>
            <Stack spacing={2} sx={{ mb: 3, position: "relative" }}>
              <Typography
                variant="h3"
                sx={{
                  [theme.breakpoints.down("sm")]: {
                    textAlign: "center",
                    fontSize: "26px",
                  },
                }}
              >
                Get started
              </Typography>
            </Stack>
            <span>Mobile Number</span>
          </>
        ) : (
          <>
            <Stack spacing={2} sx={{ mb: 2.5, position: "relative" }}>
              <ArrowBackIcon
                onClick={() => setIsOTP(false)}
                sx={{
                  cursor: "pointer",
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  [theme.breakpoints.down("md")]: {
                    textAlign: "center",
                    fontSize: "28px",
                  },
                  [theme.breakpoints.down("sm")]: {
                    textAlign: "center",
                    fontSize: "24px",
                  },
                }}
              >
                Enter OTP for Verification
              </Typography>
            </Stack>
            <Typography
              component="div"
              sx={{
                [theme.breakpoints.down("md")]: {
                  textAlign: "center",
                },
              }}
            >
              OTP sent to
              <Box
                fontWeight="fontWeightMedium"
                component="span"
                sx={{
                  px: "5px",
                }}
              >
                {isPhone}
              </Box>
              <Box
                component="span"
                sx={{ cursor: "pointer", color: "primary.main" }}
                onClick={() => {
                  setIsOTP(false);
                }}
              >
                edit
              </Box>
            </Typography>
          </>
        )}

        <form onSubmit={formik.handleSubmit}>
          {!isOTP ? (
            <>
              <FormControl
                error={Boolean(formik.touched.phone && formik.errors.phone)}
                sx={{ width: "100%" }}
              >
                <PhoneInput
                  className="number-input reg-phone"
                  country={"in"}
                  name="phone"
                  id="phone"
                  label="Phone Number"
                  onlyCountries={["in"]}
                  countryCodeEditable={false}
                  fullWidth
                  sx={{
                    marginTop: "15px",
                  }}
                  {...formik.getFieldProps("phone")}
                  onChange={(e) => {
                    formik.setFieldValue("phone", e);
                  }}
                  // error={
                  //   Boolean(formik.touched.phone &&
                  //     formik.errors.phone)
                  // }
                  // helperText={
                  //   formik.touched.phone &&
                  //   formik.errors.phone
                  // }
                />
                {formik.touched.phone && formik.errors.phone ? (
                  <div
                    className="text-danger text-right"
                    style={{
                      color: "#FF5630",
                      marginLeft: "10px",
                      marginBottom: "-13px",
                      fontSize: "12px",
                      fontWeight: 400,
                    }}
                  >
                    {formik.errors.phone}
                  </div>
                ) : null}
              </FormControl>

              {isMpinLogin && (
                <FormControl
                  fullWidth
                  error={Boolean(formik.touched.mPin && formik.errors.mPin)}
                  sx={{ height: "80px", mt: 2 }}
                >
                  <span>MPin</span>
                  <TextField
                    name="mPin"
                    fullWidth
                    InputProps={{
                      sx: {
                        height: "45px",
                        [theme.breakpoints.down("sm")]: {
                          height: "45px",
                        },
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Enter 4 Digit mPin">
                            <ErrorOutlineIcon sx={{ cursor: "pointer" }} />
                          </Tooltip>
                        </InputAdornment>
                      ),
                      minLength: 4,
                    }}
                    inputProps={{
                      maxLength: 4,
                    }}
                    {...formik.getFieldProps("mPin")}
                    onChange={formik.handleChange}
                    value={formik.values.mPin}
                    // error={
                    //   Boolean(formik.touched.mPin &&
                    //   formik.errors.mPin)
                    // }
                    // helperText={
                    //   formik.touched.mPin &&
                    //   formik.errors.mPin
                    // }
                  />
                  {formik.touched.mPin && formik.errors.mPin ? (
                    <div
                      className="text-danger text-right"
                      style={{
                        color: "#FF5630",
                        marginLeft: "10px",
                        marginBottom: "-13px",
                        fontSize: "12px",
                        fontWeight: 400,
                      }}
                    >
                      {formik.errors.mPin}
                    </div>
                  ) : null}
                </FormControl>
              )}

              <Typography
                component="div"
                sx={{
                  color: "text.secondary",
                  my: 1,
                  typography: "caption",
                  textAlign: "center",
                  fontSize: "11px",
                }}
              >
                {"By continuing, you agree to our "}
                <Link to={"/"} style={{ textDecoration: "none" }}>
                  Terms of Service
                </Link>
                {" and "}
                <Link to={"/"} style={{ textDecoration: "none" }}>
                  Privacy Policy
                </Link>
                {/* <Link style={{ textDecoration: "none" }}>Terms of Service</Link>
                {" and "}
                <Link style={{ textDecoration: "none" }}>Privacy Policy</Link>. */}
              </Typography>

              {!isMpinLogin && (
                <>
                  <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{
                      borderRadius: "60px",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "10px 36px",
                      height: "44px",
                      width: "100%",
                      color: "#ffff",
                      [theme.breakpoints.down("sm")]: {
                        width: "100%",
                      },
                    }}
                    loading={registerLoader}
                  >
                    Send OTP
                  </LoadingButton>

                  <LoadingButton
                    fullWidth
                    size="large"
                    type="button"
                    variant="outlined"
                    onClick={() => setIsMpinLogin(true)}
                    sx={{
                      mt: 2,
                      borderRadius: "60px",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "10px 36px",
                      height: "44px",
                      width: "100%",
                      [theme.breakpoints.down("sm")]: {
                        width: "100%",
                      },
                    }}
                  >
                    Login using 4 digit MPin
                  </LoadingButton>
                </>
              )}

              {isMpinLogin && (
                <>
                  <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{
                      borderRadius: "60px",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "10px 36px",
                      height: "44px",
                      width: "100%",
                      color: "#ffff",
                      [theme.breakpoints.down("sm")]: {
                        width: "100%",
                      },
                    }}
                    loading={mPinLoader}
                  >
                    Login using 4 digit MPin
                  </LoadingButton>

                  <LoadingButton
                    fullWidth
                    size="large"
                    type="button"
                    variant="outlined"
                    onClick={() => setIsMpinLogin(false)}
                    sx={{
                      mt: 2,
                      borderRadius: "60px",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "10px 36px",
                      height: "44px",
                      width: "100%",
                      [theme.breakpoints.down("sm")]: {
                        width: "100%",
                      },
                    }}
                  >
                    Login using OTP
                  </LoadingButton>
                </>
              )}
            </>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                  mt: 2,
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
                        name={name}
                        onFocus={(event) => event.currentTarget.select()}
                        InputProps={{
                          sx: {
                            width: { xs: 36, sm: 56 },
                            height: { xs: 36, sm: 56 },
                            backgroundColor: "primary.main",
                            borderRadius: "22px",
                            border: "0px ",
                            color: "white",
                            "& input": { p: 0, textAlign: "center" },
                          },
                        }}
                        inputProps={{
                          maxLength: 1,
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
                sx={{
                  borderRadius: "60px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px 36px",
                  height: "44px",
                  width: "100%",
                  color: "#ffff",
                  [theme.breakpoints.down("sm")]: {
                    width: "100%",
                  },
                }}
                loading={registerLoader}
              >
                Verify OTP
              </LoadingButton>
            </>
          )}
        </form>
      </LoginLayout>

      <Modal open={userModal} onClose={() => setUserModal(false)}>
        <Box sx={style}>
          <Grid container>
            {otpVerifyResponce?.data?.map((item, index) => (
              <Grid
                item
                key={index}
                md={4}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  cursor: "pointer",
                  alignItems: "center",
                }}
                onClick={() => handleSelectUser(item)}
              >
                <img
                  src="https://cdn.landesa.org/wp-content/uploads/default-user-image.png"
                  alt=""
                  style={{ borderRadius: "50%", width: "50px" }}
                />
                <Typography
                  sx={{ textAlign: "center" }}
                  nowrap
                  title={item?.name}
                >
                  {item?.name}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Modal>
    </>
  );
}
