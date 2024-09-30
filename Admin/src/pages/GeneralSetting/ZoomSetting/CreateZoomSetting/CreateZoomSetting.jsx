import { Helmet } from "react-helmet-async";
import React, { useEffect } from "react";
import {
  Card,
  Grid,
  Container,
  Stack,
  FormControl,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { PATH_DASHBOARD } from "routes/paths";
import { useDispatch, useSelector } from "react-redux";

import {
  createZoomCredentialAsync,
  getZoomCredentialByTeacherIdAsync,
  updateCredentialByIdAsync
} from "redux/ZoomSetting/ZoomSetting.async";
import { getAllStaffOnlyAsync } from "redux/staff/staff.async";
import { emptyzoomSetting } from "redux/ZoomSetting/ZoomSetting.slice";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { useNavigate, useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { _validate, _initial } from "./utils";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import BoxGridTwo from "components/BoxGridTwo/BoxGridTwo";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";


export default function CreateRevision() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const location = useLocation();
  const { state } = location;
  // const teacherId=location?.state?.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const { staffLoader, staffNameIdOnly } = useSelector((state) => state.staff);
  const { zoomSettingLoader, zoomSettingadd, zoomSetting, zoomSettingbyid, zoomSettingupdate } = useSelector(
    (state) => state.zooSetting
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);
  let payload;
  const onSubmit = async (values) => {
    payload = {
      id: state?.id,
      teacherId: values?.name?.value,
      zoom_api_key: values.zoomApi,
      zoom_api_secret: values.zoomSecret,
      auth_api_key: values.authtApi,
      auth_api_secret: values.authSecret
    };
    if (id) {
      dispatch(updateCredentialByIdAsync(payload));
    } else {
      delete payload.id;
      dispatch(createZoomCredentialAsync(payload));
    }
  };

  const formik = useFormik({
    initialValues: _initial,
    onSubmit,
    validationSchema: _validate,
  });

  useEffect(() => {
    dispatch(getAllStaffOnlyAsync({}))
  }, []);

  useEffect(() => {
    if (id) {
      // dispatch(getZoomCredentialByTeacherIdAsync(payload?.teacherId));
      dispatch(getZoomCredentialByTeacherIdAsync(id));
    }
  }, [id]);

  useEffect(() => {
    if (id && zoomSettingbyid) {
      formik.setFieldValue("name", {
        label: zoomSettingbyid?.name,
        value: zoomSettingbyid?.teacherId
      });
      formik.setFieldValue("zoomApi", zoomSettingbyid?.zoom_api_key);
      formik.setFieldValue("zoomSecret", zoomSettingbyid?.zoom_api_secret);
      formik.setFieldValue("authtApi", zoomSettingbyid?.auth_api_key);
      formik.setFieldValue("authSecret", zoomSettingbyid?.auth_api_secret);
    }
  }, [id, zoomSettingbyid]);



  useEffect(() => {
    if (zoomSettingadd.status === 200) {
      toast.success(zoomSettingadd.message, toastoptions);
      dispatch(emptyzoomSetting());
      formik.resetForm();
      navigate(PATH_DASHBOARD.zoomsetting);
    }

    if (zoomSettingupdate.status === 200) {
      toast.success(zoomSettingupdate.message, toastoptions);
      dispatch(emptyzoomSetting());
      formik.resetForm();
      navigate(PATH_DASHBOARD.zoomsetting);
    }
  }, [zoomSettingadd, zoomSettingupdate]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Zoom Setting | {`${tabTitle}`} </title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={Boolean(id) ? "Update Zoom Setting" : "Create Zoom Setting"}
        links={[
          { name: "General Settings", href: "" },
          {
            name: "Zoom Setting",
            href: PATH_DASHBOARD.zoomsetting,
          },
          { name: id ? "Update Zoom Setting" : "Create Zoom Setting" },
        ]}
      />
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <BoxGridTwo>
                <AutoCompleteCustom
                  disabled={Boolean(id) && zoomSettingbyid?.teacherId}
                  name="name"
                  loading={staffLoader}
                  {...formik.getFieldProps("name")}
                  options={_.map(staffNameIdOnly, (ev) => {
                    return { label: `${ev?.name} (${ev?.department})`, value: ev.id };
                  })}
                  value={formik.values.name}
                  onChange={(event, value) => {
                    formik.setFieldValue("name", value);
                  }}
                  label="Select Staff"
                  error={formik.touched.name && formik.errors.name}
                />
                <FormControl fullWidth>
                  <TextField
                    name="zoomApi"
                    label="Zoom SDK Key"
                    style={{ color: "transparent !important" }}
                    fullWidth
                    {...formik.getFieldProps("zoomApi")}
                    onChange={formik.handleChange}
                    error={formik.touched.zoomApi && formik.errors.zoomApi}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    name="zoomSecret"
                    label="Zoom Secret Key"
                    style={{ color: "transparent !important" }}
                    fullWidth
                    {...formik.getFieldProps("zoomSecret")}
                    onChange={formik.handleChange}
                    error={formik.touched.zoomSecret && formik.errors.zoomSecret}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    name="authtApi"
                    label=" Zoom Auth Api Key"
                    style={{ color: "transparent !important" }}
                    fullWidth
                    {...formik.getFieldProps("authtApi")}
                    onChange={formik.handleChange}
                    error={formik.touched.authtApi && formik.errors.authtApi}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    name="authSecret"
                    label="Zoom Auth Secret"
                    style={{ color: "transparent !important" }}
                    fullWidth
                    {...formik.getFieldProps("authSecret")}
                    onChange={formik.handleChange}
                    error={formik.touched.authSecret && formik.errors.authSecret}
                  />
                </FormControl>



              </BoxGridTwo>
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={zoomSettingLoader}
                >
                  {Boolean(id) ? "Update Zoom Setting" : "Create Zoom Setting"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

