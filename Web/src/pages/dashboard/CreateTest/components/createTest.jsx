import { Box, Button, Checkbox, Container, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useSettingsContext } from '../../../../components/settings';


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const CreateTest = (props) => {
    const { QuentionsNo, SelectSubjects, Time, levels,setOpenChapter } = props;
    const { themeStretch } = useSettingsContext();
    const theme = useTheme();

    // states...
    const [showSelector, setShowSelector] = useState({
        level: false,
        questions: false,
        time: false,
        button:false,
    });
    const [checkStatus, setCheckStatus] = useState(SelectSubjects)
    const [allChecked, setAllChecked] = useState(false)
    const [value, setValue] = useState([])
    const [subject, setSubject]=useState([])
 
    const handleSubject = () => {
        setShowSelector({ level: true })
    }

    const handleLevel = () => {
        setShowSelector({ questions: true })
    }
    const handleQuestion = () => {
        setShowSelector({ time: true })
    }
    const handleTime = () => {
        setShowSelector({ button: true })
    }

    const handleCheckBox=(e,id)=>{
        setCheckStatus(checkStatus.map((item)=>{
            if(item.id===id){
                item.selected = !item.selected
                if(item.selected){
                    setValue((pre)=>{
                        return  [...pre, e]
                    })
                }
            }
            return item
        }))
};

    const handleAllSelect=()=>{
        setAllChecked(!allChecked)
        const ltr = [...checkStatus]
        if(allChecked){
            ltr.forEach(item => {
                item.selected = false
            })
        }else{
            ltr.forEach(item => {
                item.selected = true
            })
        }
        setCheckStatus(ltr)
    }

    const changeVal = (event) =>{
        setSubject(event.target.value)
    }
    const openChapters = ()=>{
        setOpenChapter(true)
    }

    return (
        <>
            <Typography variant="h5">Create Test</Typography>
            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Subject</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Chapter"
                            value={subject}
                            sx={{ borderRadius: '30px' }}
                            onChange={changeVal} 
                        >
                          <MenuItem value={'all'} sx={{paddingInline:0}}>
                                <Checkbox checked={allChecked} {...label} onChange={()=>handleAllSelect()}/>
                                Select All
                          
                           </MenuItem>
                            <Divider />
                           
                            {SelectSubjects.map((item) => (
                                <Box sx={{display:'flex'}}><Checkbox {...label} checked={item.selected} onChange={()=>{handleCheckBox(item.value,item.id); setAllChecked(false)}}
                                /><MenuItem value={item.Chapter}>{item.Chapter}</MenuItem></Box>
                            ))}
                             <Divider />
                             <Box sx={{display:'flex',justifyContent:'right',mr:2}} >
                             <Button
                                type="button"
                                onClick={handleSubject}
                                sx={{
                                    width: '50%',
                                    display: 'flex',
                                    borderRadius: '42px',
                                    justifyContent: 'center',
                                    height: '44px',
                                    alignItems: 'center',
                                    marginTop: '30px',
                                    color: '#ffff',
                                    [theme.breakpoints.down('sm')]: {
                                        width: '50%',
                                      
                                    }
                                }}
                                variant="contained"
                            >
                                Apply
                            </Button>
                             </Box>
                            
                        </Select>
                       

                    </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Easy</InputLabel>
                        <Select
                            disabled={!showSelector.level}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Chapter"
                            sx={{ borderRadius: '30px' }}
                            onChange={handleLevel}
                        >
                            {levels.map((item) => (
                                <Box sx={{display:'flex'}}><Checkbox {...label} checked={item.selected} onChange={()=>{handleCheckBox(item.value,item.id); setAllChecked(false)}}
                                /><MenuItem value={item.Chapter}>{item.level}</MenuItem></Box>
                            ))}
                        </Select>
                    </FormControl>

                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Number of Questions</InputLabel>
                        <Select
                            disabled={!showSelector.questions}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Chapter"
                            sx={{ borderRadius: '30px' }}
                            onChange={handleQuestion}
                        >
                            {QuentionsNo.map((item) => (
                                <MenuItem value={item.number}>{item.number}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Select Time</InputLabel>
                        <Select
                            disabled={!showSelector.time}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Chapter"
                            sx={{ borderRadius: '30px' }}
                            onChange={handleTime}
                        >
                            {Time.map((item) => (
                                <MenuItem value={item.time}>{item.time}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                <Button
                    // disabled={!showSelector.time}
                    sx={{
                        // mt: 30,
                        borderRadius: '60px',
                        color: '#ffff',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '55px',
                        width: '100%',
                        [theme.breakpoints.down('md')]: {
                            width: '100%',
                            marginTop:'50px'
                        },
                    }}
                    type="submit"
                    className='OTP-button'
                    variant="contained"
                    onClick={openChapters}
                >
                    Next
                </Button>
                </Grid>
            </Grid>
        </>
    )
}

export default CreateTest;
