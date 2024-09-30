import React, {useEffect } from "react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useSelector, useDispatch } from "react-redux";
import { getActivityOfUserAsync } from "redux/async.api";
import CustomComponentLoader from "components/CustomComponentLoader";
import LearnRecentCard from "./LearnRecentCard";
import _ from "lodash";
const LearnRecentActivity = () => {
  const dispatch = useDispatch();
  const { getActivityOfUserLoader,activityOfUser = [] } = useSelector((state) => state?.activity)
  useEffect(() => {
    dispatch(getActivityOfUserAsync({
      type: "syllabus"
    }))
  }, []);
  return <>
    {
      getActivityOfUserLoader ?
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', color: 'primary.main',mt:20 }}>
          <CustomComponentLoader padding="0" size={50} />
        </Box>
        :
        <Grid container spacing={3}>
          {activityOfUser?.length>0?_.map(activityOfUser, (item, In) => {
            return <LearnRecentCard item={item} key={In}/>
          }):<Box sx={{width:'100%',textAlign:'center',marginTop:'80px',mt:20}}><Typography variant="h5">No Data Found</Typography></Box>}
        </Grid>
    }
  </>
}
export default LearnRecentActivity