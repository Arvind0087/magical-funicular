import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export const tophighlightcolumns = ({
  openPopover,
  handleOpenPopover,
  setTopHighLight,
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
      name: "Image",
      width: "150px",
      selector: (row) => {
        return (
          <img
            src={row.image}
            alt="logo"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "40px",
              objectFit: "cover",
            }}
          />
        );
      },
    },
    {
      name: "Title",
      cell: (row) => {
        return (
          <Tooltip title={row.title}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.title}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Description",
      cell: (row) => {
        return (
          <Tooltip title={row.description}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.description}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Created By",
      cell: (data) => {
        return (
          <Tooltip
            title={
              data?.createdByName
                ? `${data?.createdByName} (${data.createdByRole})`
                : "N/A"
            }
          >
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {data?.createdByName
                ? `${data?.createdByName} (${data.createdByRole})`
                : "N/A"}
            </Typography>
          </Tooltip>
        );
      },
      width: "150px",
    },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              handleOpenPopover(e);
              setTopHighLight(row);
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
