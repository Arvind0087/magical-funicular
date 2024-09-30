import React from "react";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getAllFaqsAsync } from "../../../redux/async.api";
import CustomComponentLoader from "../../../components/CustomComponentLoader";
function FAQMentorship() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const allFaqs = useSelector((state) => state?.allFaqs)
    const allFaq = allFaqs?.faqs?.data
    const { faqLoader } = allFaqs

    // states.....................................

    useEffect(() => {
        dispatch(
            getAllFaqsAsync({
                type: "mentorship"
            })
        );
    }, []);

    return (
        <>
            {faqLoader ? <><Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', color: 'primary.main' }}>
                <CustomComponentLoader padding="0" size={50} />
            </Box></> : <>
                <Card sx={{
                    marginTop: '10px',
                    marginInline: 'auto',
                    width: '98.5%',
                    maxHeight: '250px',
                    p: 3,
                    ml: 0,
                    mt: 1,
                    pt:0,
                    overflow: 'hidden',
                    [theme.breakpoints.down('md')]: {
                        background: 'none',
                        padding: 0,

                    },
                }}
                >
                    <Box sx={{ pt: 2, width: '100%', height: '22vh', overflowY: "auto" }}>
                        {
                            allFaq?.length > 0 ? allFaq?.map((item) => {
                                return (
                                    <Accordion key={item.id}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography sx={{ fontWeight: "600" }}>{item?.question}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                {item?.answer}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                )
                            }) : <Box sx={{ width: '100%', textAlign: 'center', marginTop: '80px' }}><Typography variant="h5">No Data Found</Typography></Box>
                        }
                    </Box>
                </Card>
            </>
            }
        </>
    )
}

export default FAQMentorship