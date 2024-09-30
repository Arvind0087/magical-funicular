import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";

export const columns = ({
  openPopover,
  handleOpenPopover,
  setInfoId,
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
      name: "Staff",
      selector: (row) => row.name,
      width: "150px",
    },
    {
      name: "Zoom SDK Key",
      selector: (row) => row.zoom_api_key,
    },
    {
      name: "Zoom Secret Key",
      selector: (row) => row.zoom_api_secret,
    },
    {
      name: "Zoom Auth Api Key ",
      selector: (row) => row.auth_api_key,
    },
    {
      name: "zoom Auth Api Secret ",
      selector: (row) => row.auth_api_secret,
    },
    {
      name: "Created By",
      selector: (data) =>
      data?.createdByName
        ? `${data?.createdByName} (${data.createdByRole})`
        : "N/A"
     
    },
   
    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              setInfoId(row);
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
