import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import Label from "components/label/Label";
import moment from "moment";

export const reportcolumns = ({
  openPopover,
  handleOpenPopover,
  setIdinfo,
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
      name: "Subject",
      selector: (data) => data.subjectName,
    },
    {
      name: "Total question",
      selector: (data) => data.questionCount,
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
            {moment.duration(data.time).asMinutes() + " Minute"}
          </Label>
        );
      },
    },
    {
      name: "Coins Earned",
      selector: (data) => data?.coins || "0",
    },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              handleOpenPopover(e);
              setIdinfo(row);
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
