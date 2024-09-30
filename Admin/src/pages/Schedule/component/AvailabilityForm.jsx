import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import Container from "@mui/material/Container";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/system";
import * as yup from "yup";

export const Type = [
  {
    value: "Available",
    label: "Available",
  },
  {
    value: "Not Available",
    label: "Not Available",
  },
];
export const Working = [
  {
    value: "Half Time",
    label: "Half Time",
  },
  {
    value: "Full Time",
    label: "Full Time",
  },
];

const Index = ({ onCancel }) => {
  const [value, setValue] = useState(null);
  const [endvalue, setEndValue] = useState(null);
  const today = new Date();
  const lastDate = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);
  const [availble, setAvailable] = useState("Available");
  const initialValues = {
    avalibledate: "",
    workingday: "",
    time: "",
  };
 const validatedata = yup.object().shape({
    // avalibledate: yup.string().required("Field is required"),
    // workingday: yup.string().required("Field is required"),
    // time: yup.string().required("Field is required"),
  });

  const onSubmit = async (values) => {
    const payload = {
      avalibledate: values.avalibledate,
      workingday: values.mobileworkingday,
      time: values.time,
      fromDate: value,
      toDate: endvalue,
    };
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema: validatedata,
  });

  return (
    <>
      <Box id="availble">
        <Container maxWidth="md">
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ marginBottom: { xs: "42px", md: "70px" }, mt: "20px" }}
          >
            <Box sx={{ minWidth: 120, marginBottom: "10px" }}>
              <FormControl fullWidth>
                <InputLabel>{"Avalibility"}</InputLabel>
                <Select
                  label="avalibledate"
                  name="avalibledate"
                  {...formik.getFieldProps("avalibledate")}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setAvailable(e.target.value);
                  }}
                >
                  <MenuItem selected value="">
                    Select Avalibility
                  </MenuItem>
                  {Type?.map((ev, index) => {
                    return (
                      <MenuItem value={ev.value} key={index}>
                        {ev.label}
                      </MenuItem>
                    );
                  })}
                </Select>
                {formik.touched.avalibledate && formik.errors.avalibledate && (
                  <small className="formikerror">
                    {formik.errors.avalibledate}
                  </small>
                )}
              </FormControl>
            </Box>
            {availble === "Not Available" ? (
              <>
                {" "}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDateTimePicker
                    renderInput={(props) => <TextField {...props} fullWidth />}
                    label="From Date"
                    minDate={lastDate}
                    value={value}
                    onChange={(e) => {
                      setValue(e);
                    }}
                  />
                </LocalizationProvider>
                <Box sx={{ marginTop: "10px" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDateTimePicker
                      renderInput={(props) => (
                        <TextField {...props} fullWidth />
                      )}
                      label="To Date"
                      minDateTime={lastDate}
                      value={endvalue}
                      onChange={(e) => {
                        setEndValue(e);
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ minWidth: 120, marginBottom: "10px" }}>
                  <FormControl fullWidth>
                    <InputLabel>{"Working Day"}</InputLabel>
                    <Select
                      label="workingday"
                      name="workingday"
                      {...formik.getFieldProps("workingday")}
                      onChange={(e) => {
                        formik.handleChange(e);
                      }}
                    >
                      <MenuItem defaultValue value="">
                        Select Working Day
                      </MenuItem>
                      {Working?.map((ev, index) => {
                        return (
                          <MenuItem value={ev.value} key={index}>
                            {ev.label}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {formik.touched.workingday && formik.errors.workingday && (
                      <small className="formikerror">
                        {formik.errors.workingday}
                      </small>
                    )}
                  </FormControl>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDateTimePicker
                    renderInput={(props) => <TextField {...props} fullWidth />}
                    label="From Date"
                    value={value}
                    onChange={(e) => {
                      setValue(e);
                    }}
                  />
                </LocalizationProvider>
                <Box sx={{ marginTop: "10px" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDateTimePicker
                      renderInput={(props) => (
                        <TextField {...props} fullWidth />
                      )}
                      label="To Date"
                      value={endvalue}
                      
                      onChange={(e) => {
                        setEndValue(e);
                      }}
                    />
                  </LocalizationProvider>
                </Box>
                <Box sx={{ minWidth: 120, marginTop: "10px" }}>
                  <FormControl fullWidth>
                    <TextField
                      name="time"
                      type="time"
                      label="Break Time"
                      style={{ color: "transparent !important" }}
                      fullWidth
                      {...formik.getFieldProps("time")}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.time && formik.errors.time && (
                      <small className="formikerror">
                        {formik.errors.time}
                      </small>
                    )}
                  </FormControl>
                </Box>
              </>
            )}
            <Stack alignItems="flex-end" sx={{ mt: 2 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                //   loading={chapterLoader}
              >
                {"Create Avalibility"}
              </LoadingButton>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Index;
