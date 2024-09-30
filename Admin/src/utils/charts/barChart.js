import React, { useState, useEffect } from 'react'
import Chart from 'react-apexcharts'

function BarChart() {

    const [chartWidth, setChartWidth] = useState(700);

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth < 600) {
                setChartWidth(screenWidth - 40);
            } else if (screenWidth < 1200) {
                setChartWidth(screenWidth - 80);
            } else {
                setChartWidth(1000);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Step 01
    const series = chartData.studentData

    // Step 02
    const options = {
        title: { text: chartData.chartTitle, style: { fontSize: 20 } },
        subtitle: { text: chartData.chartSubtitle, style: { fontSize: 10 } },
        theme: { mode: 'light' }, // or dark
        chart: {
            type: 'bar',
            stacked: true,
            height: 520,
            width: chartWidth,
            toolbar: {
                show: false,
            }
        },
        stroke: {
            width: 0
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
        dataLabels: {
            enabled: false,
            // formatter: (val) => { return `$${val}` }, // For Symbole In Bar, Here i.e.$
            style: { fontSize: 15, colors: ['black'] },
        },
        xaxis: {
            categories: chartData.xaxisData,
            title: { text: chartData.xaxisTitle, style: { fontSize: 20, color: 'green' } },
            tickPlacement: 'on'
        },
        yaxis: {
            labels: {
                // formatter: (val) => { return `$${val}` }, // For Symbole In Bar, Here i.e.$
                style: { fontSize: 7, colors: ['green'] }
            },
            title: { text: chartData.yaxisTitle, style: { fontSize: 15, color: 'green' } },
        },
        legend: {
            show: true,
            position: "right",
            offsetY: 200,
            offsetX: -10,
            itemMargin: {
                vertical: 5
            },
            onItemClick: {
                toggleDataSeries: true
            },
            onItemHover: {
                highlightDataSeries: true
            },
        },
        grid: {
            show: true,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: false } },

        }
    }
    return (
        <Chart options={options} series={series} type="bar" width={700} height={520} />
    )
}

export default BarChart


const chartData = {
    studentData: [
        {
            id: 1,
            name: 'Hindi Batch',
            data: [10, 20, 30, 40, 50, 110, 120],
        },
        {
            id: 2,
            name: 'Enghish Batch',
            data: [90, 20, 30, 50, 70, 200, 123],
        },
        {
            id: 3,
            name: 'Odia Batch',
            data: [20, 60, 30, 40, 100, 250, 360]
        },
        {
            id: 4,
            name: 'Panjabi Batch',
            data: [100, 10, 30, 30, 20, 230, 456]
        },
        {
            id: 5,
            name: 'Mrathi Batch',
            data: [100, 10, 30, 30, 20, 10, 230]
        },
        {
            id: 6,
            name: 'Urdu Batch',
            data: [100, 10, 30, 30, 20, 203, 230]
        },
        {
            id: 7,
            name: 'Malayalam Batch',
            data: [100, 10, 30, 30, 20, 123, 115]
        }
    ],

    chartTitle: "Student Data Chart",
    chartSubtitle: "Student Strength Till 2023",
    xaxisTitle: "Classes",
    xaxisData: ['6th', '7th', '8th', '9th', '10th', '11th', '12th'],
    yaxisTitle: "Number Of Students",
}
