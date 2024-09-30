import { IconButton, Typography } from "@mui/material";
import moment from "moment";
import Iconify from "components/iconify/Iconify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Tooltip from "@mui/material/Tooltip";

export const studentcolumns = ({
  openPopover,
  handleOpenPopover,
  setSubjectinfo,
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
      selector: (data) => {
        return (
          <LazyLoadImage
            alt={data.question}
            effect="blur"
            src={data.image}
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
      name: "Course, Board, Class, Batch",
      cell: (row) => {
        return (
          <Tooltip
            title={`(${row?.course}) (${row?.board}) (${row?.class}) (${row?.batchType})`}
          >
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {`(${row?.course}) (${row?.board}) (${row?.class}) (${row?.batchType})`}
            </Typography>
          </Tooltip>
        );
      },
      width: "250px",
    },
    {
      name: "Subject Name",
      cell: (row) => {
        return (
          <Tooltip
            title={row.subjectName}
          >
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.subjectName}
            </Typography>
          </Tooltip>
        );
      },
      width: "150px",
    },
    {
      name: "Subject Status",
      selector: (row) => (row.status === 1 ? "Active" : "Inactive"),
      width: "150px",
    },
    {
      name: "Is All Subjects",
      width: "150px",
      selector: (data) => {
        if (data.isAllSubject === true) {
          return "True";
        } else {
          return "False";
        }
      },
    },
    {
      name: "Created Date",
      selector: (row) => moment(row.createdAt).format("DD MMM YYYY"),
      width: "160px",
    },
    {
      name: "Created By",
      width: "150px",
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
              setSubjectinfo(row);
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
