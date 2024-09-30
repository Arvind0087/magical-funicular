import React, { useEffect, useState } from "react";
import { Container, Box, Stepper, Step, StepLabel, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import BasicSetting from "./Components/Stepper/BasicSetting";
import { useFormik } from "formik";
import Questions from "./Components/Stepper/Questions";
import Assign from "./Components/Stepper/Assign";
import { capitalize } from "lodash";
import { Helmet } from "react-helmet-async";
import { useSettingsContext } from "components/settings";
import { useDispatch, useSelector } from "react-redux";
import {
  _initial,
  _validateAdvance,
  _validateAssign,
  _validateBasic
} from "./utils";
import Overview from "./Components/Stepper/Overview";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { PATH_DASHBOARD } from "routes/paths";

import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import {
  createScholarshipTestAsync,
  getScholarshipTestByIdAsync
} from "redux/slices/scholorshipSlice/async.api";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { emptyScholorship } from "redux/slices/scholorshipSlice/scholorship.slice";

export default function CreateScholarshipTest() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeStep, setActiveStep] = React.useState(0);
  const [valueAssign, setValueAssign] = useState("");
  const [skipped, setSkipped] = React.useState(new Set());
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const steps = ["Basic Settings", "Assign", "Questions", "Overview"];

  const {
    scholorshipLoader,
    getScholarshipDetails,
    createScholarshipTest,
    getScholarshipTestById
  } = useSelector((state) => state.scholorship);
  useEffect(() => {
    setValueAssign(getScholarshipDetails);
  }, [getScholarshipDetails]);

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    if (formik.values.method === "automated" && activeStep === 3) {
      setActiveStep(1);
    } else if (activeStep !== 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const onSubmit = async (values) => {
    if (formik.values.selection == "automated" && activeStep === 1) {
      setActiveStep(3);
    } else if (activeStep !== 3) {
      handleNext();
    } else {
      let payload;
      if (values.selection == "automated") {
        payload = {
          scholarshipId: formik?.values?.name?.value,
          courseId: findData?.courseId,
          classId: formik?.values?.classId?.value,
          boardId: findData?.boardId,
          selectionProcess: capitalize(formik?.values?.selection)
        };
      } else if (values.selection == "manual") {
        payload = {
          // ...payload,
          scholarshipId: formik?.values?.name?.value,
          courseId: findData?.courseId,
          classId: formik?.values?.classId?.value,
          boardId: findData?.boardId,
          questionsId: formik?.values?.questions,
          selectionProcess: capitalize(formik?.values?.selection)
        };
      }
      dispatch(createScholarshipTestAsync(payload));
    }
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema:
      activeStep === 0
        ? _validateBasic
        : activeStep === 1
          ? _validateAssign
          : activeStep === 2
            ? _validateAdvance
            : null
  });

  let findData = valueAssign?.data?.find((item) => {
    return item.id == formik?.values?.name?.value;
  });

  useEffect(() => {
    if (createScholarshipTest.status === 200) {
      toast.success(createScholarshipTest.message, toastoptions);
      formik.resetForm();
      dispatch(emptyScholorship());
      navigate(PATH_DASHBOARD.scholarshiptest);
    }
    // if (updateAssignment.status === 200) {
    //   toast.success(updateAssignment.message, toastoptions);
    //   formik.resetForm();
    //   dispatch(emptyScholorship());
    //   navigate(PATH_DASHBOARD.assignment);
    // }
  }, [createScholarshipTest]);

  useEffect(() => {
    if (id) dispatch(getScholarshipTestByIdAsync(id));
  }, [id]);

  useEffect(() => {
    if (id && getScholarshipTestById) {
      formik.setFieldValue("name", {
        label: getScholarshipTestById?.data?.title,
        value: getScholarshipTestById?.data?.scholarshipId
      });
      formik.setFieldValue("classId", {
        label: getScholarshipTestById?.data?.className || "",
        value: getScholarshipTestById?.data?.classId || {}
      });
      formik.setFieldValue(
        "selection",
        _.lowerFirst(getScholarshipTestById?.data?.selectionProcess)
      );

      if (getScholarshipTestById?.data?.selectionProcess === "Manual") {
        const questionsInfo = getScholarshipTestById?.data?.questions?.map(
          (ev) => ev.id
        );
        formik.setFieldValue("questions", questionsInfo);
      }
    }
  }, [id, getScholarshipTestById]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title> Scholarship Test | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={id ? "Update Scholarship test" : "Create Scholarship test"}
        links={[
          { name: "Scholarship", href: "" },
          { name: "Scholarship Test", href: `${PATH_DASHBOARD.scholarshiptest}` },
          { name: "Create Scholarship Test" }
        ]}
      />
      <Box sx={{ width: "100%", mt: 4 }}>
        <form onSubmit={formik.handleSubmit}>
          <Stack
            sx={{
              mt: "30px",
              display: "flex",
              flexDirection: "row",
              justifyContent: activeStep === 0 ? "end" : 'space-between',
              mb: 3
            }}
          >
            <LoadingButton
              variant="contained"
              color="inherit"
              sx={{ display: activeStep === 0 ? 'none' : ' block' }}
              onClick={handleBack}
            >
              Back
            </LoadingButton>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={scholorshipLoader}
            >
              {activeStep !== 3
                ? "Next"
                : Boolean(id)
                  ? "Update Scholarship Test"
                  : "Create Scholarship Test"}
            </LoadingButton>
          </Stack>
          <Stepper
            activeStep={activeStep}
            sx={{
              mb: 4
            }}
          >
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {activeStep === 0 ? (
            <BasicSetting formik={formik} />
          ) : activeStep === 1 ? (
            <Assign formik={formik} valueAssign={valueAssign} />
          ) : activeStep === 2 ? (
            <Questions formik={formik} />
          ) : (
            <Overview formik={formik} valueAssign={valueAssign} />
          )}
        </form>
      </Box>
    </Container>
  );
}
