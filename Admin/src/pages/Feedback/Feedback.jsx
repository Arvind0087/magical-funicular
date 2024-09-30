// import { Helmet } from "react-helmet-async";
// import {
//   Button,
//   Container,
//   InputAdornment,
//   Box,
//   TextField,
// } from "@mui/material";
// import { PATH_DASHBOARD } from "routes/paths";
// import Iconify from "components/iconify/Iconify";
// import CustomBreadcrumbs from "components/custom-breadcrumbs";
// import { useSettingsContext } from "components/settings";
// import CustomTable from "components/CustomTable";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import { getAllFeedbackAsync } from "redux/async.api";
// import { feedbackExcelDownloadAsync } from "redux/downloadexcel/excel.async";
// import { feedbackcolumns } from "./utils";
// import { getFilterAsync } from "redux/filter/feedback/feedback.async";

// export default function Feedback() {
//   const { themeStretch } = useSettingsContext();
//   const dispatch = useDispatch();
//   const [openPopover, setOpenPopover] = useState(null);
//   const [feedbackinfo, setFeedbackInfo] = useState("");
//   const [paginationpage, setPaginationpage] = useState(1);
//   const [perPageNumber, setperPageNumber] = useState(10);
//   const [openConfirm, setOpenConfirm] = useState(false);
//   const [searchStudent, setSearchStudent] = useState("");
//   const { feedbackLoader, feedback } = useSelector((state) => state.feedback);
//   const {  feedbackFilter } = useSelector((state) => state.feedbackFilter);

//   const InitialCourse = () => {
//     dispatch(
//       getAllFeedbackAsync({
//         page: paginationpage,
//         limit: perPageNumber,
//         search: searchStudent,
//       })
//     );
//   };

//   const InitialFilter = () => {
//     dispatch(
//       getFilterAsync({
//       })
//     );
//   };

//   const Reset = () => {
//     setSearchStudent("");
//     dispatch(
//       getAllFeedbackAsync({
//         page: paginationpage,
//         limit: perPageNumber,
//         search: "",
//       })
//     );
//   };
//   // POPUPOVER
//   const handleClosePopover = () => {
//     setOpenPopover(null);
//   };
//   const handleOpenPopover = (event) => {
//     setOpenPopover(event.currentTarget);
//   };

//   // PAGINATION
//   const handlePageChange = (page) => {
//     setPaginationpage(page);
//   };

//   const handlePerRowsChange = async (newPerPage, page) => {
//     setperPageNumber(newPerPage);
//   };

//   //CALL API OF API FUNCTION
//   useEffect(() => {
//     InitialCourse();
//   }, [paginationpage, perPageNumber]);

//   useEffect(() => {
//     InitialFilter();
//   }, []);

//   return (
//     <>
//       <Helmet>
//         <title>Feedback | Veda Academy</title>
//       </Helmet>

//       <Container maxWidth={themeStretch ? false : "lg"}>
//         <CustomBreadcrumbs
//           heading="Feedback"
//           links={[
//             { name: "Dashboard", href: PATH_DASHBOARD.root },
//             { name: "Feedback" },
//             { name: "List" },
//           ]}
//         />
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >
//           <Box>
//             <TextField
//               width={220}
//               size="small"
//               value={searchStudent}
//               onChange={(e) => setSearchStudent(e.target.value)}
//               placeholder="Search By Student"
//               sx={{ mb: 3.5 }}
//               InputProps={{
//                 sx: { borderRadius: "10px !important" },
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Iconify
//                       icon="eva:search-fill"
//                       sx={{ color: "text.disabled" }}
//                     />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//             <Button
//               variant="contained"
//               sx={{ ml: 2, mt: 0.25, borderRadius: "7px" }}
//               onClick={() => InitialCourse()}
//             >
//               Search
//             </Button>
//             <Button
//               variant="contained"
//               sx={{ ml: 0.5, mt: 0.25, borderRadius: "7px" }}
//               onClick={Reset}
//             >
//               Reset
//             </Button>
//           </Box>

//           <Box>
//             <Button
//               variant="contained"
//               sx={{ ml: 2, mt: 0.25, borderRadius: "7px" }}
//               onClick={() => feedbackExcelDownloadAsync}
//             >
//               Download Excel
//             </Button>
//           </Box>
//         </Box>
//         <CustomTable
//           columnheight="100px"
//           loader={feedbackLoader}
//           data={feedback?.data}
//           columns={feedbackcolumns({
//             openPopover,
//             handleOpenPopover,
//             setFeedbackInfo,
//             paginationpage,
//           })}
//           totalcount={feedback?.count}
//           onChangeRowsPerPage={handlePerRowsChange}
//           onChangePage={handlePageChange}
//           expandableRows={false}
//           expandableRowsComponent={ExpandedComponent}
//         />
//       </Container>
//     </>
//   );
// }

// const ExpandedComponent = ({ data }) => {
//   return;
// };
