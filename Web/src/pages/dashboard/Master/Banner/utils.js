import { IconButton } from "@mui/material";
import moment from "moment";
import Iconify from "../../../../components/iconify/Iconify";

export const bannercolumns = ({
  openPopover,
  handleOpenPopover,
  setBannerinfo,
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
      width: "20%",
    },
    // {
    //   name: "ID",
    //   selector: (row) => row.id,
    //   width: "20%",
    // },
    {
      name: "Banner Name",
      selector: (row) => row.title,
      width: "50%",
    },
    {
      name: "Banner Type",
      selector: (row) => row.type,
      width: "20%",
    },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              handleOpenPopover(e);
              setBannerinfo(row);
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        );
      },
      width: "10%",
    },
  ];
  return columnValues;
};
