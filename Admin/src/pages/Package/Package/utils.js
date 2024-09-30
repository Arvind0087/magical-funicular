import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import Label from "components/label/Label";
import { capitalize } from "lodash";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
export const packagecolumns = ({
  openPopover,
  handleOpenPopover,
  setPackagemasterinfo,
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
      name: "Course Name",
      width: "170px",
      selector: (row) => row.courseName,
    },
    {
      name: "Package Name",
      selector: (row) => row.name,
      width: "15%",
    },
    {
      name: "Tag",
      // selector: (row) => {
      //   return (
      //     <Label
      //       variant="soft"
      //       color="success"
      //       sx={{ textTransform: "capitalize" }}
      //     >
      //       {capitalize(row.tag)}
      //     </Label>
      //   );
      // },
      cell: (row) => {
        return (
          <Tooltip
            title={
              <Label
                variant="soft"
                color="success"
                sx={{ textTransform: "capitalize" }}
              >
                {capitalize(row.tag)}
              </Label>
            }
          >
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {
                <Label
                  variant="soft"
                  color="success"
                  sx={{ textTransform: "capitalize" }}
                >
                  {capitalize(row.tag)}
                </Label>
              }
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Starting Price",
      selector: (row) => row.startingPrice,
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
              setPackagemasterinfo(row);
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
