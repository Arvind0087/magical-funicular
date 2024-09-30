import Label from "components/label/Label";
import { capitalize } from "lodash";
import moment from "moment";

export const historycolumns = ({ paginationpage }) => {
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
      name: "Batch Type",
      selector: (data) => capitalize(data?.batchType),
    },
    {
      name: "Teacher",
      selector: (data) => capitalize(data?.teacherName),
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
            {moment(row.attemptBy).format("DD MMM YYYY")}
          </Label>
        );
      },
    },
    {
      name: "Time",
      selector: (row) => {
        return (
          <Label
            variant="soft"
            color="success"
            sx={{ textTransform: "capitalize" }}
          >
            {moment(row.attemptBy.split("T")[1], "HH:mm").format("hh:mm a")}
          </Label>
        );
      },
    },
    {
      name: "Time Duration",
      selector: (row) => {
        return (
          <Label
            variant="soft"
            color="success"
            sx={{ textTransform: "capitalize" }}
          >
            {moment.duration(row?.time).asMinutes() + " Minute"}
          </Label>
        );
      },
    },
  ];
  return columnValues;
};
