import { Box } from "@mui/system";
import moment from "moment";

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
   
    },
    {
      name: "User Name",
      selector: (row) => row.userName,
      width: "150px",
    },
    {
      name: "Package Name",
      selector: (row) => row.packageName,
      width: "150px",
    },
    {
      name: "Subscription Name",
      selector: (row) => row.subscriptionTitle,
         width: "200px",
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
    },
    {
      name: "Purchase Date",
      selector: (row) => moment(row.purchaseDate).format("DD MMMM YYYY"),
      width: "150px",
    },
    {
      name: "Validity",
      selector: (row) => moment(row.validity).format("DD MMMM YYYY"),
      
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
      width: "200px",
    },
    {
      name: "Auto Renewal",
      selector: (row) => row.autoRenewal,
      width: "200px",
    },
  ];
  return columnValues;
};
