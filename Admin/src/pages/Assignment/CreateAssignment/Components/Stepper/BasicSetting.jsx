import * as React from "react";
import {
  Box,
  TextField,
  FormControl,
  Typography,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import RadioGroupCustom from "../RadioGroup";
import UploadBox from "components/CustomUploads/UploadBox";

export const Time = [
  {
    value: "00:15:00",
    label: "15 mins",
  },
  {
    value: "00:30:00",
    label: "30 mins",
  },
  {
    value: "00:45:00",
    label: "45 mins",
  },
  {
    value: "01:00:00",
    label: "60 mins",
  },
];

const BasicSetting = ({ formik }) => {
  const handleDropQuestion = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    if (file) {
      formik.setFieldValue("questionFile", [newFile]);
    }
  };
  const handleDropAnswer = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    if (file) {
      formik.setFieldValue("answerFile", [newFile]);
    }
  };
  return (
    <Box>
      <RadioGroupCustom
        name="method"
        onChange={formik.handleChange}
        error={Boolean(formik.touched.method && formik.errors.method)}
        radio={[
          {
            formikKey: formik.values.method,
            value: "online",
            label: "Online",
            mark: "Create Paper and Select Questions To Be Pushed To Students",
          },
          {
            formikKey: formik.values.method,
            value: "upload",
            label: "Upload",
            mark: "Create Paper and Select Questions To Be Pushed To Students",
          },
        ]}
        {...formik.getFieldProps("method")}
      />
      {formik.values.method === "online" ? (
        <RadioGroupCustom
          name="selection"
          error={Boolean(formik.touched.selection && formik.errors.selection)}
          onChange={formik.handleChange}
          radio={[
            {
              formikKey: formik.values.selection,
              value: "manual",
              label: "Manual",
              mark: "Create Paper and Select Questions To Be Pushed To Students",
            },
            {
              formikKey: formik.values.selection,
              value: "automated",
              label: "Automated",
              mark: "Create Paper and Select Questions To Be Pushed To Students",
            },
          ]}
          {...formik.getFieldProps("selection")}
        />
      ) : (
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
          }}
          sx={{
            mt: 2,
          }}
        >
          <UploadBox
            height={58}
            otherFile={true}
            name="questionFile"
            label="Question File"
            onDrop={handleDropQuestion}
            file={formik.values.questionFile[0]}
            error={Boolean(
              formik.touched.questionFile && formik.errors.questionFile
            )}
          />
          <UploadBox
            height={58}
            otherFile={true}
            name="answerFile"
            label="Answer File"
            onDrop={handleDropAnswer}
            file={formik.values.answerFile[0]}
            error={Boolean(
              formik.touched.answerFile && formik.errors.answerFile
            )}
          />
        </Box>
      )}

      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
        }}
      >
        <Box sx={{ mt: "20px" }}>
          <FormControl fullWidth>
            <TextField
              fullWidth
              name="name"
              label="Assignment Name"
              {...formik.getFieldProps("name")}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.name && formik.errors.name)}
            />
          </FormControl>
        </Box>

        {/* <Box sx={{ mt: "20px" }}>
          <FormControl fullWidth>
            <TextField
              type="time"
              label="Assignment Time"
              style={{ color: "transparent !important" }}
              {...formik.getFieldProps("time")}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.time && formik.errors.time)}
            />
          </FormControl>
        </Box> */}

        <Box sx={{ mt: "20px" }}>
          <FormControl
            fullWidth
            error={formik.touched.time && formik.errors.time}
          >
            <InputLabel>Assignment Time</InputLabel>
            <Select
              label="Assignment Time"
              name="time"
              {...formik.getFieldProps("time")}
              onChange={formik.handleChange}
            >
              <MenuItem defaultValue value="">
                Select Time
              </MenuItem>
              {Time.map((ev, index) => (
                <MenuItem key={ev.label} value={ev.value}>
                  {ev.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default BasicSetting;
