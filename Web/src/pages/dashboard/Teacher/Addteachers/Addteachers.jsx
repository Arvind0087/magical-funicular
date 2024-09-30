import React from "react";
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "../../../../components/settings";
import { LoadingButton } from "@mui/lab";
import { _initialValues, signupValidate } from "./utils";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import {
  adminsignupAsync,
  getTeacherByIdAsync,
  updateTeacherByIdAsync,
} from "../../../../redux/async.api";
import { toastoptions } from "../../../../utils/toastoptions";
import { toast } from "react-hot-toast";
import { emptysignup } from "../../../../redux/slices/signup.slice";
import { useEffect } from "react";
import { emptyteacher } from "../../../../redux/slices/teacher.slice";

function AddBatches() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { signupLoader, signup } = useSelector((state) => state.signup);
  const { teacherLoader, teacherById, teacherupdate } = useSelector(
    (state) => state.teachers
  );

  const onSubmit = async (values) => {
    console.log("DD")
    const payload = {
      id: id,
      name: values.name,
      email: values.email,
      phone: values.phone,
      password: values.password,
      department: values.department,
      dob: `${values.dob}T00:00:00`,
      gender: values.gender,
    };
    if (id) {
      delete payload.password
      dispatch(updateTeacherByIdAsync(payload));
    } else {
      dispatch(adminsignupAsync(payload));
    }
  };

  useEffect(() => {
    if (signup.status === 200) {
      toast.success(signup.message, toastoptions);
      dispatch(emptysignup());
      formik.setFieldValue("name", "");
      formik.setFieldValue("email", "");
      formik.setFieldValue("phone", "");
      formik.setFieldValue("password", "");
      formik.setFieldValue("department", "");
      formik.setFieldValue("dob", "");
      formik.setFieldValue("gender", "");
      navigate("/app/teachers");
    }

    if (teacherupdate.status === 200) {
      toast.success(signup.message, toastoptions);
      dispatch(emptyteacher());
      navigate("/app/teachers");
    }
  }, [signup, teacherupdate]);

  useEffect(() => {
    if (id) {
      dispatch(getTeacherByIdAsync(id));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      if (teacherById) {
        console.log(teacherById);
        formik.setFieldValue("name", teacherById?.data?.name);
        formik.setFieldValue("email", teacherById?.data?.email);
        formik.setFieldValue("phone", teacherById?.data?.phone);
        formik.setFieldValue("password", "novalues");
        formik.setFieldValue("department", teacherById?.data?.department);
        formik.setFieldValue("dob", teacherById?.data?.dob?.split("T")[0]);
        formik.setFieldValue("gender", teacherById?.data?.gender);
      }
    }
  }, [teacherById, id]);

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: signupValidate,
  }); // FOMRIK

  return (
    <>
      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={id ? "Update Staff" : "Create Staff"}
          links={[
            {
              name: "Dashboard",
              href: "/app/master",
            },
            {
              name: "Staff",
              href: "/app/master/batch",
            },
            { name: id ? "Update Staff" : "Teacher Staff" },
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
                      label="Name"
                      fullWidth
                      {...formik.getFieldProps("name")}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <small className="formikerror">
                        {formik.errors.name}
                      </small>
                    )}
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      name="email"
                      label="Email"
                      fullWidth
                      {...formik.getFieldProps("email")}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <small className="formikerror">
                        {formik.errors.email}
                      </small>
                    )}
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      type="number"
                      name="phone"
                      label="Phone"
                      fullWidth
                      {...formik.getFieldProps("phone")}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <small className="formikerror">
                        {formik.errors.phone}
                      </small>
                    )}
                  </FormControl>
                  {id ? null : (
                    <FormControl fullWidth>
                      <TextField
                        name="password"
                        label="Password"
                        fullWidth
                        {...formik.getFieldProps("password")}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.password && formik.errors.password && (
                        <small className="formikerror">
                          {formik.errors.password}
                        </small>
                      )}
                    </FormControl>
                  )}
                  <FormControl fullWidth>
                    <TextField
                      type="date"
                      name="dob"
                      label="Date of Birth"
                      fullWidth
                      {...formik.getFieldProps("dob")}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.dob && formik.errors.dob && (
                      <small className="formikerror">{formik.errors.dob}</small>
                    )}
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      label="Gender"
                      name="gender"
                      {...formik.getFieldProps("gender")}
                      onChange={formik.handleChange}
                    >
                      <MenuItem defaultValue value="">
                        Select Gender
                      </MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="NotSpecified">Not Specified</MenuItem>
                    </Select>
                    {formik.touched.gender && formik.errors.gender && (
                      <small className="formikerror">
                        {formik.errors.gender}
                      </small>
                    )}
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Deaprtment</InputLabel>
                    <Select
                      label="Deaprtment"
                      name="department"
                      {...formik.getFieldProps("department")}
                      onChange={formik.handleChange}
                    >
                      <MenuItem defaultValue value="">
                        Select Department
                      </MenuItem>
                      <MenuItem value="Manager">Manager</MenuItem>
                      <MenuItem value="Teacher">Teacher</MenuItem>
                    </Select>
                    {formik.touched.department && formik.errors.department && (
                      <small className="formikerror">
                        {formik.errors.department}
                      </small>
                    )}
                  </FormControl>
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={signupLoader || teacherLoader}
                  >
                    {id ? "Update Staff" : "Create Staff"}
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

export default AddBatches;
