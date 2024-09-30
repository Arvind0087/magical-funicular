import React from "react";
import { Box, Typography } from "@mui/material";
import QuestionCard from "./QuestionCard";
const AllquestionsPage=()=>{
  
    return(
        <>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6">57 Questions</Typography>
        <Box sx={{ mt: 2 }}>
        {/* <QuestionCard QuestionData={QuestionData} /> */}
        </Box>
      </Box>
        </>
    )
}

export default AllquestionsPage