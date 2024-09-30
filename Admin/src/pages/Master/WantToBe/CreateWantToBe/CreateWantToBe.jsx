import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, Grid, TextField, FormControl } from "@mui/material";
import { Container, Stack, Box } from "@mui/system";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { useNavigate, useParams } from "react-router";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import { emptywants } from "redux/wantotbe/wantotbe.slice";
import { _initial, _validate } from "./utils";
import {
  createWantToBeAsync,
  getWantToBeByIdAsync,
  updateWantToBeByIdAsync,
} from "redux/wantotbe/wantotbe.async";
import { PATH_DASHBOARD } from "routes/paths";

export default function CreateWantToBe() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wantLoader, wants, wantadd, wantupdate, wantById } = useSelector(
    (state) => state.wants
  );

  const onSubmit = (values) => {
    const payload = {
      WantToBeId: id,
      name: values.name,
    };
    if (id) {
      dispatch(updateWantToBeByIdAsync(payload));
    } else {
      delete payload.WantToBeId;
      dispatch(createWantToBeAsync(payload));
    }
  };

  useEffect(() => {
    if (id) dispatch(getWantToBeByIdAsync(id));
  }, [id]);

  useEffect(() => {
    if (id && wantById) {
      formik.setFieldValue("name", wantById.name);
    }
  }, [wantById, wants, id]);

  useEffect(() => {
    // SUCCESS
    if (wantadd.status === 200) {
      toast.success(wantadd.message, toastoptions);
      dispatch(emptywants()); // NEED TO CLEAR MESSAGE FROM STATE
      formik.setFieldValue("name", "");
      navigate(PATH_DASHBOARD.wanttobe);
    }
    if (wantupdate.status === 200) {
      toast.success(wantupdate.message, toastoptions);
      dispatch(emptywants()); // NEED TO CLEAR MESSAGE FROM STATE
      formik.setFieldValue("name", "");
      navigate(PATH_DASHBOARD.wanttobe);
    }
  }, [wantadd, wantupdate, id]);

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate,
  });

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <CustomBreadcrumbs
        // heading={id ? "Update Want To Be" : "Create Want To Be"}
        links={[
          { name: "Master", href: "" },
          {
            name: "  Want To Be",
            href: `${PATH_DASHBOARD.wanttobe}`,
          },
          { name: id ? "Update Want To Be" : "Create Want To Be" },
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
                  sm: "repeat(2, 1fr)",
                }}
              >
                <FormControl fullWidth>
                  <TextField
                    name="name"
                    label="Title"
                    fullWidth
                    {...formik.getFieldProps("name")}
                    onChange={formik.handleChange}
                    error={formik.touched.name && formik.errors.name}
                  />
                </FormControl>
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={wantLoader}
                >
                  {id ? "Update Want To Be" : "Create Want To Be"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container >
  );
}
