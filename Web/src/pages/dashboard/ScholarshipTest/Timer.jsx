import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { memo } from "react"
import colon from "../../../assets/images/_.svg";
import { useTheme } from "@emotion/react";
import moment from "moment"
const Timer = (props) => {
    const { ScholarshipClassByUserId, handleTimerData } = props;
    const targetDate = ScholarshipClassByUserId?.finalScholarship?.lastDateOfRegistration?.split("T")
    let newTargetDate
    if (targetDate?.length > 0 && targetDate[1] == '00:00:00.000Z') {
        newTargetDate = `${targetDate[0] + 'T18:29:59.000Z'}`
    }
    else {
        newTargetDate = ScholarshipClassByUserId?.finalScholarship?.lastDateOfRegistration
    }
    const theme = useTheme();
    let difference
    const calculateTimeLeft = () => {
        difference = +new Date(newTargetDate) - +new Date(new Date());
        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    const formatTime = (time) => {
        return time < 10 ? `0${time}` : time;
    };

    useEffect(() => {
        if (difference >= 0) {
            const intervalId = setInterval(() => {
                setTimeLeft(calculateTimeLeft());
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [calculateTimeLeft]);

    useEffect(() => {
        if (difference > 0) {
            handleTimerData(true);
        }
        else {
            handleTimerData(false);
        }
    }, [difference])

    return (

        <Box
            sx={{
                height: "200px", borderRadius: "10px",
                textAlign: "center",
                border: "2px solid #E2E2E2",
                display: "flex",
                m: 0,
                pt: 3,
                overflow: "hidden",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
            <Box sx={{
                width: "85%", borderRadius: "16px", bgcolor: "#EEF3FC",
                [theme.breakpoints.down('md')]: {
                    width: "90%"
                },
                [theme.breakpoints.down('sm')]: {
                    width: "95%"
                }
            }}>
                <Typography sx={{ fontWeight: "700", fontSize: "16px" }}>
                    {`Last Date for Registration ${moment.utc(newTargetDate).local().format('D MMMM, YYYY h:mm:ss A')}`}
                </Typography>

            </Box>
            {difference > 0 ? <Box sx={{
                height: "70%", display: "flex", width: "80%",
                justifyContent: "center",
                mt: 1
            }}>
                <Box sx={{ width: "25%", pt: 1 }}>
                    <Typography sx={{ fontWeight: "700", fontSize: "17px" }}>{formatTime(timeLeft.days)}</Typography>
                    <Typography sx={{ mt: 2, fontSize: "15px" }}>Days</Typography>
                </Box>
                <Box sx={{ width: "18%", pt: 1 }}>
                    <Typography sx={{ fontWeight: "700", fontSize: "17px" }}>{formatTime(timeLeft.hours)}</Typography>
                    <Typography sx={{ mt: 2, fontSize: "15px" }}>Hours</Typography>
                </Box>
                <Box sx={{ width: "3%", pt: 1.5 }}>
                    <img src={colon} alt={"colon"} width="40%" height="30%" />
                </Box>
                <Box sx={{ width: "18%", pt: 1 }}>
                    <Typography sx={{ fontWeight: "700", fontSize: "17px" }}>{formatTime(timeLeft.minutes)}</Typography>
                    <Typography sx={{ mt: 2, fontSize: "15px" }}>Mins</Typography>
                </Box>
                <Box sx={{ width: "3%", pt: 1.5 }}>
                    <img src={colon} alt={"colon"} width="40%" height="30%" />
                </Box>
                <Box sx={{ width: "18%", pt: 1 }}>
                    <Typography sx={{ fontWeight: "700", fontSize: "17px" }}>{formatTime(timeLeft.seconds)}</Typography>
                    <Typography sx={{ mt: 2, fontSize: "15px" }}>Secs</Typography>
                </Box>
            </Box> : <Box sx={{
                height: "70%", display: "flex", width: "80%",
                justifyContent: "center",
                mt: 1
            }}>
                <Box sx={{ width: "25%", pt: 1 }}>
                    <Typography sx={{ fontWeight: "700", fontSize: "17px" }}>00</Typography>
                    <Typography sx={{ mt: 2, fontSize: "15px" }}>Days</Typography>
                </Box>
                <Box sx={{ width: "18%", pt: 1 }}>
                    <Typography sx={{ fontWeight: "700", fontSize: "17px" }}>00</Typography>
                    <Typography sx={{ mt: 2, fontSize: "15px" }}>Hours</Typography>
                </Box>
                <Box sx={{ width: "3%", pt: 1.5 }}>
                    <img src={colon} alt={"colon"} width="40%" height="30%" />
                </Box>
                <Box sx={{ width: "18%", pt: 1 }}>
                    <Typography sx={{ fontWeight: "700", fontSize: "17px" }}>00</Typography>
                    <Typography sx={{ mt: 2, fontSize: "15px" }}>Mins</Typography>
                </Box>
                <Box sx={{ width: "3%", pt: 1.5 }}>
                    <img src={colon} alt={"colon"} width="40%" height="30%" />
                </Box>
                <Box sx={{ width: "18%", pt: 1 }}>
                    <Typography sx={{ fontWeight: "700", fontSize: "17px" }}>00</Typography>
                    <Typography sx={{ mt: 2, fontSize: "15px" }}>Secs</Typography>
                </Box>
            </Box>}
        </Box>
    )
}

export default memo(Timer)
