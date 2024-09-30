import {
  Card,
  FormControl,
  Grid,
  TextField,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Helmet } from "react-helmet-async";

import { Box, Container, Stack } from "@mui/system";
import React from "react";
import CustomComponentLoader from "components/CustomComponentLoader";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";

import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { _initialValues, _validation } from "./UtilsAdvance";
import { useNavigate, useParams } from "react-router";
import "../student.css";
import { useDispatch } from "react-redux";

import { useEffect } from "react";

import { updateStudentByIdAsync, getstudentbyidAsync } from "redux/async.api";
import { getStateAsync } from "redux/state/states.async";
import { getAllCityByStateIdAsync } from "redux/city/cities.async";
import { getAllWantToBeAsync } from "redux/wantotbe/wantotbe.async";

function AdvanceDetail({ studentid, studentInfo }) {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { wantLoader, wants } = useSelector((state) => state.wants);
  const { stateLoader, states } = useSelector((state) => state.state);
  const { cityLoader, CityByStateId } = useSelector((state) => state.city);

  const { studentLoader, studentadd, studentById } = useSelector(
    (state) => state.student
  );
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const getInitialWantAsync = () => {
    dispatch(
      getAllWantToBeAsync({
        page: "",
        limit: "",
      })
    );
  };

  const getInialStateAsync = () => {
    dispatch(
      getStateAsync({
        page: "",
        limit: "",
      })
    );
  };
  const getAllCityByState = () => {
    dispatch(
      getAllCityByStateIdAsync({
        page: "",
        limit: "",
      })
    );
  };

  const onSubmit = async (values) => {
    if (studentid.data) {
      dispatch(
        updateStudentByIdAsync({
          id: studentid.data,
          state: values.state,

          occupation: values.occupation,

          fatherName: values.fatherName,
          parentNumber: values.parentNumber,
          schoolName: values.schoolName,
          address: values.address,
          city: values.city,
          wantsToBe: values.wantsToBe,
        })
      );
    } else {
      dispatch(
        updateStudentByIdAsync({
          id: id,
          state: values.state,

          occupation: values.occupation,

          fatherName: values.fatherName,
          parentNumber: values.parentNumber,
          schoolName: values.schoolName,
          address: values.address,
          city: values.city,
          wantsToBe: values.wantsToBe,
          referralCode: values.referralCode,
        })
      );
    }
  };

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: _validation,
  });

  useEffect(() => {
    getInitialWantAsync();
  }, []);

  useEffect(() => {
    getInialStateAsync();
  }, []);

  useEffect(() => {
    if (formik.values.state) {
      dispatch(
        getAllCityByStateIdAsync({
          state: formik.values.state,
        })
      );
    }
  }, [formik.values.state]);

  useEffect(() => {
    if (id) {
      const payload = {
        userId: id,
        batchTypeId: "",
      };
      dispatch(getstudentbyidAsync(payload));
    }
  }, [id]);

  useEffect(() => {
    if (id && studentById) {
      formik.setFieldValue("state", studentById.state);
      formik.setFieldValue(
        "occupation",
        studentById?.parentDetails?.occupation
      );
      formik.setFieldValue("fatherName", studentById?.parentDetails?.name);
      formik.setFieldValue("parentNumber", studentById?.parentDetails?.phone);
      formik.setFieldValue("schoolName", studentById.schoolName);
      formik.setFieldValue("address", studentById.address);
      formik.setFieldValue("city", studentById.city);
      formik.setFieldValue("wantsToBe", studentById?.wantsToBe);
      formik.setFieldValue("referralCode", studentById?.referralCode);
    }
  }, [id, studentById]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Student Manager | {`${tabTitle}`}</title>
      </Helmet>
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
                <FormControl
                  fullWidth
                  disabled={wantLoader}
                  error={formik.touched.wantsToBe && formik.errors.wantsToBe}
                >
                  <InputLabel>
                    {wantLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "I Want to Be"
                    )}
                  </InputLabel>
                  <Select
                    label="CouwantsToBerse"
                    name="wantsToBe"
                    {...formik.getFieldProps("wantsToBe")}
                    onChange={formik.handleChange}
                  >
                    <MenuItem defaultValue value="">
                      Select Want to Be
                    </MenuItem>
                    {wants?.data?.map((ev, index) => {
                      return (
                        <MenuItem value={ev.id} key={ev.index}>
                          {ev.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  disabled={stateLoader}
                  error={formik.touched.state && formik.errors.state}
                >
                  <InputLabel>
                    {stateLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "State"
                    )}
                  </InputLabel>
                  <Select
                    label="state"
                    name="state"
                    {...formik.getFieldProps("state")}
                    onChange={formik.handleChange}
                  >
                    <MenuItem defaultValue value="">
                      Select State
                    </MenuItem>
                    {states?.data?.map((ev, index) => {
                      return (
                        <MenuItem value={ev.id} key={ev.index}>
                          {ev.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  disabled={cityLoader}
                  error={formik.touched.city && formik.errors.city}
                >
                  <InputLabel>
                    {cityLoader ? (
                      <CustomComponentLoader padding="0 0" size={20} />
                    ) : (
                      "City"
                    )}
                  </InputLabel>
                  <Select
                    label="City"
                    name="city"
                    {...formik.getFieldProps("city")}
                    onChange={formik.handleChange}
                  >
                    <MenuItem defaultValue value="">
                      Select City
                    </MenuItem>
                    {CityByStateId?.map((ev, index) => {
                      return (
                        <MenuItem value={ev.id} key={ev.index}>
                          {ev.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    name="fatherName"
                    label={
                      studentLoader ? (
                        <CustomComponentLoader padding="0 0" size={20} />
                      ) : (
                        " Father Name"
                      )
                    }
                    {...formik.getFieldProps("fatherName")}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.fatherName && formik.errors.fatherName
                    }
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    type="number"
                    disabled={Boolean(id) && studentById?.parentDetails?.phone}
                    name="parentNumber"
                    label={
                      studentLoader ? (
                        <CustomComponentLoader padding="0 0" size={20} />
                      ) : (
                        " Parent Number"
                      )
                    }
                    {...formik.getFieldProps("parentNumber")}
                    onChange={(e) => {
                      if (e.target.value.length <= 10) {
                        formik.handleChange(e);
                      }
                    }}
                    error={
                      formik.touched.parentNumber && formik.errors.parentNumber
                    }
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    name="occupation"
                    type="text"
                    label={
                      studentLoader ? (
                        <CustomComponentLoader padding="0 0" size={20} />
                      ) : (
                        "Father Occupation"
                      )
                    }
                    {...formik.getFieldProps("occupation")}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.occupation && formik.errors.occupation
                    }
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    name="schoolName"
                    label={
                      studentLoader ? (
                        <CustomComponentLoader padding="0 0" size={20} />
                      ) : (
                        " School Name"
                      )
                    }
                    {...formik.getFieldProps("schoolName")}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.schoolName && formik.errors.schoolName
                    }
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    type=""
                    name="address"
                    label={
                      studentLoader ? (
                        <CustomComponentLoader padding="0 0" size={20} />
                      ) : (
                        "Address"
                      )
                    }
                    {...formik.getFieldProps("address")}
                    onChange={formik.handleChange}
                    error={formik.touched.address && formik.errors.address}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    name="referralCode"
                    disabled={Boolean(id) && studentById?.referralCode}
                    placeholder="Enter exactly 8 characters"
                    label={
                      studentLoader ? (
                        <CustomComponentLoader padding="0 0" size={20} />
                      ) : (
                        "Referral code"
                      )
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...formik.getFieldProps("referralCode")}
                    onChange={(e) => {
                      if (String(e.target.value).length <= 8) {
                        formik.handleChange(e);
                      }
                    }}
                    error={
                      formik.touched.referralCode && formik.errors.referralCode
                    }
                  />
                </FormControl>
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={studentLoader}
                >
                  {id ? "Update Student" : "Create Student"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
export default AdvanceDetail;
