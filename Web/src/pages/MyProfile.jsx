import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import Arrow from "../assets/images/Arrow.svg";
import Account_detail from "../assets/images/account.svg";
import Order_detail from "../assets/images/order.svg";
import { PATH_DASHBOARD } from "../routes/paths";
const CardData = [{
    id: 1,
    image: Account_detail,
    heading: 'Account Details',
    text: 'Your personal and academic information',
    buttonColor: '#3B6AFF',
    cardColor: '#EEF4FF',
    Arrow: Arrow,
    path: PATH_DASHBOARD.UpdateProfile
},
{
    id: 2,
    image: Order_detail,
    heading: 'Order Details',
    text: "Description of your purchase/package",
    buttonColor: '#FD4985',
    cardColor: '#FFEEF0',
    Arrow: Arrow,
    path: PATH_DASHBOARD.orderDetail
}]

const MyProfile = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    //NOTE: navigate function to profile and account detail
    const handleNav = (path) =>{
        navigate(path)
    }
    return (
        <>
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {
                    CardData.map((item) => {
                        return (
                            <Grid item xs={12} md={6}>
                                <Card
                                    sx={{
                                        width: '100%',
                                        height: 150,
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        p: '20px 17px',
                                        mt: '30px',
                                        display: 'flex',
                                        // flexDirection: "row",
                                        justifyItems: "center",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                    onClick={() => handleNav(item?.path)}
                                >
                                    <Grid item xs={3}>
                                    <Box sx={{height:'100px',width:'100px',backgroundColor:'primary.main',borderRadius:'50%',justifyContent:'center',display:'flex',alignItems:'center'}}>
                                    <img src={item.image} height='50px' width='50px' />
                                    </Box></Grid>
                               
                                    <Grid item xs={8} sx={{
                                        [theme.breakpoints.down('md')]: {
                                            ml: 1
                                        },
                                    }}>
                                        <Box sx={{ display: 'block' }}>
                                            <Box sx={{
                                                height: "50px", [theme.breakpoints.down('md')]: {
                                                    height: '60px',
                                                },
                                            }}>
                                                <Typography variant='h5'>{item.heading}</Typography>
                                                <Typography sx={{ color: "#666666" }}>{item.text}</Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid>

                                        <img src={item.Arrow} />
                                    </Grid>
                                </Card>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </>
    )
}

export default MyProfile;

