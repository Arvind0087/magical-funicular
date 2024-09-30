import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import Label from "components/label/Label";
import { capitalize } from "lodash";
import moment from "moment";

export const reportcolumns = ({
  openPopover,
  handleOpenPopover,
  setReportinfo,
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
      name: "Student Name",
      selector: (data) => data.studentName,
    },
    {
      name: "Paper Type",
      selector: (data) => capitalize(data.category),
    },
    {
      name: "Paper Name",
      selector: (data) => data.title,
    },
    {
      name: "Total Question",
      selector: (data) => data.numberOfQuestions,
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
            {/* {data.testTime} */}
            {moment.duration(data.testTime).asMinutes() + " Minute"}
          </Label>
        );
      },
    },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              handleOpenPopover(e);
              setReportinfo(row);
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
