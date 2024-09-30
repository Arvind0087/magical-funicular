import React from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import TopicLearned from "../../assets/images/Frame 79719.svg";
import LearningTime from "../../assets/images/Frame 79718.svg";
import ChartReport from "./Chart";
const LearningRecentContent = (props) => {
    const { activityReportOfUser } = props
    const { getOnlySiteSettingData = [] } = useSelector((state) => state?.getOnlySiteSetting)
    const { siteTitle } = getOnlySiteSettingData
    return <>
        <Helmet>
            <title>Learning Report | {`${siteTitle}`}</title>
        </Helmet>
        <ChartReport graph={activityReportOfUser?.graph} />
        <Grid container>
            <Grid item xs={12} sm={12} md={5} >
                <Card
                    sx={{
                        height: "90px",
                        mt: 3,
                        display: "flex",
                        p: 1
                    }}
                >
                    <Box sx={{ width: "50%", display: "flex", justifyContent: "center" }}>
                        <Box sx={{ width: "35%" }}>
                            <img src={TopicLearned} width="100%" height={"100%"} color="primary.main" />
                        </Box>
                        <Box sx={{ width: "65%" }}>
                            <Typography variant="h6" sx={{ mt: 0.5 }}> {activityReportOfUser?.learnedTopic}/{activityReportOfUser?.totalTopic}</Typography>
                            <Typography sx={{ fontSize: "15px", color: "#787A8D" }}>Topics Learned</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ width: "50%", display: "flex", justifyContent: "center" }}>
                        <Box sx={{ width: "35%" }}>
                            <img src={LearningTime} width="100%" height={"100%"} color="primary.main" />
                        </Box>
                        <Box sx={{ width: "65%" }}>
                            <Typography variant="h6" sx={{ mt: 0.5 }}>{activityReportOfUser?.learningTime} mins</Typography>
                            <Typography sx={{ fontSize: "15px", color: "#787A8D" }}>Learning Time</Typography>
                        </Box>
                    </Box>
                </Card>
            </Grid>
        </Grid>
    </>
}
export default LearningRecentContent;