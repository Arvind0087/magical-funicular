import Label from "components/label/Label";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";
export const schedulecolumns = ({ paginationpage }) => {
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
      name: "Name",
      selector: (row, index) => row.adminUser,
      // cell:(row)=>{
      //   <Tooltip title={row.adminUser}>
      //     <span>{row.adminUser}</span>
      //   </Tooltip>
      // }
    },
    {
      name: "Date",
      selector: (row, index) => moment(row?.date).format("DD MMMM YYYY"),
    },
    {
      name: "Day",
      selector: (row, index) => moment(row?.date).format("dddd"),
    },
    {
      name: "Availability",
      selector: (row, index) => {
        return (
          <Label
            variant="soft"
            color={row.availability ? "success" : "warning"}
            sx={{ textTransform: "capitalize" }}
          >
            {row.availability ? "Available" : "Unavailable"}
          </Label>
        );
      },
    },
    {
      name: "Break Time",
      selector: (row, index) => row.breakTime,
    },
    {
      name: "Duration",
      selector: (row, index) => row.duration,
    },
  ];
  return columnValues;
};
