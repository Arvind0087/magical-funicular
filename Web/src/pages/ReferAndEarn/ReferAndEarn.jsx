import React, { useEffect } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material'
import { useSettingsContext } from "../../components/settings";
import Coin from '../../assets/images/coin.svg'
import ArrowForwardIosTwoToneIcon from '@mui/icons-material/ArrowForwardIosTwoTone';
import { useSelector } from 'react-redux';
import { getAllFaqsAsync } from '../../redux/async.api';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toastoptions } from "../../utils/toastoptions";
import { toast } from "react-hot-toast";
import './referAndEarn.css'
import { WhatsappShareButton, FacebookShareButton, TwitterShareButton, LinkedinShareButton, EmailShareButton } from 'react-share';
import { WhatsappIcon, FacebookIcon, TwitterIcon, LinkedinIcon, EmailIcon } from 'react-share';
import { Helmet } from 'react-helmet-async';



const ReferAndEarn = () => {
    const { themeStretch } = useSettingsContext();
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const allFaq = useSelector((state) => state.allFaqs.faqs.data)
    const { studentById = [] } = useSelector((state) => state?.student);
    const { coins, referralCode } = studentById
    const { getOnlySiteSettingLoader, getOnlySiteSettingData = [] } = useSelector((state) => state.getOnlySiteSetting)
    const { siteLogo, siteAuthorName,siteTitle } = getOnlySiteSettingData
    // states.....................................

    useEffect(() => {
        const payload = {
            type: 'refer'
        }
        dispatch(
            getAllFaqsAsync({ type: payload.type })
        );
    }, []);

    const onClickCopy = () => {
        navigator.clipboard.writeText(text);
        toast.success('Referral Code Copied', toastoptions);
    }

    //Student Referral Cade
    const text = (studentById.referralCode).toUpperCase()

    // Social Content
    const heading = getOnlySiteSettingData.socialContent
    const Subheading = ''
    const handleNavSubscrption =() =>{
        navigate('/app/subscription')
    }
    return (
        <>
            <Helmet>
                <title> ReferAndEarn |  {`${siteTitle}`}</title>
            </Helmet>
            <Container maxWidth={themeStretch ? false : "xl"}>

                <Typography variant="h3" component="h2" sx={{ textAlign: 'center' }}>
                    Refer & Earn
                </Typography>

                <Typography sx={{ fontSize: '18px', textAlign: 'center', mt: '15px' }}>
                    <Typography variant='span' sx={{ fontWeight: 700 }}> Earn Cash </Typography>
                    upto <Typography variant='span' sx={{ fontWeight: 700, color: 'primary.main' }}>100 Coins</Typography>  in your bank account for <Typography variant='span' sx={{ fontWeight: 700 }}>Every Friend</Typography>  you refer
                </Typography>

                <Grid container textAlign='-webkit-center'>
                    {/* Changble Area  Start */}
                    <Grid item md={6} xs={12} textAlign='-webkit-center'>

                        <Typography variant='h5' sx={{ mt: 3 }}>
                            Total Rewards Earn
                        </Typography>

                        <Box sx={{ maxWidth: '400px', height: '50px', borderRadius: "82px", border: '1px solid', borderColor: 'primary.main', overflow: 'hidden', mt: 2 }}>
                            <Grid container>
                                <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex' }}>
                                        <img src={Coin} alt='coin' /> &nbsp;
                                        <Typography variant='h6' color='primary.main'> &nbsp;{studentById.coins}</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={4} sx={{ backgroundColor: 'primary.main', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} onClick={handleNavSubscrption}>
                                    <Box sx={{ fontSize: '18px', fontWeight: "600", color: 'white' }}>  Redeem Now </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    {/* Changble Area End */}


                    {/* <Grid item md={6} xs={12}> <Card sx={{ p: '20px', maxWidth: '350px', mt: 3, textAlign: 'center' }}> */}
                    {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}> */}
                    {/* <Box>
                                <Typography sx={{ fontSize: '16px' }}>
                                    Total Rewards Earn
                                </Typography>
                                <Box sx={{ display: 'flex' }}>
                                    <img src={Coin} alt='coin' /> &nbsp;
                                    <Typography variant='h6' color='primary.main'>2140</Typography>
                                </Box>
                            </Box> */}
                    {/* <Button variant="contained" sx={{
                                color: "#fff", borderRadius: "60px",
                                p: 1.5, minWidth: '150px', height: '45px'
                            }} endIcon={<ArrowForwardIosTwoToneIcon />}>
                                Redeem Now
                            </Button> */}
                    {/* </Box> */}
                    {/* </Card></Grid> */}


                    <Grid item md={6} xs={12} textAlign='-webkit-center'>
                        <Typography variant='h5' sx={{ mt: 3 }}>
                            Share Your Referral Code
                        </Typography>

                        <Box sx={{ maxWidth: '400px', height: '50px', borderRadius: "82px", border: '1px solid', borderColor: 'primary.main', overflow: 'hidden', mt: 2 }}>
                            <Grid container>
                                <Grid item xs={9} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography sx={{ fontSize: '18px', fontWeight: "600", }}> {text} </Typography>

                                </Grid>
                                <Grid item xs={3} sx={{ backgroundColor: 'primary.main', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} onClick={onClickCopy}>
                                    <Box sx={{ fontSize: '18px', fontWeight: "600", color: 'white' }}> Copy </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>



                <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <WhatsappShareButton url={heading} title={Subheading} >
                        <WhatsappIcon size={45} className='share-icon' logofillcolor='white' round={true}></WhatsappIcon>
                    </WhatsappShareButton>
                    <FacebookShareButton url={heading} title={Subheading}>
                        <FacebookIcon size={45} className='share-icon' logofillcolor='white' round={true}></FacebookIcon>
                    </FacebookShareButton>
                    <TwitterShareButton url={heading} title={Subheading}>
                        <TwitterIcon size={45} className='share-icon' logofillcolor='white' round={true}></TwitterIcon>
                    </TwitterShareButton>
                    <LinkedinShareButton url={heading} title={Subheading}>
                        <LinkedinIcon size={45} className='share-icon' logofillcolor='white' round={true}></LinkedinIcon>
                    </LinkedinShareButton>
                    <EmailShareButton url={heading} title={Subheading}>
                        <EmailIcon size={45} className='share-icon' logofillcolor='white' round={true}></EmailIcon>
                    </EmailShareButton>
                </Box>


                <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mt: 3 }}>
                    Frequently Asked Questions
                </Typography>

                <Card
                    sx={{
                        marginTop: '20px',
                        marginInline: 'auto',
                        width: '92%',
                        maxHeight: '75%',
                        p: 3,
                        overflow: 'hidden',
                        [theme.breakpoints.down('md')]: {
                            background: 'none',
                            boxShadow: 'none',
                            padding: 0,

                        },
                    }}>

                    <Box sx={{ pt: 2, width: '100%', height: '39vh', overflowY: "auto" }}>
                        {
                            allFaq && allFaq.map((item) => {
                                return (
                                    <Accordion key={item.id}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography>{item.question}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                {item.answer}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                )
                            })
                        }
                    </Box>
                </Card>
            </Container>
        </>
    )
}

export default ReferAndEarn