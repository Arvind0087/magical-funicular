import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  ListItemText,
  MenuItem,
  ListItemIcon,
  Checkbox,
} from "@mui/material";
import { Box } from "@mui/system";
import { getStudentAsync } from "redux/async.api";
import { useSelector, useDispatch } from "react-redux";

function UploadImage() {
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.student);

  const options = students?.data;
  const [selected, setSelected] = useState([]);
  const isAllSelected =
    options?.length > 0 && selected?.length === options.length;

  const handleChange = (event) => {
    const value = event.target.value;

    if (value[value.length - 1] === "all") {
      var allUsers = [];
      {
        options?.map((option) => allUsers.push(option?.name));
      }
      setSelected(selected.length === options.length ? [] : allUsers);
      return;
    }
    setSelected(value);
  };

  useEffect(() => {
    dispatch(
      getStudentAsync({
        page: "",
        limit: "",
      })
    );
  }, []);

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="mutiple-select-label">Multiple Select</InputLabel>
        <Select
          labelId="mutiple-select-label"
          multiple
          value={selected}
          onChange={handleChange}
          renderValue={(selected) => selected?.join(", ")}
        >
          <MenuItem value="all">
            <ListItemIcon>
              <Checkbox
                checked={isAllSelected}
                indeterminate={
                  selected.length > 0 && selected.length < options.length
                }
              />
            </ListItemIcon>
            <ListItemText primary="Select All" />
          </MenuItem>
          {options?.map((option) => (
            <MenuItem key={option?.id} value={option?.name}>
              <ListItemIcon>
                <Checkbox checked={selected.indexOf(option?.name) > -1} />
              </ListItemIcon>
              <ListItemText primary={option?.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default UploadImage;
