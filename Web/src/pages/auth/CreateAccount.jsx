import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { toast } from "react-hot-toast";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { PATH_AUTH, PATH_DASHBOARD } from "../../routes/paths";
import { showHiddenSection } from "../../redux/slices/completeProfileSlice";
import { userSignupAsync } from "../../redux/register/register.async";
import { toastoptions } from "../../utils/toastoptions";
import { emptyregister } from "../../redux/register/register.slice";
import { getStudentByIdAsync } from "../../redux/async.api";
import { reduxSetUserLoggedInInfo } from "../../redux/loggedInInfo/loggedIn.slice";
import BasicDetails from "./accountsComponents/BasicDetails";
import Account from "./accountsComponents/account";
import LinearWithValueLabel from "./accountsComponents/ProgressBar";
import BoardDetails from "./accountsComponents/BoardDetails";
import { BasicDetailsValidate, _initialValues } from "./utils/profileUtils";
import Successfull from "./accountsComponents/Successfull";
import { setDeviceToken } from "../../redux/slices/notification.slice";

export default function CreateAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const validate = BasicDetailsValidate;
  const theme = useTheme();
  const location = useLocation();
  const { registerLoader, createaccount = {} } = useSelector(
    (state) => state.register
  );
  const systemToken = useSelector((state) => state?.notification?.deviceToken);
  const { studentById = {} } = useSelector((state) => state?.student);
  const [activeTab, setActiveTab] = useState({
    activeIndex: 0,
    activeTitle: "Basic details",
    activeProgress: 0,
  });
  const [getBoardId, setGetBoardId] = useState("");
  const [getStartDate, setGetStartDate] = useState("");
  const [getClassId, setGetClassId] = useState("");

  const Title = {
    0: "Basic Details",
    1: "Create Account",
    2: "Board Details",
    3: "Successfull",
  };

  const onSubmit = async (values, { resetForm }) => {
    const payLoad = {
      name: values?.name,
      dob: values?.dob,
      gender: values?.gender,
      pinCode: values?.pinCode,
      mPin: values?.mPin,
      recommendReferralCode: values?.recommendReferralCode,
      batchStartDateId: getStartDate,
      courseId: values?.courseId,
      boardId: getBoardId,
      batchTypeId: values?.batchTypeId,
      classId: values?.classId ? values?.classId : getClassId,
    };

    if (activeTab.activeIndex === 0) {
      return setActiveTab({
        activeIndex: activeTab.activeIndex + 1,
        activeTitle: "Create Account",
        activeProgress: 10,
      });
    }
    if (activeTab.activeIndex === 2) {
      const mPin = String(values.mPin);
      const pinCode = String(values.pinCode);
      const recommendReferralCode = String(values.recommendReferralCode);
      let studentType = "Primary";
      const type = "Student";
      // this line for create multiple userboardId
      if (location?.pathname === PATH_AUTH.createAccount) {
        studentType = "Secondary";
        const primaryId = studentById?.id;
        const phone = studentById?.phone;
        dispatch(
          userSignupAsync({
            ...payLoad,
            phone,
            mPin,
            pinCode,
            studentType,
            type,
            primaryId,
            systemToken,
            deviceToken: systemToken,
            deviceType: "web",
            recommendReferralCode,
          })
        ).then((res) => {
          const { payload } = res || {};
          const { status } = payload || {};
          if (status === 200) {
            return setActiveTab({
              activeIndex: activeTab.activeIndex + 1,
              activeTitle: "Basic Details",
              activeProgress: 50,
            });
          } else if (status !== 200) {
            return setActiveTab({
              activeIndex: activeTab.activeIndex - 1,
              activeTitle: "Basic Details",
              activeProgress: 25,
            });
          }
        });
      } else {
        studentType = "Primary";
        dispatch(
          userSignupAsync({
            ...payLoad,
            phone: location?.state?.phone.substring(2),
            mPin,
            pinCode,
            studentType,
            type,
            deviceToken: systemToken,
            recommendReferralCode,
            deviceType: "web",
          })
        ).then((res) => {
          const { payload } = res || {};
          const { status } = payload || {};
          if (status === 200) {
            return setActiveTab({
              activeIndex: activeTab.activeIndex + 1,
              activeTitle: "Basic Details",
              activeProgress: 50,
            });
          } else if (status !== 200) {
            return setActiveTab({
              activeIndex: activeTab.activeIndex - 1,
              activeTitle: "Basic Details",
              activeProgress: 25,
            });
          }
        });
      }
    }
    resetForm();
  };

  const handleBack = () => {
    if (location?.pathname === PATH_AUTH.createAccount) {
      return navigate("/app/dashboard");
    }
    var countVal = 0;
    switch (activeTab.activeIndex) {
      case 0:
        countVal = 0;
        break;
      case 1:
        countVal = 0;
        break;
      case 2:
        countVal = 10;
        break;
      case 3:
        countVal = 15;
        break;
      case 4:
        countVal = 25;
        break;
      default:
        countVal = 0;
        break;
    }
    setActiveTab({
      activeIndex: activeTab.activeIndex - 1,
      activeTitle: Title[activeTab.activeIndex - 1],
      activeProgress: countVal,
    });
    dispatch(showHiddenSection({ hiddentype: "all" }));
  };

  useEffect(() => {
    if (createaccount.status === 200) {
      toast.success(createaccount.message, toastoptions);
      if (location?.pathname === PATH_AUTH.createAccount) {
        const payload = {
          userId: studentById?.id,
          batchTypeId: "",
        };
        dispatch(getStudentByIdAsync(payload)); // for login users details

        dispatch(setDeviceToken(createaccount.accessToken));
        localStorage.setItem(
          "auth",
          JSON.stringify({
            accessToken: createaccount.accessToken,
            userId: createaccount.data,
          })
        );

        dispatch(
          reduxSetUserLoggedInInfo({
            accessToken: createaccount.accessToken,
            userId: createaccount.data,
            loginStatus: createaccount?.loginStatus,
          })
        );
      } else {
        dispatch(setDeviceToken(createaccount.accessToken));
        localStorage.setItem(
          "auth",
          JSON.stringify({
            accessToken: createaccount.accessToken,
            userId: createaccount.data,
          })
        );

        dispatch(
          reduxSetUserLoggedInInfo({
            accessToken: createaccount.accessToken,
            userId: createaccount.data,
            loginStatus: createaccount?.loginStatus,
          })
        );

        const payload = {
          userId: createaccount?.data,
          batchTypeId: "",
        };
        dispatch(getStudentByIdAsync(payload)); // for login users details
      }

      dispatch(emptyregister());
      setTimeout(() => {
        navigate(PATH_DASHBOARD.app);
      }, 1000);
    }
  }, [createaccount]);

  return (
    <>
      <Card
        sx={{
          backgroundColor: "#fff",
          m: "auto",
          width: "100%",
          height: "100%",
          paddingBlock: 6,
          paddingInline: 18,
          // overflow: "hidden",
          overflowY: "scroll",
          [theme.breakpoints.down("md")]: {
            background: "none",
            boxShadow: "none",
            padding: 0,
          },
        }}
      >
        <Grid container sx={{ display: "flex", alignItems: "center" }}>
          <Grid item xs={4} md={1} lg={5}>
            <ArrowBackIcon
              style={{
                visibility:
                  activeTab.activeIndex === 0
                    ? location?.pathname === PATH_AUTH.createAccount
                      ? "visible"
                      : "hidden"
                    : "visible",
              }}
              onClick={handleBack}
            />
          </Grid>
          <Grid item xs={8} md={11} lg={7}>
            <Typography
              variant="h3"
              component="h3"
              sx={{
                [theme.breakpoints.between("md", "lg")]: {
                  textAlign: "center",
                  fontSize: "27px",
                },
              }}
            >
              {activeTab.activeTitle}
            </Typography>
          </Grid>
        </Grid>

        <Formik
          initialValues={_initialValues}
          validationSchema={validate}
          onSubmit={onSubmit}
        >
          {(formik) => (
            <Form
              id="myForm"
              style={activeTab.activeIndex === 1 ? { height: "100%" } : null}
            >
              <LinearWithValueLabel progressValue={activeTab.activeProgress} />

              {activeTab.activeIndex === 0 ? (
                <BasicDetails
                  setActiveTab={setActiveTab}
                  activeTab={activeTab}
                  formik={formik}
                />
              ) : null}
              {activeTab.activeIndex === 1 ? (
                <Account
                  setActiveTab={setActiveTab}
                  activeTab={activeTab}
                  formik={formik}
                />
              ) : null}

              {activeTab.activeIndex === 2 ? (
                <BoardDetails
                  setActiveTab={setActiveTab}
                  activeTab={activeTab}
                  formik={formik}
                  setGetBoardId={setGetBoardId}
                  setGetStartDate={setGetStartDate}
                  setGetClassId={setGetClassId}
                />
              ) : null}
              {activeTab.activeIndex === 3 ? (
                <Successfull
                  setActiveTab={setActiveTab}
                  activeTab={activeTab}
                />
              ) : null}
            </Form>
          )}
        </Formik>
      </Card>
    </>
  );
}
