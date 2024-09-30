import { IconButton } from "@mui/material";
import { Button, Typography, Checkbox } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import moment from "moment";
import Inf from "assets/ImageStudent/inf.jpg";
import Tooltip from "@mui/material/Tooltip";

export const studentcolumns = ({
  openPopover,
  handleOpenPopover,
  setStudentInfo,
  paginationpage,
  handleChangeCheckbox,
  handleCheckedAll,
  getCheckedAll,
  getCheckedValue,
  setUserName,
  setUserImage,
  setOpenImageViewer,
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
    // {
    //   name: (
    //     <Checkbox
    //       value={getCheckedAll}
    //       checked={getCheckedAll}
    //       onChange={(event) =>
    //         // console.log(event.target.checked)
    //         handleCheckedAll(event.target.checked)
    //       }
    //     />
    //   ),
    //   selector: (data) => (
    //     <Checkbox
    //       value={JSON.stringify({
    //         id: data?.id,
    //         type: data?.subscriptionType,
    //       })}
    //       checked={
    //         getCheckedValue.findIndex((i) => JSON.parse(i).id == data.id) != -1
    //       }
    //       onChange={(event) => {
    //         console.log("event.target.value", event.target.value);
    //         handleChangeCheckbox(event.target.value);
    //       }}
    //     />
    //   ),
    //   width: "80px",
    // },
    {
      name: "Course",
      cell: (row) => {
        return (
          <Tooltip title={row?.course}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.course}
            </Typography>
          </Tooltip>
        );
      },
      width: "120px",
    },
    {
      name: "Class",
      selector: (row) => row?.class,
      width: "120px",
    },
    {
      name: "Language",
      selector: (row) => row?.language,
      width: "120px",
    },
    {
      name: "Name",
      cell: (row) => {
        return (
          <Tooltip title={row.name}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.name}
            </Typography>
          </Tooltip>
        );
      },
      width: "185px",
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      width: "180px",
    },
    {
      name: "Gender",
      selector: (row) => row?.gender,
      width: "140px",
    },
    {
      name: "Purchase Date",
      selector: (row) =>
        row?.purchaseDate
          ? moment(row?.purchaseDate).format("DD MMM YYYY")
          : "N/A",
      width: "150px",
    },

    // {
    //   name: "Actions",
    //   selector: (row) => {
    //     return (
    //       <IconButton
    //         color={openPopover ? "inherit" : "default"}
    //         onClick={(e) => {
    //           setStudentInfo(row);
    //           handleOpenPopover(e);
    //         }}
    //       >
    //         <Iconify icon="eva:more-vertical-fill" />
    //       </IconButton>
    //     );
    //   },
    // },
  ];
  return columnValues;
};
