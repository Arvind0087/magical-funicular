import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import moment from "moment";

export const studentcolumns = ({
  openPopover,
  handleOpenPopover,
  setAttendanceinfo,
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
      selector: (row) => row?.student,
    },
    {
      name: "Date",
      selector: (row) => moment(row?.createdAt).format("DD MMM YYYY")
    },
    {
      name: "Time",
      selector: (row) => moment(row?.createdAt).format("HH:MM")
    },
    {
      name: "Attendance",
      selector: (row) => row?.mark,
      width: "150px"
    },

    {
      name: "Status",
      selector: (row) => row?.status,
      width: "150px"
    }

    // {
    //   name: "Actions",
    //   selector: (row) => {
    //     return (
    //       <IconButton
    //         color={openPopover ? "inherit" : "default"}
    //         onClick={(e) => {
    //           setAttendanceinfo(row);
    //           handleOpenPopover(e);
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
