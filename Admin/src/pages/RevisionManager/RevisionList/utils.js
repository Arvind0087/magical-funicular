import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

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
      name: "Image",
      width: "100px",
      selector: (data) => {
        return (
          <img
            src={data?.list[0]?.image}
            alt="Question Image"
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
      name: "Course, Board, Class, Batch",
      cell: (row) => {
        return (
          <Tooltip
            title={
              `(${row.courseName})` +
              " " +
              `(${row.boardName})` +
              " " +
              `(${row.className})` +
              " " +
              `(${row.batchTypeName})`
            }
          >
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {`(${row.courseName})` +
                " " +
                `(${row.boardName})` +
                " " +
                `(${row.className})` +
                " " +
                `(${row.batchTypeName})`}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Subject Name",
      cell: (data) => {
        return (
          <Tooltip title={data.subjectName}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {data.subjectName}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Chapter",
      cell: (data) => {
        return (
          <Tooltip title={data.chapaterName}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {data.chapaterName}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Category",
      selector: (data) => data.category,
    },
    {
      name: "Topic Name",
      // selector: (data) => data?.topic,
      cell: (data) => {
        return (
          <Tooltip title={data?.topic}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {data?.topic}
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
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              setInfoId(row.id);
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
