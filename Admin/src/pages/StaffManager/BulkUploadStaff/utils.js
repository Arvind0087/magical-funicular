import Label from "components/label/Label";
import { capitalize } from "lodash";
import moment from "moment";

export const Bulkcolumns = ({ paginationpage }) => {
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
      name: "Date",
      selector: (row) => moment(row?.uploadedDate).format("DD MMM YYYY"),
    },
    {
      name: "Created By",
      selector: (data) =>
      data?.createdByName
        ? `${data?.createdByName} (${data.createdByRole})`
        : "N/A"
    },
    {
      name: "Status",
      selector: (row) => {
        return (
          <Label
            variant="soft"
            color={_status[row?.status]}
            sx={{ textTransform: "capitalize" }}
          >
            {row?.status}
          </Label>
        );
      },
    },
    {
      name: "Success",
      selector: (row) => {
        return (
          <>
          {row?.uploadFileUrl && (
          <Label
            variant="contained"
            sx={{
              textTransform: "capitalize",
              cursor: Boolean(row?.uploadFileUrl) && "pointer",
            }}
            onClick={() => {
              if (Boolean(row?.uploadFileUrl)) {
                window.open(row?.uploadFileUrl, "_blank", "noreferrer");
              }
            }}
          >
            Download
          </Label>
          )}
          </>
        );
      },
      width: "150px",
    },
    {
      name: "Failure",
      selector: (row) => {
        return (
          <>
          {row?.errorFileUrl && (
          <Label
            variant="contained"
            sx={{
              textTransform: "capitalize",
              cursor: Boolean(row?.errorFileUrl) && "pointer",
            }}
            onClick={() => {
              if (Boolean(row?.errorFileUrl)) {
                window.open(row?.errorFileUrl, "_blank", "noreferrer");
              }
            }}
          >
            Download
          </Label>
          )}
          </>
        );
      },
      width: "150px",
    },
  
  ];
  return columnValues;
};

const _status = {
  error: "error",
  pending: "warning",
  success: "success",
};
