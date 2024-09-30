import React from "react";
import { Helmet } from "react-helmet-async";
import { useSettingsContext } from "components/settings";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { Grid, Card, Stack, Container } from "@mui/material";
import Editor from "components/editor/Editor";
import { _initialValues, _validation } from "./utils";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { PATH_DASHBOARD } from "routes/paths";
import {
  getAllInstructionAsync,
  updateWebByIdAsync,
} from "redux/slices/SiteSettingsSlice/WebAsync.api";
import { useParams } from "react-router";
import { emptyinstruction } from "redux/slices/SiteSettingsSlice/Instruction.slice";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { emptyPaymentSettings } from "redux/slices/SiteSettingsSlice/PaymentSetting.slice";
import { emptyadmin } from "redux/slices/SiteSettingsSlice/Admin.slice";
import { emptymobile } from "redux/slices/SiteSettingsSlice/Mobile.slice";
import { emptyweb } from "redux/slices/SiteSettingsSlice/Web.slice";

export default function Instructions() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { themeStretch } = useSettingsContext();

  const { instructionLoader, instruction, instructionUpdate } = useSelector(
    (state) => state.instruction
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  useEffect(() => {
    dispatch(getAllInstructionAsync({}));
  }, []);

  const onSubmit = async (values) => {
    const payload = {
      instruction: values.instruction,
      type: "instruction",
    };
    dispatch(updateWebByIdAsync(payload));
  };

  useEffect(() => {
    if (instruction)
      formik.setFieldValue("instruction", instruction.instruction);
  }, [instruction]);

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: _validation,
  }); // FOMRIK

  useEffect(() => {
    if (instructionUpdate.status === 200) {
      toast.success(instructionUpdate.message, toastoptions);
      dispatch(emptyinstruction());
      dispatch(emptyPaymentSettings());
      dispatch(emptyadmin());
      dispatch(emptymobile());
      dispatch(emptyweb());
    }
  }, [instructionUpdate]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false} >
      <Helmet>
        <title>Instructions | {`${tabTitle}`} </title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Instructions"
        links={[
          { name: "General Settings", href: "" },
          { name: "Instructions", href: "" },
        ]}
      />
      <Card sx={{ p: 2, mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <form onSubmit={formik.handleSubmit}>
              <Stack>
                <Editor
                  name="instruction"
                  value={formik.values.instruction}
                  onChange={(e) => {
                    formik.setFieldValue("instruction", e);
                  }}
                  error={
                    formik.touched.instruction && formik.errors.instruction
                  }
                />
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  sx={{ marginTop: "25px" }}
                >
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={instructionLoader}
                  >
                    Save
                  </LoadingButton>
                </Stack>
              </Stack>
            </form>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}
