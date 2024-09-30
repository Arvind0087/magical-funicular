import moment from "moment";
import _ from 'lodash';
import Label from "components/label/Label";

export const StudentRequestcolumns = ({ paginationpage }) => {
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
      name: "Student",
      selector: (data) => data?.user,
    },
    {
      name: "Reason",
      selector: (row) => row?.reason,
    },
    {
      name: "Contact",
      selector: (row) => row?.phone,
    },
    // {
    //   name: "Date",
    //   selector: (row) => moment(row.date).format("DD MMM YYYY"),

    //   // width: "350px",
    // },
    {
      name: "Date and Time",
      selector: (data) => {
        const getTime = new Date(data?.date);

        const year = getTime.getUTCFullYear();
        const month = ("0" + (getTime.getUTCMonth() + 1)).slice(-2);
        const date = ("0" + getTime.getUTCDate()).slice(-2);
        const hour = getTime.getUTCHours() % 12 || 12; // convert to 12-hour format
        const minute = ("0" + getTime.getUTCMinutes()).slice(-2);
        const period = getTime.getUTCHours() < 12 ? "AM" : "PM"; // get AM/PM

        return (
          <Label
            variant="soft"
            color="success"
            sx={{ textTransform: "capitalize" }}
          >
            {` ${date}-${month}-${year}`}
            {` ${hour}:${minute} ${period}`}
          </Label>
        );
      },
      width: "200px"
    }
  ];
  return columnValues;
};
