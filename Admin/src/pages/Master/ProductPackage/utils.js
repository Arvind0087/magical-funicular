import { IconButton } from "@mui/material";
import moment from "moment";
import Iconify from "components/iconify/Iconify";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export const packageColumns = ({
  openPopover,
  handleOpenPopover,
  setPackageInfo,
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
      name: "Image",
      selector: (row) => {
        return (
          <img
            src={row.package_thumbnail}
            alt="logo"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "40px",
              objectFit: "cover",
            }}
          />
        );
      },
      width: "80px",
    },
    {
      name: "Class",
      selector: (row) => row?.className,
      width: "80px",
    },
    {
      name: "Title",
      cell: (row) => {
        return (
          <Tooltip title={row?.package_title}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.package_title}
            </Typography>
          </Tooltip>
        );
      },
      width: "180px",
    },
    {
      name: "Type",
      cell: (row) => {
        return (
          <Tooltip title={row.package_type}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.package_type}
            </Typography>
          </Tooltip>
        );
      },
      width: "150px",
    },
    {
      name: "Invoice Title",
      cell: (row) => {
        return (
          <Tooltip title={row?.invoice_title}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.invoice_title}
            </Typography>
          </Tooltip>
        );
      },
      width: "180px",
    },
    {
      name: "Shipping Price",
      selector: (row) => row?.delivery_charge,
      width: "140px",
    },
    {
      name: "Description",
      cell: (row) => {
        const description = JSON?.parse(row?.package_description)?.toString();
        const truncatedDescription = description?.substring(0, 20);
        const displayDescription =
          truncatedDescription.length < description.length
            ? truncatedDescription + "..."
            : truncatedDescription;

        return (
          <Tooltip
            title={
              <div
                dangerouslySetInnerHTML={{
                  __html: JSON?.parse(row?.package_description),
                }}
              />
            }
          >
            <div
              dangerouslySetInnerHTML={{
                __html: displayDescription,
              }}
            />
          </Tooltip>
        );
      },
      width: "200px",
    },
    {
      name: "Status",
      selector: (row) => (row?.status == 1 ? "Active" : "Inactive"),
    },
    {
      name: "Price",
      selector: (row) => row.package_price,
    },
    {
      name: "S Price",
      selector: (row) => row.package_selling_price,
    },
    {
      name: "Validity",
      selector: (row) => row.package_duration,
    },
    {
      name: "Brochure",
      selector: (row) => {
        return (
          <Button onClick={() => window.open(row.package_brochure, "_blank")}>
            <PictureAsPdfIcon />
          </Button>
        );
      },
      width: "100px",
    },
    {
      name: "Start Date",
      selector: (row) => moment(row.package_start_date).format("YYYY-MM-DD"),
    },
    // {
    //   name: "Duration",
    //   selector: (row) => row.package_duration,
    // },
    {
      name: "Created By",
      // selector: (data) =>
      //   `${data?.createdByName}` + " " + `(${data?.createdByRole})`,
      cell: (row) => {
        return (
          <Tooltip
            title={`${row?.createdByName}` + " " + `(${row?.createdByRole})`}
          >
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {`${row?.createdByName}` + " " + `(${row?.createdByRole})`}
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
              setPackageInfo(row);
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
