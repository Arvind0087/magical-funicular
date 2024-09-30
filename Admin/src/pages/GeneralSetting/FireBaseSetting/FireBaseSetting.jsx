import React from "react";
import { Helmet } from "react-helmet-async";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { Grid, Card, TextField, Stack, Box, Container } from "@mui/material";
import { _initialValues, _validation } from "./utils";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { PATH_DASHBOARD } from "routes/paths";
import { emptyfirebaseSettings } from "redux/slices/SiteSettingsSlice/FirebaseSlice/Firebase.slice";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import {
  getAllFirebaseSettingsAsync,
  updateFirebaseByIdAsync
} from "redux/slices/SiteSettingsSlice/FirebaseSlice/FirebaseAsync.api";
import { useSettingsContext } from "components/settings";

export default function FireBaseSetting() {
  const dispatch = useDispatch();
  const { themeStretch } = useSettingsContext();

  const { firebaseSettingsLoader, firebaseSettings, updateFirebaseSettings } =
    useSelector((state) => state.FirebaseSettings);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  useEffect(() => {
    dispatch(getAllFirebaseSettingsAsync({}));
  }, []);

  const onSubmit = async (values) => {
    const payload = {
      firebaseKey: values.firebaseKey,
      type: "firebase"
    };

    dispatch(updateFirebaseByIdAsync(payload));
  };

  useEffect(() => {
    if (firebaseSettings) {
      formik.setFieldValue("firebaseKey", firebaseSettings.firebaseKey);
    }
  }, [firebaseSettings]);

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: _validation
  }); // FOMRIK

  useEffect(() => {
    if (updateFirebaseSettings.status === 200) {
      toast.success(updateFirebaseSettings.message, toastoptions);
      dispatch(emptyfirebaseSettings());
    }
  }, [updateFirebaseSettings]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Firebase Setting | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Firebase Setting"
        links={[
          { name: "General Settings", href: "" },
          { name: "Firebase Setting" }
        ]}
      />
      <Card sx={{ p: 2, mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>

            <form onSubmit={formik.handleSubmit}>
              <Stack>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(1, 1fr)"
                  }}
                >
                  <TextField
                    name="firebaseKey"
                    label="Firebase Key"
                    fullWidth
                    {...formik.getFieldProps("firebaseKey")}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.firebaseKey && formik.errors.firebaseKey
                    }
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
                    loading={firebaseSettingsLoader}
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
