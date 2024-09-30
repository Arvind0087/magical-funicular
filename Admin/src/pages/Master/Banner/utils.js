import { IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export const bannercolumns = ({
  openPopover,
  handleOpenPopover,
  setBannerinfo,
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
      name: "Course, Board, Class, Batch",
      cell: (row) => {
        return (
          <Tooltip
            title={
              row?.courseName
                ? `(${row?.courseName}) (${row?.boardName}) (${row?.classes.map(
                    (ev) => ev.name
                  )})  (${row?.batchType.map((ev) => ev.name)})`
                : "N/A"
            }
          >
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.courseName
                ? `(${row?.courseName}) (${row?.boardName}) (${row?.classes.map(
                    (ev) => ev.name
                  )})  (${row?.batchType.map((ev) => ev.name)})`
                : "N/A"}
            </Typography>
          </Tooltip>
        );
      },
      width: "300px",
    },
    {
      name: "Image",
      selector: (row) => {
        return (
          <LazyLoadImage
            alt={row.question}
            effect="blur"
            src={row.image}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "40px",
              objectFit: "cover",
            }}
          />
        );
      },
      // width: "100px",
    },

    {
      name: "Banner Name",
      // width: "300px",
      cell: (row) => {
        return (
          <Tooltip title={row.title}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.title}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Banner Type",
      selector: (row) =>
        row.type ? row.type.charAt(0).toUpperCase() + row.type.slice(1) : "N/A",
      // width: "300px",
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
              setBannerinfo(row);
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

export const Banners = [
  {
    id: 1,
    value: "Home",
    label: "Home",
  },
  {
    id: 2,
    value: "Assessment",
    label: "Assessment",
  },
];
