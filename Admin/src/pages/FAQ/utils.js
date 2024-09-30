import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import { capitalize } from "lodash";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export const faqcolumns = ({
  openPopover,
  handleOpenPopover,
  setFaqinfo,
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
      name: "Question",
      cell: (row) => {
        return (
          <Tooltip title={row?.question}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.question?.slice(0, 30)}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Answer",
      cell: (row) => {
        return (
          <Tooltip title={row?.answer}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.answer?.slice(0, 30)}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Type",
      selector: (row) => capitalize(row.type),
      width: "150px",
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
              setFaqinfo(row);
              handleOpenPopover(e);
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
