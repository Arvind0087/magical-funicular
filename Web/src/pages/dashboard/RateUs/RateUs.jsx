import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import Modal from "@mui/material/Modal";
import DialogTitle from "@mui/material/DialogTitle";
import Rating from "@mui/material/Rating";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { addRatingAsync } from "../../../redux/async.api";
import { toastoptions } from "../../../utils/toastoptions";
import { getRatingByUserIdAsync } from "../../../redux/async.api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "primary.main",
  boxShadow: 24,
  p: 2,
  textAlign: "center",
  alignItem: "center",
  borderRadius: "8px",
};
const ratingObject = {
  0: "Would you like to rate this app? Tell others what you think",
  1: "What can be improved",
  2: "What can be improved",
  3: "What can be improved",
  4: "What did you like",
  5: "What did you like",
};
const IssueArr = [
  "Content Quality",
  "Signup-Signin Issues",
  "Teaching Methods/study material are not impressive",
  "App UI",
  "Other",
];
const LikeArr = [
  "Good Quality Content",
  "Explained very well",
  "Easy to use",
  "Smooth functioning of App",
  "Courses are well structured",
  "Impressive teaching methods",
  "Other",
];
function RateUs(props) {
  const dispatch = useDispatch();
  const { open, setOpen } = props;
  const { studentById = [] } = useSelector((state) => state?.student);
  const { id } = studentById;
  const [value, setValue] = useState(0);
  const [issue, setIssue] = useState([]);
  const [addComment, setAddComment] = useState("");

  useEffect(() => {
    if (open) {
      dispatch(
        getRatingByUserIdAsync({
          // studentId: id,
          type: "app",
          eventId: "",
        })
      ).then((res) => {
        const { payload } = res || {};
        const { status, data } = payload || {};
        if (status === 200) {
          data?.rating ? setValue(data?.rating) : setValue(0);
          data?.issue ? setIssue(data?.issue) : setIssue([]);
          data?.comment ? setAddComment(data?.comment) : setAddComment("");
        }
      });
    }
  }, [open]);

  const handleRatingChange = (event, newValue) => {
    newValue ? setValue(newValue) : setValue(0);
  };

  const handleIssueChange = (event) => {
    if (event.target.checked) {
      setIssue([...issue, event.target.value]);
    } else {
      setIssue(issue?.filter((value) => value !== event.target.value));
    }
  };
  function handleClose() {
    let rating = [];
    rating.push(value);
    dispatch(
      addRatingAsync({
        // studentId: id,
        rating: rating,
        issue: issue,
        comment: addComment,
        type: "app",
      })
    ).then((res) => {
      const { payload } = res || {};
      const { status, message } = payload || {};
      if (status === 200) {
        toast.success(message, toastoptions);
        setOpen(false);
      }
    });
  }

  return (
    <>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            <Box sx={{ width: "100%" }}>
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  fontSize: "20px",
                }}
              >
                Rate Us
              </Typography>
              <DialogTitle id="dialog-title" sx={{ pb: 0.5, pt: 0.5 }}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {ratingObject[value]}
                </Typography>
              </DialogTitle>
            </Box>
            <Box>
              <HighlightOffIcon
                sx={{ color: "primary.main" }}
                onClick={() => setOpen(false)}
              />
            </Box>
          </Box>
          <Rating
            name="no-value"
            value={value}
            size="large"
            onChange={handleRatingChange}
            sx={{ borderRadius: "30px" }}
          />

          <FormGroup sx={{ textAlign: "start" }}>
            {value < 4 &&
              IssueArr.map((e, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        onChange={handleIssueChange}
                        checked={issue?.includes(e) ? true : false}
                      />
                    }
                    label={e}
                    value={e}
                  />
                );
              })}
            {value > 3 &&
              LikeArr.map((e, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        onChange={handleIssueChange}
                        checked={issue?.includes(e) ? true : false}
                      />
                    }
                    label={e}
                    value={e}
                  />
                );
              })}
          </FormGroup>
          <Box sx={{ height: "100px", mt: 1 }}>
            <TextField
              id="outlined-multiline-flexible"
              label="Add Comments"
              defaultValue={addComment ? addComment : ""}
              multiline
              rows={3}
              sx={{ width: "100%" }}
              onChange={(e) => setAddComment(e.target.value)}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <Button
              variant="contained"
              sx={{
                height: "100%",
                borderRadius: "12px",
                height: "40px",
                mt: 2,
                width: "40%",
                color: "white",
                bgcolor: "primary.main",
                paddingTop: "8px",
              }}
              onClick={() => setOpen(false)}
            >
              Skip
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={value ? false : true}
              sx={{
                height: "100%",
                borderRadius: "12px",
                height: "40px",
                mt: 2,
                width: "40%",
                color: "white",
                bgcolor: "primary.main",
                paddingTop: "8px",
              }}
              onClick={handleClose}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default RateUs;
