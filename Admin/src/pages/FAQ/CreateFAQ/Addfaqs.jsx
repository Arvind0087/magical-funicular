import React, { useState } from "react";
import {
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { Box, Container, Stack } from "@mui/system";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useSettingsContext } from "components/settings";
import { LoadingButton } from "@mui/lab";
import { _initialValues, signupValidate } from "./utils";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import {
  createFaqAsync,
  updateFaqByIdAsync,
  getFaqByIdAsync
} from "redux/async.api";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { emptyfaq } from "redux/slices/faq.slice";
import { PATH_DASHBOARD } from "routes/paths";

function AddBatches() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("");
  const [searchQuestion, setSearchQuestion] = useState("");
  const { faqLoader, faqadd, faqupdate, faqId, faq } = useSelector(
    (state) => state.faq
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  // HANDLE SUBMIT
  const onSubmit = (values) => {
    // PAYLOAD
    const payload = {
      id: id,
      question: values.question,
      answer: values.answer,
      type: values.type
    };
    if (id) {
      // UPDATE
      dispatch(updateFaqByIdAsync(payload));
    } else {
      // ADD
      dispatch(createFaqAsync(payload));
    }
  };

  useEffect(() => {
    if (id) {
      // GET BY ID
      dispatch(getFaqByIdAsync(id));
    }
  }, [id]);

  useEffect(() => {
    // VALUE SET
    if (id) {
      if (faqId) {
        formik.setFieldValue("question", faqId.question);
        formik.setFieldValue("answer", faqId.answer);

        formik.setFieldValue("type", faqId.type);
      }
    }
  }, [faqId, faq, id]);

  useEffect(() => {
    // SUCCESS
    if (faqadd.status === 200) {
      toast.success(faqadd.message, toastoptions);
      dispatch(emptyfaq()); // NEED TO CLEAR MESSAGE FROM STATE
      formik.setFieldValue("question", "");
      formik.setFieldValue("answer", "");
      formik.setFieldValue("type", "");
      navigate(PATH_DASHBOARD.faq);
    }
    if (faqupdate.status === 200) {
      toast.success(faqupdate.message, toastoptions);
      dispatch(emptyfaq()); // NEED TO CLEAR MESSAGE FROM STATE
      formik.setFieldValue("question", "");
      formik.setFieldValue("answer", "");
      formik.setFieldValue("type", "");
      navigate(PATH_DASHBOARD.faq);
    }
  }, [faqadd, faqupdate]);

  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: signupValidate
  }); // FOMRIK

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>FAQ | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading={id ? "Update FAQ" : "Create FAQ"}
        links={[
          // { name: "Dashboard", href: PATH_DASHBOARD.root },
          { name: "FAQ", href: `${PATH_DASHBOARD.faq}` },
          { name: id ? "Update FAQ" : "Create FAQ" }
        ]}
      />

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)"
                }}
              >
                <FormControl fullWidth>
                  <TextField
                    name="question"
                    label="Question"
                    multiline
                    rows={4}
                    fullWidth
                    {...formik.getFieldProps("question")}
                    onChange={formik.handleChange}
                    error={formik.touched.question && formik.errors.question}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    name="answer"
                    label="Answer"
                    multiline
                    rows={4}
                    fullWidth
                    error={formik.touched.answer && formik.errors.answer}
                    {...formik.getFieldProps("answer")}
                    onChange={formik.handleChange}
                  />
                </FormControl>

                <FormControl
                  fullWidth
                  error={formik.touched.type && formik.errors.type}
                >
                  <InputLabel>Type</InputLabel>
                  <Select
                    label="Type"
                    name="type"
                    {...formik.getFieldProps("type")}
                    onChange={formik.handleChange}
                  >
                    <MenuItem defaultValue value="">
                      Select Type
                    </MenuItem>
                    <MenuItem value="scholarship">Scholarship</MenuItem>
                    <MenuItem value="mentorship">Mentorship</MenuItem>
                    <MenuItem value="refer">Refer</MenuItem>
                    <MenuItem value="help">Help</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={faqLoader}
                >
                  {id ? "Update FAQ" : "Create FAQ"}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default AddBatches;
