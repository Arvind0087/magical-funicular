import React, { useCallback } from "react";
import { Autocomplete, TextField } from "@mui/material";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";

const AutoCompleteCustom = ({
  loading,
  name,
  options,
  onChange,
  label,
  error,
  shrink = false,
  multiple = false,
  sx,
  size,
  disabled = false,
  placeholder,
  ...other
}) => {
  const shrinkProp = {};
  if (shrink) {
    shrinkProp.shrink = shrink;
  }
  return (
    <Autocomplete
      sx={sx}
      size={size}
      filterSelectedOptions
      disabled={disabled}
      multiple={multiple}
      loading={loading}
      name={name}
      options={options}
      onChange={onChange}
      getOptionLabel={(option) => option?.label || ""}
      loadingText={<CustomComponentLoader padding="0 0" size={20} />}
      isOptionEqualToValue={useCallback(
        (option, value) => option?.value === value?.value
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          error={Boolean(error)}
          label={label}
          InputLabelProps={shrinkProp}
          placeholder={placeholder}
        />
      )}
      {...other}
    />
  );
};

export default AutoCompleteCustom;
