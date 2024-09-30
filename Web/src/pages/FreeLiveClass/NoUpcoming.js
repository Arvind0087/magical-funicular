import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import folder from "../../assets/images/folder.png";

function NoUpcoming({ setTabVal }) {
  return (
    <Grid container>
      <Grid item xs={12} sm={6} sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            backgroundColor: "#F9F9F9",
            width: "100%",
            height: "100%",
            borderRadius: "7px",
            padding: "25px",
            display: "flex",
            justifyItems: "center",
            boxShadow: `0px 2px 10px 0px rgba(0, 0, 0, 0.25)`,
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: "15%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img src={folder} alt="folder image" width="18px" />
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#343434",
                fontSize: "15px",
                fontWeight: 600,
                mb: 2,
              }}
            >
              No Upcoming classes!
            </Typography>
            <Typography sx={{ color: "#343434", fontSize: "12px", mb: 2 }}>
              Classes will appear here when they are upcoming
            </Typography>
            <Typography
              sx={{ color: "#0166B6", fontSize: "14px", cursor: "pointer" }}
              onClick={() => setTabVal("past")}
            >
              SEE PAST CLASSES
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default NoUpcoming;
