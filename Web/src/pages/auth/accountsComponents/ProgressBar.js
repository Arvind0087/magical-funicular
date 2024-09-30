import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircleIcon from '@mui/icons-material/Circle';


export default function LinearWithValueLabel(props) {
    const {progressValue} = props
 
   

    return (

        <Box sx={{ alignItems: 'center', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">Percentage</Typography>
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{progressValue}%</Typography>
                </Box>
            </Box>

            <Box sx={{ width: '97%', m: 1 }}>
                <LinearProgress variant="determinate" value={progressValue} />
            </Box>
{/* 
            <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                aria-label="contacts"
            >
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <CircleIcon
                            sx={{
                                width:'7px',
                                height:'7px',
                                color: "primary.dark",
                                
                               

                            }}/>
                           
                        </ListItemIcon>
                        <ListItemText primary="Chelsea Otakan" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                      
                        <ListItemText primary="Eric Hoffman" />
                    </ListItemButton>
                </ListItem>
            </List> */}
        </Box>
    );
}