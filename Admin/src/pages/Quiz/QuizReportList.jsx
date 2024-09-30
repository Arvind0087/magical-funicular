import { Helmet } from "react-helmet-async";
import {
  Container,
  FormControl,
  Autocomplete,
  TextField,
  Box,
  Button
} from "@mui/material";
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { getAllQuizAsync } from "redux/slices/QuizReportSlice/quiz.async.api";
import { reportcolumns } from "./utils";
import MenuPopupNotice from "./component/MenuPopup";
import { PATH_DASHBOARD } from "routes/paths";
import { getFilterAsync } from "redux/filter/student/student.async";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import _ from "lodash";
import { getStudentFilterAsync } from "redux/filter/filter.async";

export default function Quiz() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [Idinfo, setIdinfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [searchStudent, setSearchStudent] = useState([]);
  const [isFind, setIsFind] = useState(false);
  const { quizLoader, quiz } = useSelector((state) => state.quizReport);

  const { filterLoader, studentFilter } = useSelector(
    (state) => state.filterInfo
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const InitialQuiz = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        studentId: searchStudent?.value
      };
    }
    if (isReset) delete payload.studentId;
    dispatch(
      getAllQuizAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload
      })
    );
  };

  const resetFilter = () => {
    setIsFind(false);
    setSearchStudent([]);
    InitialQuiz({
      pageNo: 1,
      paginateNo: 10,
      isReset: true
    });
  };

  // POPUPOVER
  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  // PAGINATION
  const handlePageChange = (page) => {
    setPaginationpage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setperPageNumber(newPerPage);
  };

  useEffect(() => {
    InitialQuiz({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(getStudentFilterAsync({}));
  }, []);
  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Quiz | {`${tabTitle}`} </title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Quiz  Report"
        links={[
          { name: "Quiz  Report", href: "" }
        ]}

        action={
          <Box>
            <FormControl>
              <Autocomplete
                filterSelectedOptions
                size="small"
                sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                loading={filterLoader}
                loadingText={<CustomComponentLoader padding="0 0" size={20} />}
                value={searchStudent}
                options={_.map(studentFilter, (ev) => {
                  return { label: `${ev.name} (${ev.class})`, value: ev.id };
                })}
                onChange={(event, value) => setSearchStudent(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Student" />
                )}
                isOptionEqualToValue={useCallback(
                  (option, value) => option.value === value.value
                )}
              />
            </FormControl>
            <Button
              variant="contained"
              sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
              onClick={() => {
                setIsFind(true);
                InitialQuiz({
                  pageNo: 1,
                  paginateNo: 10,
                  isFindManual: true
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
        }
      />
      <CustomTable
        columnheight="30px"
        loader={quizLoader}
        data={quiz?.data}
        columns={reportcolumns({
          openPopover,
          handleOpenPopover,
          setIdinfo,
          paginationpage
        })}
        totalcount={quiz?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupNotice
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        Idinfo={Idinfo}
        paginationpage={paginationpage}
        perPageNumber={perPageNumber}
      />
    </Container >
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
