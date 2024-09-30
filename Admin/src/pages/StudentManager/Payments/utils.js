import { Box } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export const paymentcolumns = ({
  openPopover,
  handleOpenPopover,
  setPaymentInfo,
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
    },
    {
      name: "Order Name",
      cell: (row) => {
        return (
          <Tooltip title={row.orderId}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.orderId}
            </Typography>
          </Tooltip>
        );
      },
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
    },
    {
      name: "Phone",
      selector: (row, index) => row.phone,
    },
    {
      name: "Subscription",
      cell: (row) => {
        return (
          <Tooltip title={row.subscriptionTitle}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.subscriptionTitle}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Amount",
      selector: (row, index) => row.amount,
    },
    {
      name: "Status",
      selector: (row, index) => {
        return (
          <Box
            sx={{
              backgroundColor: row.status === "success" ? "#ebf8f2" : "#ffefef",
              borderRadius: "500px",
              p: "4px 12px",
            }}
          >
            {row.status}
          </Box>
        );
      },
    },
  ];
  return columnValues;
};
