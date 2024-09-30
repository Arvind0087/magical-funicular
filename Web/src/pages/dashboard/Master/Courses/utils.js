import { IconButton } from "@mui/material";
import moment from "moment";
import Iconify from "../../../../components/iconify/Iconify";

export const coursecolumns = ({
  DataLogo,
  openPopover,
  handleOpenPopover,
  setCourseInfo,
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
      name: "Image",
      selector: (row) => {
        return (
          <img
            src={row.image}
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
      name: "Course Name",
      selector: (row) => row.name,
      width: "200px",
      // sortable: true,
    },
    {
      name: "Short Description",
      selector: (row) => row.shortDescription,
      width: "450px",
      wrap: true,
    },
    {
      name: "Created Date",
      selector: (row) => moment(row.createdAt).format("ll"),
      width: "160px",
      // sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              handleOpenPopover(e);
              setCourseInfo(row);
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
