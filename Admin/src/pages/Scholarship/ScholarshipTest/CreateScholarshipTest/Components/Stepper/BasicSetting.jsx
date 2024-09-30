import React, { useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import RadioGroupCustom from "../RadioGroup";
import { useSelector, useDispatch } from "react-redux";

import { getScholarshipDetailsAsync } from "redux/slices/scholorshipSlice/async.api";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";

const BasicSetting = ({ formik }) => {
  const dispatch = useDispatch();
  const {
    scholorshipLoader,
    getScholarshipDetails,
    getAllScholarshipTest,
    getScholarshipTestById
  } = useSelector((state) => state.scholorship);

  const handleDropQuestion = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file)
    });
    if (file) {
      formik.setFieldValue("questionFile", [newFile]);
    }
  };
  const handleDropAnswer = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file)
    });
    if (file) {
      formik.setFieldValue("answerFile", [newFile]);
    }
  };

  useEffect(() => {
    dispatch(getScholarshipDetailsAsync({}));
  }, []);

  return (
    <Box>
      <RadioGroupCustom
        name="selection"
        error={Boolean(formik.touched.selection && formik.errors.selection)}
        onChange={formik.handleChange}
        radio={[
          {
            formikKey: formik.values.selection,
              // formikKey: formik.values.method,
            value: "manual",
            label: "Manual",
            mark: "Create Paper and Select Questions To Be Pushed To Students",
 

          },
          {
            formikKey: formik.values.selection,
            value: "automated",
            label: "Automated",
            mark: "Create Paper and Select Questions To Be Pushed To Students"
          }
        ]}
        {...formik.getFieldProps("selection")}
      />
      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)"
        }}
      >
        <Box sx={{ mt: "20px" }}>
          <AutoCompleteCustom
            name="name"
            loading={scholorshipLoader}
            // getOptionLabel={(option) => (option ? option.name : "")}
            options={_.map(getScholarshipDetails?.data, (ev) => {
              return { label: ev?.name, value: ev?.id };
            })}
            value={formik?.values?.name}
            onChange={(event, value) => {
              formik.setFieldValue("name", value);
            }}
            label="Select Scholarship"
            error={formik?.touched?.name && formik?.errors?.name}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BasicSetting;
