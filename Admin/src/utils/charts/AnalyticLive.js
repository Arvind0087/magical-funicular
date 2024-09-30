import React from "react";
import ReactApexChart from "react-apexcharts";

const AnalyticLive = ({ liveLabelsArray, liveValuesArray }) => {
  const series = [
    {
      name: "Students", // Bar Data
      data: liveValuesArray,
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
      categories: liveLabelsArray,
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
        columnWidth: "10%",
        barWidth: "10%",
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
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default AnalyticLive;
