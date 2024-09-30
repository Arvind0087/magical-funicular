import { Rating, Box } from "@mui/material";
import _ from "lodash";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export const columns = ({ paginationpage }) => {
  const columnValues = [
    {
      name: "Sr. No.",
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
      cell: (row) => {
        return (
          <Tooltip title={row?.name}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.name}
            </Typography>
          </Tooltip>
        );
      },
      width: "140px",
    },
    {
      name: "Course",
      selector: (row) => row.courseName,
    },
    {
      name: "Class",
      selector: (row) => row.className,
    },
    {
      name: "Batch",
      cell: (row) => {
        return (
          <Tooltip title={row?.batchName}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.batchName}
            </Typography>
          </Tooltip>
        );
      },
      width: "140px",
    },
    {
      name: "Rating",
      selector: (row) => {
        return (
          <Box sx={{ my: 2 }}>
            <Rating value={row.rating} readOnly />
          </Box>
        );
      },
      width: "150px",
    },
    {
      name: "Comment",
      // wrap: true,
      cell: (row) => {
        return (
          <Tooltip title={row?.comment}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.comment}
            </Typography>
          </Tooltip>
        );
      },
      width: "210px",
    },
    {
      name: "Issue",
      // selector: (row) => _.join(row?.issue, " , "),
      // wrap: true,
      cell: (row) => {
        return (
          <Tooltip title={_.join(row?.issue, " , ")}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {_.join(row?.issue, " , ")}
            </Typography>
          </Tooltip>
        );
      },
      width: "210px",
    },
    {
      name: "Date",
      selector: (row) => moment(row.createdAt).format("DD MMM YYYY"),
      width: "120px",
    },
  ];
  return columnValues;
};
