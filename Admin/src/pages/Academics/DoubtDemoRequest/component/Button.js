import React, { useState, useEffect } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import axios from "axios";
import { Box, FormControl, FormHelperText, useTheme } from "@mui/material";

export const CustomToggleButton = (props) => {
  const { buttons, name, formik, onChange, basicdetail } = props;
  const theme = useTheme();

  return (
    <FormControl>
      <ToggleButtonGroup
        sx={{ border: "none" }}
        color="primary"
        // value={value}
        {...formik.getFieldProps(name)}
        exclusive
        name={name}
        {...formik.getFieldProps(name)}
        onChange={(e, value) => {
          formik.setFieldValue(name, value);
          onChange(value);
        }}
        aria-label="Platform"
      >
        <Box
          rowGap={2}
          columnGap={1}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(2, 1fr)",
            sm: "repeat(4, 1fr)",
            md: "repeat(4, 1fr)",
          }}
        >
          {buttons?.map((item) => (
            <ToggleButton
              value={item["value"]}
              key={item["value"]}
              sx={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                display: "unset",
                bgcolor:
                  formik.values[name] === item.value
                    ? "primary.main"
                    : "primary.lighter",
                lineHeight: 0,
                padding: "20px",
                width: "130px",
                borderRadius: "16px",
                border: "none",
                hover: "primary.main",
                color:
                  formik.values[name] === item.value ? "white" : "primary.main",
                [theme.breakpoints.down("md")]: {
                  bgcolor:
                    formik.values[name] === item.value
                      ? "primary.main"
                      : "primary.lighter",
                  color:
                    formik.values[name] === item.value
                      ? "white"
                      : "primary.main",
                },
              }}
              onClick={() => {
                formik.setFieldValue(name, item["value"]);
                onChange(item["value"]);
              }}
            >
              {item["label"]}
            </ToggleButton>
          ))}
        </Box>
      </ToggleButtonGroup>
      <FormHelperText
        sx={{
          color: (theme) =>
            basicdetail ? "#FF5630" : theme.palette.error.dark,
        }}
        error={formik.touched[name] && formik.errors[name]}
      >
        {formik.errors[name]}
      </FormHelperText>
    </FormControl>
  );
};
