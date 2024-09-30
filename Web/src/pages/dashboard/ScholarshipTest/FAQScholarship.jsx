import React from "react";
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getAllFaqsAsync } from "../../../redux/async.api";
import { useEffect } from "react";
import CustomComponentLoader from "../../../components/CustomComponentLoader";
function FAQScholarship(props) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const allFaqs = useSelector((state) => state?.allFaqs);
    const { faqLoader, faqs } = allFaqs
    const [listOfQuestionData, setListOfQuestionData] = useState(
        props.ListOfQuestion
    );
    useEffect(() => {
        dispatch(getAllFaqsAsync({
            type: "scholarship"
        }))
    }, [])
    return (
        <>
            {faqLoader ? <><Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', color: 'primary.main' }}>
                <CustomComponentLoader padding="0" size={50} />
            </Box></> : <>
                {faqs?.data?.length > 0 ? <>
                    <Card
                        sx={{
                            marginTop: '10px',
                            marginInline: 'auto',
                            width: '98.5%',
                            maxHeight: '250px',
                            p: 3,
                            ml: 0,
                            overflow: 'hidden',
                            [theme.breakpoints.down('md')]: {
                                background: 'none',
                                padding: 0,

                            },
                        }}
                    >
                        <Box sx={{ pt: 2, width: '100%', height: '39vh', overflowY: "auto" }}>
                            {
                                faqs?.data?.map((item) => {
                                    return (
                                        <Accordion key={item?.id}>
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
                                })
                            }
                        </Box>
                    </Card></> : <><Box sx={{ width: '100%', textAlign: 'center', marginTop: '80px' }}><Typography variant="h5">No Data Found</Typography></Box></>}
            </>
            }
        </>
    )
}

export default FAQScholarship
