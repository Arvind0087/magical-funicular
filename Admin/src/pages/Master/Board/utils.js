import { IconButton } from "@mui/material";
import moment from "moment";
import Iconify from "components/iconify/Iconify";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export const boardcolumns = ({
  openPopover,
  handleOpenPopover,
  setBoardInfo,
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
      name: "Course Name",
      // selector: (row) => row?.course,
      cell: (row) => {
        return (
          <Tooltip title={row.course}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.course}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Board Name",
      // selector: (row) => row.name,
      cell: (row) => {
        return (
          <Tooltip title={row.name}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.name}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Board Status",
      selector: (row) => (row.status === 1 ? "Active" : "Inactive"),
    },
    {
      name: "Created Date",
      selector: (row) => moment(row.createdAt).format("DD MMM YYYY"),
    },
    {
      name: "Created By",
      // selector: (data) =>
      //   `${data?.createdByName}` + " " + `(${data?.createdByRole})`,
      cell: (row) => {
        return (
          <Tooltip
            title={`${row?.createdByName}` + " " + `(${row?.createdByRole})`}
          >
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {`${row?.createdByName}` + " " + `(${row?.createdByRole})`}
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
              setBoardInfo(row);
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
