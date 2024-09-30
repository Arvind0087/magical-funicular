import React from "react";
import { Helmet } from "react-helmet-async";
import { useSettingsContext } from "components/settings";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { Grid, Card, TextField, Stack, Box, Container } from "@mui/material";
import { _initialValues, _validation } from "./utils";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { PATH_DASHBOARD } from "routes/paths";
import { emptyPaymentSettings } from "redux/slices/SiteSettingsSlice/PaymentSetting.slice";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import {
  getAllPaymentSettingsAsync,
  updateWebByIdAsync,
} from "redux/slices/SiteSettingsSlice/WebAsync.api";
import { emptyinstruction } from "redux/slices/SiteSettingsSlice/Instruction.slice";
import { emptyadmin } from "redux/slices/SiteSettingsSlice/Admin.slice";
import { emptymobile } from "redux/slices/SiteSettingsSlice/Mobile.slice";
import { emptyweb } from "redux/slices/SiteSettingsSlice/Web.slice";

export default function PaymentSettings() {
  const dispatch = useDispatch();
  const { themeStretch } = useSettingsContext();

  const { paymentSettingsLoader, paymentSettings, updatepaymentSettings } =
    useSelector((state) => state.PaymentSettings);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  useEffect(() => {
    dispatch(getAllPaymentSettingsAsync({}));
  }, []);

  const onSubmit = async (values) => {
    const payload = {
      razorpayId: values.keyid,
      razorpayKey: values.secretkey,
      type: "razorpay",
    };

    dispatch(updateWebByIdAsync(payload));
  };

  useEffect(() => {
    if (paymentSettings.id) {
      formik.setFieldValue("keyid", paymentSettings.razorpayId);
      formik.setFieldValue("secretkey", paymentSettings.razorpayKey);
    }
  }, [paymentSettings.id]);

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: _validation,
  }); // FOMRIK

  useEffect(() => {
    if (updatepaymentSettings.status === 200) {
      toast.success(updatepaymentSettings.message, toastoptions);
      dispatch(emptyPaymentSettings());
      dispatch(emptyinstruction());
      dispatch(emptyadmin());
      dispatch(emptymobile());
      dispatch(emptyweb());
      // navigate(PATH_DASHBOARD.paymentsetting);
    }
  }, [updatepaymentSettings]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Payment Setting | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Payment Setting"
        links={[
          { name: "General Settings", href: "" },
          { name: "Payment Setting", href: "" },
        ]}
      />
      <Card sx={{ p: 2, mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <form onSubmit={formik.handleSubmit}>
              <Stack>
                <h3>Razorpay</h3>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                  }}
                >
                  <TextField
                    name="keyid"
                    label="Razorpay Key Id"
                    fullWidth
                    {...formik.getFieldProps("keyid")}
                    onChange={formik.handleChange}
                    error={formik.touched.keyid && formik.errors.keyid}
                  />

                  <TextField
                    name="secretkey"
                    label="Razorpay Secret Key"
                    fullWidth
                    {...formik.getFieldProps("secretkey")}
                    onChange={formik.handleChange}
                    error={formik.touched.secretkey && formik.errors.secretkey}
                  />
                </Box>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  sx={{ marginTop: "25px" }}
                >
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={paymentSettingsLoader}
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
