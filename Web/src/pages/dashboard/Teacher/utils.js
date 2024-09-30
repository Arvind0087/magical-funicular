import { IconButton } from "@mui/material";
import Iconify from "../../../components/iconify/Iconify";
import moment from "moment";

export const teachercolumns = ({
  openPopover,
  handleOpenPopover,
  setTeacherinfo,
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
    //   name: "Id",
    //   selector: (row) => row.id,
    //   width: "150px",
    // },
    {
      name: "Name",
      selector: (row) => row.name,
      width: "150px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      width: "250px",
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      width: "150px",
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      width: "200px",
    },
    {
      name: "Department",
      selector: (row) => row.department,
      width: "200px",
    },
    {
      name: "Date of Birth",
      selector: (row) => moment(row.dob).format("ll"),
      width: "200px",
    },
    // {
    //   name: "Status",
    //   selector: (row) => {
    //     return (
    //       <p
    //         style={{
    //           color: "green",
    //         }}
    //       >
    //         Active
    //       </p>
    //     );
    //   },
    // },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              setTeacherinfo(row);
              handleOpenPopover(e);
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
