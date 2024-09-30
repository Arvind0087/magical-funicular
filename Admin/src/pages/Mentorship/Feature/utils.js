import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";

export const featurecolumns = ({
  openPopover,
  handleOpenPopover,
  setFeatureInfo,
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
      name: "Image",
      selector: (row) => {
        return (
          <img
            src={row.image}
            alt="logo"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "40px",
              objectFit: "cover"
            }}
          />
        );
      }
    },
    {
      name: "Title",
      selector: (row) => row.title
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
              handleOpenPopover(e);
              setFeatureInfo(row);
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        );
      }
    }
  ];
  return columnValues;
};
