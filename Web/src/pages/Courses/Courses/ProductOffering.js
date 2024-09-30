import React from "react";
import {
  FormControl,
  Grid,
  TextField,
  Container,
  Typography,
  Box,
  Stack,
  Button,
} from "@mui/material";
import live from "../../../assets/images/live.png";
import record from "../../../assets/images/record.png";
import doubt from "../../../assets/images/doubt.png";
import carrier from "../../../assets/images/carrier.png";
import books from "../../../assets/images/books.png";
import notes from "../../../assets/images/notes.png";

function ProductOffering({ getCoursePackageById }) {
  return (
    <div>
      <Typography variant="h5" sx={{ mt: 5, mb: 3 }}>
        Product Offering
      </Typography>

      <Box sx={{ width: "90%", backgroundColor: "#FEF4D8", padding: "15px" }}>
        <Grid container spacing={3}>
          {getCoursePackageById?.prodOffers?.map((item) => {
            return (
              <Grid item xs={12} sm={4}>
                <Button
                  sx={{
                    backgroundColor: "#FFFFFF",
                    width: "100%",
                    color: "#000",
                    padding: "10px 5px",
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    pl: 2,
                    justifyContent: "flex-start",
                    gap: 1,
                    pointerEvents: "none",
                  }}
                >
                  <img
                    src={item?.thumbnail}
                    alt="download"
                    width="20px"
                    height="20px"
                  />
                  {item?.name}
                </Button>
              </Grid>
            );
          })}

          {/*<Grid item xs={12} sm={4}>
            <Button
              sx={{
                backgroundColor: "#FFFFFF",
                width: "100%",
                color: "#000",
                padding: "10px 5px",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                pl: 2,
                justifyContent: "flex-start",
                gap: 1,
                pointerEvents: "none",
              }}
            >
              <img src={record} alt="download" width="20px" height="20px" />
              Recorded Content
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              sx={{
                backgroundColor: "#FFFFFF",
                width: "100%",
                color: "#000",
                padding: "10px 5px",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                pl: 2,
                justifyContent: "flex-start",
                gap: 1,
                pointerEvents: "none",
              }}
            >
              <img src={doubt} alt="download" width="20px" height="20px" />
              Doubt Solving
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              sx={{
                backgroundColor: "#FFFFFF",
                width: "100%",
                color: "#000",
                padding: "10px 5px",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                pl: 2,
                justifyContent: "flex-start",
                gap: 1,
                pointerEvents: "none",
              }}
            >
              <img src={carrier} alt="download" width="20px" height="20px" />
              Career counselling
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              sx={{
                backgroundColor: "#FFFFFF",
                width: "100%",
                color: "#000",
                padding: "10px 5px",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                pl: 2,
                justifyContent: "flex-start",
                gap: 1,
                pointerEvents: "none",
              }}
            >
              <img src={books} alt="download" width="20px" height="20px" />
              Books
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              sx={{
                backgroundColor: "#FFFFFF",
                width: "100%",
                color: "#000",
                padding: "10px 5px",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                pl: 2,
                justifyContent: "flex-start",
                gap: 1,
                pointerEvents: "none",
              }}
            >
              <img src={notes} alt="download" width="20px" height="20px" />
              Notes
            </Button>
          </Grid> */}
        </Grid>
      </Box>
    </div>
  );
}

export default ProductOffering;
