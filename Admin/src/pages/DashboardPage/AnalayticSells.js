import { useTheme, styled } from "@mui/material/styles";
import { Card, CardHeader } from "@mui/material";
import { fNumber } from "../../utils/formatNumber";
import Chart, { useChart } from "../../components/chart";

const CHART_HEIGHT = 280;
const LEGEND_HEIGHT = 42;

const StyledChart = styled("div")(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(2),
  "& .apexcharts-canvas svg": {
    height: CHART_HEIGHT,
  },
  "& .apexcharts-canvas svg,.apexcharts-canvas foreignObject": {
    overflow: "visible",
  },
  "& .apexcharts-legend": {
    height: LEGEND_HEIGHT,
    alignContent: "center",
    position: "relative !important",
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

export default function AnalayticSells({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const { colors, series, options } = chart;

  const chartSeries = series.map((i) => i?.totalSell);

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors,
    labels: series.map((i) => i?.courseName),
    stroke: {
      colors: [theme.palette.background?.paper],
    },
    legend: {
      floating: true,
      horizontalAlign: "center",
    },
    dataLabels: {
      enabled: true,
      dropShadow: { enabled: false },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } },
    },
    ...options,
  });

  return (
    <Card {...other} sx={{ maxWidth: "670px" }}>
      <CardHeader
        title={title}
        subheader={subheader}
        sx={{ padding: "10px 0px 0px 10px" }}
      />

      <StyledChart dir="1tr">
        <Chart
          type={"pie"}
          series={chartSeries}
          options={chartOptions}
          height={230}
        />
      </StyledChart>
    </Card>
  );
}
