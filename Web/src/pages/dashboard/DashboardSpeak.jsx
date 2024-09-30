import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Phone from "../../assets/images/phone.svg"
import share from "../../assets/images/share.svg"
import ShareWith from '../../components/shareWith/ShareWith'

const CardData = [{
    id: 1,
    image: Phone,
    buttonText: 'Call Now',
    heading: 'Have Queries?',
    text: 'Talk to your academic counsellor',
    buttonColor: '#3B6AFF',
    cardColor: '#EEF4FF'
},
{
    id: 2,
    image: share,
    buttonText: 'Share Now',
    heading: 'Share with friends',
    text: "  ",
    buttonColor: '#FD4985',
    cardColor: '#FFEEF0'
}]

const DashboardSpeak = () => {
    const theme = useTheme();
    // states...
    const { getOnlySiteSettingLoader, getOnlySiteSettingData = [] } = useSelector((state) => state?.getOnlySiteSetting)
    const [openShareDialog, setShareOpenDialog] = useState(false)

    const handleClickOpen = (data) => {
        if (data == "Share Now") setShareOpenDialog(true)
    };

    return (
        <>
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {
                    CardData.map((item) => {
                        return (
                          <Grid item xs={12} md={6} key={item.id}
                            sx={{display:(item?.heading==="Have Queries?"&& getOnlySiteSettingData?.helpLineNumber)?"none":"block"}}
                          >
                                <Card
                                    sx={{
                                        width: '100%',
                                        height: 150,
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        p: '20px 17px',
                                        mt: '30px',
                                        display: 'flex',
                                        flexDirection: "row",
                                        backgroundColor: item.cardColor,
                                        [theme.breakpoints.down('md')]: {
                                            justifyContent:"space-between"
                                        },
                                    }}
                                >
                                    <Grid item xs={3}><img src={item.image} height='100px' width='100px' /></Grid>

                                    <Grid item xs={8}>
                                        <Box sx={{ display: 'block' }}>
                                            <Box sx={{
                                                height: "50px", [theme.breakpoints.down('md')]: {
                                                    height: '60px',
                                                },
                                            }}>
                                                <Typography variant='h5'>{item.heading}</Typography>
                                                <Typography sx={{ color: "#666666" }}>{item.text}</Typography>
                                            </Box>
                                            <Button
                                                onClick={() => handleClickOpen(item.buttonText)}
                                                sx={{
                                                    borderRadius: '60px',
                                                    color: '#ffff',
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    height: '35px',
                                                    width: '50%',
                                                    mt: 2,
                                                    backgroundColor: item.buttonColor,
                                                    [theme.breakpoints.down('sm')]: {
                                                        minWidth: '80%',
                                                    },
                                                }}
                                                type="submit"
                                                className='OTP-button'
                                                variant="contained"
                                            >
                                                {item.buttonText}
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Card>
                            </Grid>
                        )
                    })
                }
            </Grid>
            <ShareWith
                {...{
                    setShareOpenDialog,
                    openShareDialog,
                }}
            />
        </>
    )
}

export default DashboardSpeak;