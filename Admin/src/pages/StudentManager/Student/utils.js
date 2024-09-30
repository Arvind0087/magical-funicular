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
      name: (
        <Checkbox
          value={getCheckedAll}
          checked={getCheckedAll}
          onChange={(event) =>
            // console.log(event.target.checked)
            handleCheckedAll(event.target.checked)
          }
        />
      ),
      selector: (data) => (
        <Checkbox
          value={JSON.stringify({
            id: data?.id,
            type: data?.subscriptionType,
          })}
          checked={
            getCheckedValue.findIndex((i) => JSON.parse(i).id == data.id) != -1
          }
          onChange={(event) =>
            // console.log(event.target.value)
            handleChangeCheckbox(event.target.value)
          }
        />
      ),
      width: "80px",
    },
    {
      name: "VedaId",
      selector: (row) => row.vedaId,
    },
    {
      name: "Image",
      selector: (row) => {
        return (
          <img
            src={row.avatar == null ? Inf : row.avatar}
            alt="logo"
            onClick={() => {
              setUserImage(row?.avatar);
              setUserName(row?.name);
              setOpenImageViewer(true);
            }}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "40px",
              objectFit: "cover",
              cursor: "pointer",
            }}
          />
        );
      },
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
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      width: "120px",
    },
    {
      name: "Email",
      // selector: (row) => (row.email ? row.email : "N/A")
      cell: (row) => {
        return (
          <Tooltip title={row.email ? row.email : "N/A"}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.email ? row.email : "N/A"}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
    },
    {
      name: "Course, Class",
      cell: (row) => {
        return (
          <Tooltip title={`(${row?.course})(${row?.class})`}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {`(${row?.course})(${row?.class})`}
            </Typography>
          </Tooltip>
        );
      },
      width: 300,
    },
    {
      name: "Student Type",
      selector: (row) => row.studentType,
    },
    {
      name: "Date of Birth",
      selector: (row) =>
        row.dob ? moment(row.dob).format("DD MMM YYYY") : "N/A",
    },
    {
      name: " Profile Percentage Age",
      selector: (row) => row.profilePercentage,
    },
    {
      name: "Subscription",
      selector: (row) => row.subscriptionType,
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
      name: "Registration Date",
      selector: (row) =>
        row?.registationDate
          ? moment(row?.registationDate).format("DD MMM YYYY")
          : "N/A",
      width: "150px",
    },

    {
      name: "Actions",
      selector: (row) => {
        return (
          <IconButton
            color={openPopover ? "inherit" : "default"}
            onClick={(e) => {
              setStudentInfo(row);
              handleOpenPopover(e);
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
