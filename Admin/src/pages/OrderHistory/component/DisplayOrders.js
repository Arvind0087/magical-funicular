import React from "react";
import { Grid, Card, Typography, CardContent, Box } from "@mui/material";
import moment from "moment";

function DisplayOrders({ orderInfo }) {
  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid xs={12} sm={12} md={6} item>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                Order Id:
              </Typography>
              <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                {orderInfo?.orderId}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                Package:
              </Typography>
              <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                {orderInfo?.packageName}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                Batch:
              </Typography>
              <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                {orderInfo?.batchName}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                Phone:
              </Typography>
              <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                {orderInfo?.phone}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                Date:
              </Typography>
              <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                {moment(orderInfo?.purchaseDate).format("Do MMM YYYY, h:mm A")}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                Amount:
              </Typography>
              <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                ₹ {orderInfo?.amount}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                Payment Mode:
              </Typography>
              <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                {orderInfo?.paymentMode}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid xs={12} sm={12} md={6} item>
        <Card sx={{ minHeight: { md: "281px" } }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                Payment Status:
              </Typography>
              <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                {orderInfo?.status ? orderInfo?.status : "NA"}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 1 }}
            >
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, width: { md: "27%" } }}
              >
                Full Address:
              </Typography>
              <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                {orderInfo?.fullAddress ? orderInfo?.fullAddress : "NA"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                Landmark:
              </Typography>
              <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                {orderInfo?.landmark ? orderInfo?.landmark : "NA"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                State:
              </Typography>
              <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                {orderInfo?.state ? orderInfo?.state : "NA"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                City:
              </Typography>
              <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                {orderInfo?.city ? orderInfo?.city : "NA"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
                Pincode:
              </Typography>
              <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                {orderInfo?.pincode ? orderInfo?.pincode : "NA"}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default DisplayOrders;
