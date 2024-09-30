// import { useFormik } from "formik";
// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
// import {
//   Box,
//   Checkbox,
//   Paper,
//   Stack,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   tableCellClasses,
//   Container,
//   Typography,
// } from "@mui/material";
// import { useEffect } from "react";
// import { getAllRoutesAsync } from "redux/slices/routes/routes.async";
// import { useDispatch } from "react-redux";
// import _ from "lodash";
// import styled from "styled-components";
// import { LoadingButton } from "@mui/lab";
// import { useSettingsContext } from "components/settings";
// import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
// import { useNavigate, useParams } from "react-router";
// import {
//   addPermissionByIdAsync,
//   getpermissionAsync,
// } from "redux/slices/permission/permission.async";
// import { toastoptions } from "utils/toastoptions";
// import { toast } from "react-hot-toast";
// import { emptypermission } from "redux/slices/permission/permission.slice";
// import { PATH_DASHBOARD } from "routes/paths";

// const Permission = () => {
//   const { themeStretch } = useSettingsContext();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [RoutesPermission, setRoutesPermission] = useState([]);
//   const [AllCheck, setAllCheck] = useState(false);
//   const { routeLoader, allRoutes } = useSelector((state) => state.routesRedux);
//   const { permissionLoader, permissionById, permissionadd } = useSelector(
//     (state) => state.permission
//   );

//   const onSubmit = async (values) => {
//     const permission = RoutesPermission.filter(
//       (ev) =>
//         ev.add === true ||
//         ev.edit === true ||
//         ev.view === true ||
//         ev.remove === true
//     );
//     const permissionUpdate = permission.map((ev) => {
//       return {
//         id: Number(ev.id),
//         add: ev.add,
//         edit: ev.edit,
//         remove: ev.remove,
//         view: ev.view,
//       };
//     });
//     dispatch(
//       addPermissionByIdAsync({
//         staffId: Number(id),
//         permission: permissionUpdate,
//       })
//     );
//   };

//   const handleCheckPermission = (row, string, condition) => {
//     const indexNum = RoutesPermission.findIndex((item) => item.id === row.id);
//     let updateRow;
//     if (string === "add") {
//       updateRow = { ...row, add: condition };
//     } else if (string === "edit") {
//       updateRow = { ...row, edit: condition };
//     } else if (string === "view") {
//       updateRow = { ...row, view: condition };
//     } else if (string === "remove") {
//       updateRow = { ...row, remove: condition };
//     }
//     if (indexNum !== -1) {
//       const stateInfo = [...RoutesPermission];
//       stateInfo.splice(indexNum, 1, { ...stateInfo[indexNum], ...updateRow });
//       setRoutesPermission(stateInfo);
//     }
//   };

//   const handleAllCheck = (permission) => {
//     const permissionall = RoutesPermission.map((ev) => {
//       return {
//         ...ev,
//         add: permission,
//         edit: permission,
//         view: permission,
//         remove: permission,
//       };
//     });
//     setRoutesPermission(permissionall);
//   };

//   useEffect(() => {
//     dispatch(getAllRoutesAsync());
//   }, []);

//   useEffect(() => {
//     if (allRoutes.length > 0 && id) {
//       dispatch(getpermissionAsync(id));
//     }
//     if (allRoutes) {
//       const mapRoute = _.map(allRoutes, (item) => {
//         return item;
//       });
//       setRoutesPermission(mapRoute);
//     }
//   }, [allRoutes]);

//   useEffect(() => {
//     if (permissionById.length > 0) {
//       const updateroute = allRoutes.map((ev) => {
//         const filterinfo = permissionById.filter((evval) => evval.id === ev.id);
//         if (filterinfo.length > 0) {
//           return {
//             ...ev,
//             add: filterinfo[0].add,
//             edit: filterinfo[0].edit,
//             view: filterinfo[0].view,
//             remove: filterinfo[0].remove,
//           };
//         }
//         return ev;
//       });
//       setRoutesPermission(updateroute);
//     }
//   }, [permissionById]);

//   useEffect(() => {
//     if (permissionadd.status === 200) {
//       toast.success(permissionadd.message, toastoptions);
//       dispatch(emptypermission());
//       formik.resetForm();
//       navigate(PATH_DASHBOARD.staff);
//     }
//   }, [permissionadd]);

//   useEffect(() => {
//     if (RoutesPermission.length > 0 && allRoutes.length > 0) {
//       const permissionall = RoutesPermission.filter(
//         (ev) =>
//           ev.add === true &&
//           ev.view === true &&
//           ev.edit === true &&
//           ev.remove === true
//       );
//       if (permissionall.length === allRoutes.length) {
//         setAllCheck(true);
//       } else {
//         setAllCheck(false);
//       }
//     }
//   }, [RoutesPermission, allRoutes]);

//   const formik = useFormik({
//     initialValues: {},
//     onSubmit,
//   }); // FOMRIK

//   return (
//     <Container maxWidth={themeStretch ? false : "lg"}>
//       <CustomBreadcrumbs
//         heading="Permission"
//         links={[
//           {
//             name: "Dashboard",
//             href: "/app/master",
//           },
//           { name: "Staff", href: `${PATH_DASHBOARD.staff}` },
//           { name: "Permission" },
//         ]}
//       />

//       <form onSubmit={formik.handleSubmit}>
//         <Box>
//           {routeLoader ? (
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 py: 5,
//               }}
//             >
//               <CustomComponentLoader padding="0 0" size={20} />
//             </Box>
//           ) : (
//             <TableContainer component={Paper} sx={{ maxWidth: "100%" }}>
//               <Box sx={{ display: "flex" }}>
//                 <Typography
//                   variant="h4"
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     fontSize: "15px !important",
//                     lineHeight: "30px !important",
//                     fontWeight: "500 !important",
//                   }}
//                 >
//                   <Checkbox
//                     sx={{
//                       p: 0,
//                       mr: 1,
//                     }}
//                     checked={AllCheck}
//                     onClick={(e) => {
//                       setAllCheck(e.target.checked);
//                       handleAllCheck(e.target.checked);
//                     }}
//                   />{" "}
//                   Permissions According To Roles
//                 </Typography>
//               </Box>
//               <Table aria-label="customized table" sx={{ marginTop: "21px" }}>
//                 <TableHead>
//                   <TableRow>
//                     <StyledTableCell
//                       sx={{
//                         backgroundColor: "#F2F3F7 !important",
//                         color: "#000000 !important",
//                         fontWeight: 700,
//                       }}
//                     >
//                       MODULE
//                     </StyledTableCell>
//                     <StyledTableCell
//                       sx={{
//                         backgroundColor: "#F2F3F7 !important",
//                         color: "#000000 !important",
//                         fontWeight: 700,
//                       }}
//                       align="right"
//                     >
//                       VIEW
//                     </StyledTableCell>
//                     <StyledTableCell
//                       sx={{
//                         backgroundColor: "#F2F3F7 !important",
//                         color: "#000000 !important",
//                         fontWeight: 700,
//                       }}
//                       align="right"
//                     >
//                       EDIT
//                     </StyledTableCell>
//                     <StyledTableCell
//                       sx={{
//                         backgroundColor: "#F2F3F7 !important",
//                         color: "#000000 !important",
//                         fontWeight: 700,
//                       }}
//                       align="right"
//                     >
//                       CREATE
//                     </StyledTableCell>
//                     <StyledTableCell
//                       sx={{
//                         backgroundColor: "#F2F3F7 !important",
//                         color: "#000000 !important",
//                         fontWeight: 700,
//                       }}
//                       align="right"
//                     >
//                       DELETE
//                     </StyledTableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {RoutesPermission?.map((row, index) => (
//                     <StyledTableRow key={index}>
//                       <StyledTableCell
//                         component="th"
//                         scope="row"
//                         sx={{ py: "12px !important" }}
//                       >
//                         {row?.name}
//                       </StyledTableCell>
//                       <StyledTableCell
//                         align="right"
//                         sx={{ py: "0px !important" }}
//                       >
//                         <Checkbox
//                           {...label}
//                           checked={row.view}
//                           onChange={(e) => {
//                             const permission = row.view ? false : true;
//                             handleCheckPermission(row, "view", permission);
//                           }}
//                         />
//                       </StyledTableCell>
//                       <StyledTableCell
//                         align="right"
//                         sx={{ py: "0px !important" }}
//                       >
//                         <Checkbox
//                           {...label}
//                           checked={row.edit}
//                           onChange={(e) => {
//                             const permission = row.edit ? false : true;
//                             handleCheckPermission(row, "edit", permission);
//                           }}
//                         />
//                       </StyledTableCell>
//                       <StyledTableCell
//                         align="right"
//                         sx={{ py: "0px !important" }}
//                       >
//                         <Checkbox
//                           {...label}
//                           checked={row.add}
//                           onChange={(e) => {
//                             const permission = row.add ? false : true;
//                             handleCheckPermission(row, "add", permission);
//                           }}
//                         />
//                       </StyledTableCell>
//                       <StyledTableCell
//                         align="right"
//                         sx={{ py: "0px !important" }}
//                       >
//                         <Checkbox
//                           {...label}
//                           checked={row.remove}
//                           onChange={(e) => {
//                             const permission = row.remove ? false : true;
//                             handleCheckPermission(row, "remove", permission);
//                           }}
//                         />
//                       </StyledTableCell>
//                     </StyledTableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}
//           <Stack alignItems="flex-end" sx={{ mt: 3 }}>
//             <LoadingButton
//               type="submit"
//               variant="contained"
//               loading={permissionLoader}
//             >
//               Permission
//             </LoadingButton>
//           </Stack>
//         </Box>
//       </form>
//     </Container>
//   );
// };

// export default Permission;

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     // backgroundColor: theme.palette.common.black,
//     // color: theme.palette.common.white,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     // backgroundColor: theme.palette.action.hover,
//   },
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
// }));

// const label = { inputProps: { "aria-label": "Checkbox demo" } };
