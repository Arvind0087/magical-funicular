import React, { useState, useEffect } from "react";
import { Box, Container, Stack } from "@mui/system";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { ensureJSONString, isJson } from "utils/isJson";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";

function CustomCheckboxDropdown(props) {
  const {
    label,
    getCheckedValue,
    setCheckedValue,
    loader,
    arrayName,
    formikName,
    error,
    formik,
    sx,
    widthparameter,
  } = props;
  const [getCheckedAll, setCheckedAll] = useState(false);

  const handleChangeCheckbox = (data) => {
    formik.handleChange(data);
    setCheckedAll(false);
    const index = getCheckedValue.indexOf(data);
    if (index === -1) {
      setCheckedValue([...getCheckedValue, data]);
      formik.setFieldValue(formikName, [...getCheckedValue, data]);
    } else {
      setCheckedValue(getCheckedValue.filter((item) => item != data));
      formik.setFieldValue(
        formikName,
        getCheckedValue.filter((item) => item != data)
      );
    }
  };

  useEffect(() => {
    if (getCheckedValue?.length > 0 && arrayName?.length > 0) {
      getCheckedValue?.length === arrayName?.length
        ? setCheckedAll(true)
        : setCheckedAll(false);
    }
  }, [getCheckedValue]);

  const handleCheckedAll = (data) => {
    setCheckedAll(data);
    if (data === true) {
      const ids = arrayName?.map((i) =>
        JSON.stringify({
          id: i.id,
          name: i.name,
          class: i.class ?? "",
          batchType: i.batchType ?? "",
          subject: i.subject ?? "",
          chapter: i.chapter ?? "",
        })
      );
      setCheckedValue(ids);
      formik.setFieldValue(formikName, ids);
    } else {
      setCheckedValue([]);
      formik.setFieldValue(formikName, []);
    }
  };

  const handleCheckedLabel = (ev) => {
    const data = JSON.stringify({
      id: ev.id,
      name: ev.name,
      class: ev.class ?? "",
      batchType: ev.batchType ?? "",
      subject: ev.subject ?? "",
      chapter: ev.chapter ?? "",
    });

    formik.handleChange(data);
    setCheckedAll(false);

    const index = getCheckedValue.indexOf(data);

    if (index === -1) {
      setCheckedValue([...getCheckedValue, data]);
      formik.setFieldValue(formikName, [...getCheckedValue, data]);
    } else {
      setCheckedValue(getCheckedValue.filter((item) => item != data));
      formik.setFieldValue(
        formikName,
        getCheckedValue.filter((item) => item != data)
      );
    }
  };

  return (
    <Box sx={{ width: widthparameter }}>
      <FormControl fullWidth error={Boolean(error)} sx={{ ...sx }}>
        <InputLabel id="mutiple-select-label">
          {loader ? (
            <CustomComponentLoader padding="0 0" size={20} />
          ) : (
            `${label}`
          )}
        </InputLabel>
        <Select
          labelId="mutiple-select-label"
          label={label}
          name={formikName}
          select
          multiple
          // disabled={true}
          value={getCheckedValue}
          //   onChange={handleCheckedAll}
          renderValue={(setCheckedValue) =>
            !!setCheckedValue?.length &&
            setCheckedValue
              ?.map((item) => {
                if (!isJson(item)) {
                  return "";
                }
                const passedItem = JSON.parse(item);
                return passedItem?.chapter
                  ? `${passedItem?.name} (${passedItem?.class ?? ""}) (${
                      passedItem?.batchType ?? ""
                    })
                           ( ${passedItem?.subject ?? ""}) (${
                      passedItem?.chapter ?? ""
                    })`
                  : passedItem?.subject
                  ? `${passedItem?.name} (${passedItem?.class ?? ""}) (${
                      passedItem?.batchType ?? ""
                    })
                           ( ${passedItem?.subject ?? ""})`
                  : passedItem?.batchType
                  ? `${passedItem?.name} (${passedItem?.class ?? ""}) (${
                      passedItem?.batchType ?? ""
                    })`
                  : passedItem?.class
                  ? `${passedItem?.name} (${passedItem?.class ?? ""})`
                  : `${passedItem?.name} `;
              })
              .join(" , ")
          }
        >
          <MenuItem value="all">
            <ListItemIcon>
              <Checkbox
                value={getCheckedAll}
                checked={getCheckedAll}
                onChange={(event) => handleCheckedAll(event.target.checked)}
              />
              <ListItemText style={{ marginTop: "8px" }} primary="Select All" />
            </ListItemIcon>
          </MenuItem>
          {arrayName?.map((ev, index) => (
            <MenuItem key={ev.id}>
              <ListItemIcon>
                <Checkbox
                  value={JSON.stringify({
                    id: ev.id,
                    name: ev.name,
                    class: ev.class ?? "",
                    batchType: ev.batchType ?? "",
                    subject: ev.subject ?? "",
                    chapter: ev.chapter ?? "",
                  })}
                  checked={
                    getCheckedValue?.findIndex(
                      (i) => isJson(i) && JSON.parse(i).id == ev.id
                    ) != -1
                  }
                  onChange={(event) => handleChangeCheckbox(event.target.value)}
                />
              </ListItemIcon>
              <span onClick={() => handleCheckedLabel(ev)}>
                {ev?.chapter ? (
                  <ListItemText>
                    {`${ev.name} (${ev.class ?? ""})
                            (${ev.batchType ?? ""}) (${ev.subject ?? ""}) (${
                      ev.chapter ?? ""
                    })`}
                  </ListItemText>
                ) : ev?.subject ? (
                  <ListItemText>
                    {`${ev.name} (${ev.class ?? ""})
                            (${ev.batchType ?? ""}) (${ev.subject ?? ""})`}
                  </ListItemText>
                ) : ev?.batchType ? (
                  <ListItemText>
                    {`${ev.name} (${ev.class ?? ""})
                            (${ev.batchType ?? ""}) `}
                  </ListItemText>
                ) : ev?.class ? (
                  <ListItemText>{`${ev.name} (${
                    ev.class ?? ""
                  }) `}</ListItemText>
                ) : (
                  <ListItemText>{`${ev.name}`}</ListItemText>
                )}
              </span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default CustomCheckboxDropdown;
