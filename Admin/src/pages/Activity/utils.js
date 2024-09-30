import { capitalize } from "lodash";

export const activitycolumns = ({ paginationpage }) => {
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
      name: "Student Name",
      selector: (data) => data?.user,
    },
    {
      name: "Module",
      selector: (row) => capitalize(row?.module),
    },
    {
      name: "Activity Name",
      selector: (data) => capitalize(data?.activityName),
    },
  ];
  return columnValues;
};
