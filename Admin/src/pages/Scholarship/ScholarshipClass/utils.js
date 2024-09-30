import { IconButton } from "@mui/material";
import moment from "moment";
import Iconify from "components/iconify/Iconify";
import Label from "components/label/Label";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export const scholorshipCreatecolumns = ({
  openPopover,
  handleOpenPopover,
  setScholorshipInfo,
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
      name: "Course, Board",
      cell: (data) => {
        return (
          <Tooltip title={`(${data?.course})` + " " + `(${data?.board})`}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {`(${data?.course})` + " " + `(${data?.board})`}
            </Typography>
          </Tooltip>
        );
      },
      width: "250px",
    },
    {
      name: "Scholarships",
      selector: (data) => data?.title,
      width: "200px",
    },
    {
      name: "Exam Date",
      selector: (data) => moment(data?.date).format("DD MMM YYYY"),
      width: "150px",
    },
    {
      name: "Exam Start Time",
      selector: (data) => {
        return (
          <Label
            variant="soft"
            color="success"
            sx={{ textTransform: "capitalize" }}
          >
            {moment(data?.startTime, "HH:mm").format("hh:mm a")}
          </Label>
        );
      },
      width: "150px",
    },
    {
      name: "Exam End Time",
      selector: (data) => {
        return (
          <Label
            variant="soft"
            color="success"
            sx={{ textTransform: "capitalize" }}
          >
            {moment(data?.endTime, "HH:mm").format("hh:mm a")}
          </Label>
        );
      },
      width: "150px",
    },
    {
      name: "Created By",
      width: "200px",
      cell: (data) => {
        return (
          <Tooltip
            title={
              data?.createdByName
                ? `${data?.createdByName} (${data.createdByRole})`
                : "N/A"
            }
          >
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {data?.createdByName
                ? `${data?.createdByName} (${data.createdByRole})`
                : "N/A"}
            </Typography>
          </Tooltip>
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
              setScholorshipInfo(row);
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
