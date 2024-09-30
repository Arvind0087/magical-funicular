import { Helmet } from "react-helmet-async";
import {
  Button,
  Container,
  Box,
  TextField,
  FormControl,
  Autocomplete,
} from "@mui/material";
import excelDownload from "../../../assets/excel/ExcelDownload.png";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { PATH_DASHBOARD } from "routes/paths";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllFeedbackAsync } from "redux/async.api";
import { feedbackExcelDownloadAsync } from "redux/downloadexcel/excel.async";
import { feedbackcolumns } from "./utils";
import { getFilterAsync } from "redux/filter/student/student.async";

export default function Feedback() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [feedbackinfo, setFeedbackInfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [searchStudent, setSearchStudent] = useState([]);

  const [isFind, setIsFind] = useState(false);
  const { feedbackLoader, feedback } = useSelector((state) => state.feedback);
  const { feedbackFilter } = useSelector((state) => state.feedbackFilter);
  const { studentFilter } = useSelector((state) => state.studentFilter);
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const InitialFeedback = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        search: searchStudent?.value,
      };
    }
    if (isReset) delete payload.search;
    dispatch(
      getAllFeedbackAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
      })
    );
  };
  const resetFilter = () => {
    setIsFind(false);
    setSearchStudent([]);
    InitialFeedback({
      pageNo: 1,
      paginateNo: 10,
      isReset: true,
    });
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handlePageChange = (page) => {
    setPaginationpage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setperPageNumber(newPerPage);
  };

  useEffect(() => {
    InitialFeedback({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(getFilterAsync());
  }, []);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Feedback | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Feedback"
        links={[{ name: "Student Manager", href: "" }, { name: "Feedback" }]}
        action={
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Box>
              <FormControl>
                <Autocomplete
                  size="small"
                  sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                  disablePortal
                  value={searchStudent}
                  options={studentFilter?.map((ev) => {
                    return { label: `${ev.name}(${ev.class})`, value: ev.id };
                  })}
                  onChange={(event, value) => setSearchStudent(value)}
                  renderInput={(params) => (
                    <TextField {...params} label="Student" />
                  )}
                />
              </FormControl>
              <Button
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                onClick={() => {
                  setIsFind(true);
                  InitialFeedback({
                    pageNo: 1,
                    paginateNo: 10,
                    isFindManual: true,
                  });
                }}
              >
                Filter
              </Button>
              <Button
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                onClick={resetFilter}
              >
                <AutorenewRoundedIcon />
              </Button>
            </Box>
            <Box
              sx={{
                borderRadius: "7px",
                mr: 1,
                mb: { xs: 1, md: 0 },
                cursor: "pointer",
              }}
              onClick={() =>
                feedbackExcelDownloadAsync(
                  searchStudent?.value || searchStudent
                )
              }
            >
              <img
                src={excelDownload}
                alt="Download Excel"
                width="50px"
                height="50px"
                borderRadius="40px"
              />
            </Box>
          </Box>
        }
      />
      <CustomTable
        columnheight="30px"
        loader={feedbackLoader}
        data={feedback?.data}
        columns={feedbackcolumns({
          openPopover,
          handleOpenPopover,
          setFeedbackInfo,
          paginationpage,
        })}
        totalcount={feedback?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
    </Container>
  );
}

const ExpandedComponent = ({ data }) => {
  return;
};
