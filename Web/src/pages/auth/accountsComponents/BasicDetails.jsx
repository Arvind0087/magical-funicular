import React, { useState } from "react";
import { useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "./AccountStyle.css";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { CustomToggleButton } from "../../../components/CustomComponents/Button";
// import Button from '../../../components/CustomComponents/Button';
// ----------------------------------------------------------------------

const gender = [
  {
    value: "Male",
    label: "male",
  },
  {
    value: "Female",
    label: "female",
  },
  {
    value: "Other",
    label: "other",
  },
];

export default function BasicDetails(props) {
  const theme = useTheme();

  const { activeTab, setActiveTab, formik } = props;

  return (
    <>
      <Card
        sx={{
          mt: 2,
          // overflowY: "scroll",
          display: "flex",
          justifyContent: "center",
          // minHeight: "70vh",
          paddingBlock: 1.5,
          // position:'relative',
          height: "630px",
          [theme.breakpoints.down("sm")]: {
            mt: 0,
            boxShadow: "none",
          },
        }}
      >
        <Grid
          container
          columnSpacing={2}
          sx={{
            width: "60%",
            paddingBlock: "15px",
            [theme.breakpoints.down("md")]: {
              width: "100%",
            },
          }}
        >
          <Grid item xs={6} md={12} sx={{}}>
            <FormControl fullWidth sx={{ height: "90px" }}>
              <span>Name</span>
              <TextField
                variant="outlined"
                type="text"
                name="name"
                fullWidth
                inputProps={{
                  sx: {
                    height: "10px",
                    [theme.breakpoints.down("sm")]: {
                      height: "10px",
                    },
                  },
                }}
                {...formik.getFieldProps("name")}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6} md={12}>
            <FormControl fullWidth sx={{ height: "90px" }}>
              <span>Date of Birth</span>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name="dob"
                  {...formik.getFieldProps("dob")}
                  inputFormat="DD/MM/YYYY"
                  onChange={(newValue) => {
                    formik.setFieldValue("dob", newValue?.$d || new Date());
                  }}
                  maxDate={new Date().toString()}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={formik.touched.dob && Boolean(formik.errors.dob)}
                      helperText={formik.touched.dob && formik.errors.dob}
                      sx={{
                        "& .MuiInputBase-input": {
                          height: "10px", // Set your height here.
                        },
                      }}
                    />
                  )}
                  // renderInput={(params) => <TextField {...params}
                  //     sx={{
                  //         "& .MuiInputBase-input": {
                  //             height: "10px" // Set your height here.
                  //         }
                  //     }}

                  // />}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl
              sx={{
                height: "90px",
                [theme.breakpoints.down("sm")]: {
                  height: "150px",
                },
              }}
            >
              <span>Gender</span>
              <CustomToggleButton
                basicdetail
                formik={formik}
                buttons={gender}
                name="gender"
                onChange={formik.handleChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6} md={12}>
            <FormControl fullWidth sx={{ height: "90px" }}>
              <span>Pincode</span>
              <TextField
                name="pinCode"
                fullWidth
                InputProps={{
                  sx: {
                    height: "45px",
                    [theme.breakpoints.down("sm")]: {
                      height: "45px",
                    },
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Enter 6 Digit Pin Code">
                        <ErrorOutlineIcon sx={{ cursor: "pointer" }} />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  maxlength: 6,
                }}
                {...formik.getFieldProps("pinCode")}
                onChange={formik.handleChange}
                error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
                helperText={formik.touched.pinCode && formik.errors.pinCode}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6} md={12}>
            <FormControl fullWidth sx={{ height: "80px" }}>
              <span>MPin</span>
              <TextField
                name="mPin"
                fullWidth
                InputProps={{
                  sx: {
                    height: "45px",
                    [theme.breakpoints.down("sm")]: {
                      height: "45px",
                    },
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Enter 4 Digit mPin">
                        <ErrorOutlineIcon sx={{ cursor: "pointer" }} />
                      </Tooltip>
                    </InputAdornment>
                  ),
                  minLength: 4,
                }}
                inputProps={{
                  maxlength: 4,
                }}
                {...formik.getFieldProps("mPin")}
                onChange={formik.handleChange}
                error={formik.touched.mPin && Boolean(formik.errors.mPin)}
                helperText={formik.touched.mPin && formik.errors.mPin}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <FormControl fullWidth sx={{ height: "80px" }}>
              <span>Referral Code</span>
              <TextField
                name="recommendReferralCode"
                fullWidth
                InputProps={{
                  sx: {
                    height: "45px",
                    [theme.breakpoints.down("sm")]: {
                      height: "45px",
                    },
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Enter 8 character ReferralCode">
                        <ErrorOutlineIcon sx={{ cursor: "pointer" }} />
                      </Tooltip>
                    </InputAdornment>
                  ),
                  minLength: 8,
                }}
                inputProps={{
                  maxlength: 8,
                }}
                {...formik.getFieldProps("recommendReferralCode")}
                onChange={formik.handleChange}
                // error={formik.touched.mPin && Boolean(formik.errors.mPin)}
                // helperText={formik.touched.mPin && formik.errors.mPin}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <Button
                // onClick={() => setActiveTab({ activeIndex: activeTab.activeIndex + 1, activeTitle: 'Create account', activeProgress: activeTab.activeProgress + 33 })}
                disabled={!(formik.isValid && formik.dirty)}
                type="submit"
                sx={{
                  width: "100%",
                  display: "flex",
                  borderRadius: "42px",
                  justifyContent: "center",
                  height: "44px",
                  alignItems: "center",
                  marginTop: "10px",
                  color: "#ffff",
                }}
                variant="contained"
              >
                Save and next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
