import { IconButton, Box } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export const reportcolumns = ({
  openPopover,
  handleOpenPopover,
  setIdinfo,
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
      name: "Student Name",
      cell: (data) => {
        return (
          <Tooltip title={data.student}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {data.student}
            </Typography>
          </Tooltip>
        );
      },
      width: "150px",
    },
    {
      name: "Parent Name",
      cell: (data) => {
        return (
          <Tooltip title={data.parent || "N/A"}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {data.parent || "N/A"}
            </Typography>
          </Tooltip>
        );
      },
      width: "150px",
    },
    {
      name: "Category",
      selector: (data) => data.category || "N/A",
      width: "150px",
    },
    {
      name: "Sub Category",
      // selector: (data) => data.subcategory || "N/A",
      cell: (data) => {
        return (
          <Tooltip title={data.subcategory || "N/A"}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {data.subcategory || "N/A"}
            </Typography>
          </Tooltip>
        );
      },
      width: "150px",
    },
    {
      name: "Message",
      // selector: (data) => (
      //   <Box sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
      //     {data?.messsage}
      //   </Box>
      // ),
      cell: (data) => {
        return (
          <Tooltip
            title={
              <Box sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
                {data?.messsage}
              </Box>
            }
          >
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {
                <Box
                  sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}
                >
                  {data?.messsage}
                </Box>
              }
            </Typography>
          </Tooltip>
        );
      },
      width: "500px",
    },
  ];
  return columnValues;
};
