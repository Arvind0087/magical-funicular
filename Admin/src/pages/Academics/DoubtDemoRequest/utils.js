import { IconButton } from "@mui/material";
import moment from "moment";
import Iconify from "components/iconify/Iconify";
import Label from "components/label/Label";

export const doubtDemocolumns = ({
  openPopover,
  handleOpenPopover,
  setDoubtdemorquestInfo,
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
      selector: (row) => row?.student,
    },
    {
      name: "Type",
      selector: (row) => row?.type,
    },
    {
      name: "Subject",
      selector: (row) => row?.subject,
    },
    {
      name: "Status",
      selector: (row) => {
        const status = {
          Accepted: "success",
          Rejected: "error",
          Pending: 'warning'
        }
        return (
          <Label
            variant="soft"
            color={status[row?.status]}
            sx={{ textTransform: "capitalize" }}
          >
            {row?.status}
          </Label>
        );
      },
    },
    {
      name: "Teacher",
      selector: (row) => row?.teacher,
    },
    {
      name: "Date",
      selector: (row) => {
        return (
          <Label
            variant="soft"
            color="success"
            sx={{ textTransform: "capitalize" }}
          >
            {moment(row.date).format("DD MMM YYYY")}
          </Label>
        );
      },
      width: "200px",
    },

    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              handleOpenPopover(e);
              setDoubtdemorquestInfo(row);
            }}
            disabled={Boolean(
              row.status !== "Pending"
            )}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        );
      },
    },
  ];
  return columnValues;
};

export const _status = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "accepted",
    label: "Accepted",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
];
