// import moment from "moment";

// export const feedbackcolumns = ({ paginationpage }) => {
//   const columnValues = [
//     {
//       name: "Sl No.",
//       selector: (row, index) =>
//         paginationpage === 1
//           ? index + 1
//           : index === 9
//           ? `${paginationpage}0`
//           : `${paginationpage - 1}${index + 1}`,
//       // width: "100px",
//       width: "25%",
//     },
//     {
//       name: "Student",
//       selector: (data) => data?.student,

//       width: "25%",
//     },
//     {
//       name: "Feedback",
//       selector: (row) => row?.feedback,
//       width: "25%",
//     },
//     {
//       name: "Date",
//       selector: (row) => moment(row.createdAt).format("ll"),
//       width: "25%",
//     },
//   ];
//   return columnValues;
// };
