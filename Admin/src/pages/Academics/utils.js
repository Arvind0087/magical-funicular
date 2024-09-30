import { Button, IconButton, Checkbox } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
import Label from "components/label/Label";
import { capitalize } from "lodash";
import moment from "moment";
import { useSelector } from "react-redux";
import { PATH_DASHBOARD } from "routes/paths";
import Tooltip from "@mui/material/Tooltip";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router";

export const liveclasscolumns = ({
  openPopover,
  handleOpenPopover,
  setliveclassInfo,
  paginationpage,
  handleChangeCheckbox,
  handleCheckedAll,
  getCheckedAll,
  getCheckedValue,
}) => {
  const navigate = useNavigate();
  const { userinfo } = useSelector((state) => state.userinfo);

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
      name: (
        <Checkbox
          value={getCheckedAll}
          checked={getCheckedAll}
          onChange={(event) => handleCheckedAll(event.target.checked)}
        />
      ),
      selector: (data) => (
        <Checkbox
          value={JSON.stringify({
            id: data?.id,
          })}
          checked={
            getCheckedValue.findIndex((i) => JSON.parse(i).id == data.id) != -1
          }
          onChange={(event) => handleChangeCheckbox(event.target.value)}
        />
      ),
      width: "80px",
    },
    {
      name: "Course",
      cell: (row) => {
        return (
          <Tooltip title={row?.courseName}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.courseName}
            </Typography>
          </Tooltip>
        );
      },
      width: "100px",
    },
    {
      name: "Package",
      cell: (row) => {
        return (
          <Tooltip title={row?.packageName}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.packageName}
            </Typography>
          </Tooltip>
        );
      },
      width: "180px",
    },
    {
      name: "Title",
      cell: (row) => {
        return (
          <Tooltip title={row?.title}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row?.title}
            </Typography>
          </Tooltip>
        );
      },
      width: "180px",
    },
    {
      name: "Batch",
      cell: (row) => {
        return (
          <Tooltip title={`${capitalize(row?.batchType)}`}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {`${capitalize(row?.batchType)}`}
            </Typography>
          </Tooltip>
        );
      },
      width: "130px",
    },
    {
      name: "Subject",
      cell: (row) => {
        return (
          <Tooltip title={`${capitalize(row?.subject)}`}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {`${capitalize(row?.subject)}`}
            </Typography>
          </Tooltip>
        );
      },
      width: "130px",
    },
    {
      name: "Date",
      selector: (row) => {
        return (
          <Label
            variant="soft"
            color="success"
            sx={{ textTransform: "capitalize" }}
          >
            {moment(row.startedBy.split("T")[0]).format("DD MMM YYYY")}
          </Label>
        );
      },
      width: "120px",
    },
    {
      name: "Time",
      selector: (row) => {
        return (
          <Label
            variant="soft"
            color="success"
            sx={{ textTransform: "capitalize" }}
          >
            {moment(row.startedBy.split("T")[1], "HH:mm").format("hh:mm a")}
          </Label>
        );
      },
      width: "120px",
    },
    {
      name: "Deep link",
      selector: (row) => {
        return (
          <Label
            variant="contained"
            color="success"
            sx={{ textTransform: "capitalize", cursor: "pointer" }}
            onClick={() => {
              navigator.clipboard.writeText(row.deepLink);
              toast.success("Deep link Copied!", toastoptions);
            }}
          >
            Copy to Clipboard
          </Label>
        );
      },
      width: "160px",
    },
    {
      name: "Join Meeting",
      selector: (row) => {
        return (
          <Button
            variant="contained"
            onClick={() => {
              navigate(`${PATH_DASHBOARD.liveclass}/${row.id}`, {
                state: { data: row },
              });

              // let newWindow = window.open(
              //   `${PATH_DASHBOARD.zoommeeting}/${row.meetingNumber}`,
              //   "_blank"
              // );
              // newWindow.ZoomCredentials = {
              //   meetigNumber: row.meetingNumber,
              //   password: row.password,
              //   sdkKey: row.zoomApiKey || row.zoomClientKey,
              //   sdkSecret: row.zoomApiSecret || row.zoomClientSecret,
              //   email: `${userinfo?.email}`,
              //   // email: `${userinfo?.id}_${userinfo?.email}`,
              //   name: `${userinfo?.name.toLowerCase().replace(/ /g, "_")}(${
              //     userinfo.vedaId
              //   })`,
              //   role: 1,
              // };
            }}
            sx={{
              borderRadius: "0px",
            }}
          >
            Join
          </Button>
        );
      },
      width: "150px",
    },
    // {
    //   name: "Created Date",
    //   selector: (row) => moment(row.startDate).format("ll"),
    //   width: "150px",
    // },
    {
      name: "Teacher",
      cell: (row) => {
        return (
          <Tooltip
            title={row.teachers?.map((item) => item?.teacherName + ", ")}
          >
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.teachers?.map((item) => item?.teacherName + ", ")}
            </Typography>
          </Tooltip>
        );
      },
      width: "180px",
    },
    {
      name: "Created By",
      selector: (data) =>
        data?.createdByName
          ? `${data?.createdByName} (${data.createdByRole})`
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
              handleOpenPopover(e);
              setliveclassInfo(row);
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
