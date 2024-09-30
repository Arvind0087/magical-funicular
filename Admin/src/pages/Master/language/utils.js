import { IconButton } from "@mui/material";
import moment from "moment";
import Iconify from "components/iconify/Iconify";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export const languagecolumns = ({
  openPopover,
  handleOpenPopover,
  setBatchInfo,
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
      width: "270px",
    },
    {
      name: "Language",
      selector: (row) => row.language,
    },
    {
      name: "Batch Status",
      selector: (row) => (row.status === 1 ? "Active" : "Inactive"),
    },
    {
      name: "Created Date",
      selector: (row) => moment(row.createdAt).format("DD MMM YYYY"),
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
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              handleOpenPopover(e);
              setBatchInfo(row);
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        );
      },
      // width: "80px",
    },
  ];
  return columnValues;
};
