import React, { useEffect, useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Box } from "@mui/system";
import {
  Button,
  DialogContent,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import TestSubmittedPopover from "./testSubmitted";

const ExamSummary = (props) => {
  const {
    open,
    getExamSummary = {},
    examSummaryNoHandler,
    examSummaryYesHandler,
    remainingTime,
    timeOverSubmitHandler,
    okHandler,
  } = props;
  // state
  const [openSubmitPopOver, setOpenSubmitPopOver] = useState(true);
  // functions
  const handleClose = (value) => {
    setOpenSubmitPopOver(false);
  };

  const onOkClick = () => {
    okHandler();
  };
  useEffect(() => {
    if (remainingTime === 0) timeOverSubmitHandler();
  }, []);

  return (
    <>
      <Dialog
        open={open}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          style: {
            maxHeight: "80%",
          },
        }}
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            sx={{
              textAlign: "center",
              ml: 15,
            }}
          >
            <DialogTitle id="dialog-title">
              <Typography variant="h5">Exam Summary</Typography>
            </DialogTitle>
          </Box>

          <Box sx={{ display: remainingTime ? "block" : "none" }}>
            <IconButton color="primary" size="large">
              <HighlightOffIcon onClick={examSummaryNoHandler} />
            </IconButton>
          </Box>
        </Box>
        <DialogContent
          sx={{
            display: "block",
            paddingInline: "20px",
            height: "500px",
            overflowY: "hidden !important",
          }}
        >
          <Typography variant="h6">
            Number of question: {getExamSummary?.numberOfQuestions}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
            <Box
              sx={{
                height: "20px",
                width: "20px",
                backgroundColor: "#80CC8C",
                borderRadius: "50%",
                mr: 1,
              }}
            ></Box>
            <Typography>
              Number of questions attempted/answered:{" "}
              {getExamSummary?.attempted}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Box
              sx={{
                height: "20px",
                width: "20px",
                backgroundColor: "#85888A",
                borderRadius: "50%",
                mr: 1,
              }}
            ></Box>
            <Typography>
              Number of questions skipped: {getExamSummary?.skipped}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Box
              sx={{
                height: "20px",
                width: "20px",
                backgroundColor: "#F1F1F1",
                borderRadius: "50%",
                mr: 1,
              }}
            ></Box>
            <Typography>
              Questions not visited: {getExamSummary?.notVisited}
            </Typography>
          </Box>
          <Divider sx={{ mt: 3 }} />
          {remainingTime ? (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Are you sure you want to submit the test for final marking?
              </Typography>
              <Typography variant="p">
                No changes will be allowed after submission.
              </Typography>
            </Box>
          ) : null}

          <Box sx={{ display: "flex", justifyContent: "space-around", mt: 3 }}>
            {remainingTime ? (
              <>
                <Button
                  sx={{
                    borderRadius: "50px",
                    color: "#ffff",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "35px",
                    width: "30%",
                    backgroundColor: "primary.main",
                  }}
                  type="submit"
                  className="OTP-button"
                  variant="contained"
                  onClick={examSummaryYesHandler}
                >
                  Yes
                </Button>

                <Button
                  onClick={examSummaryNoHandler}
                  sx={{
                    borderRadius: "50px",
                    color: "#ffff",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "35px",
                    width: "30%",
                    backgroundColor: "primary.main",
                    display: remainingTime ? "block" : "none",
                  }}
                  type="submit"
                  className="OTP-button"
                  variant="contained"
                >
                  No
                </Button>
              </>
            ) : (
              <Button
                sx={{
                  borderRadius: "50px",
                  color: "#ffff",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "35px",
                  width: "30%",
                  backgroundColor: "primary.main",
                }}
                type="submit"
                className="OTP-button"
                variant="contained"
                onClick={onOkClick}
              >
                Ok
              </Button>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {openSubmitPopOver && (remainingTime === 0 || remainingTime === 59) && (
        <TestSubmittedPopover
          setOpenSubmitPopOver={setOpenSubmitPopOver}
          openSubmitPopOver={openSubmitPopOver}
          onClose={handleClose}
          remainingTime={remainingTime}
          examSummaryNoHandler={examSummaryNoHandler}
        />
      )}
    </>
  );
};
export default ExamSummary;
