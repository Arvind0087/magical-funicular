import { IconButton } from "@mui/material";
import moment from "moment";
import Iconify from "../../../../components/iconify/Iconify";

export const classcolumns = ({
  openPopover,
  handleOpenPopover,
  setClassInfo,
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
      name: "Course Name",
      selector: (row) => row?.course?.name,
      //   width: "100px",
    },
    {
      name: "Board Name",
      selector: (row) => row?.board?.name,
      //   width: "100px",
    },
    {
      name: "Class Name",
      selector: (row) => row.name,
      //   width: "150px",
    },
    // {
    //   name: "Status",
    //   selector: (row) => {
    //     return <p
    //       style={{
    //         color: "green",
    //       }}
    //     >
    //       Active
    //     </p>;
    //   },
    //   //   width: "150px",
    // },
    {
      name: "Created Date",
      selector: (row) => moment(row.createdAt).format("ll"),
      //   width: "150px",
    },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              handleOpenPopover(e);
              setClassInfo(row);
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
