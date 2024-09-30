import React from "react";
import moment from "moment";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from "react";
import calender from "../../../assets/images/Vector.svg";
import clock from "../../../assets/images/time.svg.svg";
import { memo } from "react";
const ScholarshipClasses = (props) => {
  const { item, handleShowExam } = props
  const [isWithinDateTimeRange, setIsWithinDateTimeRange] = useState(false);
  const targetDate = moment(item?.date);
  const startTime = moment(item?.startTime, "HH:mm:ss");
  const endTime = moment(item?.endTime, "HH:mm:ss");

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDateTime = moment();
      const isWithinRange =
        currentDateTime.isSame(targetDate, "day") &&
        currentDateTime.isBetween(startTime, endTime);
      setIsWithinDateTimeRange(isWithinRange);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, startTime, endTime]);
  useEffect(() => {
    if (isWithinDateTimeRange) {
      handleShowExam(true)
    }
    else {
      handleShowExam(false)
    }
  }, [isWithinDateTimeRange])
  return <>
    <Grid item xs={10} md={6} lg={4}>
      <Box sx={{
        height: "180px", borderRadius: "10px",
        p: 1,
        pl: 2,
        pr: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        border: "2px solid #E2E2E2",
      }}>
        <Box sx={{ display: "flex" }}>{item?.classes?.map((e, i) => <Box key={i} sx={{ display: "flex" }}><Typography sx={{ color: "primary.main", fontWeight: "600", ml: 0.3 }}>{e.name}</Typography></Box>)}</Box>
        <Box sx={{ display: "flex" }}>
          <img src={calender} />
          <Typography sx={{ marginLeft: "4px", color: "#787A8D", fontSize: "15px" }}>{`${moment(item?.startTime, 'HH:mm:ss').format('h:mm A')} -`}</Typography>
          <Typography sx={{ marginLeft: "4px", color: "#787A8D", fontSize: "15px" }}>{moment(item?.endTime, 'HH:mm:ss').format('h:mm A')}</Typography>
        </Box>
        <Box sx={{ display: "flex" }}>
          <img src={clock} />
          <Typography sx={{ marginLeft: "4px", color: "#787A8D", fontSize: "14px" }}>{moment(item?.date, 'YYYY-MM-DD').format('DD-MM-YYYY')}</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: "500" }}>Syllabus</Typography>
          <Box sx={{ display: "flex" }}>
            {item?.subjects?.map((e, i) => (<Box key={i} sx={{ display: "flex" }}><Typography sx={{ color: "#787A8D", fontSize: "12px", mt: 0.4 }}>{e.name}</Typography>
              <Typography sx={{ color: "rgb(136,138,154)", visibility: item?.subjects?.length < 2 ? "hidden" : "visible" }}>|</Typography></Box>))}</Box>
        </Box>
      </Box>
    </Grid>
  </>
}
export default memo(ScholarshipClasses)
