import { Outlet } from "react-router-dom";
import { Box } from "@material-ui/core";

export default function BlankLayout() {
  return (
    <>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          p: 0,
          m: 0,
        }}
      >
        <Outlet />
      </Box>
    </>
  );
}
