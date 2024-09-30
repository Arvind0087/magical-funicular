import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import Label from "components/label/Label";
import { capitalize } from "lodash";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
export const assignmentcolumns = ({
  openPopover,
  handleOpenPopover,
  setAssignmentInfo,
  paginationpage,
}) => {
  const columnValues = [
    {
      name: "Sl No.",
      selector: (row, index) =>
        paginationpage === 1
          ? index + 1
          : index === 9
          ? `${paginationpage}0`
          : `${paginationpage - 1}${index + 1}`,
      width: "80px",
    },
    {
      name: "Assignment",
      cell: (data) => {
        return (
          <Tooltip title={data?.name}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {data?.name}
            </Typography>
          </Tooltip>
        );
      },
      width: "200px",
    },
    {
      name: "Assignment Type",
      selector: (data) => {
        const _data = {
          weeklyTest: "Weekly Test",
          mockTest: "Mock Test",
          homeWork: "Home Work",
        };
        return _data[data?.type];
      },

      width: "150px",
    },
    {
      name: "Class",
      cell: (data) => {
        return (
          <Tooltip title={data?.class}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {data?.class}
            </Typography>
          </Tooltip>
        );
      },
      width: "150px",
    },
    {
      name: "Total Questions",
      selector: (data) => (data?.questionCount ? data?.questionCount : "N/A"),
      width: "150px",
    },
    {
      name: "Marks/Question",
      selector: (data) => data?.markPerQuestion,
      width: "150px",
    },
    {
      name: "Time Duration",
      selector: (data) => {
        return (
          <Label
            variant="soft"
            color="success"
            sx={{ textTransform: "capitalize" }}
          >
            {moment.duration(data?.time).asMinutes() + " Minute"}
          </Label>
        );
      },
      width: "150px",
    },

    {
      name: "Start Date and Time",
      selector: (data) => {
        const getTime = new Date(data?.validity);

        const year = getTime.getUTCFullYear();
        const month = ("0" + (getTime.getUTCMonth() + 1)).slice(-2);
        const date = ("0" + getTime.getUTCDate()).slice(-2);
        const hour = getTime.getUTCHours() % 12 || 12; // convert to 12-hour format
        const minute = ("0" + getTime.getUTCMinutes()).slice(-2);
        const period = getTime.getUTCHours() < 12 ? "AM" : "PM"; // get AM/PM

        return (
          <Label
            variant="soft"
            color="success"
            sx={{ textTransform: "capitalize" }}
          >
            {` ${date}-${month}-${year}`}
            {` ${hour}:${minute} ${period}`}
          </Label>
        );
      },
      width: "200px",
    },

    {
      name: "Test Method",
      selector: (data) => capitalize(data?.testMethod),
      width: "200px",
    },
    {
      name: "Created By",
      width: "200px",
      selector: (data) =>
        data?.createdByName
          ? `${data?.createdByName} (${data.createdByRole})`
          : "N/A",
    },
    // {
    //   name: "Created By",
    //   selector: (data) => capitalize(data?.createdByType),
    //   width: "200px"
    // },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              handleOpenPopover(e);
              setAssignmentInfo(row);
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        );
      },
    },
  ];
  return columnValues;
};
