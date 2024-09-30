import { Helmet } from "react-helmet-async";

import { Container, Card } from "@mui/material";

import { PATH_DASHBOARD } from "routes/paths";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import { useSelector } from "react-redux";

import AdvanceDetails from "./AdvanceDetails";

import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { useEffect } from "react";
import BasicDetail from "./BasicDetail";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { emptyStudent } from "redux/slices/student.slice";
import { useNavigate, useParams } from "react-router";

const steps = ["Basic Details", "Advance Details"];

export default function AddStudent({ studentInfo }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const formik = useFormik({});

  const dispatch = useDispatch();
  const [studentid, setStudentid] = React.useState();
  const { studentadd, studentupdate, students } = useSelector(
    (state) => state.student
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const { themeStretch } = useSettingsContext();

  const [activeStep, setActiveStep] = React.useState(0);

  const isStepOptional = (step) => {
    return step === 1;
  };

  useEffect(() => {
    if (studentadd.status === 200) {
      toast.success(studentadd.message, toastoptions);
      setStudentid(studentadd);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      formik.resetForm();
      dispatch(emptyStudent());
      if (activeStep === 1) {
        navigate(PATH_DASHBOARD.student);
      }
    }
  }, [studentadd]);

  useEffect(() => {
    if (studentupdate.status === 200) {
      toast.success(studentupdate.message, toastoptions);
      setStudentid(studentupdate);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      formik.resetForm();
      dispatch(emptyStudent());

      if (activeStep === 1) {
        navigate(PATH_DASHBOARD.student);
      }
    }
  }, [studentupdate]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Student | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={id ? "Update Student" : "Create Student"}
        links={[
          { name: "Student Manager", href: "" },
          { name: "Student", href: `${PATH_DASHBOARD.student}` },
          { name: id ? "Update Student" : "Create Student" }
        ]}
      />
      <Card sx={{ pt: 3, pb: 5, px: 5, mb: 3 }}>
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepOptional(index)) {
                labelProps.optional = (
                  <Typography variant="caption"></Typography>
                );
              }

              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === 1 ? (
            <React.Fragment>
              <Box>
                <AdvanceDetails studentid={studentid} />
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                {" "}
                <Box>
                  <BasicDetail studentInfo={studentInfo} />
                </Box>
              </Typography>
            </React.Fragment>
          )}
        </Box>
      </Card>
    </Container>
  );
}
