import { IconButton, Checkbox } from "@mui/material";
import Iconify from "components/iconify/Iconify";
import { capitalize } from "lodash";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import _ from "lodash";
export const teachercolumns = ({
  openPopover,
  handleOpenPopover,
  setTeacherinfo,
  paginationpage,
  teacherinfo,
  getCheckedAll,
  setCheckedAll,
  getCheckedValue,
  setCheckedValue,
  handleChangeCheckbox,
  handleCheckedAll,
}) => {
  const columnValues = [
    {
      name: "Sr No.",
      selector: (row, index) =>
        paginationpage === 1
          ? index + 1
          : index === 9
          ? `${paginationpage}0`
          : `${paginationpage - 1}${index + 1}`,
    },
    {
      name: (
        <Checkbox
          value={getCheckedAll}
          checked={getCheckedAll}
          onChange={(event) => handleCheckedAll(event.target.checked)}
        />
      ),
      selector: (row) => (
        <Checkbox
          value={parseInt(row.id)}
          checked={
            getCheckedValue.findIndex(
              (i) => parseInt(i) === parseInt(row.id)
            ) !== -1
          }
          onChange={(event) =>
            handleChangeCheckbox(parseInt(event.target.value))
          }
        />
      ),
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
      name: "Email",
      cell: (row) => {
        return (
          <Tooltip title={row.email}>
            <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
              {row.email}
            </Typography>
          </Tooltip>
        );
      },
      width: "250px",
    },
    {
      name: "Gender",
      selector: (row) => capitalize(row.gender) || "N/A",
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
    },
    {
      name: "Role",
      selector: (row) => capitalize(row.department),
    },
    // {
    //   name: "Teacher Info",
    //   cell: (row) => {
    //     let data = row?.teacherInfo;
    //     let parsedData = JSON?.parse(data);
    //     return (
    //       <>
    //         {parsedData?.map((item) => (
    //           <Tooltip title={item}>
    //             <Typography component="div" noWrap sx={{ fontSize: "14px" }}>
    //               {item}
    //             </Typography>
    //           </Tooltip>
    //         ))}
    //       </>
    //     );
    //   },
    //   width: "150px",
    // },
    {
      name: "Date of Birth",
      selector: (row) => moment(row.dob).format("DD MMM YYYY"),
      width: "150px",
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
          <>
            {row.department !== "superAdmin" && (
              <IconButton
                color={openPopover ? "inherit" : "default"}
                onClick={(e) => {
                  setTeacherinfo(row);
                  handleOpenPopover(e);
                }}
              >
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  return columnValues;
};
