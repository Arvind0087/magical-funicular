import { IconButton } from "@mui/material";
import moment from "moment";
import Iconify from "components/iconify/Iconify";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Button } from "@mui/material";

export const topiccolumns = ({
  openPopover,
  handleOpenPopover,
  setPyqsinfo,
  paginationpage,
}) => {
  const columnValues = [
    {
      name: "Sr. No.",
      selector: (row, index) =>
        paginationpage === 1
          ? index + 1
          : index === 9
          ? `${paginationpage}0`
          : `${paginationpage - 1}${index + 1}`,
      width: "80px",
    },
    {
      name: "Course Name",
      selector: (row) => row?.courseName,
      width: "140px",
    },
    {
      name: "Class",
      selector: (row) => row?.className,
      width: "120px",
    },
    {
      name: "Batch",
      cell: (row) => {
        return (
          <Tooltip title={row?.batchName}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.batchName}
            </Typography>
          </Tooltip>
        );
      },
      width: "150px",
    },
    {
      name: "Language",
      selector: (row) => row?.batchLanguage,
      width: "120px",
    },
    {
      name: "Title",
      cell: (row) => {
        return (
          <Tooltip title={row?.title}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.title}
            </Typography>
          </Tooltip>
        );
      },
      width: "150px",
    },
    {
      name: "Year",
      selector: (row) => row?.year,
      width: "100px",
    },
    {
      name: "Sequence",
      selector: (row) => row?.ORDERSEQ,
      width: "140px",
    },
    {
      name: "Pdf Title",
      cell: (row) => {
        return (
          <Tooltip title={row?.pdf_title}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.pdf_title}
            </Typography>
          </Tooltip>
        );
      },
      width: "150px",
    },
    {
      name: "Pdf",
      selector: (row) => {
        return (
          <Button onClick={() => window.open(row?.pdf, "_blank")}>
            <PictureAsPdfIcon />
          </Button>
        );
      },
      width: "100px",
    },
    {
      name: "Video Title",
      cell: (row) => {
        return (
          <Tooltip title={row?.video_title}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.video_title}
            </Typography>
          </Tooltip>
        );
      },
      width: "150px",
    },
    {
      name: "Video Url",
      cell: (row) => {
        return (
          <Tooltip title={row?.video}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.video}
            </Typography>
          </Tooltip>
        );
      },
      width: "180px",
    },
    {
      name: "Created Date",
      selector: (row) => moment(row.createdAt).format("DD MMM YYYY"),
    },
    {
      name: "Created By",
      cell: (data) => {
        return (
          <Tooltip
            title={
              data?.createdByName
                ? `${data?.createdByName} (${data?.createdByRole})`
                : "N/A"
            }
          >
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {data?.createdByName
                ? `${data?.createdByName} (${data?.createdByRole})`
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
              setPyqsinfo(row);
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
