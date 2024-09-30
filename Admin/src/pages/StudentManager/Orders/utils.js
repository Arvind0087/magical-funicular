import { Box } from "@mui/system";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export const ordercolumns = ({ paginationpage }) => {
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
      name: "User Name",
      cell: (row) => {
        return (
          <Tooltip title={row.userName}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.userName}
            </Typography>
          </Tooltip>
        );
      },
      // width: "150px",
    },
    {
      name: "Package Name",
      cell: (row) => {
        return (
          <Tooltip title={row.packageName}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.packageName}
            </Typography>
          </Tooltip>
        );
      },
      // width: "150px",
    },
    {
      name: "Subscription Name",
      cell: (row) => {
        return (
          <Tooltip title={row.subscriptionTitle}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.subscriptionTitle}
            </Typography>
          </Tooltip>
        );
      },
      // width: "180px",
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
    },
    {
      name: "Purchase Date",
      selector: (row) => moment(row.purchaseDate).format("DD MMM YYYY"),
      // width: "150px",
    },
    {
      name: "Validity",
      selector: (row) => moment(row.validity).format("DD MMM YYYY"),
    },
    {
      name: "Package Status",
      selector: (row) => {
        return (
          <Box
            sx={{
              backgroundColor:
                row.packageStatus === "Active" ? "#ebf8f2" : "#ffefef",
              borderRadius: "500px",
              p: "4px 12px",
            }}
          >
            {row.packageStatus}
          </Box>
        );
      },
      // width: "200px",
    },
    {
      name: "Auto Renewal",
      selector: (row) => row.autoRenewal,
      // width: "200px",
    },
  ];
  return columnValues;
};
