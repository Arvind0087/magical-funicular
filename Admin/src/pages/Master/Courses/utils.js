import { IconButton } from "@mui/material";
import moment from "moment";
import Iconify from "components/iconify/Iconify";
import ReactHtmlParser from "react-html-parser";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export const coursecolumns = ({
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
              objectFit: "cover",
            }}
          />
        );
      },
      width: "100px",
    },
    {
      name: "Course Name",
      // width: "250px",
      cell: (row) => {
        return (
          <Tooltip title={row.name}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.name}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Type",
      selector: (row) => {
        return row.type;
      },
      width: "120px",
    },
    {
      name: "Short Description",
      width: "200px",
      cell: (row) => {
        return (
          <Tooltip title={ReactHtmlParser(row.shortDescription)}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {ReactHtmlParser(row.shortDescription)}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Course Status",
      selector: (row) => (row.status === 1 ? "Active" : "Inactive"),
      // width: "250px",
    },
    {
      name: "Created Date",
      selector: (row) => moment(row.createdAt).format("DD MMM YYYY"),
      // width: "160px",
    },
    {
      name: "Created By",
      // selector: (data) =>
      //   data?.createdByName
      //     ? `${data?.createdByName} (${data.createdByRole})`
      //     : "N/A",
      cell: (row) => {
        return (
          <Tooltip
            title={
              row?.createdByName
                ? `${row?.createdByName} (${row.createdByRole})`
                : "N/A"
            }
          >
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.createdByName
                ? `${row?.createdByName} (${row.createdByRole})`
                : "N/A"}
            </Typography>
          </Tooltip>
        );
      },
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
    },
  ];
  return columnValues;
};
