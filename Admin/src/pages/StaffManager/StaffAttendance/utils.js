import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import moment from "moment";

export const studentcolumns = ({
  openPopover,
  handleOpenPopover,
  setAttendanceinfo,
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
      width: "80px"
    },

    {
      name: "Staff Name",
      selector: (row) => row?.teacher
    },
    {
      name: "Date",
      selector: (row) =>moment( row?.createdAt ).format("DD MMM YYYY")
    },
    {
      name: "Time",
      selector: (row) => moment( row?.createdAt ).format("HH:MM")
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
  ];
  return columnValues;
};


export const months = [
  {
      id: 1,
      label: 'January',
      value: 'January'
  },
  {
      id: 2,
      label: 'February',
      value: 'February'
  },
  {
      id: 3,
      label: 'March',
      value: 'March'
  },
  {
      id: 4,
      label: 'April',
      value: 'April'
  },
  {
      id: 5,
      label: 'May',
      value: 'May'
  },
  {
      id: 6,
      label: 'June',
      value: 'June'
  },
  {
      id: 7,
      label: 'July',
      value: 'July'
  },
  {
      id: 8,
      label: 'August',
      value: 'August'
  },
  {
      id: 9,
      label: 'September',
      value: 'September'
  },
  {
      id: 10,
      label: 'October',
      value: 'October'
  },
  {
      id: 11,
      label: 'November',
      value: 'November'
  },
  {
      id: 12,
      label: 'December',
      value: 'December'
  },
]
