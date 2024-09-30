// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Box,
//   Typography,
// } from "@mui/material";

// export default function Popup({
//   title,
//   content,
//   action,
//   open,
//   onClose,
//   children,
//   ...other
// }) {
//   return (
//     <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
//       <Box sx={{ p: 1 }}>
//         <DialogTitle>
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <Typography
//               style={{
//                 fontWeight: 800,
//                 fontSize: "20px",
//               }}
//             >
//               {title}
//             </Typography>
//           </Box>
//         </DialogTitle>

//         <DialogContent> {children}</DialogContent>
//       </Box>
//     </Dialog>
//   );
// }
