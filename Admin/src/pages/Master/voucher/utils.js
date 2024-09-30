import { IconButton, Typography } from "@mui/material";
import moment from "moment";
import Iconify from "components/iconify/Iconify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Tooltip from "@mui/material/Tooltip";

export const studentcolumns = ({
  openPopover,
  handleOpenPopover,
  setVoucherinfo,
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
      name: "Course",
      cell: (row) => {
        return (
          <Tooltip title={`${row?.courseName}`}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {`${row?.courseName}`}
            </Typography>
          </Tooltip>
        );
      },
      width: "120px",
    },
    {
      name: "Voucher Code",
      selector: (row) => row?.voucher_code,
      width: "140px",
    },
    {
      name: "Voucher Visible",
      selector: (row) =>
        row?.show_voucher == 1 ? (
          <span
            style={{
              color: "green",
              fontWeight: 600,
            }}
          >
            Yes
          </span>
        ) : (
          <span
            style={{
              color: "red",
              fontWeight: 600,
            }}
          >
            No
          </span>
        ),
      width: "140px",
    },
    {
      name: "Description",
      selector: (row) => row?.voucher_description?.slice(0, 60),
      width: "150px",
    },
    {
      name: "Type",
      selector: (row) => row?.voucher_type,
      width: "100px",
    },
    {
      name: "Discount (%)",
      selector: (row) => row?.voucher_discount,
      width: "120px",
    },
    {
      name: "Voucher Status",
      selector: (row) => (row.status === 1 ? "Active" : "Inactive"),
      width: "130px",
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
              setVoucherinfo(row);
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
