import {Rating,Box} from "@mui/material";
import _ from "lodash";
import moment from "moment";

export const columns = ({ paginationpage }) => {
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
      name: "Student Name",
      selector: (row) => row.name,
    },
    {
      name: "Rating",
      selector: (row) => {
        return (
          <Box sx={{my:2}}>
            <Rating value={row.rating} readOnly />
          </Box>
        );
      },
    },
    {
      name: "Comment",
      selector: (row) => row.comment,
      wrap: true
    },
    {
      name: "Comment",
      selector: (row) => _.join(row?.issue, " , "),
      wrap: true 
    },
    {
      name: "Date",
      selector: (row) =>moment(row.createdAt).format("DD MMM YYYY"),
    },
  ];
  return columnValues;
};
