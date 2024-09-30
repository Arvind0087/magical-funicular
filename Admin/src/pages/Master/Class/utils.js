import { IconButton } from "@mui/material";
import moment from "moment";
import Iconify from "components/iconify/Iconify";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

export const classcolumns = ({
  openPopover,
  handleOpenPopover,
  setClassInfo,
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
      name: "Course Board",
      // selector: (row) => `(${row?.course})` + " " + `(${row?.board})`
      cell: (row) => {
        return (
          <Tooltip title={`(${row?.course})` + " " + `(${row?.board})`}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {`(${row?.course})` + " " + `(${row?.board})`}
            </Typography>
          </Tooltip>
        );
      },
    },

    {
      name: "Class Name",
      // selector: (row) => row.className
      cell: (row) => {
        return (
          <Tooltip title={row.className}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.className}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Class Status",
      selector: (row) => (row.status === 1 ? "Active" : "Inactive"),
    },

    {
      name: "Created Date",
      selector: (row) => moment(row.createdAt).format("DD MMM YYYY"),
    },
    {
      name: "Created By",
      // selector: (data) =>
      //   data?.createdByName
      //     ? `${data.createdByName}  (${data.createdByRole})`
      //     : "N/A",

      cell: (data) => {
        return (
          <Tooltip
            title={
              data?.createdByName
                ? `${data.createdByName}  (${data.createdByRole})`
                : "N/A"
            }
          >
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {data?.createdByName
                ? `${data.createdByName}  (${data.createdByRole})`
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
              setClassInfo(row);
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
