import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import ReactHtmlParser from "react-html-parser";

const Overview = ({ formik, valueAssign }) => {
  const { multipleStudents } = useSelector((state) => state.assignment);
  const { getAllquestions, getQuestionScholarshipTest } = useSelector(
    (state) => state.questionbank
  );

  let finddata = valueAssign?.data?.find((item) => {
    return item.id == formik?.values?.name?.value;
  });
  // let findData = {};

  // findData = valueAssign?.data?.find((item) => {
  //   return item.id == formik?.values?.name?.value || [];
  // });

  const data = {
    manual: "Manual",
    automated: "Automated"
  };

  

  const Info = [
    {
      label: "Test Method",
      value: data[formik.values.selection || "N/A"]
    },
    {
      label: "Scholarship  Name",
      // value: finddata?.name
      value: formik?.values?.name?.label
    },
    {
      label: "Course",
      value: finddata?.courseName
    },
    {
      label: "Board",
      value: finddata?.boardName
    },
    {
      label: "Class",

      value: formik.values.classId.label
    }
  ];
  return (
    <Box>
      <Typography
        sx={{
          my: 1,
          fontWeight: 600
        }}
      >
        Selected Items
      </Typography>
      {Info.map((ev, index) => {
        return (
          <TextField
            sx={{
              mr: index === 4 ? 0 : 1,
              mt: 2
            }}
            label={ev.label}
            size="small"
            value={ev.value}
            readOnly
          />
        );
      })}
      {/* <Typography
        sx={{
          my: 1,
          fontWeight: 600,
        }}
      >
        Students
      </Typography> */}
      <Box display="flex">
        {/* {multipleStudents?.data.map((ev) => {
          if (formik?.values?.students?.find((evv) => evv.value === ev.id)) {
            return (
              <Box
                sx={{
                  backgroundColor: "#e7eaec",
                  py: 0.5,
                  px: 2,
                  borderRadius: 1,
                  mb: 1,
                  mr: 1
                }}
              >
                {ev.name}
              </Box>
            );
          }
        })} */}
      </Box>
      {formik.values.selection === "manual" && (
        <>
          <Typography
            sx={{
              my: 1,
              fontWeight: 600
            }}
          >
            Questions
          </Typography>
          {getQuestionScholarshipTest?.data.map((ev) => {
            if (formik?.values?.questions?.find((evv) => evv === ev.id)) {
              return (
                <Box
                  sx={{
                    backgroundColor: "#e7eaec",
                    py: 0.5,
                    px: 2,
                    borderRadius: 1,
                    mb: 1
                  }}
                >
                  {ReactHtmlParser(ev.question)}
                </Box>
              );
            }
          })}
        </>
      )}

      {/* {formik.values.method === "upload" && (
        <>
          <Typography
            sx={{
              my: 1,
              fontWeight: 600,
            }}
          >
            Subjects
          </Typography>
          <Box display="flex">
            {formik?.values?.subjects?.map((ev) => {
              return (
                <Box
                  sx={{
                    backgroundColor: "#e7eaec",
                    py: 0.5,
                    px: 2,
                    borderRadius: 1,
                    mb: 1,
                    mr: 1
                  }}
                >
                  {ev.label}
                </Box>
              );
            })}
          </Box>
          <Typography
            sx={{
              my: 1,
              fontWeight: 600,
            }}
          >
            Chapters
          </Typography>
          <Box display="flex">
            {formik?.values?.chapters?.map((ev) => {
              return (
                <Box
                  sx={{
                    backgroundColor: "#e7eaec",
                    py: 0.5,
                    px: 2,
                    borderRadius: 1,
                    mr: 1
                  }}
                >
                  {ev.label}
                </Box>
              );
            })}
          </Box>
        </>
      )} */}
    </Box>
  );
};

export default Overview;
