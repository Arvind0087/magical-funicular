import { IconButton } from "@mui/material";
import moment from "moment";
import Iconify from "../../../../components/iconify/Iconify";

export const batchcolumns = ({
  openPopover,
  handleOpenPopover,
  setBatchInfo,
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
    // {
    //   name: "ID",
    //   selector: (row) => row.id,
    //   width: "80px",
    // },
    {
      name: "Batch Name",
      selector: (row) => row.name,
    },
    {
      name: "Course Name",
      selector: (row) => row?.course?.name,
    },
    {
      name: "Board Name",
      selector: (row) => row?.board?.name,
    },

    {
      name: "Class Name",
      selector: (row) => row?.class?.name,
    },
    {
      name: "Created Date",
      selector: (row) => moment(row.createdAt).format("ll"),
    },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              handleOpenPopover(e);
              setBatchInfo(row);
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        );
      },
      // width: "80px",
    },
  ];
  return columnValues;
};
