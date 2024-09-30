import { IconButton } from "@mui/material";
import Iconify from "../../../components/iconify/Iconify";
import moment from "moment";

export const studentcolumns = ({
  openPopover,
  handleOpenPopover,
  setStudentinfo,
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
      name: "Image",
      selector: (row) => {
        return (
          <img
            src={row.avatar}
            alt="logo"
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />
        );
      },
      width: "140px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      width: "150px",
    },
    {
      name: "Date of Birth",
      selector: (row) => moment(row.dob).format("ll"),
      width: "150px",
    },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              setStudentinfo(row);
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
