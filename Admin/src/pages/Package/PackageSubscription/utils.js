import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
export const subscriptioncolumns = ({
  openPopover,
  handleOpenPopover,
  setSubscriptioninfo,
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
      name: "Package Name",
      selector: (row) => row.packageName,
      width: "25%",
    },
    {
      name: "Title",
      selector: (row) => row.title,
      width: "25%",
    },
    {
      name: "Months Allowed",
      selector: (row) => row.month,
    },
    {
      name: "Created Date",
      selector: (data) => moment(data.createdAt).format("DD MMM YYYY"),
    },
    {
      name: "Created By",
      // selector: (data) =>
      //   data?.createdByName
      //     ? `${data?.createdByName} (${data.createdByRole})`
      //     : "N/A",
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
              setSubscriptioninfo(row);
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
