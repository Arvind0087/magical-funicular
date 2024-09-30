import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@material-ui/core';

import React from 'react';
import { useField } from 'formik';

const MultiSelectDropdown = ({ label, options, ...props }) => {
  const [field, meta, helpers] = useField(props.name);

  const handleChange = (event) => {
    // const value = JSON.parse(event?.target?.value);
    console.log(event?.target?.value)
    // const selectedValues = Array.from([value?.value]);
    // helpers.setValue(selectedValues);
  };

  console.log(field)

  return (
    <FormControl>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={field.value}
        onChange={(e) => handleChange(e)}
        onBlur={field.onBlur}
        error={meta.touched && !!meta.error}
        {...props}
        renderValue={(selected) => selected?.length ? selected.join(', ') : ''}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={JSON.stringify(option)}>
            <Checkbox checked={field.value?.includes(option?.value)}/>
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
      {meta.touched && meta.error && <div>{meta.error}</div>}
    </FormControl>
  );
};
// value={JSON.stringify(option)}

export default MultiSelectDropdown;