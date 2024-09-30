import { Helmet } from "react-helmet-async";
import React, { useMemo } from "react";
import { Card, Grid, TextField, FormControl } from "@mui/material";
import { Container, Stack, Box } from "@mui/system";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import {
  getScholorshipAddByIdAsync,
  createScholarshipAddAsync,
  updateScholarshipAddAsync
} from "redux/slices/scholorshipSlice/async.api";
import { emptyScholorship } from "redux/slices/scholorshipSlice/scholorship.slice";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { useNavigate, useParams } from "react-router";
import { useFormik } from "formik";
import { PATH_DASHBOARD } from "routes/paths";
import { _validate, _initial } from "./utils";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";

export default function CreateScholarship() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    scholorshipLoader,
    createScholorshipAdd,
    getScholorshipAddById,
    updateScholarshipAdd
  } = useSelector((state) => state.scholorship);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const onSubmit = async (values) => {
    const payload = {
      scholarshipId: id,
      title: values.title,
      lastDateOfRegistration: `${values.regisDate}T00:00:00Z`
    };
    if (id) {
      dispatch(updateScholarshipAddAsync(payload));
    } else {
      delete payload.scholarshipId;
      dispatch(createScholarshipAddAsync(payload));
    }
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate
  });

  useMemo(() => {
    if (createScholorshipAdd.status === 200) {
      toast.success(createScholorshipAdd.message, toastoptions);
      dispatch(emptyScholorship());
      formik.resetForm();
      navigate(PATH_DASHBOARD.scholarship);
    }
    if (updateScholarshipAdd.status === 200) {
      toast.success(updateScholarshipAdd.message, toastoptions);
      dispatch(emptyScholorship());
      formik.resetForm();
      navigate(PATH_DASHBOARD.scholarship);
    }
  }, [createScholorshipAdd, updateScholarshipAdd]);

  useMemo(() => {
    if (id) dispatch(getScholorshipAddByIdAsync(id));
  }, [id]);

  useMemo(() => {
    if (id && getScholorshipAddById) {
      formik.setFieldValue("title", getScholorshipAddById?.data?.title);
      formik.setFieldValue(
        "regisDate",
        getScholorshipAddById?.data?.lastDateOfRegistration?.split("T")[0]
      );
    }
  }, [id, getScholorshipAddById]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Scholarship | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={id ? "Update Scholarship" : " Create Scholarship"}
        links={[
          { name: "Scholarship", href: `${PATH_DASHBOARD.scholarship}` },
          { name: id ? "Update Scholarship" : "Create Scholarship" }
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
                <FormControl fullWidth>
                  <TextField
                    label="Title"
                    {...formik.getFieldProps("title")}
                    onChange={formik.handleChange}
                    error={formik.touched.title && formik.errors.title}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    label="Last Date For Registration"
                    {...formik.getFieldProps("regisDate")}
                    onChange={formik.handleChange}
                    error={formik.touched.regisDate && formik.errors.regisDate}
                    inputProps={{ min: new Date().toISOString().split("T")[0], shrink: true }}
                  />
                </FormControl>
              </Box>
              <Stack alignItems="flex-end" sx={{ mt: 10 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={scholorshipLoader}
                >
                  {id ? "Update Scholarship" : "Create Scholarship"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
