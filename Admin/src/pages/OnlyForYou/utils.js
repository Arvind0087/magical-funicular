import { IconButton } from "@mui/material";
import moment from "moment";
import Iconify from "components/iconify/Iconify";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export const onlycolumns = ({
  openPopover,
  handleOpenPopover,
  setOnlyInfo,
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
      width: "100px",
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
      width: "250px",
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
      name: " Description",
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
      name: " Button Text",
      selector: (row) => row.buttonText,
    },
    {
      name: " HyperLink",
      // selector: (row) => {
      //   if (row?.buttonLink === "") {
      //     return row?.otherLink;
      //   } else {
      //     return row?.buttonLink
      //   }
      // },
      cell: (row) => {
        return (
          <Tooltip
            title={row?.buttonLink === "" ? row?.otherLink : row?.buttonLink}
          >
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.buttonLink === "" ? row?.otherLink : row?.buttonLink}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Created By",
      // selector: (data) =>
      //   data?.createdByName
      //     ? `${data?.createdByName} (${data.createdByRole})`
      //     : "N/A",
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
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              handleOpenPopover(e);
              setOnlyInfo(row);
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
