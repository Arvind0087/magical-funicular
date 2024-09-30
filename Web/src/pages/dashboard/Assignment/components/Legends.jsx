import React, { useState } from "react";
import { useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function Legends() {
    const theme = useTheme();
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    // state
    const [enable, setEnable] = useState(false);
    const legends = [
        {
            title: 'Not Visited',
            id: 1
        },
        {
            title: 'Skipped',
            id: 2
        },
        {
            title: 'Answered',
            id: 3
        },

    ]

    const handleChange = (e) => {
        setEnable(!enable)
    }

    return (
        <>
            <Typography variant='h5'>Navigation & Legends</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                <Box sx={{ height: '20px', width: '20px', backgroundColor: '#F1F1F1', borderRadius: '5px', mr: 1 }}></Box>
                <Typography>Not Visited</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Box sx={{ height: '20px', width: '20px', backgroundColor: '#85888A', borderRadius: '5px', mr: 1 }}></Box>
                <Typography>Skipped</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Box sx={{ height: '20px', width: '20px', backgroundColor: '#80CC8C', borderRadius: '5px', mr: 1 }}></Box>
                <Typography>Answered</Typography>
            </Box>
        </>
    );
}

export default Legends;
