import React from "react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import CustomTable from "components/CustomTable";
import { Container } from "@mui/system";
import { Grid, Box, Button, Card, Paper, Typography } from "@mui/material";
import { useSettingsContext } from "components/settings";
import UploadBox from "components/CustomUploads/UploadBox";
import { PATH_DASHBOARD } from "routes/paths";
import { useFormik } from "formik";
import { _initialValues, _validation } from "./validation";
import { GenerateBase64 } from "utils/convertToBase64";
import { LoadingButton } from "@mui/lab";
import { alpha } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  getAllBulkFiles,
  UploadBulkAsync,
} from "redux/slices/bulkupload/topicBulkSlice/topicBulk.Async";
import { emptybulk } from "redux/slices/bulkupload/topicBulkSlice/topicBulk.slice";
import { Bulkcolumns } from "./utils";
import { toast } from "react-hot-toast";
import { toastoptions } from "utils/toastoptions";
export default function BulkTopic() {
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);

  const handlePageChange = (page) => {
    setPaginationpage(page);
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    setperPageNumber(newPerPage);
  };
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const dispatch = useDispatch();
  const [FileError, setFileError] = useState(false);
  const { themeStretch } = useSettingsContext();
  const { bulkUpload, bulkFiles, bulkLoader } = useSelector(
    (state) => state.topicBulk
  );

  const InitialBulktopic = () => {
    dispatch(
      getAllBulkFiles({
        page: paginationpage,
        limit: perPageNumber,
      })
    );
  };
  const handleDrop = (acceptedFiles) => {
    var file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    if (file) {
      if (!file.name.includes("xlsx")) {
        setFileError(true);
        return;
      } else {
        setFileError(false);
      }
      formik.setFieldValue("file", [newFile]);
    }
  };
  const onSubmit = async (values) => {
    const imageBase64 = await GenerateBase64(values.file[0]);
    let payload = {
      file: imageBase64,
    };
    dispatch(UploadBulkAsync(payload));
  };
  const formik = useFormik({
    initialValues: _initialValues,
    onSubmit,
    validationSchema: _validation,
  });

  useEffect(() => {
    InitialBulktopic();
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    if (bulkUpload.status === 200) {
      toast.success(bulkUpload.message, toastoptions);
      formik.resetForm();
      dispatch(emptybulk());
      InitialBulktopic();
    }
  }, [bulkUpload]);

  return (

    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title> Upload Bulk Topic | {`${tabTitle}`}</title>
      </Helmet>

      <CustomBreadcrumbs
        // heading="Upload Bulk Topic"
        links={[
          { name: "Syllabus", href: "" },
          { name: "Topic", href: `${PATH_DASHBOARD.topic}` },
          { name: "Upload Bulk Topic ", href: "" },
        ]}
      />
      <Card sx={{ p: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexWrap: 'wrap',
            columnGap: 3,
            mb: 1,
          }}>
            <Box sx={{ minWidth: '700px', mb: { xs: 1, md: 1 } }}>
              <UploadBox
                height={40}
                otherFile={true}
                name="file"
                label="Excel File"
                accept={{
                  "file/*": [],
                }}
                onDrop={handleDrop}
                file={formik.values.file[0]}
                error={Boolean(formik.touched.file && formik.errors.file)}
              />
              {FileError && (
                <Paper
                  variant="outlined"
                  sx={{
                    py: 1,
                    px: 2,
                    mt: 3,
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                    borderColor: (theme) =>
                      alpha(theme.palette.error.main, 0.24),
                  }}
                >
                  <Box sx={{ my: 1 }}>
                    <Typography variant="subtitle2" noWrap></Typography>

                    <Box component="span" sx={{ typography: "caption" }}>
                      - File type must be xls,xlsx/*
                    </Box>
                  </Box>
                </Paper>
              )}
            </Box>
            <LoadingButton
              sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 1 } }}
              type="submit"
              size='medium'
              variant="contained"
              loading={bulkLoader}
            >
              Upload Bulk Topic
            </LoadingButton>
            <Button
              sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 1 } }}
              variant="contained"
              size='medium'
              onClick={() =>
                window.open(
                  process.env.REACT_APP_TOPIC_BULK_FILE,
                  "_blank",
                  "noreferrer"
                )
              }
            >
              Download Demo File{" "}
            </Button>
          </Box>
        </form>
        <CustomTable
         columnheight="30px"
          loader={bulkLoader}
          data={bulkFiles?.data}
          columns={Bulkcolumns({
            paginationpage,
          })}
          totalcount={bulkFiles?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
        />
      </Card>
    </Container >
  );
}
