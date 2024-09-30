import React, { useState, useEffect, useMemo } from 'react'
import { Box, Card, CardHeader, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Chart from 'react-apexcharts'
import { useDispatch, useSelector } from 'react-redux'
import { coursefilterAsync, boardfilterAsync, getClassWithBatchFilterAsync } from "redux/filter/filter.async";
import { getstudentAttandenceReportAsync } from '../../redux/graph/studentStrenghtbarChart.async';
import { getBoardsByCourseIdAsync } from "redux/async.api";
import { getClassByBoardAndCourseIdAsync } from "redux/class/class.async";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";
import { monthsCount, getPreviousYearsObj } from './utils'
function StudentAttendanceGraph() {
    const dispatch = useDispatch();
    const preYears = getPreviousYearsObj();
    const [searchCourse, setSearchCourse] = useState(undefined);
    const [searchBoard, setSearchBoard] = useState(undefined);
    const [searchClass, setSearchClass] = useState(undefined);
    const [getSearchMonths, setSearchMonths] = useState('')
    const [getSearchedYears, setSearchedYears] = useState('')

    const { filterLoader, courseFilter, boardFilterInfo, classWithBatchFilter } = useSelector((state) => state.filterInfo);
    const { studentAttendanceLoader, studentAttendance } = useSelector((state) => state.perStudentAttendance);
    const { boardLoader, boardByCourse } = useSelector((state) => state.board);
    const { classLoader, classbycourseboard } = useSelector((state) => state.class);
    useEffect(() => {
        dispatch(coursefilterAsync({}));
        dispatch(boardfilterAsync({}))
        dispatch(getClassWithBatchFilterAsync({}))
    }, []);

    useMemo(() => {
        if (searchCourse) {
            let payload = { courseId: searchCourse?.value }
            dispatch(getBoardsByCourseIdAsync(payload))
        }
    }, [searchCourse])
    useMemo(() => {
        if (searchBoard) {
            let payload = { courseId: searchCourse?.value, boardId: searchBoard.value }
            dispatch(getClassByBoardAndCourseIdAsync(payload))
        }
    }, [searchBoard])

    const preFilteredCourseId = courseFilter[0]?.id;
    const preFilderedBoardId = boardFilterInfo[0]?.id;
    const preFilterClassId = classWithBatchFilter[0]?.classId;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    useEffect(() => {
        if (searchCourse && searchBoard && searchClass && getSearchMonths && getSearchedYears) {
            let payload = {
                courseId: searchCourse?.value,
                boardId: searchBoard?.value,
                classId: searchClass?.value,
                month: getSearchMonths,
                year: getSearchedYears,
            }
            dispatch(getstudentAttandenceReportAsync(payload))
        }
        if (preFilteredCourseId && preFilderedBoardId && preFilterClassId) {
            let payload = {
                courseId: searchCourse?.value || preFilteredCourseId,
                boardId: searchBoard?.value || preFilderedBoardId,
                classId: searchClass?.value || preFilterClassId,
                month: getSearchMonths || currentMonth,
                year: getSearchedYears || currentYear,
            }
            dispatch(getstudentAttandenceReportAsync(payload))
        }
    }, [preFilteredCourseId, preFilderedBoardId, preFilterClassId, searchCourse, searchBoard, searchClass, currentMonth, currentYear, getSearchMonths, getSearchedYears]);

    let dataWidth;
    if (studentAttendance.length <= 60) {
        dataWidth = 100;
    } else {
        dataWidth = 150 + studentAttendance.length
    }
    useEffect(() => {
        if (searchCourse === null) {
            setSearchBoard(undefined);
            setSearchClass(undefined);
        }
    }, [searchCourse])

    useEffect(() => {
        if (searchCourse != null || searchBoard === null) {
            setSearchClass(undefined);
        }
    }, [searchBoard])

    const xaxisData = [];
    const studentName = studentAttendance.map((ev) => ev?.studentName)
    xaxisData.push(...studentName)
    const xaxisWithoutNull = xaxisData.map((value) => (value === null ? '(Unnamed)' : value));

    const yaxisData = [];
    const studentAttend = studentAttendance.map((ev) => ev?.attandenceCount)
    yaxisData.push(...studentAttend)
    const yaxisWithoutNull = yaxisData.map((value) => (value === null ? 0 : value));

    // Chart Data
    const series = [{
        name: 'Students', // Bar Data
        data: yaxisWithoutNull
    }]
    const options = {
        chart: {
            type: 'bar',
            toolbar: {
                show: false,
            }
        },
        grid: {
            show: true,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
        },
        colors: ['#FFD338'],
        theme: { mode: 'light' },
        xaxis: {
            categories: xaxisWithoutNull,
            tickPlacement: 'on'
        },
        yaxis: {
            labels: { style: { fontSize: 15 } }, //Y-Axis Parameter
        },
        legend: {
            show: false,
            position: "top"
        },
        dataLabels: {
            enabled: false,
            style: { fontSize: 15, colors: ['white'] }
        },
        plotOptions: {
            bar: {
                distributed: false,
                borderRadius: 5,
                horizontal: false,
                columnWidth: '20%',
                barWidth: '20%',
                barHeight: '20%',
                endingShape: 'rounded',
                dataLabels: {
                    position: 'center',
                    style: {
                        fontSize: '14px',
                        fontWeight: 600,
                        colors: ['#333']
                    },
                    offsetX: 0,
                    offsetY: -5,
                },
            },
        },
    }
    return (
        <Card elevaltio={7}>
            < CardHeader
                title="Class Wise Student Attendance"
            />
            <Box sx={{ overflowX: 'auto', maxWidth: '100%' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        mt: 2
                    }}
                >
                    <FormControl>
                        <AutoCompleteCustom
                            size="small"
                            sx={{ width: 130, mr: 2, mb: { xs: 1, md: 0 } }}
                            loading={filterLoader}
                            options={_.map(courseFilter, (ev) => {
                                return {
                                    label: `${ev.name}`,
                                    value: ev.id
                                };
                            })}
                            value={searchCourse}
                            onChange={(event, value) => setSearchCourse(value)}
                            label="Course"
                        />
                    </FormControl>
                    <FormControl>
                        <AutoCompleteCustom
                            size="small"
                            sx={{ width: 130, mr: 2, mb: { xs: 1, md: 0 } }}
                            loading={boardLoader}
                            options={_.map(boardByCourse, (ev) => {
                                return {
                                    label: `${ev.name}`,
                                    value: ev.id
                                };
                            })}
                            value={searchBoard ?? ""}
                            onChange={(event, value) => setSearchBoard(value)}
                            label="Board"
                        />
                    </FormControl>
                    <FormControl>
                        <AutoCompleteCustom
                            size="small"
                            sx={{ width: 130, mr: 2, mb: { xs: 1, md: 0 } }}
                            loading={classLoader}
                            options={_.map(classbycourseboard, (ev) => {
                                return {
                                    label: `${ev.name}`,
                                    value: ev.id
                                };
                            })}
                            value={searchClass ?? ""}
                            onChange={(event, value) => setSearchClass(value)}
                            label="Class"
                        />
                    </FormControl>
                    <FormControl size="small">
                        <InputLabel size="small">Months</InputLabel>
                        <Select
                            size="small"
                            sx={{ width: 130, mr: 2, mb: { xs: 1, md: 0 } }}
                            label="Months"
                            value={getSearchMonths}
                            onChange={(e) => setSearchMonths(e.target.value)}
                        >
                            <MenuItem value="">Months</MenuItem>
                            {
                                monthsCount?.map(ev => (
                                    <MenuItem key={ev?.id} value={ev?.value}>{ev?.label}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl size="small">
                        <InputLabel size="small">Years</InputLabel>
                        <Select
                            size="small"
                            sx={{ width: 130, mr: 2, mb: { xs: 1, md: 0 } }}
                            label="Years"
                            value={getSearchedYears}
                            onChange={(e) => setSearchedYears(e.target.value)}
                        >
                            <MenuItem value="">Years</MenuItem>
                            {
                                preYears?.map((ev, index) => (
                                    <MenuItem key={ev?.index} value={ev?.value}>{ev?.label}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>
                <Chart options={options} series={series} type="bar" width={`${dataWidth}%`} height={364} />
            </Box>
        </Card >
    )
}

export default StudentAttendanceGraph;


