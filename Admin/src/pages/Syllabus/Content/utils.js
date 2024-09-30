import { IconButton } from "@mui/material";
import moment from "moment";
import Iconify from "../../../components/iconify/Iconify";
import { capitalize } from "lodash";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export const syllabuscollumns = ({
  openPopover,
  handleOpenPopover,
  setSyllabusinfo,
  paginationpage,
}) => {
  const columnValues = [
    {
      name: "Sl No.",
      // sortable: true,
      selector: (row, index) =>
        paginationpage === 1
          ? index + 1
          : index === 9
          ? `${paginationpage}0`
          : `${paginationpage - 1}${index + 1}`,
      width: "80px",
    },
    {
      name: "Class",
      selector: (row) => row?.class?.map((ev) => ev.name),
      width: "100px",
    },
    {
      name: "Batch",
      selector: (row) => row?.batchType?.map((ev) => ev.name),
      width: "150px",
    },
    {
      name: "Subject",
      cell: (row) => {
        return (
          <Tooltip title={row?.subject?.map((ev) => ev.name)}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.subject?.map((ev) => ev.name)}
            </Typography>
          </Tooltip>
        );
      },
      width: "150px",
    },
    {
      name: "Chapter",
      cell: (row) => {
        return (
          <Tooltip title={row?.chapter?.map((ev) => ev.name)}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.chapter?.map((ev) => ev.name)}
            </Typography>
          </Tooltip>
        );
      },
      width: "200px",
    },
    {
      name: "Topic",
      cell: (row) => {
        return (
          <Tooltip title={row?.topic?.map((ev) => ev.name)}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.topic?.map((ev) => ev.name)}
            </Typography>
          </Tooltip>
        );
      },
      width: "200px",
    },
    {
      name: "Tag",
      cell: (row) => {
        return (
          <Tooltip title={capitalize(row?.tag)}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {capitalize(row?.tag)}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Source",
      cell: (row) => {
        return (
          <Tooltip title={capitalize(row?.source)}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {capitalize(row?.source)}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Sequence",
      cell: (row) => {
        return (
          <Tooltip title={capitalize(row?.source)}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.ORDERSEQ}
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
    },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              handleOpenPopover(e);
              setSyllabusinfo(row);
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
