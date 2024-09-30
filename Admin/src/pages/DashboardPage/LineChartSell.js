import React, { useState, useEffect } from "react";
import { Box, Card, CardHeader, FormControl } from "@mui/material";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";

function LineChartSell({ monthWiseData }) {
  const dispatch = useDispatch();

  let dataWidth = 90;
  //   if (monthWiseData?.length <= 60) {
  //     dataWidth = 90;
  //   } else {
  //     dataWidth = 150 + monthWiseData?.length;
  //   }

  // Chart Data
  const series = [
    {
      name: "Users",
      data: monthWiseData?.map((ev) => ev?.totalSell) || [],
    },
  ];
  const options = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    grid: {
      show: true,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    colors: ["#3FCF78"],
    theme: { mode: "light" },
    xaxis: {
      categories: monthWiseData?.map((ev) => `${ev?.month}`),
      tickPlacement: "on",
    },
    yaxis: {
      labels: { style: { fontSize: 15 } }, //Y-Axis Parameter
    },
    legend: {
      show: false,
      position: "top",
    },
    dataLabels: {
      enabled: false,
      style: { fontSize: 15, colors: ["white"] },
    },
    plotOptions: {
      bar: {
        distributed: false,
        borderRadius: 3,
        horizontal: false,
        columnWidth: "40%",
        barWidth: "40%",
        barHeight: "20%",
        endingShape: "rounded",
        dataLabels: {
          position: "center",
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: ["#333"],
          },
          offsetX: 0,
          offsetY: -5,
        },
      },
    },
  };

  return (
    <Card elevaltio={7} sx={{ mt: 0 }}>
      <CardHeader title="Monthly Sales" sx={{ padding: "10px 0px 0px 10px" }} />
      <Chart
        options={options}
        series={series}
        type="bar"
        width={`${dataWidth}%`}
        height={280}
      />
    </Card>
  );
}

export default LineChartSell;
