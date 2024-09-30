import FullCalendar from "@fullcalendar/react"; // => request placed at the top
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import timelinePlugin from "@fullcalendar/timeline";
import { useState, useRef, useEffect } from "react";
import { Card, Box, Typography, Dialog, DialogTitle, IconButton, DialogContent, Button, Grid } from "@mui/material";
import useResponsive from "../hooks/useResponsive";
// import CalendarToolbar from "./component/ScheduleToolbar";
// import StyledCalendar from "./component/style";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import moment from "moment";
import { toast } from "react-hot-toast";
import { toastoptions } from "../utils/toastoptions";
import CustomComponentLoader from "../components/CustomComponentLoader";
import {
  StyledCalendar,
  CalendarToolbar,
} from '../sections/@dashboard/calendar';
import { createEventRequestAsync, getAllReminderTimeAsync, getTeacherScheduleSlotsAsync } from "../redux/async.api";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { PATH_DASHBOARD } from "routes/paths";
import { useNavigate } from "react-router";

const tDate = new Date();
const todaysDate = tDate.setHours(0, 0, 0, 0);
const holidays = [0, 6];

export default function Calender() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const isDesktop = useResponsive("up", "sm");
  const { scheduleLoader, events } = useSelector((state) => state?.schedule);
  const { teachers } = useSelector(state => state)
  const { getTeacherScheduledSlots, teacherId, getAllReminderTime, getSubjectId, getTecherScheduleByTeacherId } = teachers;
  const { studentById } = useSelector((state) => state?.student)

  // states
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(isDesktop ? "dayGridMonth" : "listWeek");
  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reminderTime, setReminderTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [reminderId, setReminderId] = useState(0);
  const [slot, setSlot] = useState(null);

  // variables
  let todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD of today
  // functions
  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = isDesktop ? "dayGridMonth" : "listWeek";
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isDesktop]);

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
      setSelectedDate(e.dateStr)
      dispatch(
        getTeacherScheduleSlotsAsync({
          teacherId: teacherId,
          date: e.dateStr,
        })
      ).then(res => {
        const { payload } = res || {};
        const { status } = payload || {};
        if (status === 200) {
          setOpen(true)
          dispatch(
            getAllReminderTimeAsync()
          )
        }
      })
    }
  }

  const handleClose = (value) => {
    setOpen(false);
  };
  const handleslots = (startDate, endDate, slots) => {
    setSlot(slots)
    const startTime = startDate.replace(/\s*[AP]M$/i, "")
    setStartTime(startTime)
    const endTime = endDate.replace(/\s*[AP]M$/i, "")
    setEndTime(endTime);
  }

  const handleReminder = (reminderId, reminderTime) => {
    setReminderTime(reminderTime)
    setReminderId(reminderId)

  }
  const bookEvent = () => {
    if (startTime && endTime) {
      dispatch(
        createEventRequestAsync({
          "studentId": studentById?.id,
          "teacherId": teacherId,
          "subjectId": getSubjectId,
          "date": selectedDate,
          "fromTime": startTime,
          "toTime": endTime,
          "type": "Doubt Class",
          "reminderMe": reminderTime
        })
      ).then(res => {
        const { payload } = res || {};
        const { status, message } = payload || {};
        if (status === 200) {
            toast.success(message, toastoptions)
            setOpen(false)
            navigate(PATH_DASHBOARD.event)
          }
        })
    }
  }
  return (
    <>
      <Typography variant="h5">Calender</Typography>
      <Card
        sx={{
          mt: 4,
          '& .fc-daygrid-event': {
            margin: '0 !important',
            zIndex: "-1 !important",
            height: "110px",
            position: "absolute",
            top: "-30px",
            width: "100%",
          },
          // '& .dayRedClass': {
          //   backgroundColor: 'Red !important',
          // },
          // '& .dayGreyClass': {
          //   backgroundColor: 'Blue !important',
          // },
          // '& .dayYellowClass': {
          //   backgroundColor: 'yellow !important',
          // },
          // '& .dayGreenClass': {
          //   backgroundColor: 'green !important',
          // },
        }}
      >
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
              events={getTecherScheduleByTeacherId?.data}
              dayCellClassNames="dayCellClassNames"
              // eventBackgroundColor={"#0ff"}
              ref={calendarRef}
              // minDate={date}
              selectable={true}
              selectAllow={(selectInfo) => {
                return moment().diff(selectInfo.start) <= 0
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


      <Dialog open={open} fullWidth minHeight='100vh'>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <DialogTitle id="dialog-title">
              Available Time
            </DialogTitle>
          </Box>
          <Box>
            <IconButton color="primary" size="large">
              <HighlightOffIcon
                onClick={handleClose}
              />
            </IconButton>
          </Box>
        </Box>
        <DialogContent sx={{ display: 'flex' }}>
          <Grid container spacing={1.5}>
            {
              getTeacherScheduledSlots?.data?.length > 0 ?
                getTeacherScheduledSlots?.data.map((slots, index) => {
                  const [startTime, endTime] = slots.split(' - ');
                  const startTime12 = moment(startTime, 'HH:mm').format('h:mm A');
                  const endTime12 = moment(endTime, 'HH:mm').format('h:mm A');
                  return (
                    <Grid item xs={3}>
                      <Box sx={{
                        padding: '10px', height: 'auto', width: '129px', borderRadius: '5px',
                        backgroundColor: slot === slots ? 'primary.main' : 'primary.lighter', marginInline: '10px',
                        display: 'flex', alignItems: 'center', color: slot === slots ? '#ffff' : 'primary.main'
                      }} key={index}
                        onClick={() => handleslots(startTime12, endTime12, slots)}>
                        <Typography sx={{ fontSize: 13 }}> {`${startTime12} - ${endTime12}`}</Typography></Box>
                    </Grid>
                  )
                }) :
                <Box sx={{ width: '100%', textAlign: 'center', marginTop: '20px' }}><Typography variant="h5">No slots available</Typography></Box>
            }
          </Grid>
        </DialogContent>
        {/* reminder time */}
        <Box>
          <DialogTitle id="dialog-title">
            Reminder Me Before
          </DialogTitle>
        </Box>
        <DialogContent sx={{ display: 'flex' }}>
          <Grid container spacing={1.5}>
            {
              getAllReminderTime?.data?.length > 0 &&
              getAllReminderTime?.data?.map((RemTime, id) => {
                const [hours, minutes, seconds] = RemTime?.time.split(":");
                const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
                return (
                  <Grid item xs={3} >
                    <Box
                      key={id}
                      onClick={() => handleReminder(RemTime?.id, RemTime?.time)}
                      sx={{
                        padding: '10px', height: 'auto', width: '129px', borderRadius: '5px',
                        backgroundColor: reminderId === RemTime.id ? 'primary.main' : 'primary.lighter', marginInline: '10px',
                        display: 'flex', textAlign: 'center', justifyContent: 'center', color: reminderId === RemTime.id ? '#ffff' : 'primary.main'
                      }}
                    >
                      <Typography sx={{ fontSize: 13 }}>{totalMinutes} mins</Typography>
                    </Box>
                  </Grid>
                )
              })
            }
          </Grid>

        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button
            variant="contained"
            sx={{
              height: "100%",
              borderRadius: "12px",
              height: "40px",
              mt: 6,
              mb: 2,
              width: "40%",
              color: "white",
              bgcolor: "primary.main",
              paddingTop: "8px",
            }}
            onClick={bookEvent}
          >Book A Slot</Button>
        </Box>
      </Dialog>
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


