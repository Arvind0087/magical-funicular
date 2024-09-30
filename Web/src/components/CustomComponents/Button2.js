import React, { useState, useEffect } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Box, FormControl, FormHelperText, useTheme } from "@mui/material";
import Classroom from "../../assets/images/classroom.png";
import LanguageImage from "../../assets/images/language.png";
import EnglishImage from "../../assets/images/englishicon.png";

export const CustomToggleButton = (props) => {
  const { buttons, name, formik, onChange, basicdetail, type } = props;
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
          rowGap={3}
          columnGap={3}
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
                  formik.values[name] === item.value ? "lightgray" : "white",
                lineHeight: 0,
                padding: "20px",
                minWidth: "120px",
                borderRadius: "16px",
                border: "none",
                hover: "primary.main",
                border: "1px solid #E9E7FB",
                color:
                  formik.values[name] === item.value ? "white" : "primary.main",
                [theme.breakpoints.down("md")]: {
                  bgcolor:
                    formik.values[name] === item.value ? "lightgray" : "white",
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {type == "class" ? (
                  <img
                    src={Classroom}
                    alt="classroom"
                    width="41px"
                    height="48px"
                  />
                ) : (
                  <img
                    src={
                      item["label"] == "English" ? EnglishImage : LanguageImage
                    }
                    alt="classroom"
                    width="44px"
                    height="42px"
                  />
                )}
                {item["label"]}
              </Box>
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
