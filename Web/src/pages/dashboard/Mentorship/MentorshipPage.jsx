import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@mui/material";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import AskDoubtSlider from "./AskDoubtSlider";
import SaarthiHelp from "./SaarthiHelp";
import YourMentor from "./YourMentor";
import WhyNeedMentor from "./WhyNeedMentor";
import FAQMentorship from "./FAQMentorship";
import SubscribePopover from "./SubscribePopup";
import { getTestInstructionAsync } from "../../../redux/async.api";
import { Helmet } from "react-helmet-async";

const MentorshipPage = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { test } = useSelector(state => state)
    const { testinstruction } = test;
    const { getOnlySiteSettingLoader, getOnlySiteSettingData = [] } = useSelector((state) => state.getOnlySiteSetting)
    const { siteLogo, siteAuthorName, siteTitle } = getOnlySiteSettingData
    // state
    const [open, setOpen] = useState(false);
    const [openRazorPay, setOpenRazorPay] = useState(false)

    // functions
    const handleClose = (value) => {
        setOpen(false);
        // setSelectedValue(value);
    };
    useEffect(() => {
        dispatch(
            getTestInstructionAsync({
                type: 'mentor'
            })
        )
    }, [])

    const handlePopup = () => {
        if (testinstruction.amount === 0) {
            setOpen(true)
        } else {
            alert('open razor pay popup')
            setOpenRazorPay(true)
        }
    }

    return (
        <>
            <Helmet>
                <title>Mentorship | {`${siteTitle}`}</title>
            </Helmet>
            <Container sx={{}}>
                <Box>
                    <Typography variant="h4">Mentorship</Typography>
                </Box>
                <Box sx={{ mt: 0 }}>
                    <AskDoubtSlider />
                </Box>
                {/* <Box sx={{ mt:4,}}>
          <Typography variant="h6">Connect with our Premium Coaches</Typography>
          <PremiumCoaches PremiumCoachData={PremiumCoachData}/>
          </Box> */}
                <Box sx={{ mt: 4, }}>
                    <Typography variant="h6">How Saarthi Helps</Typography>
                    <SaarthiHelp />
                </Box>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6">Meet Your Mentors</Typography>
                    <YourMentor />
                </Box>
                <Box sx={{ mt: 4, }}>
                    <Typography variant="h6" >Why you need Mentors?</Typography>
                    <WhyNeedMentor />
                </Box>
                <Box sx={{ mt: 4, }}>
                    <Typography variant="h6">Frequently Asked Questions</Typography>
                    <FAQMentorship />
                </Box>
                <Box sx={{ mt: 4, }}>
                    <Card sx={{
                        marginTop: '20px',
                        marginInline: 'auto',
                        width: '98.5%',
                        maxHeight: '250px',
                        p: 2,
                        ml: 0,
                        display: "flex",
                        justifyContent: "space-between",
                        overflow: 'hidden',
                        [theme.breakpoints.down('md')]: {
                            background: 'none',
                            pt: 1,
                            pb: 2,
                            flexDirection: "column",
                            justifyContent: "space-around"
                        },
                    }}>
                        <Box sx={{
                            display: "flex", pl: 2, [theme.breakpoints.down('md')]: {
                                background: 'none',
                                padding: 0,
                                width: "100%",
                                justifyContent: "space-between"
                            }
                        }}>
                            <Box sx={{
                                display: "flex", pl: 1, [theme.breakpoints.down('md')]: {
                                    pl: 0
                                },
                            }}>
                                <Box ><Typography sx={{ mt: 1 }}>Get Your </Typography></Box>
                                <Box ><Typography sx={{ ml: 0.5, fontWeight: "600", mt: 1 }}>
                                    Mentor
                                </Typography>
                                </Box>
                            </Box>
                            <Box><Typography sx={{ ml: 0.5, fontWeight: "600", mt: 1, }}>Only ₹{testinstruction?.amount}</Typography></Box>
                        </Box>
                        <Box sx={{
                            height: "50px", [theme.breakpoints.down('md')]: {
                                width: "100%",
                                alignItems: "center",
                                paddingInline: "30%",
                                mt: 2
                            },
                        }}>
                            <Button
                                onClick={handlePopup}
                                variant="contained"
                                sx={{
                                    height: "100%",
                                    borderRadius: "12px",
                                    width: "100%",
                                    color: "white",
                                    paddingTop: "8px",
                                }}
                            >
                                Subscribe Now
                            </Button>
                        </Box>
                    </Card>
                </Box>
            </Container>
            <SubscribePopover
                // selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
                setOpen={setOpen}
            // subjectBy={subjectBy}
            />
        </>
    )
}
export default MentorshipPage