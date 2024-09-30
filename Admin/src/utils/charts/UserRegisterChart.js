import React, { useState, useEffect } from "react";
import { Box, Card, CardHeader, FormControl } from "@mui/material";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { userRegisteredAsync } from "../../redux/graph/studentStrenghtbarChart.async";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import { getStateFilterAsync } from "redux/filter/filter.async";
import { getCityByMultipleStateIdAsync } from "redux/city/cities.async";

function UserRegisterChart() {
  const dispatch = useDispatch();
  const [searchState, setSearchState] = useState([]);
  const [searchCity, setSearchCity] = useState([]);
  const { cityLoader, cityByMultipleStateId } = useSelector(
    (state) => state.city
  );
  const { filterLoader, stateFilter } =
    useSelector((state) => state.filterInfo);
  const { studentStrengthLoader, studentStrength, userRegistered } =
    useSelector((state) => state.perBatchStudentStrength);
  useEffect(() => {
    const payload = {
      stateId: [],
      cityId: []
    };
    dispatch(getStateFilterAsync({}));
    dispatch(userRegisteredAsync(payload));
  }, []);
  useEffect(() => {
    if (searchState === null) {
      setSearchCity([]);
    }
  }, [searchState]);

  let dataWidth;
  if (studentStrength.length <= 60) {
    dataWidth = 90;
  } else {
    dataWidth = 150 + studentStrength.length;
  }

  // Chart Data
  const series = [
    {
      name: "Users", // Bar Data
      data: userRegistered.map((ev) => ev?.value)
    }
  ];
  const options = {
    chart: {
      type: "bar",
      toolbar: {
        show: false
      }
    },
    grid: {
      show: true,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    colors: ["#3FCF78"],
    theme: { mode: "light" },
    xaxis: {
      categories: userRegistered?.map((ev) => `${ev?.label}`),
      tickPlacement: "on"
    },
    yaxis: {
      labels: { style: { fontSize: 15 } } //Y-Axis Parameter
    },
    legend: {
      show: false,
      position: "top"
    },
    dataLabels: {
      enabled: false,
      style: { fontSize: 15, colors: ["white"] }
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
            colors: ["#333"]
          },
          offsetX: 0,
          offsetY: -5
        }
      }
    }
  };

  const handelStatChange = (value) => {
    setSearchState(value);
    const payload = {
      stateId: value?.map((ev) => ev.value) || [],
      cityId: []
    };

    dispatch(userRegisteredAsync(payload));

    let statePayload = { stateIds: value?.map((ev) => ev.value) || [] };
    dispatch(getCityByMultipleStateIdAsync(statePayload));
  };

  const handelCityChange = (value) => {
    setSearchCity(value);
    const payload = {
      stateId: searchState,
      cityId: value?.map((ev) => ev.value) || []
    };

    dispatch(userRegisteredAsync(payload));
  };

  return (
    <Card elevaltio={7}>
      <CardHeader title="State & City Wise Student Strength" />
      <Box sx={{ overflowX: "auto", maxWidth: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            flexWrap: "wrap",
            mt: 2
          }}
        >
          <FormControl>
            <AutoCompleteCustom
              multiple={true}
              size="small"
              sx={{ width: 130, mr: 2, mb: { xs: 1, md: 0 } }}
              loading={filterLoader}
              InputLabelLoader={filterLoader}
              options={_.map(stateFilter, (ev) => {
                return {
                  label: `${ev.name}`,
                  value: ev.id
                };
              })}
              value={searchState ?? ""}
              onChange={(event, value) => handelStatChange(value)}
              label="State"
            />
          </FormControl>

          <FormControl>
            <AutoCompleteCustom
              multiple={true}
              size="small"
              sx={{ width: 130, mr: 2, mb: { xs: 1, md: 0 } }}
              loading={cityLoader}
              options={_.map(cityByMultipleStateId, (ev) => {
                return {
                  label: `${ev.name}`,
                  value: ev.id
                };
              })}
              value={searchCity ?? ""}
              onChange={(event, value) => handelCityChange(value)}
              label="City"
            />
          </FormControl>
        </Box>
      </Box>
      <Chart
        options={options}
        series={series}
        type="bar"
        width={`${dataWidth}%`}
        height={364}
      />
    </Card>
  );
}

export default UserRegisterChart;
