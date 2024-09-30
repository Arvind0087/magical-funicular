import { capitalize } from "lodash";
import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
export const applicationcolumns = ({
  openPopover,
  handleOpenPopover,
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
      name: "Scholarship Name",
      // selector: (row) => row.title,
      cell: (row) => {
        return (
          <Tooltip title={row.title}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.title}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Student Name",
      selector: (row) => row.user,
    },
    {
      name: "Class",
      selector: (row) => row.class,
    },
    {
      name: "Batch",
      selector: (row) => row.batchType,
    },
    {
      name: "State",
      selector: (row) => capitalize(row.state),
    },
    {
      name: "City",
      selector: (row) => row.city,
    },
    // {
    //   name: "Actions",
    //   selector: (row) => {
    //     return (
    //       <IconButton
    //         color={openPopover ? "inherit" : "default"}
    //         onClick={(e) => {
    //           handleOpenPopover(e);
    //           // setPackageboardinfo(row);
    //         }}
    //       >
    //         <Iconify icon="eva:more-vertical-fill" />
    //       </IconButton>
    //     );
    //   },
    // },
  ];
  return columnValues;
};
