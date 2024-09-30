import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import _ from 'lodash'
export const columns = ({
  openPopover,
  handleOpenPopover,
  setCategoryInfo,
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
      name: "Category",
      selector: (data) =>  _.capitalize(data?.category),
    },
    {
      name: "Created By",
      selector: (data) => data.createdByName ? `${data.createdByName} (${data.createdByRole})`:"N/A"
    },
    
    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              handleOpenPopover(e);
              setCategoryInfo(row.id);
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
