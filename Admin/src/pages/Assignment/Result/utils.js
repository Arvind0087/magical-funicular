import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import Label from "components/label/Label";
import { capitalize } from "lodash";

export const assignmentcolumns = ({
  openPopover,
  handleOpenPopover,
  setAssignmentInfo,
  paginationpage
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
      width: "80px"
    },
    {
      name: "Student Name",
      selector: (data) => data?.studentName
    },
    {
      name: "Assignment Name",
      selector: (data) => data?.title
    },
    {
      name: "Assignment type",
      selector: (data) => capitalize(data?.type)
    },
    {
      name: "Mode",
      selector: (row) => {
        return (
          <Label
            variant="soft"
            color={_mode[row.mode]?.color}
            sx={{ textTransform: "capitalize" }}
          >
            {_mode[row.mode]?.label ? _mode[row.mode]?.label : row.mode}
          </Label>
        );
      },
      width: "150px"
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
      }
    }
  ];
  return columnValues;
};

const _mode = {
  online: {
    label: "Online",
    color: "success"
  },
  offline: {
    label: "Offline",
    color: "warning"
  }
};
