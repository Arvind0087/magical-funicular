import { IconButton } from "@mui/material";
import moment from "moment";
import Iconify from "components/iconify/Iconify";

export const scholorshipAddcolumns = ({
  openPopover,
  handleOpenPopover,
  setScholorshipInfo,
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
      name: "Scholarship Title",
      selector: (data) => data?.title,
    },
    {
      name: "Last Date For Registration",
      selector: (data) =>
        moment(data?.lastDateOfRegistration).format("DD MMM YYYY"),
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
              setScholorshipInfo(row);
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
