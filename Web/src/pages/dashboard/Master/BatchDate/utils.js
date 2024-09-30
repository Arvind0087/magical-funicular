import { IconButton } from "@mui/material";
import moment from "moment";
import Iconify from "../../../../components/iconify/Iconify";

export const batchdatecolumns = ({
  openPopover,
  handleOpenPopover,
  setBatchdateinfo,
  paginationpage
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
    // {
    //   name: "ID",
    //   selector: (row) => row.id,
    //   width: "80px",
    // },
    {
      name: "Course Name",
      selector: (row) => row.course.name,
      width: "150px",
    },
    {
      name: "Board Name",
      selector: (row) => row.board.name,
      width: "150px",
    },
    {
      name: "Class Name",
      selector: (row) => row.class.name,
      width: "150px",
    },
    {
      name: "Batch Type Name",
      selector: (row) => row.batchType.name,
      width: "150px",
    },
    {
      name: " Date",
      selector: (row) => moment(row.date).format("ll"),
      width: "150px",
    },
    {
      name: "Created Date",
      selector: (row) => moment(row.createdAt).format("ll"),
      width: "150px",
    },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              handleOpenPopover(e);
              setBatchdateinfo(row);
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        );
      },
    },
  ];
  return columnValues;
};
