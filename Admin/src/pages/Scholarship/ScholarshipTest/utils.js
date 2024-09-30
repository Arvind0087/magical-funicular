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
      name: "Scholarship Name",
      cell: (row) => {
        return (
          <Tooltip title={row?.title}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.title}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Scholarship Type",
      selector: (data) => capitalize(data?.category),
    },
    {
      name: "Total Questions",
      selector: (data) => data?.numberOfQuestions,
    },
    {
      name: "Mode",
      selector: (data) => data?.selectionProcess,
    },

    {
      name: "Created By",
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
