import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import Label from "components/label/Label";
import { capitalize } from "lodash";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
export const gallarycolumns = ({
  openPopover,
  handleOpenPopover,
  setgalleryInfo,
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
      name: "Uploaded Date",
      selector: (row) => moment(row.date).format("DD MMM YYYY"),
      width: "150px",
    },
    {
      name: "Title",
      cell: (row) => {
        return (
          <Tooltip title={capitalize(row?.title)}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {capitalize(row?.title)}
            </Typography>
          </Tooltip>
        );
      },
      width: "150px",
    },
    {
      name: "File Location",
      selector: (row) => {
        return (
          <Label
            variant="contained"
            color="success"
            sx={{ textTransform: "capitalize", cursor: "pointer" }}
            onClick={() => {
              navigator.clipboard.writeText(row.location);
              toast.success("File Location Copied!", toastoptions);
            }}
          >
            Copy to Clipboard
          </Label>
        );
      },
    },
    {
      name: "Created By",

      selector: (data) =>
      data?.createdByName
        ? `${data?.createdByName} (${data.createdByRole})`
        : "N/A"
     
    },

    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              handleOpenPopover(e);
              setgalleryInfo(row);
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

export const _type = [
  {
    label: "image",
    value: "Image",
  },
  {
    label: "video",
    value: "Video",
  },
];
