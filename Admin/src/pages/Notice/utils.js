import { Button, IconButton } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export const noticecolumns = ({
  openPopover,
  handleOpenPopover,
  setNoticeinfo,
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
          <img
            src={data.image}
            alt="logo"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "40px",
              objectFit: "cover",
              // margin: "20px"
            }}
          />
        );
      },
      width: "120px",
    },
    // {
    //   name: "Course, Board, Class, Batch",
    //   cell: (data) => {
    //     return (
    //       <Tooltip
    //         title={
    //           `(${data.course})` +
    //           " " +
    //           `(${data.board})` +
    //           " " +
    //           `(${data.class})` +
    //           " " +
    //           `(${data.batchType})`
    //         }
    //       >
    //         <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
    //           {`(${data.course})` +
    //             " " +
    //             `(${data.board})` +
    //             " " +
    //             `(${data.class})` +
    //             " " +
    //             `(${data.batchType})`}
    //         </Typography>
    //       </Tooltip>
    //     );
    //   },
    //   width: "300px",
    // },
    {
      name: "Title",
      // width: "150px"
      cell: (data) => {
        return (
          <Tooltip title={data.title}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {data.title}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: " HyperLink",
      // selector: (row) => {
      //   if (row?.backLink === "") {
      //     return row?.otherLink;
      //   } else {
      //     return row?.backLink;
      //   }
      // },
      cell: (row) => {
        return (
          <Tooltip
            title={row?.backLink === "" ? row?.otherLink : row?.backLink}
          >
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.backLink === "" ? row?.otherLink : row?.backLink}
            </Typography>
          </Tooltip>
        );
      },
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
              setNoticeinfo(row);
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
