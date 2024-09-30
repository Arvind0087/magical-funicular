import { React, useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import TextFieldCustom from "components/TextFieldCustom/TextFieldCustom";
import { useParams } from "react-router";

const Assign = ({ formik }) => {
  const { id } = useParams();

  const { classLoader, classbycourseboard } = useSelector(
    (state) => state.class
  );
  const { scholorshipLoader, getScholarshipDetails, getScholarshipTestById } =
    useSelector((state) => state.scholorship);

  

  let findData = _.find(
    getScholarshipDetails?.data,
    (item) => item.id === formik?.values?.name?.value
  );

  const data = [
    {
      label: "Course",
      value: findData?.courseName || getScholarshipTestById?.data?.courseName
    },
    {
      label: "Board",
      value: findData?.boardName || getScholarshipTestById?.data?.boardName
    }
  ];

  return (
    <Box>
      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)"
        }}
      >
        {data.map((ev, index) => {
          return (
            <TextFieldCustom
              sx={{
                mr: 1,
                mt: 2,
                minWidth: "100px"
              }}
              label={ev.label}
              size="large"
              value={ev.value}
              inputProps={{ readOnly: true }}
            />
          );
        })}
        <AutoCompleteCustom
          name="classId"
          loading={classLoader}
          options={
            findData?.class?.map((ev) => {
              return { label: ev.name, value: ev.id };
            }) || []
          }
          value={formik?.values?.classId}
          onChange={(event, value) => formik.setFieldValue("classId", value)}
          label="Select Class"
          error={formik.touched.classId && formik.errors.classId}
        />
      </Box>
    </Box>
  );
};

export default Assign;
