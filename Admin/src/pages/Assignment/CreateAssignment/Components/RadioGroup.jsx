import React from "react";
import {
  Box,
  RadioGroup,
  Radio,
  Typography,
  FormControlLabel,
} from "@mui/material";

const RadioGroupCustom = ({ onChange, name, radio, error, ...other }) => {
  return (
    <RadioGroup
      name={name}
      onChange={onChange}
      row
      sx={{
        mt: 2,
      }}
      {...other}
    >
      {radio.map((ev, index) => {
        return (
          <Box
            key={index}
            sx={{
              border: error
                ? "1px solid red"
                : ev.formikKey === ev.value
                ? "1px solid #dff3ea"
                : "1px solid #dff3ea",
              borderRadius: "5px",
              backgroundColor: ev.formikKey === ev.value ? "#dff3ea" : "white",
              mr: 2,
            }}
          >
            <FormControlLabel
              control={
                <Radio
                  size="small"
                  color="success"
                  value={ev.value}
                  sx={{
                    display: "none",
                  }}
                />
              }
              label={
                <Box
                  sx={{
                    p: "12px 10px 12px 30px",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "700",
                    }}
                  >
                    {ev.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    {ev.mark}
                  </Typography>
                </Box>
              }
              value={ev.value}
            />
          </Box>
        );
      })}
    </RadioGroup>
  );
};

export default RadioGroupCustom;
