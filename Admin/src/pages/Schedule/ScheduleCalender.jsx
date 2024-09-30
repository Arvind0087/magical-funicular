import FullCalendar from "@fullcalendar/react"; // => request placed at the top
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import timelinePlugin from "@fullcalendar/timeline";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Card,
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import useResponsive from "hooks/useResponsive";
import CalendarToolbar from "./component/ScheduleToolbar";
import StyledCalendar from "./component/style";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getAuth } from "utils/getAuth";
import CustomComponentLoader from "components/CustomComponentLoader";
import Modal from "components/Modal";
import { getScheduleByTeacherIdCalenderAsync } from "redux/schedule/schedule.async";
import { PATH_DASHBOARD } from "routes/paths";

import moment from "moment";

export default function ScheduleCalender({
  searchStaff,
  searchValue,
  resetValue,
  setSearchStaff,
}) {
  const dispatch = useDispatch();
  const getauth = getAuth();
  const [modalEvent, setmodalEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [date, setDate] = useState(new Date());
  const isDesktop = useResponsive("up", "sm");
  const calendarRef = useRef(null);
  const [view, setView] = useState(isDesktop ? "dayGridMonth" : "listWeek");

  const { scheduleLoader, events } = useSelector((state) => state.schedule);
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
    setmodalEvent(true);
    setSelectedEvent(arg);
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

  useEffect(() => {
    if (getauth.id) {
      dispatch(
        getScheduleByTeacherIdCalenderAsync({
          teacherId: getauth.id,
          date: moment(date).format("YYYY-MM"),
        })
      );
      setSearchStaff([]);
    }
  }, [getauth.id, date, resetValue]);

  useEffect(() => {
    if (searchStaff?.value) {
      const payload = {
        teacherIdValue: searchStaff?.value,
        dateValue: moment(date).format("YYYY-MM"),
      };
      dispatch(
        getScheduleByTeacherIdCalenderAsync({
          teacherId: payload.teacherIdValue,
          date: payload.dateValue,
        })
      );
    }
  }, [searchValue]);

  return (
    <>
      <Card>
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
              initialEvents={events}
              dayMaxEventRows={3}
              eventBackgroundColor={() => {}}
              ref={calendarRef}
              initialDate={date}
              initialView={view}
              eventDisplay="block"
              headerToolbar={false}
              select={handleSelectRange}
              eventClick={handleSelectEvent}
              height={isDesktop ? 720 : "auto"}
              eventContent={renderEventContent}
              event
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

      <Modal
        size="xs"
        title="Event Information"
        openModal={modalEvent}
        closeModal={() => setmodalEvent(true)}
      >
        <Box
          sx={{
            p: 3,
            pt: 0,
          }}
        >
          <IconButton sx={{ ml: { xs: 0, sm: 40 }, mt: { xs: -3, sm: -12 } }}>
            <ClearOutlinedIcon onClick={() => setmodalEvent(false)} />
          </IconButton>
          <Typography sx={{ mb: 1 }}>
            <b> Session : </b>
            {selectedEvent && selectedEvent?.event?.title}
          </Typography>

          <Typography sx={{ mb: 1 }}>
            <b>Starting At : </b>
            {selectedEvent?.event?.start &&
              // moment(selectedEvent?.event?.start).format("DD MMMM YYYY HH:MM")}
              selectedEvent?.event?.start?.toDateString() +
                " " +
                selectedEvent?.event?.start?.toLocaleTimeString()}
          </Typography>

          <Typography sx={{ mb: 1 }}>
            <b>Time Duration : </b>
            {moment
              .duration(
                selectedEvent && selectedEvent?.event?.extendedProps?.time
              )
              .asMinutes() + " Minute"}
          </Typography>

          <Typography sx={{ mb: 1 }}>
            <b>Faculty Name : </b>
            {selectedEvent && selectedEvent?.event?.extendedProps?.teacher}
          </Typography>

          <Typography sx={{ mb: 1 }}>
            <b>Course : </b>
            {selectedEvent && selectedEvent?.event?.extendedProps?.course}
          </Typography>

          <Typography sx={{ mb: 1 }}>
            <b>Board : </b>
            {selectedEvent && selectedEvent?.event?.extendedProps?.board}
          </Typography>

          <Typography sx={{ mb: 1 }}>
            <b>Board : </b>
            {selectedEvent && selectedEvent?.event?.extendedProps?.class}
          </Typography>

          <Typography sx={{ mb: 1 }}>
            <b>Batch : </b>
            {selectedEvent && selectedEvent?.event?.extendedProps?.batchType}
          </Typography>

          <Typography sx={{ mb: 1 }}>
            <b>Subject : </b>
            {selectedEvent && selectedEvent?.event?.extendedProps?.subject}
          </Typography>

          <Typography sx={{ mb: 1 }}>
            <b>Chapter : </b>
            {selectedEvent && selectedEvent?.event?.extendedProps?.chapter}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={() => {
                let newWindow = window.open(
                  `${PATH_DASHBOARD.zoommeeting}/${selectedEvent?.event?.extendedProps?.meetingNumber}`,
                  "_blank"
                );
                newWindow.ZoomCredentials = {
                  meetigNumber:
                    selectedEvent?.event?.extendedProps?.meetingNumber,
                  password: selectedEvent?.event?.extendedProps?.password,
                  sdkKey: selectedEvent?.event?.extendedProps?.zoomApiKey,
                  sdkSecret: selectedEvent?.event?.extendedProps?.zoomApiSecret,
                };
              }}
              sx={{
                borderRadius: "5px",
                pointerEvents: "none",
                opacity: "0.6",
              }}
            >
              Join
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

function renderEventContent(eventInfo) {
  return (
    <Stack>
      <Box
        sx={{
          color: "#000",
        }}
      >
        <Typography sx={{ display: "flex", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", fontWeigth: 800 }}>
            {/* {eventInfo?.timeText} */}
            {moment(eventInfo?.timeText, ["h:mma"]).format("h:mm A")}
          </span>
          &nbsp;&nbsp;
          <span style={{ fontSize: "12px", fontWeigth: 800 }}>
            {eventInfo.event?.title}
          </span>
        </Typography>
      </Box>
    </Stack>
  );
}
