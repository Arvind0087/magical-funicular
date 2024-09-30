import moment from "moment";
import _ from "lodash";
import Label from "components/label/Label";

export const feedbackcolumns = ({ paginationpage }) => {
  const columnValues = [
    {
      name: "Sl No.",
      selector: (row, index) =>
        paginationpage === 1
          ? index + 1
          : index === 9
          ? `${paginationpage}0`
          : `${paginationpage - 1}${index + 1}`,
      // width: "100px",
      width: "80px",
    },
    {
      name: "Student",
      selector: (data) => data?.student,
      width: "200px",
    },
    {
      name: "Feedback",
      selector: (row) => row?.feedback,
      width: "300px",
    },
    {
      name: "Contact",
      selector: (row) => row?.phone,
      width: "200px",
    },
    {
      name: "Date and Time",
      selector: (row) => moment(row.createdAt).format("DD-MM-YYYY h:mm A"),
      width: "190px",
      style: (row) => {
        return {
          fontWeight: "700",
          backgroundColor: "#DFE3E8",
          padding: "0px 8px",
          height: "24px",
          borderRadius: "6px",
          fontSize: "0.75rem",
          minWidth:"145px !important",
          maxWidth:"145px !important",
          width:"145px !important"
        };
      },
    },

    // {
    //   name: "Date and Time",
    //   width: "200px",
    //   selector: (data) => {
    //     const getTime = new Date(data?.createdAt);

    //     const year = getTime.getUTCFullYear();
    //     const month = ("0" + (getTime.getUTCMonth() + 1)).slice(-2);
    //     const date = ("0" + getTime.getUTCDate()).slice(-2);
    //     const hour = getTime.getUTCHours() % 12 || 12; // convert to 12-hour format
    //     const minute = ("0" + getTime.getUTCMinutes()).slice(-2);
    //     const period = getTime.getUTCHours() < 12 ? "AM" : "PM"; // get AM/PM

    //     return (
    //       <Label
    //         variant="soft"
    //         color="success"
    //         sx={{ textTransform: "capitalize" }}
    //       >
    //         {` ${date}-${month}-${year}`}
    //         {` ${hour}:${minute} ${period}`}
    //       </Label>
    //     );
    //   },
    //   width: "200px",
    // },
  ];
  return columnValues;
};
