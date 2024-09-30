import React from "react";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AppAreaInstalled } from "../../sections/@dashboard/general/app";

export default function Chart(props) {
  const {graph=[]}=props
  let categories=[];
  let data=[];
  graph.length>0 && graph?.map((item)=>{
    categories.push(item?.month)
    data.push(item?.learningTime)
  })
  return ( 
      <Grid item xs={12} md={6} lg={8}>
        {
      graph.length>0?
      <AppAreaInstalled
        subheader=""
        chart={{
          "categories": categories,
          "series": [
            {"data": [
                { "data": data }
              ]
            },
          ]
        }}
      />:<Box sx={{ width: '100%', textAlign: 'center', marginTop: '80px' }}><Typography variant="h5">No Data Found</Typography></Box>}
    </Grid>
  );
}
