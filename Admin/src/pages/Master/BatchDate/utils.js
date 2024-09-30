import { IconButton } from "@mui/material";
import moment from "moment";
import Iconify from "components/iconify/Iconify";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export const batchdatecolumns = ({
  openPopover,
  handleOpenPopover,
  setBatchdateinfo,
  paginationpage,
}) => {
  const columnValues = [
    {
      name: "Sr. No.",
      selector: (row, index) =>
        paginationpage === 1
          ? index + 1
          : index === 9
          ? `${paginationpage}0`
          : `${paginationpage - 1}${index + 1}`,
      width: "80px",
    },
    {
      name: "Course, Board, Class",
      cell: (row) => {
        return (
          <Tooltip title={`(${row?.course}) (${row?.board}) (${row?.class})`}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {`(${row?.course}) (${row?.board}) (${row?.class})`}
            </Typography>
          </Tooltip>
        );
      },
      width: "280px",
    },
    {
      name: "Batch Name",
      cell: (row) => {
        return (
          <Tooltip title={`${row?.batchName}`}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {`${row?.batchName}`}
            </Typography>
          </Tooltip>
        );
      },
      width: "150px",
    },
    {
      name: "Start Date",
      selector: (row) => moment(row.date).format("DD MMM YYYY"),
      width: "120px",
    },
    {
      name: "End Date",
      selector: (row) =>
        row.endDate ? moment(row.endDate).format("DD MMM YYYY") : "NA",
      width: "120px",
    },
    {
      name: "Batch Status",
      selector: (row) => (row.status === 1 ? "Active" : "Inactive"),
      width: "120px",
    },
    {
      name: "Created Date",
      selector: (row) => moment(row.createdAt).format("DD MMM YYYY"),
      width: "120px",
    },
    {
      name: "Created By",
      selector: (data) =>
        data?.createdByName
          ? `${data?.createdByName} (${data.createdByRole})`
          : "N/A",
    },
    {
      name: "Actions",
      width: "150px",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              handleOpenPopover(e);
              setBatchdateinfo(row);
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
