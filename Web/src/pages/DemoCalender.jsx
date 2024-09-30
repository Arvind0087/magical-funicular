import FullCalendar from "@fullcalendar/react"; // => request placed at the top
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import timelinePlugin from "@fullcalendar/timeline";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Box, Typography } from "@mui/material";
import useResponsive from "../hooks/useResponsive";
// import CalendarToolbar from "./component/ScheduleToolbar";
// import StyledCalendar from "./component/style";
import CustomComponentLoader from "../components/CustomComponentLoader";
import {
    StyledCalendar,
    CalendarToolbar,
} from '../sections/@dashboard/calendar';
import DemoPopover from "./dashboard/Live/components/DemoPopover";
import { getCalendarMonthAsync } from "redux/async.api";

const tDate = new Date();
const todaysDate = tDate.setHours(0, 0, 0, 0);
const holidays = [0, 6];

export default function DemoCalender() {
    const calendarRef = useRef(null);
    const dispatch = useDispatch();
    const isDesktop = useResponsive("up", "sm");
    const { scheduleLoader } = useSelector((state) => state?.schedule);
    const live = useSelector(state => state?.live)
    const { getCalenderData } = live;
    // states
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState(isDesktop ? "dayGridMonth" : "listWeek");
    const [selectedDate, setSelectedDate] = useState('');
    const [openDemo, setOpenDemo] = useState(false);

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
        if (isDateClickable(date, day)) {
            setOpenDemo(true);
            setSelectedDate(e.dateStr)
        }
    }
    const handleClose = (value) => {
        setOpenDemo(false);
    };

    const disablePastDates = (info) => {
        const eventDate = info.event.start;
        const minDate = new Date('2022-03-01'); // example minimum date
        if (eventDate < minDate) {
            info.el.disabled = true;
        }
    };

    return (
        <>
            <Card sx={{
                mt: 4,
                '& .fc-daygrid-event': {
                    margin: '0 !important',
                    zIndex: "-1 !important",
                    height: "115px",
                    position: "absolute",
                    top: "-30px",
                    width: "100%",
                    border: '2px solid blue',
                    disable: 'true'
                },
                '& .fc-day-disabled': {
                    pointerEvents: 'none',
                    opacity: '0.5',
                }
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
                            eventBorderColor="#f0f"
                            themeSystem="#000"
                            allDayContent
                            events={getCalenderData?.data}
                            dayCellClassNames="dayCellClassNames"
                            ref={calendarRef}
                            minDate={date}
                            selectable={date => {
                                return date.getDay() !== 0 && date.getDay() !== 6; // return false for Sundays (0) and Saturdays (6)
                            }}
                            selectAllow={(selectInfo) => {
                                console.log('selectInfo', selectInfo)
                                // return moment().diff(selectInfo.start) >= 0
                            }}
                            allDaySlot
                            // initialDate={date}
                            initialView={view}
                            dayMaxEventRows={100}
                            eventDisplay="block"
                            headerToolbar={false}
                            select={handleSelectRange}
                            eventClick={handleSelectEvent}
                            height={isDesktop ? 720 : "auto"}
                            dateClick={(e) => dateHandler(e)}
                            eventContent={renderEventContent}
                            // validRange={validRange}
                            eventRender={disablePastDates}
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

            <DemoPopover
                openDemo={openDemo}
                onClose={handleClose}
                selectedDate={selectedDate}
                setOpenDemo={setOpenDemo}
            />
        </>
    );
}

function renderEventContent(eventInfo) {
    return (
        <Box
            sx={{
                color: "red",
                display: 'none',
                border: '1px solid red'

            }}
        >
            {eventInfo.event.title}
        </Box>
    );
}


