import { Box } from "@mui/material";

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
      selector: (row, index) => row.userName,
    },
    {
      name: "Order Name",
      selector: (row, index) => row.orderId,
    },
    {
      name: "Package Name",
      selector: (row, index) => row.packageName,
    },
    {
      name: "Subscription",
      selector: (row, index) => row.subscriptionTitle,
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
