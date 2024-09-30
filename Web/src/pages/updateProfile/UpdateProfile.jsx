import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import UpdateProfileCover from "./UpdateProfileCover";
import { useSettingsContext } from "../../components/settings";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import InputAdornment from "@mui/material/InputAdornment";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import "./styles.css";
import {
  getAllStateAsync,
  getCityByIdAsync,
  getStateByIdAsync,
  getAllCityByStateIdAsync,
} from "../../redux/cityAndState/cityAndState.async";
import { deactivateUserByIdAsync } from "../../redux/async.api";

import {
  getAllWantToBeAsync,
  updateStudentByIdAsync,
  getStudentByIdAsync,
} from "../../redux/async.api";
import { toastoptions } from "../../utils/toastoptions";
import RequestCallback from "./RequestCallback";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const UpdateProfilePage = () => {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { studentById } = useSelector((state) => state?.student);
  const { updateStudentById } = useSelector((state) => state?.updateStudent);
  const { deactivateUser } = useSelector((state) => state?.deactivateUser);
  const {
    name,
    gender,
    dob,
    phone,
    state,
    city,
    id,
    email,
    address,
    pincode,
    schoolName,
    avatar,
    wantsToBe,
    className,
    classId,
    boardId,
    parentDetails,
    boardName,
    batchTypeName,
  } = studentById;

  const { getAllStateBy = [], AllCityByStateId = [] } = useSelector(
    (state) => state?.StateAndCity
  );
  const { AllWantToBe = [] } = useSelector((state) => state?.wantToBe);
  const [update, setUpdated] = useState(false);
  const [inactive, setInactive] = useState(false);
  const [deactive, setDeactive] = useState(false);
  const [dialogOpen, setDailogOpen] = useState(false);
  const [personsState, setPersonsState] = useState(state);
  const time = "00:00:00.000Z";
  const userPhone = "+91" + phone;
  const dateString = dob;
  const date = new Date(dateString);
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear();
  const formattedDate = `${year}-${month}-${day}`;

  useEffect(() => {
    if (update) {
      const payload = {
        userId: id,
        batchTypeId: "",
      };
      dispatch(getStudentByIdAsync(payload));
      setUpdated(false);
    }
  }, [update]);

  useEffect(() => {
    if (personsState) {
      dispatch(
        getAllCityByStateIdAsync({
          id: personsState,
        })
      );
    }
  }, [personsState]);

  useEffect(() => {
    dispatch(getAllStateAsync());
    dispatch(getAllWantToBeAsync());
  }, []);

  const _initialValues = {
    name: name,
    email: email,
    phone: userPhone,
    pincode: pincode,
    dob: formattedDate,
    gender: gender,
    address: address,
    state: state,
    city: city,
    wantsToBe: wantsToBe,
    boardId: boardId,
    grade: className,
    fatherName: parentDetails?.name,
    occupation: parentDetails?.occupation,
    schoolName: schoolName,
  };
  const classValidate = yup.object().shape({
    name: yup.string().required("Name is required"),
    gender: yup.string().required("Gender is required"),
    email: yup.string().required("Gender is required"),
    dob: yup.string().required("Birth Date is required"),
    pincode: yup
      .string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .required("Pincode is required")
      .min(6, "Must be exactly 6 digits")
      .max(6, "Must be exactly 6 digits"),
  });

  const onSubmit = (value) => {
    dispatch(
      updateStudentByIdAsync({
        id: id,
        name: value.name,
        email: value.email,
        phone: phone,
        pincode: value.pincode,
        dob: `${value.dob}T${time}`,
        gender: value.gender,
        address: value.address,
        state: value.state,
        city: value.city,
        wantsToBe: value.wantsToBe,
        boardId: boardId,
        classId: classId,
        fatherName: value.fatherName,
        occupation: value.occupation,
        schoolName: value.schoolName,
      })
    ).then((res) => {
      if (res?.payload?.status === 200) {
        toast.success(res?.payload?.message, toastoptions);
        setInactive(true);
      }
    });
  };

  const handleClickOpen = () => {
    setDailogOpen(true);
  };

  const handleClose = () => {
    setDailogOpen(false);
  };

  const handleCloseAgree = () => {
    dispatch(
      deactivateUserByIdAsync({
        id: studentById?.id,
      })
    ).then((res) => {
      if (res?.payload?.status === 200) {
        toast.success(res?.payload?.message, toastoptions);
      }
    });
    setDeactive(true);
    setDailogOpen(false);
  };

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: classValidate,
  });

  console.log("updateStudentById....", updateStudentById);

  return (
    <>
      <Box sx={{ mt: 5 }}>
        <Container maxWidth={themeStretch ? false : "lg"}>
          <Typography variant="h4" sx={{ ml: 1 }}>
            Update Profile
          </Typography>
          <Card
            sx={{
              mb: 3,
              height: 230,
              position: "relative",
              display: "flex",
              [theme.breakpoints.down("md")]: {
                height: 280,
              },
            }}
          >
            <UpdateProfileCover
              avatar={avatar}
              id={id}
              name={name}
              phone={phone}
              boardName={boardName}
              batchTypeName={batchTypeName}
              className={className}
            />
          </Card>
          <form onSubmit={formik.handleSubmit}>
            <Grid
              container
              spacing={4}
              sx={{
                m: 1,
                mt: 6,
                direction: "flex",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <Grid
                item
                xs={10}
                md={6}
                lg={4}
                sx={{
                  paddingTop: "0 !important",
                  paddingLeft: "0 !important",
                  height: "57px",
                  mb: 3,
                }}
              >
                <TextField
                  label="Grade"
                  id="outlined-size-small"
                  select
                  size="medium"
                  {...formik.getFieldProps("grade")}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  disabled={true}
                  sx={{ height: "90%", width: "90%" }}
                >
                  <MenuItem value={className}>{className}</MenuItem>
                </TextField>
              </Grid>
              <Grid
                item
                xs={10}
                md={6}
                lg={4}
                sx={{
                  height: "57px",
                  paddingTop: "0 !important",
                  paddingLeft: "0 !important",
                  mb: 3,
                }}
              >
                <TextField
                  label="Name"
                  id="outlined-size-normal"
                  sx={{ height: "90%", width: "90%" }}
                  {...formik.getFieldProps("name")}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                />
              </Grid>
              <Grid
                item
                xs={10}
                md={6}
                lg={4}
                sx={{
                  height: "57px",
                  paddingTop: "0 !important",
                  paddingLeft: "0 !important",
                  mb: 3,
                }}
              >
                <PhoneInput
                  specialLabel={""}
                  country={"in"}
                  {...formik.getFieldProps("phone")}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  disabled={true}
                  maxLength={13}
                  inputStyle={{
                    height: "56px",
                    width: "90%",
                    color: "rgb(145,158,171)",
                    marginTop: "0px !important",
                  }}
                />
              </Grid>
              <Grid
                item
                xs={10}
                md={6}
                lg={4}
                sx={{
                  height: "57px",
                  mb: 3,
                  paddingTop: "0 !important",
                  paddingLeft: "0 !important",
                }}
              >
                <TextField
                  label="Email Id"
                  id="outlined-size-normal"
                  type="email"
                  disabled={email ? true : false}
                  sx={{ height: "90%", width: "90%" }}
                  {...formik.getFieldProps("email")}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                />
              </Grid>
              <Grid
                item
                xs={10}
                md={6}
                lg={4}
                sx={{
                  height: "57px",
                  mb: 3,
                  paddingTop: "0 !important",
                  paddingLeft: "0 !important",
                }}
              >
                <TextField
                  id="date"
                  label="Date of Birthday"
                  type="date"
                  {...formik.getFieldProps("dob")}
                  format={"DD/MM/YYYY"}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  sx={{ width: "90%" }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={formik.touched.dob && Boolean(formik.errors.dob)}
                />
              </Grid>
              <Grid
                item
                xs={10}
                md={6}
                lg={4}
                sx={{
                  mb: 3,
                  paddingTop: "0 !important",
                  paddingLeft: "0 !important",
                  height: "57px",
                }}
              >
                <TextField
                  label="Gender"
                  id="outlined-size-small"
                  select
                  size="medium"
                  {...formik.getFieldProps("gender")}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  error={formik.touched.gender && Boolean(formik.errors.gender)}
                  sx={{ height: "90%", width: "90%" }}
                >
                  <MenuItem value={"Male"}>Male</MenuItem>
                  <MenuItem value={"Female"}>Female</MenuItem>
                  <MenuItem value={"Other"}>Other</MenuItem>
                </TextField>
              </Grid>
              <Grid
                item
                xs={10}
                md={6}
                lg={4}
                sx={{
                  mb: 3,
                  paddingTop: "0 !important",
                  paddingLeft: "0 !important",
                  height: "57px",
                }}
              >
                <TextField
                  label="State"
                  id="outlined-size-small"
                  select
                  size="medium"
                  {...formik.getFieldProps("state")}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setPersonsState(e.target.value);
                  }}
                  sx={{ height: "90%", width: "90%" }}
                >
                  {getAllStateBy &&
                    getAllStateBy?.map((item, index) => (
                      <MenuItem key={index} value={item?.id}>
                        {item?.name}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid
                item
                xs={10}
                md={6}
                lg={4}
                sx={{
                  mb: 3,
                  paddingTop: "0 !important",
                  paddingLeft: "0 !important",
                  height: "57px",
                }}
              >
                <TextField
                  label="City"
                  id="outlined-size-small"
                  select
                  size="medium"
                  {...formik.getFieldProps("city")}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  sx={{ height: "90%", width: "90%" }}
                >
                  {AllCityByStateId &&
                    AllCityByStateId?.map((item, index) => (
                      <MenuItem key={index} value={item?.id}>
                        {item?.name}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid
                item
                xs={10}
                md={6}
                lg={4}
                sx={{
                  mb: 2,
                  paddingTop: "0 !important",
                  paddingLeft: "0 !important",
                  height: "57px",
                  [theme.breakpoints.down("md")]: {
                    mb: 3,
                  },
                }}
              >
                <TextField
                  label="Pincode"
                  id="outlined-size-normal"
                  type="number"
                  inputProps={{ maxLength: 6 }}
                  {...formik.getFieldProps("pincode")}
                  onChange={(e) => {
                    if (String(e.target.value).length <= 6) {
                      {
                        formik.handleChange(e);
                      }
                    }
                  }}
                  error={
                    formik.touched.pincode && Boolean(formik.errors.pincode)
                  }
                  sx={{ height: "90%", width: "90%" }}
                />
              </Grid>
              <Grid
                item
                xs={10}
                md={6}
                lg={4}
                sx={{
                  height: "57px",
                  mb: 2,
                  paddingTop: "0 !important",
                  paddingLeft: "0 !important",
                  [theme.breakpoints.down("md")]: {
                    mb: 3,
                  },
                }}
              >
                <TextField
                  label="Father's Name"
                  id="outlined-size-normal"
                  sx={{ height: "90%", width: "90%" }}
                  {...formik.getFieldProps("fatherName")}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                />
              </Grid>
              <Grid
                item
                xs={10}
                md={6}
                lg={4}
                sx={{
                  height: "57px",
                  mb: 2,
                  paddingTop: "0 !important",
                  paddingLeft: "0 !important",
                }}
              >
                <TextField
                  label="Father's Occupation"
                  id="outlined-size-normal"
                  {...formik.getFieldProps("occupation")}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  sx={{ height: "90%", width: "90%" }}
                />
              </Grid>
              <Grid
                item
                xs={10}
                md={6}
                lg={4}
                sx={{
                  mb: 3,
                  paddingTop: "0 !important",
                  paddingLeft: "0 !important",
                  height: "57px",
                }}
              >
                <TextField
                  label="School Name"
                  id="outlined-size-normal"
                  {...formik.getFieldProps("schoolName")}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  sx={{ height: "90%", width: "90%" }}
                />
              </Grid>
            </Grid>
            <Grid
              Grid
              container
              spacing={4}
              sx={{
                m: 1,
                direction: "flex",
                width: "100%",
                [theme.breakpoints.down("md")]: {
                  m: 1,
                  mt: 1,
                  direction: "flex",
                  justifyContent: "space-evenly",
                },
              }}
            >
              <Grid
                item
                xs={10}
                md={6}
                lg={4}
                sx={{
                  paddingTop: "0 !important",
                  paddingLeft: "0 !important",
                  height: "57px",
                  mb: 3,
                }}
              >
                <TextField
                  label="I want to be"
                  id="outlined-size-small"
                  select
                  size="medium"
                  {...formik.getFieldProps("wantsToBe")}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  sx={{ height: "90%", width: "90%" }}
                >
                  {AllWantToBe &&
                    AllWantToBe?.map((item, index) => (
                      <MenuItem key={index} value={item?.id}>
                        {item?.name}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid
                item
                xs={10}
                md={6}
                lg={4}
                sx={{
                  height: "57px",
                  paddingTop: "0 !important",
                  paddingLeft: "0 !important",
                  mb: 3,
                }}
              >
                <TextField
                  id="input-with-icon-textfield"
                  label="Complete Address"
                  multiline
                  rows={3}
                  {...formik.getFieldProps("address")}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  sx={{ height: "90%", width: "90%" }}
                />
              </Grid>
            </Grid>
            <Grid
              Grid
              container
              spacing={4}
              sx={{
                mb: 3,
                m: 1,
                mt: 4,
                direction: "flex",
                width: "100%",
                justifyContent: "space-evenly",
                [theme.breakpoints.down("md")]: {
                  direction: "flex",
                  justifyContent: "space-evenly",
                },
              }}
            >
              <Grid
                item
                xs={10}
                md={5}
                lg={5}
                sx={{
                  [theme.breakpoints.down("md")]: {
                    alignItems: "center",
                  },
                  mt: 1,
                  height: "57px",
                  textAlign: "center",
                  alignItems: "center",
                  paddingTop: "0 !important",
                  paddingLeft: "0 !important",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    height: "100%",
                    borderRadius: "12px",
                    width: "50%",
                    ml: "-10%",
                    color: "white",
                    paddingTop: "8px",
                  }}
                >
                  Update
                </Button>
              </Grid>
              <Grid
                item
                xs={10}
                md={5}
                lg={5}
                sx={{
                  [theme.breakpoints.down("md")]: {
                    alignItems: "center",
                  },
                  mt: 1,
                  height: "57px",
                  textAlign: "center",
                  alignItems: "center",
                  paddingTop: "0 !important",
                  paddingLeft: "0 !important",
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    height: "100%",
                    borderRadius: "12px",
                    width: "50%",
                    ml: "-10%",
                    color: "white",
                    paddingTop: "8px",
                  }}
                  onClick={handleClickOpen}
                  disabled={deactive ? true : false}
                >
                  Deactivate Account
                </Button>
              </Grid>
            </Grid>
          </form>

          <Dialog
            open={dialogOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Delete User Account"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this user account?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Disagree</Button>
              <Button onClick={handleCloseAgree} autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  );
};
export default UpdateProfilePage;
