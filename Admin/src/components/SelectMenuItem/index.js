import React from "react";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";

const SelectMenuItem = ({
  fullWidth,
  disabled = false,
  readOnly = false,
  error,
  label,
  name,
  onChange,
  defaultItemLabel,
  data,
  InputLabelLoader,
  InputLabelSize,
  InputLabelLabel,
  ...other
}) => {
  return (
    <FormControl
      fullWidth
      disabled={disabled}
      error={Boolean(error)}
      readOnly={readOnly}
    >
      <InputLabel>
        {InputLabelLoader ? (
          <CustomComponentLoader padding="0 0" size={InputLabelSize} />
        ) : (
          InputLabelLabel
        )}
      </InputLabel>
      <Select
        label={label}
        name={name}
        onChange={onChange}
        inputProps={{
          readOnly: readOnly,
        }}
        {...other}
      >
        <MenuItem defaultValue value="">
          {defaultItemLabel}
        </MenuItem>
        {data}
      </Select>
    </FormControl>
  );
};

export default SelectMenuItem;
