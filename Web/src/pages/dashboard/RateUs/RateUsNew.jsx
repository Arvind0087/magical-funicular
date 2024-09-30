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

const ratingObject = {
  0: "Would you like to rate this class? It would be appreciated.",
  1: "What can be improved",
  2: "What can be improved",
  3: "What can be improved",
  4: "What did you like",
  5: "What did you like",
};
const IssueArr = [
  "Content Quality",
  "Teaching Methods/study material are not impressive",
  "Other",
];
const LikeArr = [
  "Good Quality Content",
  "Explained very well",
  "Impressive teaching methods",
  "Other",
];

function RateUsNew({ eventId }) {
  const dispatch = useDispatch();
  // const { open, setOpen } = props;
  const [open, setOpen] = useState(false);
  const { studentById = [] } = useSelector((state) => state?.student);
  const { id } = studentById;
  const [value, setValue] = useState(0);
  const [issue, setIssue] = useState([]);
  const [addComment, setAddComment] = useState("");

  useEffect(() => {
    dispatch(
      getRatingByUserIdAsync({
        // studentId: id,
        type: "event",
        eventId: eventId,
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
  }, []);

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

  function handleSubmitRating() {
    let rating = [];
    rating.push(value);
    dispatch(
      addRatingAsync({
        // studentId: id,
        rating: rating,
        issue: issue,
        comment: addComment,
        type: "event",
        eventId: eventId,
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
      <Box>
        <Box display="flex">
          <Box sx={{ width: "100%" }}>
            <Typography
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                fontSize: "20px",
                textAlign: "center",
                mb: 1,
              }}
            >
              Rate Us
            </Typography>
            <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
              {ratingObject[value]}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 1 }}>
          <Rating
            name="no-value"
            value={value}
            size="large"
            onChange={handleRatingChange}
            sx={{ borderRadius: "30px" }}
          />
        </Box>
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
        <Box sx={{ height: "100px", mt: 4 }}>
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
            onClick={handleSubmitRating}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default RateUsNew;
