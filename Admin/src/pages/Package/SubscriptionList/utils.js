import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import moment from "moment";
import Label from "components/label/Label";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
export const subscriptionListcolumns = ({
  openPopover,
  handleOpenPopover,
  setPackageboardinfo,
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
      name: "Package Name",
      cell: (row) => {
        return (
          <Tooltip title={row.packageName}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.packageName}
            </Typography>
          </Tooltip>
        );
      },
      width: "200px",
    },
    {
      name: "Subscription Name",
      cell: (row) => {
        return (
          <Tooltip title={row.subscriptionName}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.subscriptionName}
            </Typography>
          </Tooltip>
        );
      },
      width: "200px",
    },
    {
      name: "Board Name",
      cell: (row) => {
        return (
          <Tooltip title={row.boardName}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.boardName}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Class Name",
      selector: (row) => row.className,
    },
    {
      name: " Batch Name",
      selector: (row) => (row.batchTypeName ? row.batchTypeName : "N/A"),
    },
    {
      name: "Batch Start Date",
      selector: (row) => {
        return (
          <Label
            variant="soft"
            color="success"
            sx={{ textTransform: "capitalize" }}
          >
            {row.batchStartDate
              ? moment(row.batchStartDate).format("DD MMM YYYY")
              : "N/A"}
          </Label>
        );
      },
      width: "200px",
    },
    {
      name: "Monthly Price",
      selector: (row) => row.monthlyPrice,
    },
    {
      name: "Monthly Discount Price",
      selector: (row) => row.monthlyDiscountedPrice,
    },
    {
      name: "Real Price",
      selector: (row) => row.realPrice,
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
              setPackageboardinfo(row);
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
