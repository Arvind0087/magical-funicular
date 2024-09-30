import moment from "moment";

export const enquirycolumns = ({ paginationpage }) => {
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
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Subject",
      selector: (row) => row.subject,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Message",
      selector: (row) => row.message,
    },
    {
      name: "Date",
      selector: (row) => moment(row.createdAt).format("ll"),
    },
  ];
  return columnValues;
};
