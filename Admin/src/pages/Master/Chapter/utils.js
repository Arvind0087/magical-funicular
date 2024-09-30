import { IconButton } from "@mui/material";
import moment from "moment";
import Iconify from "components/iconify/Iconify";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Button } from "@mui/material";

export const chaptercolumns = ({
  openPopover,
  handleOpenPopover,
  setChapterInfo,
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
          <Tooltip title={row?.subject}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.subject}
            </Typography>
          </Tooltip>
        );
      },
      width: "130px",
    },
    {
      name: "Chapter Name",
      selector: (row) => row.chapterName,
      width: "130px",
    },
    {
      name: "Chapter Status",
      selector: (row) => (row.status === 1 ? "Active" : "Inactive"),
      width: "140px",
    },
    {
      name: "Sequence",
      selector: (row) => row?.ORDERSEQ,
      width: "100px",
    },
    {
      name: "Notes Pdf",
      selector: (row) => {
        return (
          <Button onClick={() => window.open(row?.note, "_blank")}>
            {row?.note ? <PictureAsPdfIcon /> : ""}
          </Button>
        );
      },
      width: "100px",
    },
    
    {
      name: "Free Pdf",
      selector: (row) => {
        return (
          <Button onClick={() => window.open(row?.free_note_pdf, "_blank")}>
            {row?.free_note_pdf ? <PictureAsPdfIcon /> : ""}
          </Button>
        );
      },
      width: "100px",
    },
    {
      name: "Imp Ques. Pdf",
      selector: (row) => {
        return (
          <Button onClick={() => window.open(row?.free_question_pdf, "_blank")}>
            {row?.free_question_pdf ? <PictureAsPdfIcon /> : ""}
          </Button>
        );
      },
      width: "130px",
    },
    {
      name: "Created Date",
      selector: (row) => moment(row.createdAt).format("DD MMM YYYY"),
      // width: "160px",
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
              setChapterInfo(row);
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
