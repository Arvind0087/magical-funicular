import PropTypes from "prop-types";
import * as Yup from "yup";
import merge from "lodash/merge";
import { isBefore } from "date-fns";
// form
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import {
  Box,
  Stack,
  Button,
  Tooltip,
  TextField,
  IconButton,
  DialogActions,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
// components
import Iconify from "../../../components/iconify";
import { ColorSinglePicker } from "../../../components/color-utils";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import FormProvider, {
  RHFTextField,
  RHFSwitch,
} from "../../../components/hook-form";
import { PATH_DASHBOARD } from "../../../routes/paths";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { toastoptions } from "../../../utils/toastoptions";
// ----------------------------------------------------------------------

const getInitialValues = (event, range) => {
  const initialEvent = {
    title: "",
    description: "",
    textColor: "#1890FF",
    allDay: false,
    start: range
      ? new Date(range.start).toISOString()
      : new Date().toISOString(),
    end: range ? new Date(range.end).toISOString() : new Date().toISOString(),
  };

  if (event || range) {
    return merge({}, initialEvent, event);
  }

  return initialEvent;
};

// ----------------------------------------------------------------------

CalendarForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func,
  onDeleteEvent: PropTypes.func,
  onCreateUpdateEvent: PropTypes.func,
  colorOptions: PropTypes.arrayOf(PropTypes.string),
};

export default function CalendarForm({
  event,
  range,
  colorOptions,
  onCreateUpdateEvent,
  onDeleteEvent,
  onCancel,
  currentEvent,
  eventStatus,
  setEventStatus,
}) {
  const { id } = useSelector((state) => state?.student?.studentById);
  const navigate = useNavigate();
  const hasEventData = !!event;
  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required("Title is required"),
    description: Yup.string().max(5000),
  });

  const [isEventLive, setIsEventLive] = useState(false);

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: getInitialValues(event, range),
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const checkLiveStatus = (videoData) => {
    if (videoData) {
      let videoDateTime = videoData?.startedBy;
      const splitValue = videoDateTime && videoDateTime.split("T");

      if (splitValue && splitValue.length === 2) {
        const providedDate = splitValue[0];
        const providedTime = splitValue[1];
        const providedDateTime = moment(
          `${providedDate} ${providedTime}`,
          "YYYY-MM-DD HH:mm:ss"
        );
        const currentDateTime = moment();

        if (currentDateTime.isSame(providedDateTime, "day")) {
          if (currentDateTime.isSameOrAfter(providedDateTime)) {
            return true;
          } else {
            return false;
          }
        } else if (currentDateTime.isAfter(providedDateTime)) {
          return false;
        } else {
          return false;
        }
      } else {
        console.error("Invalid videoDateTime format");
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      const newEvent = {
        title: data.title,
        description: data.description,
        textColor: data.textColor,
        allDay: data.allDay,
        start: data.start,
        end: data.end,
      };

      onCreateUpdateEvent(newEvent);

      onCancel();
      setEventStatus(false);

      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const isDateError =
    !values.allDay && values.start && values.end
      ? isBefore(new Date(values.end), new Date(values.start))
      : false;

  const joinEvent = (currentEvent) => {
    const currentEventObject = currentEvent[0];

    const checkStatus = checkLiveStatus(currentEventObject);

    if (currentEventObject && checkStatus) {
      navigate(`${PATH_DASHBOARD?.event}/${currentEventObject?.id}`, {
        state: { data: currentEventObject, studentId: id },
      });
    } else {
      toast.error("Please join at the scheduled time", toastoptions);
    }
  };

  const cancelHandler = () => {
    onCancel();
    setEventStatus(false);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <RHFTextField name="title" label="Title" disabled={true} />
        <Controller
          name="startedBy"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              onChange={(newValue) => field.onChange(newValue)}
              label="Start date"
              inputFormat="dd/MM/yyyy hh:mm a"
              disabled={true}
              renderInput={(params) => (
                <TextField {...params} fullWidth disabled={true} />
              )}
            />
          )}
        />
        {/* 
        <Controller
          name="end"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              onChange={(newValue) => field.onChange(newValue)}
              label="End date"
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!isDateError}
                  helperText={isDateError && 'End date must be later than start date'}
                />
              )}
            />
          )}
        /> */}

        {/* <Controller
          name="textColor"
          control={control}
          render={({ field }) => (
            <ColorSinglePicker value={field.value} onChange={field.onChange} colors={colorOptions} />
          )}
        /> */}
      </Stack>

      <DialogActions>
        {/* {hasEventData && (
          <Tooltip title="Delete Event">
            <IconButton onClick={onDeleteEvent}>
              <Iconify icon="eva:trash-2-outline" />
            </IconButton>
          </Tooltip>
        )} */}

        <Box sx={{ flexGrow: 1 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            // color="inherit"
            onClick={cancelHandler}
            sx={{
              cursor: "pointer",
              backgroundColor: "red",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#eb4949",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!eventStatus}
            sx={{ cursor: "pointer", backgroundColor: "green", color: "#fff" }}
            onClick={() => joinEvent(currentEvent)}
          >
            Join
          </Button>
        </Box>

        {/* <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {hasEventData ? 'Update' : 'Add'}
        </LoadingButton> */}
      </DialogActions>
    </FormProvider>
  );
}
