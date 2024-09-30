import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import { capitalize } from "lodash";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
export const ownQuestionColumn = ({
  openPopover,
  handleOpenPopover,
  setSOQinfo,
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
      name: "Student Name",
      selector: (row) => row.student,
    },
    {
      name: "Class",
      selector: (row) => row.className,
    },
    {
      name: "Batch",
      selector: (row) => row.batchType,
    },
    {
      name: "Difficulty Levels",
      cell: (row) => {
        return (
          <Tooltip title={row.difficultyLevels?.join(",")}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.difficultyLevels?.join(",")}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Questions",
      selector: (row) => row.numberOfQuestions,
    },
    {
      name: "Time Duration",
      selector: (row) => moment.duration(row?.time).asMinutes() + " Minute",
    },

    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              handleOpenPopover(e);
              setSOQinfo(row);
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
