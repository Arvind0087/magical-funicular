import { Helmet } from "react-helmet-async";
import React, { useEffect } from "react";
import {
  Card,
  Grid,
  MenuItem,
  TextField
} from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { _validate, _initial } from "./utils";
import { useDispatch } from "react-redux";
import {
  createSubscriptionsAsync,
  getSubscriptionsByIdAsync,
  updateSubscriptionByIdAsync,
  getAllPackagesAsync
} from "redux/async.api";
import { emptysubscriptions } from "redux/slices/subscription.slice";
import { useSelector } from "react-redux";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";
import SelectMenuItem from "components/SelectMenuItem/index";
import _ from "lodash";

export default function AddPackage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    subscriptionLoader,
    subscriptionadd,
    subscriptionId,
    subscriptionupdateId
  } = useSelector((state) => state.subscription);
  const { masterLoader, master } = useSelector((state) => state.master);
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const IntitalPackageSubscription = () => {
    dispatch(getAllPackagesAsync({}));
  };

  const onSubmit = async (value) => {
    const payload = {
      id: id,
      packageId: value.packageId,
      month: value.month,
      title: value.title,
      // days: value.days
    };
    if (id) {
      dispatch(updateSubscriptionByIdAsync(payload));
    } else {
      delete payload.id;
      dispatch(createSubscriptionsAsync(payload));
    }
  };

  useEffect(() => {
    IntitalPackageSubscription();
  }, []);

  useEffect(() => {
    if (id) dispatch(getSubscriptionsByIdAsync(id));
  }, [id]);

  useEffect(() => {
    if (id && subscriptionId) {
      formik.setFieldValue("packageId", subscriptionId.packageId);
      formik.setFieldValue("month", subscriptionId.month);
      formik.setFieldValue("title", subscriptionId.title);
      // formik.setFieldValue("days", subscriptionId.days);
    }
  }, [id, subscriptionId]);

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate
  }); // FOMRIK

  useEffect(() => {
    if (subscriptionadd.status === 200) {
      toast.success(subscriptionadd.message, toastoptions);
      formik.resetForm();
      dispatch(emptysubscriptions());
      navigate(PATH_DASHBOARD.packagesubscription);
    }
    if (subscriptionupdateId.status === 200) {
      toast.success(subscriptionupdateId.message, toastoptions);
      formik.resetForm();
      dispatch(emptysubscriptions());
      navigate(PATH_DASHBOARD.packagesubscription);
    }
  }, [subscriptionadd, subscriptionupdateId]);

  return (
    <>
      <Container maxWidth={themeStretch ? "lg" : false}>
        <Helmet>
          <title>Package Details | {`${tabTitle}`}</title>
        </Helmet>
        <CustomBreadcrumbs
          // heading={id ? "Update  Package Details" : "Create  Package Details"}
          links={[
            {
              name: "Subscription",
              href: ""
            },
            {
              name: "Package Details",
              href: PATH_DASHBOARD.packagesubscription
            },
            { name: id ? "Update Package Details " : "Create Package Details " }
          ]}
        />

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)"
                  }}
                >
                  <SelectMenuItem
                    fullWidth
                    disabled={masterLoader}
                    error={formik.touched.packageId && formik.errors.packageId}
                    InputLabelLoader={masterLoader}
                    InputLabelLabel="Package"
                    InputLabelSize={20}
                    label="Package"
                    name="packageId"
                    {...formik.getFieldProps("packageId")}
                    onChange={formik.handleChange}
                    defaultItemLabel="Select Package"
                    data={_.map(master?.data, (ev, index) => {
                      return (
                        <MenuItem value={ev.id} key={ev.index}>
                          {ev.name}
                        </MenuItem>
                      );
                    })}
                  />
                  <TextField
                    name="title"
                    label="Title"
                    {...formik.getFieldProps("title")}
                    onChange={formik.handleChange}
                    fullWidth
                    error={formik.touched.title && formik.errors.title}
                  />
                  <TextField
                    type="number"
                    name="month"
                    label="Months Allowed"
                    {...formik.getFieldProps("month")}
                    onChange={formik.handleChange}
                    fullWidth
                    error={formik.touched.month && formik.errors.month}
                  />
                  {/* <TextField
                    type="number"
                    name="days"
                    label="Days"
                    {...formik.getFieldProps("days")}
                    onChange={formik.handleChange}
                    fullWidth
                    error={formik.touched.days && formik.errors.days}
                  /> */}
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={subscriptionLoader}
                  >
                    {id ? "Update Package Details" : "Create Package Details"}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
}
