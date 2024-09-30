import React from "react";
import FullCalendar from "@fullcalendar/react"; // => request placed at the top
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import timelinePlugin from "@fullcalendar/timeline";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import useResponsive from "../../../../hooks/useResponsive";
import CustomComponentLoader from "../../../../components/CustomComponentLoader";
import {
  // CalendarForm,
  StyledCalendar,
  CalendarToolbar,
  CalendarForm,
} from "../../../../sections/@dashboard/calendar";
import {
  getAllEventByStudentIdAsync,
  getScheduleByTeacherIdCalenderAsync,
} from "../../../../redux/async.api";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";

const COLOR_OPTIONS = [
  "#00AB55", // theme.palette.primary.main,
  "#1890FF", // theme.palette.info.main,
  "#54D62C", // theme.palette.success.main,
  "#FFC107", // theme.palette.warning.main,
  "#FF4842", // theme.palette.error.main
  "#04297A", // theme.palette.info.darker
  "#7A0C2E", // theme.palette.error.darker
];

export default function ScheduleCalender({ packageId }) {
  const dispatch = useDispatch();
  const { studentById = {} } = useSelector((state) => state?.student);
  const [eventStatus, setEventStatus] = useState(false);
  const { scheduleLoader } = useSelector((state) => state?.schedule);
  const { getAllEvent = {}, getAllEventLoader } = useSelector(
    (state) => state?.live
  );
  const [modalEvent, setmodalEvent] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [date, setDate] = useState(new Date());
  const isDesktop = useResponsive("up", "sm");
  const calendarRef = useRef(null);
  const [view, setView] = useState(isDesktop ? "dayGridMonth" : "listWeek");
  const [openForm, setOpenForm] = useState(false);

  let formattedData = [];
  if (Object?.keys(getAllEvent)?.length > 0) {
    formattedData = Object.entries(getAllEvent)
      ?.map(([date, classes]) =>
        Array.isArray(classes)
          ? classes.map(
              ({
                id,
                title,
                type,
                startedBy,
                time,
                teacherId,
                teacherName,
              }) => ({
                date,
                id,
                title,
                type,
                startedBy,
                time,
                teacherId,
                teacherName,
              })
            )
          : []
      )
      .flat();
  }

  const eventt = formattedData?.map((event) => ({
    ...event,
    // textColor: event.color,
  }));

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
  const handleClose = () => {
    setOpenForm(false);
  };

  const handleSelectEvent = (arg) => {
    setOpenForm(true);
    setSelectedEventId(arg.event.id);
  };

  const selectedEvent = useSelector(() => {
    if (selectedEventId) {
      return eventt.find((event) => event.id == selectedEventId);
    }

    return null;
  });

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

  <Dialog fullWidth maxWidth="xs" open={openForm} onClose={handleClose}>
    <DialogTitle>{selectedEvent ? "Edit Event" : "Add Event"}</DialogTitle>

    <CalendarForm
      event={selectedEvent}
      range={() => {}}
      onCancel={handleClose}
      colorOptions={[]}
    />
  </Dialog>;

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
    dispatch(
      getAllEventByStudentIdAsync({
        // studentId: id,
        date: "",
        day: "all",
        batchTypeId: studentById?.batchTypeId,
        packageId: packageId?.packageId ? packageId?.packageId : "",
      })
    );
  }, []);

  const currentDateData = selectedEvent
    ? getAllEvent?.[selectedEvent?.date]
    : [];

  const currentEvent = currentDateData?.filter(
    (item) => item?.id == selectedEvent?.id
  );

  useEffect(() => {
    const currentEventObject = currentEvent[0];
    let currentDate = moment();
    let providedDate = moment(currentEventObject?.startedBy);
    if (providedDate.isSame(currentDate, "day")) {
      setEventStatus(true);
    } else if (providedDate.isAfter(currentDate)) {
      setEventStatus(false);
    } else {
      setEventStatus(false);
    }
  }, [currentEvent[0]]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Typography variant="h5">Calender</Typography>
      <Card sx={{ mt: 4 }}>
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
              // initialEvents={events}
              eventBackgroundColor={() => {
                console.log("DONE");
              }}
              ref={calendarRef}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={100}
              eventDisplay="block"
              headerToolbar={false}
              events={formattedData}
              select={handleSelectRange}
              eventClick={handleSelectEvent}
              height={isDesktop ? 720 : "auto"}
              // dateClick={(e) => console.log(e)}
              // eventContent={renderEventContent}
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
      <Dialog fullWidth maxWidth="xs" open={openForm} onClose={handleClose}>
        <DialogTitle>Event details</DialogTitle>

        <CalendarForm
          event={selectedEvent}
          onCancel={handleClose}
          colorOptions={COLOR_OPTIONS}
          currentEvent={currentEvent}
          setEventStatus={setEventStatus}
          eventStatus={eventStatus}
        />
      </Dialog>
    </LocalizationProvider>
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
