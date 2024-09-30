import React, { useState, useMemo } from "react";
import {
  Avatar, Box, Button, Card, Typography, Dialog,
  DialogTitle, InputBase,
  DialogContent,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { alpha } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-hot-toast";
import ShareIcon from "@material-ui/icons/Share";
import moment from "moment/moment";
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import * as yup from "yup";
import { getDoubtByStudentIdAsync } from "../../redux/async.api";
import { createReplyAsync } from '../../redux/async.api'
import { emptydoubt } from "../../redux/slices/doubt.slice";
import { UploadAvatar } from "../../components/upload";
import { toastoptions } from "../../utils/toastoptions";
import ShareWith from '../../components/shareWith/ShareWith'

function MyDoubtsCard(props) {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [openShareDialog, setShareOpenDialog] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [imageupload, seImageUpload] = useState();
  const [errorhandle, setErrorhandle] = useState({
    image: false,
    title: false,
    link: false,
    type: false,
  });
  const { doubtLoader, doubt, studentReplyDoubt } = useSelector((state) => state?.doubt);
  const { studentById } = useSelector((state) => state?.student);

  const TeacherAnswerClick = (id) => {
    navigate('/app/solutionsByTeacher?myDoubt-tab', {
      state: { id, type: 'teacher' },
    });
  }
  const StudentAnswerClick = (id) => {
    navigate('/app/solutionsByStudents?myDoubt-tab', {
      state: { id, type: 'student' },
    });
  }
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    const base64 = await convertBase64(file);
    formik.setFieldValue('image', base64);
    if (file) {
      // SET FILE IN STATE
      seImageUpload(newFile);
      setErrorhandle({
        ...errorhandle,
        image: false,
      });
    }
  };
  useMemo(() => {
    const payload = {
      id: studentById?.id,
      chapterId: '',
      search: '',
      subjectId: '',
    }
    if (studentReplyDoubt.status === 200) {
      setOpenDialog(false);
      toast.success(studentReplyDoubt.message, toastoptions);
      dispatch(emptydoubt());
      dispatch(getDoubtByStudentIdAsync(payload))
    }
  }, [studentReplyDoubt])


  const _initialValues = {
    answer: "",
    image: ""
  };

  const studentReply = yup.object().shape({
    answer: yup.string().required("Reply Required"),
  });

  const onSubmit = (values) => {
    const payload = {
      doubtId: props?.id,
      replyId: studentById?.id,
      type: "student",
      chapterId: "",
      answer: values.answer,
      image: values.image,
    }
    dispatch(createReplyAsync(payload));
  };

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: studentReply,
  });

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Box sx={{
          display: "flex",
          flexDirection: 'row',
          justifyContent: 'space-between',
          mb: 1
        }}
        >
          <Typography
            sx={{
              fontSize: "12px",
            }}
          >
            <b>Posted On:</b> {moment(props.posted_time).format("DD MMM YYYY hh:mm A")}
          </Typography>

          <Box
            sx={{
              cursor: "pointer",
              color: "primary.main",
            }}
          >
            <ShareIcon
              onClick={() => setShareOpenDialog(true)}
              sx={{
                width: "22px",
                height: "22px",
              }}
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: 'column', mt: 1 }}>
          <Box sx={{ display: "flex", flexDirection: 'row', mb: 1 }}>
            <Typography
              sx={{
                fontSize: "13.7px",
              }}
            >
              Q.
            </Typography>

            {
              props.profile_img ? (<Avatar
                sx={{
                  width: "64px",
                  height: "64px",
                  overflow: "hidden",
                  ml: 1,
                  borderRadius: "8px",
                }}
                variant="rounded"
              >
                <img src={props.profile_img} style={{ maxWidth: "136%" }} />
              </Avatar>) : <Box sx={{ mt: 8 }}>{""}</Box>
            }
            <Typography
              sx={{
                ml: 1,
                fontSize: "13.7px",
              }}
            >
              {
                props.question.length > 60 ? (props.question).slice(0, 60) + " " + "..." : (props.question)
              }
            </Typography>
          </Box>
          <Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex", mt: 2 }}>
          <Button
            onClick={() => TeacherAnswerClick(props.id)}
            fullWidth
            variant="contained"
            sx={{ mr: 0.7, color: "#fff", borderRadius: "60px", p: 1 }}
          >
            Teacher Answer
          </Button>
          <Button
            onClick={() => StudentAnswerClick(props.id)}
            fullWidth
            sx={{
              ml: 0.7,
              color: "primary.main",
              borderRadius: "60px",
              p: 1,
              bgcolor: "primary.lighter",
            }}
          >
            Student Answer
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button
            onClick={() => setOpenDialog(true)}
            fullWidth
            sx={{
              ml: 0.7,
              color: "primary.main",
              borderRadius: "60px",
              p: 1,
              bgcolor: "primary.lighter",
            }}
          >
            Reply
          </Button>
        </Box>
      </Card>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(true)}
      >
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Box>
            <DialogTitle id='dialog-title'> Student Reply </DialogTitle>
          </Box>
        </Box>
        <DialogContent>
          <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
            <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: '20px', p: 3 }}>
              <Box>
                <InputBase
                  multiline
                  fullWidth
                  rows={7}
                  placeholder="Reply"
                  name="answer"
                  sx={{
                    p: 2,
                    mt: 1,
                    borderRadius: 2,
                    border: (theme) =>
                      `solid 1px ${alpha(theme.palette.grey[500], 0.32)}`,
                  }}
                  {...formik.getFieldProps("answer")}
                  onChange={formik.handleChange}
                />
                {formik.touched.answer && formik.errors.answer && (
                  <Typography color='error' fontSize='15px'>
                    {formik.errors.answer}
                  </Typography>
                )}
              </Box>

              <Box>
                <UploadAvatar
                  name="image"
                  accept={{
                    "image/*": [],
                  }}
                  file={imageupload}
                  error={errorhandle.image}
                  onDrop={handleDrop}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: "auto",
                        display: "block",
                        textAlign: "center",
                        color: errorhandle.image ? "red" : "text.secondary",
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of
                    </Typography>
                  }
                />
              </Box>
            </Box>
            <Box sx={{
              mb: 4, display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'end',
              columnGap: 1,

            }}>
              <LoadingButton
                loading={doubtLoader}
                type="submit"
                variant="contained"
              > Submit </LoadingButton>

              <Button
                type="reset"
                variant="contained"
                onClick={() => setOpenDialog(false)}
              > Cancel </Button>

            </Box>
          </form >
        </DialogContent>
      </Dialog>
      <ShareWith
        {...{
          setShareOpenDialog,
          openShareDialog,
        }}
      />
    </>
  );
}

export default MyDoubtsCard;

