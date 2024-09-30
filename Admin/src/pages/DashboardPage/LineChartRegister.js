import React, { useState, useEffect } from "react";
import { Box, Card, CardHeader, FormControl } from "@mui/material";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";

function LineChartRegister({ coursesData }) {
  const dispatch = useDispatch();

  console.log("coursesData....", coursesData);

  let dataWidth = 105;
  //   if (monthWiseData?.length <= 60) {
  //     dataWidth = 90;
  //   } else {
  //     dataWidth = 150 + monthWiseData?.length;
  //   }

  const series = [
    {
      name: "Users",
      data: coursesData?.map((ev) => ev?.totalUsers) || [],
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
      categories: coursesData?.map((ev) => `${ev?.courseName}`),
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
        columnWidth: "30%",
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
      <CardHeader title="Users" sx={{ padding: "10px 0px 0px 10px" }} />
      <Chart
        options={options}
        series={series}
        type="bar"
        width={`${dataWidth}%`}
        height={300}
      />
    </Card>
  );
}

export default LineChartRegister;
