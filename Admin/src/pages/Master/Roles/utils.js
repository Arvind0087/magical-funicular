import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import { capitalize } from "lodash";

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
      name: "Role Name",
      selector: (row) => capitalize(row?.role),
    },
    {
      name: "Created By",
      selector: (data) =>
      data?.createdByName
        ? `${data?.createdByName} (${data?.createdByRole})`
        : "N/A"
    },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <>
            {row.role !== "superAdmin" && (
              <IconButton
                color={openPopover ? "inherit" : "default"}
                onClick={(e) => {
                  handleOpenPopover(e);
                  setInfoId(row?.id);
                }}
              >
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];
  return columnValues;
};
