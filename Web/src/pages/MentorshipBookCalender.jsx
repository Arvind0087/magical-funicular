import FullCalendar from "@fullcalendar/react"; // => request placed at the top
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import timelinePlugin from "@fullcalendar/timeline";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import useResponsive from "../hooks/useResponsive";
// import CalendarToolbar from "./component/ScheduleToolbar";
// import StyledCalendar from "./component/style";
import CustomComponentLoader from "../components/CustomComponentLoader";
import {
    StyledCalendar,
    CalendarToolbar,
} from '../sections/@dashboard/calendar';
import { getAllowedSessionByUserIdAsync, getCalendarMonthAsync } from "../redux/async.api";
import FreeBookPopver from "./dashboard/Mentorship/MentorshipFreeBookPopup";
import { Helmet } from "react-helmet-async";

const tDate = new Date();
const todaysDate = tDate.setHours(0, 0, 0, 0);
const holidays = [0, 6];

export default function MentorshipBookCalender() {
    const calendarRef = useRef(null);
    const isDesktop = useResponsive("up", "sm");
    const dispatch = useDispatch();
    const { scheduleLoader } = useSelector((state) => state?.schedule);
    const { getAllowedSession, getAllowedSessionLoader, studentById = [] } = useSelector(state => state?.student);
    const { id } = studentById;
    const live = useSelector(state => state?.live)
    const { getCalenderData } = live;
    const { getOnlySiteSettingLoader, getOnlySiteSettingData = [] } = useSelector((state) => state.getOnlySiteSetting)
    const { siteLogo, siteAuthorName, siteTitle } = getOnlySiteSettingData
    // states
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState(isDesktop ? "dayGridMonth" : "listWeek");
    const [selectedDate, setSelectedDate] = useState('');
    const [openFree, setOpenFree] = useState(false);

    useEffect(() => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            const newView = isDesktop ? "dayGridMonth" : "listWeek";
            calendarApi.changeView(newView);
            setView(newView);
        }
    }, [isDesktop]);

    useEffect(() => {
        dispatch(getAllowedSessionByUserIdAsync({
            userId: id
        }))
    }, [])

    useEffect(() => {
        dispatch(
            getCalendarMonthAsync()
        )
    }, []);

    const handleSelectRange = (arg) => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.unselect();
        }
    };

    const handleSelectEvent = (arg) => {
        // setmodalEvent(true);
        // setSelectedEvent(arg);
    };

    // Calendar Toolbar
    const handleClickDatePrev = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.prev();
            setDate(calendarApi.getDate());
        }
    };

    const handleClickDateNext = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.next();
            setDate(calendarApi.getDate());
        }
    };

    const handleClickToday = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.today();
            setDate(calendarApi.getDate());
        }
    };

    const handleChangeView = (newView) => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.changeView(newView);
            setView(newView);
        }
    };
    const isDateClickable = (date, day) => {
        if ((date < todaysDate) || (holidays.includes(day))) {
            return false
        }
        return true
    }
    const dateHandler = (e) => {
        const date = e.date.getTime()
        const day = e.date.getDay()
        if (isDateClickable(date, day)){
            setSelectedDate(e.dateStr)
            setOpenFree(true);
        }
    }
    const handleClose = (value) => {
        setOpenFree(false);
    };

    return (
        <>
         <Helmet>
                <title>Mentorship | {`${siteTitle}`}</title>
            </Helmet>
            <Grid container>
                <Grid item md={5} xs={12}>
                    <Card sx={{ height: 'auto', width: '100%', p: 1.5, mt: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingBlock: 1 }}> <Typography variant='h6'>Total Session Allocated</Typography>
                            <Typography variant='h6'>{getAllowedSession?.data?.sessionAllocated}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingBlock: 1 }}> <Typography variant='h6'>Total Session Used</Typography>
                            <Typography variant='h6'>{getAllowedSession?.data?.sessionUsed}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingBlock: 1, alignItems: 'center' }}> <Typography variant='h6'>Available Session</Typography>
                            <Typography sx={{ color: 'primary.main', fontSize: '20px' }}><b>{getAllowedSession?.data?.sessionAvailable}</b></Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <Card sx={{
                mt: 4,
                '& .fc-daygrid-event': {
                    margin: '0 !important',
                    zIndex: "-1 !important",
                    height: "110px",
                    position: "absolute",
                    top: "-30px",
                    width: "100%",
                    border: '1px solid red'
                },
            }}>
                <StyledCalendar>
                    <CalendarToolbar
                        date={date}
                        view={view}
                        onNextDate={handleClickDateNext}
                        onPrevDate={handleClickDatePrev}
                        onToday={handleClickToday}
                        onChangeView={handleChangeView}
                    />
                    {scheduleLoader ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                m: "40px 0",
                            }}
                        >
                            <CustomComponentLoader padding="0 0" size={40} />
                        </Box>
                    ) : (
                        <FullCalendar
                            weekends
                            allDayMaintainDuration
                            eventResizableFromStart
                            initialEvents={''}
                            eventBackgroundColor={() => {
                            }}
                            events={getCalenderData?.data}
                            ref={calendarRef}
                            initialDate={date}
                            initialView={view}
                            dayMaxEventRows={100}
                            eventDisplay="block"
                            headerToolbar={false}
                            select={handleSelectRange}
                            eventClick={handleSelectEvent}
                            height={isDesktop ? 720 : "auto"}
                            dateClick={(e) => dateHandler(e)}
                            eventContent={renderEventContent}
                            plugins={[
                                listPlugin,
                                dayGridPlugin,
                                timelinePlugin,
                                timeGridPlugin,
                                interactionPlugin,
                            ]}
                        />
                    )}
                </StyledCalendar>
            </Card>

            <FreeBookPopver
                openFree={openFree}
                onClose={handleClose}
                selectedDate={selectedDate}
                setOpenFree={setOpenFree}
            />

        </>
    );
}

function renderEventContent(eventInfo) {
    return (
        <Box
            sx={{
                color: "#000",
            }}
        >
            {eventInfo.event.title}
        </Box>
    );
}


