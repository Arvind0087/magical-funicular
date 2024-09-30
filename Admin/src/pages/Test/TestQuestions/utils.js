import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import Label from "components/label/Label";
import { capitalize } from "lodash";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
export const testcolumns = ({
  openPopover,
  handleOpenPopover,
  setTestinfo,
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
      name: "Paper Type",
      selector: (data) => capitalize(data.category),
    },
    {
      name: "Paper Name",
      selector: (data) => data.title || "N/A",
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
            {moment.duration(data.time).asMinutes() + " Minute"}
          </Label>
        );
      },
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
      width: "150px",
    },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              handleOpenPopover(e);
              setTestinfo(row);
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
