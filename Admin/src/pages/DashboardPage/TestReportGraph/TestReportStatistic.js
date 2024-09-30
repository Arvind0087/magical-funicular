import PropTypes from "prop-types";
import { useState, useEffect } from "react";
// @mui
import {
  Card,
  CardHeader,
  Box,
  Autocomplete,
  FormControl,
  TextField,
  Container
} from "@mui/material";
// components
import Chart, { useChart } from "../../../components/chart";
import CustomSmallSelect from "components/CustomSmallSelect/CustomSmallSelect";
import { useDispatch, useSelector } from "react-redux";
import { studentLoader, getFilterAsync } from "redux/filter/student/student.async";


export default function TestReportStatistic({
  title,
  subheader,
  chart,
  seriesData,
  setSeriesData,
  ...other
}) {
  const dispatch = useDispatch();
  const { studentFilter } = useSelector((state) => state.studentFilter);
  const { categories, colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"]
    },
    xaxis: {
      categories
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}`
      }
    },
    ...options
  });

  useEffect(() => {
    dispatch(getFilterAsync());
  }, []);

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <>
            <FormControl>
              <Autocomplete
                size="small"
                sx={{ width: 170, mr: 2, mb: { xs: 1, md: 0 } }}
                disablePortal
                value={seriesData && seriesData}
                options={studentFilter?.map((ev) => {
                  return { label: `${ev?.name}(${ev?.class})`, value: ev?.id };
                })}
                onChange={(event, value) => setSeriesData(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Select Student" />
                )}
              />
            </FormControl>
          </>
        }
      />
      {series.map((item) => (
        <Box key={item?.type} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item?.type === seriesData?.label && (
            <Chart
              type="bar"
              series={item?.data}
              options={chartOptions}
              height={364}
            />
          )}
        </Box>
      ))}
    </Card>
  );
}
