import { Helmet } from "react-helmet-async";
import BoxGridTwo from "components/BoxGridTwo/BoxGridTwo";
import TextFieldCustom from "components/TextFieldCustom/TextFieldCustom";
import React, { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import { Stack, Container, Grid, Card, MenuItem } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings/SettingsContext";
import SelectMenuItem from "components/SelectMenuItem/index";
import { useFormik } from "formik";
import { _initial, _validate } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import {
  getSettingByTypeAsync,
  updateSettingByTypeAsync,
} from "redux/mentorshippackage/mentorshippackage.async";
import { emptymentorshippackage } from "redux/mentorshippackage/mentorshippackage.slice";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";

const MentorshipPackage = () => {
  const dispatch = useDispatch();
  const { themeStretch } = useSettingsContext();
  const {
    mentorshippackageLoader,
    mentorshippackage,
    mentorshippackageupdate,
  } = useSelector((state) => state.mentorshippackage);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const onSubmit = async (values) => {
    const payload = {
      subscriptionType: values.subscriptionType,
      amount: values.amount,
      sessionAllocated: values.sessionAllocated,
      type: "mentor",
    };
    dispatch(updateSettingByTypeAsync(payload));
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate,
  });

  useEffect(() => {
    dispatch(getSettingByTypeAsync());
  }, []);

  useEffect(() => {
    if (mentorshippackage?.subscriptionType) {
      formik.setFieldValue(
        "subscriptionType",
        mentorshippackage?.subscriptionType || ""
      );
      formik.setFieldValue("amount", String(mentorshippackage?.amount) || "0");
      formik.setFieldValue(
        "sessionAllocated",
        mentorshippackage?.sessionAllocated || ""
      );
    }
  }, [mentorshippackage]);

  useEffect(() => {
    if (mentorshippackageupdate.status === 200) {
      toast.success(mentorshippackageupdate.message, toastoptions);
      dispatch(emptymentorshippackage());
    }
  }, [mentorshippackageupdate]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Mentorship Package | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        heading="Mentorship Package"
        links={[
          { name: "Mentorship", href: "" },
          { name: "Mentorship Package", },
        ]}
      />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <form onSubmit={formik.handleSubmit}>
              <BoxGridTwo>
                <SelectMenuItem
                  InputLabelLabel="Subscription Type"
                  InputLabelSize={20}
                  label="Subscription Type"
                  name="subscriptionType"
                  defaultItemLabel="Select Subscription Type"
                  error={
                    formik.touched.subscriptionType &&
                    formik.errors.subscriptionType
                  }
                  {...formik.getFieldProps("subscriptionType")}
                  data={_.map(["Free", "Paid"], (ev, index) => {
                    return (
                      <MenuItem key={index} value={ev}>
                        {ev}
                      </MenuItem>
                    );
                  })}
                  onChange={(e) => {
                    formik.handleChange(e);
                    if (e.target.value === "Free") {
                      formik.setFieldValue("amount", "0");
                    } else {
                      formik.setFieldValue("amount", "");
                    }
                  }}
                />
                <TextFieldCustom
                  name="amount"
                  label="Amount"
                  fullWidth
                  shrink={false}
                  disabled={Boolean(formik.values.subscriptionType === "Free")}
                  error={formik.touched.amount && formik.errors.amount}
                  {...formik.getFieldProps("amount")}
                  onChange={formik.handleChange}
                />
                <TextFieldCustom
                  type="number"
                  name="sessionAllocated"
                  label="Session"
                  fullWidth
                  shrink={false}
                  error={
                    formik.touched.sessionAllocated &&
                    formik.errors.sessionAllocated
                  }
                  {...formik.getFieldProps("sessionAllocated")}
                  onChange={formik.handleChange}
                />
              </BoxGridTwo>
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={mentorshippackageLoader}
                >
                  Update Subscription
                </LoadingButton>
              </Stack>
            </form>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MentorshipPackage;
