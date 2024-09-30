import React, { useState, useEffect } from 'react'
import { Box, Card, CardHeader, CardActions, FormControl } from "@mui/material";
import Chart from 'react-apexcharts'
import { useDispatch, useSelector } from 'react-redux'
import { coursefilterAsync, boardfilterAsync } from "redux/filter/filter.async";
import { getStudentStrengthByBatchTypeAsync } from '../../redux/graph/studentStrenghtbarChart.async';
import { getBoardsByCourseIdAsync } from "redux/async.api";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";

function BarChartSimple() {
    const dispatch = useDispatch();
    const [searchCourse, setSearchCourse] = useState(undefined);
    const [searchBoard, setSearchBoard] = useState(undefined)

    const { filterLoader, courseFilter, boardFilterInfo } = useSelector((state) => state.filterInfo);
    const { studentStrengthLoader, studentStrength } = useSelector((state) => state.perBatchStudentStrength);
    const { boardLoader, boardByCourse } = useSelector((state) => state.board);
    useEffect(() => {
        dispatch(coursefilterAsync({}));
        dispatch(boardfilterAsync({}))
    }, []);

    useEffect(() => {
        if (searchCourse) {
            let payload = { courseId: searchCourse?.value }
            dispatch(getBoardsByCourseIdAsync(payload))
        }
    }, [searchCourse])

    const preFilteredCourseId = courseFilter[0]?.id
    const preFilderedBoardId = boardFilterInfo[0]?.id
    const firstObjectWithStudents = studentStrength?.find(obj => obj?.studentsCount > 0);

    useEffect(() => {
        if (searchCourse && searchBoard) {
            let payload = {
                courseId: searchCourse?.value || firstObjectWithStudents?.courseId,
                boardId: searchBoard?.value || firstObjectWithStudents?.boardId,
            }
            dispatch(getStudentStrengthByBatchTypeAsync(payload))
        }
        if (preFilteredCourseId && preFilderedBoardId) {
            let payload = {
                courseId: searchCourse?.value || firstObjectWithStudents?.courseId || preFilteredCourseId,
                boardId: searchBoard?.value || firstObjectWithStudents?.boardId || preFilderedBoardId,
            }
            dispatch(getStudentStrengthByBatchTypeAsync(payload))
        }
    }, [preFilteredCourseId, preFilderedBoardId, searchCourse?.value, searchBoard?.value]);

    useEffect(() => {
        if (searchCourse === null) {
            setSearchBoard(undefined);
        }
    }, [searchCourse])

    let dataWidth;
    if (studentStrength.length <= 60) {
        dataWidth = 90;
    } else {
        dataWidth = 150 + studentStrength.length
    }

    // Chart Data
    const series = [{
        name: 'Students', // Bar Data
        data: studentStrength.map((ev) => ev?.studentsCount)
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
        colors: ['#3FCF78'],
        theme: { mode: 'light' },
        xaxis: {
            categories: studentStrength.map((ev) => `${ev?.className}(${ev?.batchName})`),
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
                borderRadius: 3,
                horizontal: false,
                columnWidth: '10%',
                barWidth: '10%',
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
            <CardHeader
                title="Batch Wise Student Strength"
            />
            <Box sx={{ overflowX: 'auto', maxWidth: '100%' }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    mt: 2
                }}>
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
                            value={searchCourse ?? ""}
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
                </Box>
            </Box>
            <Chart options={options} series={series} type="bar" width={`${dataWidth}%`} height={364} />
        </Card>
    )
}

export default BarChartSimple;


