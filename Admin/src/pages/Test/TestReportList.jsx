import { Helmet } from "react-helmet-async";
import { Container, Box, Button } from "@mui/material";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getallTestReportsAsync } from "redux/slices/TestSlice/async.api";
import { reportcolumns } from "./utils";
import MenuPopupNotice from "./component/MenuPopup";
import { PATH_DASHBOARD } from "routes/paths";
import { getFilterAsync } from "redux/filter/student/student.async";
import _ from "lodash";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";

export default function Test() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [isFind, setIsFind] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [reportInfo, setReportinfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [searchStudent, setSearchStudent] = useState("");
  const { testreportLoader, testreport } = useSelector(
    (state) => state.testreport
  );
  const { studentFilterLoader, studentFilter } = useSelector(
    (state) => state.studentFilter
  );
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const InitialTest = ({ pageNo, paginateNo, isFindManual, isReset }) => {
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
      getallTestReportsAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload
      })
    );
  };

  const resetFilter = () => {
    setIsFind(false);
    setSearchStudent([]);
    InitialTest({
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
    InitialTest({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(getFilterAsync({}));
  }, []);

  return (
    <>
      <Helmet>
        <title>Test Report | {`${tabTitle}`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? "lg" : false}>
        <CustomBreadcrumbs
          // heading="Test Reports"
          links={[
            { name: "Test", href: "" },
            { name: "Test Reports" }
          ]}
          action={
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <AutoCompleteCustom
                size="small"
                sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                loading={studentFilterLoader}
                options={_.map(studentFilter, (ev) => {
                  return { label: `${ev.name} (${ev.class})`, value: ev.id };
                })}
                value={searchStudent}
                onChange={(event, value) => setSearchStudent(value)}
                label="Student"
              />

              <Button
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                onClick={() => {
                  setIsFind(true);
                  InitialTest({
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
          loader={testreportLoader}
          data={testreport?.data}
          columns={reportcolumns({
            openPopover,
            handleOpenPopover,
            setReportinfo,
            paginationpage
          })}
          totalcount={testreport?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
          expandableRowsComponent={ExpandedComponent}
        />
        <MenuPopupNotice
          openPopover={openPopover}
          handleClosePopover={handleClosePopover}
          reportInfo={reportInfo}
          paginationpage={paginationpage}
          perPageNumber={perPageNumber}
        />
      </Container>
    </>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
