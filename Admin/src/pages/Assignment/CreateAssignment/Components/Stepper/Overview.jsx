import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import ReactHtmlParser from "react-html-parser";
import { capitalize } from "lodash";

const Overview = ({ formik }) => {
  const { multipleStudents } = useSelector((state) => state.assignment);
  const { getAllquestions } = useSelector((state) => state.questionbank);
  const { course } = useSelector((state) => state.course);
  const { boardByCourse } = useSelector((state) => state.board);
  const { classbycourseboard } = useSelector((state) => state.class);
  const { batchByCourseBoardClass } = useSelector((state) => state.batch);

  const data = {
    weeklyTest: "Weekly Test",
    mockTest: "Mock Test",
    homeWork: "Home Work"
  };

  const selection = {
    manual: "Manual",
    automated: "Automated"
  };

  const method = {
    online: "Online",
    upload: "Upload"
  };

  const Info = [
    {
      label: "Test Method",
      value: method[formik.values.method]
    },
    {
      label: "Selection",
      value: selection[formik.values.selection || "N/A"]
    },
    {
      label: "Test Name",
      value: formik.values.name
    },
    {
      label: "Test Time",
      value: formik.values.time
    },
    // {
    //   label: "Assignment Type",
    //   value: formik.values.assingmenttype,
    // },

    {
      label: "Assignment Type",

      value: data[formik.values.assingmenttype]
    },

    {
      label: "Course",
      value: course?.data?.find((ev) => ev.id === formik.values.courseId)?.name
    },
    {
      label: "Board",
      value: boardByCourse?.find((ev) => ev.id === formik.values.boardId)?.name
    },
    {
      label: "Class",
      value: classbycourseboard?.find((ev) => ev.id === formik.values.classId)
        ?.name
    },
    {
      label: "Batch",
      value: batchByCourseBoardClass?.find(
        (ev) => ev.id === formik.values.batchId
      )?.name
    },
    {
      label: "Date",
      value: formatDateString(formik.values.date)
    }
  ];

  function formatDateString(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = date.getHours() % 12 || 12;
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const period = date.getHours() < 12 ? "AM" : "PM";

    return `${day}/${month}/${year} ${hours}:${minutes} ${period}`;
  }
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
      <Typography
        sx={{
          my: 1,
          fontWeight: 600
        }}
      >
        Students
      </Typography>
      <Box display="flex">
        {multipleStudents?.data?.map((ev) => {
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
        })}
      </Box>
      {formik.values.method === "online" && (
        <>
          <Typography
            sx={{
              my: 1,
              fontWeight: 600
            }}
          >
            Questions
          </Typography>
          {getAllquestions?.data.map((ev) => {
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

      {formik.values.method === "upload" && (
        <>
          <Typography
            sx={{
              my: 1,
              fontWeight: 600
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
              fontWeight: 600
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
      )}
    </Box>
  );
};

export default Overview;
