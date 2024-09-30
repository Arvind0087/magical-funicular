import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Grid,
  Card,
  Fab,
  Typography,
  Paper,
  CardContent,
  Button,
} from "@mui/material";
import { Container, Stack, Box } from "@mui/system";
import { useSettingsContext } from "components/settings";
import Iconify from "components/iconify";
import ReactReadMoreReadLess from "react-read-more-read-less";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useRef } from "react";
import { CustomAvatar } from "components/custom-avatar";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { emptydoubts } from "redux/slices/doubts.slice";
import { getDoubtsByIdAsync, postReplyAsync } from "redux/async.api";
import { _initialValues, _validation } from "./utils";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import Editor from "components/editor/Editor";
import moment from "moment/moment";
import { GenerateBase64 } from "utils/convertToBase64";
import { LoadingButton } from "@mui/lab";
import ReactHtmlParser from "react-html-parser";
import { PATH_DASHBOARD } from "routes/paths";
import "./readMoreLess.css";
import { capitalize } from "lodash";
import Inf from "assets/ImageStudent/inf.jpg";
import { getAllDoubtsAsync } from "redux/async.api";

export default function Reply({ id, paginationpage, perPageNumber }) {
  const { themeStretch } = useSettingsContext();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  // const { id } = useParams();
  const { userinfo } = useSelector((state) => state.userinfo);
  const { doubtsLoader, doubtsById, postReply } = useSelector(
    (state) => state.doubts
  );
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const handleClickAttach = () => {
    const { current } = fileInputRef;
    if (current) {
      current.click();
    }
  };

  const onSubmit = async (values) => {
    const ImageBase64 = await GenerateBase64(values.image[0]);
    const payload = {
      doubtId: id,
      // replyId: 2,
      replyId: userinfo?.id,
      answer: values.answer,
      image: ImageBase64 ? ImageBase64 : "",
      type: "teacher",
    };
    dispatch(postReplyAsync(payload));
  };

  const InitialDoubtAsync = () => {
    dispatch(getDoubtsByIdAsync(id));
  };

  useEffect(() => {
    if (id) {
      InitialDoubtAsync();
    }
  }, [id]);

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: _validation,
  });

  useEffect(() => {
    if (postReply.status === 200) {
      toast.success(postReply.message, toastoptions);
      formik.resetForm();
      dispatch(emptydoubts());
      InitialDoubtAsync();
      dispatch(
        getAllDoubtsAsync({
          page: paginationpage,
          limit: perPageNumber,
          subject: "",
        })
      );
    }
  }, [postReply]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Doubts | {`${tabTitle}`}</title>
      </Helmet>
      {/*<CustomBreadcrumbs
        links={[
          { name: "Doubts", href: PATH_DASHBOARD.doubts },
          { name: "Doubts Reply" },
        ]}
      /> */}

      <Card elevation={5}>
        <Grid container mt={1} mb={1}>
          <Grid
            item
            xs={12}
            sm={9}
            sx={{
              diaplay: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CardContent>
              <Stack>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "text.secondary" }}
                >
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    Name:
                  </span>{" "}
                  &nbsp; {doubtsById?.user}
                </Typography>
              </Stack>
              <Stack
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: "10px",
                  mt: "7px",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ color: "text.secondary" }}
                >
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    Subject:
                  </span>{" "}
                  &nbsp; {doubtsById?.subject}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "text.secondary" }}
                >
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    Chapter:
                  </span>{" "}
                  &nbsp; {doubtsById?.chapter}
                </Typography>
              </Stack>
              <Typography
                variant="subtitle1"
                sx={{ color: "text.secondary", mt: "7px" }}
              >
                <span style={{ color: "black", fontWeight: "bold" }}>
                  Question:
                </span>{" "}
                &nbsp;
                <ReactReadMoreReadLess
                  className="react-read-more-read-less"
                  charLimit={100}
                  readMoreText={"Read more ▼"}
                  readLessText={"Read less ▲"}
                >
                  {` ${doubtsById?.question}`}
                </ReactReadMoreReadLess>
              </Typography>
            </CardContent>
          </Grid>

          <Grid
            item
            xs={12}
            sm={3}
            sx={{
              display: "flex",
              height: "100%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box>
              <img
                alt="Doubt Reply"
                src={doubtsById?.image == null ? Inf : doubtsById?.image}
                width="150px"
              />
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Card sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            {doubtsById?.answers.map((reply, index) => (
              <Doubtcard
                {...{
                  reply,
                  userinfo,
                }}
              />
            ))}
          </Grid>

          <Grid item xs={12} md={5}>
            <form onSubmit={formik.handleSubmit}>
              <Editor
                name="answer"
                value={formik.values.answer}
                onChange={(e) => {
                  formik.setFieldValue("answer", e);
                }}
                error={formik.touched.answer && formik.errors.answer}
              />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ marginTop: "20px" }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ color: "text.secondary" }}
                >
                  <Fab
                    size="small"
                    color="inherit"
                    variant="softExtended"
                    onClick={handleClickAttach}
                  >
                    <Iconify
                      icon="ic:round-perm-media"
                      width={24}
                      sx={{ color: "success.main" }}
                    />
                    {formik.values.image ? "Change Image/Video" : "Image/Video"}
                  </Fab>
                </Stack>

                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={doubtsLoader}
                >
                  Answer
                </LoadingButton>
              </Stack>

              <input
                ref={fileInputRef}
                type="file"
                name="image"
                style={{ display: "none" }}
                onChange={(e) => formik.setFieldValue("image", e.target.files)}
              />
            </form>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}

const Doubtcard = ({ userinfo, reply }) => {
  const [isReadMore, setIsReadMore] = useState(true);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <>
      <Stack spacing={1.5} sx={{ px: 3, padding: "0px !important" }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ paddingBottom: "0px !important" }}
        >
          {/* <CustomAvatar
            alt={userinfo?.name}
            src={userinfo?.avatar}
            name={userinfo?.name}
          /> */}
          <CustomAvatar
            alt={reply?.sender}
            src={reply?.avatar}
            name={reply?.sender}
          />
          <Paper
            sx={{
              p: 1.5,
              flexGrow: 1,
              bgcolor: "background.neutral",
              marginBottom: "10px !important",
            }}
          >
            <Stack
              justifyContent="space-between"
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ sm: "center" }}
              sx={{ mb: 0.5 }}
            >
              <Typography variant="subtitle2">
                {reply.sender} ( {capitalize(reply?.type)} )
              </Typography>

              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                {moment(reply.createdAt).format("DD MMMM YYYY")}
              </Typography>
            </Stack>
            <Grid
              container
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                columnGap: "100px",
              }}
            >
              <Grid item xs={12} sm={6} md={6}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: "5px",
                  }}
                >
                  {isReadMore
                    ? ReactHtmlParser(reply.answer.slice(0, 100))
                    : ReactHtmlParser(reply.answer)}
                  {reply.answer.length > 50 ? (
                    <span
                      onClick={() => toggleReadMore()}
                      className="read-or-hide"
                    >
                      {isReadMore ? "...Read more" : " Show less"}
                    </span>
                  ) : null}
                </Typography>
              </Grid>
              {Boolean(reply?.image !== null) && (
                <Grid item xs={12} sm={3} md={3}>
                  <Button
                    variant="contained"
                    onClick={() =>
                      window.open(
                        reply?.image,
                        "Window Title",
                        "width=500, height=500"
                      )
                    }
                  >
                    Download
                  </Button>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Stack>
      </Stack>
    </>
  );
};
