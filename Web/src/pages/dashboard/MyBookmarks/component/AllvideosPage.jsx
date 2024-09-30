import React from "react";
import { Box,Typography,Grid, } from "@mui/material";
import VideoCard from "./VideoCard";
const AllvideosPage=()=>{
    
    return (
        <Box sx={{ mt: 5 }}>
        <Typography variant="h6">57 Videos</Typography>
        <Box sx={{ mt: 2 }}>
        {/* <VideoCard VideosData={VideosData}/> */}
        </Box>
      </Box>
    )
}

export default AllvideosPage 
