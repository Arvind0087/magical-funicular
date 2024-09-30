import React from "react";
import { TextField } from "@mui/material";

const TextFieldCustom = ({
  type = "text",
  name,
  label,
  error,
  onChange,
  shrink = true,
  sx,
  disabled = false,
  ...other
}) => {
  const shrinkProp = {};
  if (shrink) {
    shrinkProp.shrink = shrink;
  }
  return (
    <TextField
      type={type}
      name={name}
      label={label}
      disabled={disabled}
      error={Boolean(error)}
      fullWidth
      InputLabelProps={shrinkProp}
      onChange={onChange}
      sx={sx}
      {...other}
    />
  );
};

export default TextFieldCustom;
