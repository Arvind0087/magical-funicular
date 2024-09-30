import { Box } from "@mui/system";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";

export const ordercolumns = ({
  paginationpage,
  openPopover,
  handleOpenPopover,
  setOrderInfo,
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
      name: "User Name",
      cell: (row) => {
        return (
          <Tooltip title={row.userName}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.userName}
            </Typography>
          </Tooltip>
        );
      },
      width: "150px",
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      width: "120px",
    },
    {
      name: "Package Name",
      cell: (row) => {
        return (
          <Tooltip title={row?.packageName}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.packageName}
            </Typography>
          </Tooltip>
        );
      },
      width: "230px",
    },
    {
      name: "Order Id",
      cell: (row) => {
        return (
          <Tooltip title={row?.orderId}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.orderId}
            </Typography>
          </Tooltip>
        );
      },
      width: "170px",
    },
    {
      name: "Amount",
      selector: (row) => row?.amount,
    },
    {
      name: "Address",
      cell: (row) => {
        return (
          <Tooltip title={row?.fullAddress}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.fullAddress}
            </Typography>
          </Tooltip>
        );
      },
      width: "190px",
    },
    {
      name: "Purchase Date",
      selector: (row) => moment(row?.purchaseDate).format("DD MMM YYYY"),
      width: "140px",
    },
    {
      name: "Validity",
      selector: (row) => moment(row.validity).format("DD MMM YYYY"),
      width: "140px",
    },
    {
      name: "Payment Mode",
      cell: (row) => {
        return (
          <Tooltip title={row?.paymentMode}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.paymentMode}
            </Typography>
          </Tooltip>
        );
      },
      width: "140px",
    },
    {
      name: "Auto Renewal",
      selector: (row) => (row?.autoRenewal ? row?.autoRenewal : "NA"),
      width: "140px",
    },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              handleOpenPopover(e);
              setOrderInfo(row);
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
