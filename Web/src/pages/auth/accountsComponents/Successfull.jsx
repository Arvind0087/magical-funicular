import React, { useState } from "react";
import { useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { Helmet } from "react-helmet-async";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import { size } from "lodash";
import gif from "../../../assets/images/s.gif";

// ----------------------------------------------------------------------

export default function Successfull(props) {
  const { activeTab, setActiveTab, formik } = props;

  const theme = useTheme();
  const [value, setValue] = useState(null);

  return (
    <>
      {/* <Helmet>
                <title> Register | Minimal UI</title>
            </Helmet> */}
      <Card sx={{ mt: 2, p: 3, minHeight: "70vh" }}>
        <Grid xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          {/* <Box sx={{
                        borderRadius: "50%",
                        width: "250px",
                        height: "250px",
                        bgcolor: "primary.lighter",
                        display: "grid",
                        placeItems: "center",
                        cursor: "pointer",
                        color: "primary.main",
                        mt: 6,
                        [theme.breakpoints.down('sm')]: {
                            width: "150px",
                        height: "150px",
                          }
                    }}> */}
          <img src={gif} style={{ height: "250px", width: "340px" }} />
          {/* </Box> */}
        </Grid>
        <Grid xs={12} sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <Typography
            variant="h4"
            component="h4"
            sx={{
              color: "primary.main",
              [theme.breakpoints.down("sm")]: {
                textAlign: "center",
                fontSize: "18px",
              },
            }}
          >
            Your Account is Successfully Created !
          </Typography>
        </Grid>
      </Card>
    </>
  );
}
