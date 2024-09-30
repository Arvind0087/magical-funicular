import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import * as yup from "yup";
import { Helmet } from "react-helmet-async";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { PATH_DASHBOARD } from "../routes/paths";
import {
  createFeedbackAsync,
  getTestInstructionAsync,
} from "../redux/async.api";
import { toastoptions } from "../utils/toastoptions";
import { emptyfeedback } from "../redux/slices/feedback.slice";
import CustomComponentLoader from "../components/CustomComponentLoader/CustomComponentLoader";

const data = [
  {
    id: "1",
    logo: <HelpOutlineIcon sx={{ fontSize: "60px" }} />,
    title: "Help & FAQs",
    value: "help",
  },
  {
    id: "2",
    logo: <WhatsAppIcon sx={{ fontSize: "60px" }} />,
    title: "Chat with us on Whatsapp",
    value: "whatsapp",
  },
  {
    id: "3",
    logo: <MailOutlineIcon sx={{ fontSize: "60px" }} />,
    title: "Connect with us",
    value: "mail",
  },
];

const HelpAndSupport = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { feedbackLoader, feedbackadd } = useSelector(
    (state) => state?.createFeedback
  );
  const { studentLoader, studentById } = useSelector((state) => state?.student);
  const { getOnlySiteSettingLoader, getOnlySiteSettingData = [] } = useSelector(
    (state) => state.getOnlySiteSetting
  );
  const { siteTitle } = getOnlySiteSettingData;
  const { testinstruction } = useSelector((state) => state?.test);
  const { helpLineNumber, helpEmail } = testinstruction;

  const validationSchema = yup.object({
    feedback: yup
      .string("Enter your Feedback")
      .min(1, "Enter atleast one character")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      feedback: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(
        createFeedbackAsync({
          // generate otp api call...
          studentId: studentById.id,
          feedback: values.feedback,
        })
      );
    },
  });

  const handleClick = (value) => {
    if (value === "help") {
      navigate(PATH_DASHBOARD.faqs);
    }
    if (value === "whatsapp") {
      window.open(
        `https://web.whatsapp.com/send?phone=+91${helpLineNumber}&text=Hi`,
        "_blank"
      );
    }
    if (value === "mail") {
      window.open(`mailto:${helpEmail}`, "_blank");
    }
  };

  useEffect(() => {
    dispatch(
      getTestInstructionAsync({
        type: "view",
      })
    );
  }, []);

  useEffect(() => {
    if (feedbackadd.status === 200) {
      toast.success(feedbackadd.message, toastoptions);
      formik.resetForm();
      dispatch(emptyfeedback()); // NEED TO CLEAR MESSAGE FROM STATE
    }
  }, [feedbackadd]);

  return (
    <>
      <Helmet>
        <title>Help & Support | {`${siteTitle}`}</title>
      </Helmet>

      <Typography variant="h3" component="h2" sx={{ textAlign: "center" }}>
        Help & Support
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          mt: 1,
          [theme.breakpoints.down("md")]: {
            paddingInline: "20px",
          },
        }}
      >
        {data &&
          data.map((item, id) => {
            return (
              <>
                <Grid item xs={12} md={4} key={item.id}>
                  <Card
                    onClick={() => handleClick(item.value)}
                    sx={{
                      height: 200,
                      overflow: "hidden",
                      cursor: "pointer",
                      alignContent: "center",
                      textAlign: "center",
                      flexWrap: "wrap",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Box sx={{ display: "block" }}>
                      <Box sx={{ color: "primary.main" }}>{item.logo}</Box>
                      <Typography variant="h5" component="h2">
                        {item.title}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              </>
            );
          })}
      </Grid>

      <Grid
        container
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "center",
          [theme.breakpoints.down("md")]: {
            paddingInline: "20px",
          },
        }}
      >
        <Grid item xs={12} md={9}>
          <Typography variant="h5" component="h2">
            Share Feedback
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              id="outlined-basic..."
              label="Feedback"
              variant="outlined"
              multiline
              name="feedback"
              maxRows={12}
              rows={8}
              sx={{ width: "100%" }}
              {...formik.getFieldProps("feedback")}
              onChange={formik.handleChange}
              error={formik.touched.feedback && formik.errors.feedback}
            />

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                sx={{
                  borderRadius: "60px",
                  color: "#ffff",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "10px 36px",
                  height: "44px",
                  width: "50%",
                  [theme.breakpoints.down("sm")]: {
                    width: "100%",
                  },
                }}
                type="submit"
                variant="contained"
              >
                {feedbackLoader ? (
                  <CustomComponentLoader padding="0" size={20} />
                ) : (
                  "Submit"
                )}
              </Button>
            </Box>
          </form>
        </Grid>
      </Grid>
    </>
  );
};

export default HelpAndSupport;
