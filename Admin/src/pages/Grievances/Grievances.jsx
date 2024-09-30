import { Helmet } from "react-helmet-async";
import { useEffect, useState, useCallback } from "react";
import {
  Container,
  FormControl,
  Autocomplete,
  TextField,
  Box,
  Button
} from "@mui/material";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { PATH_DASHBOARD } from "routes/paths";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import _ from "lodash";
import {
  getAllGrievancesAsync
} from 'redux/grievances/grievances.async';
import { reportcolumns } from "./utils";
import MenuPopupNotice from "./components/MenuPopupGrievances";


export default function Grievances() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [searchStudent, setSearchStudent] = useState([]);
  const [isFind, setIsFind] = useState(false);
  const [getGrievances, setGrievances] = useState("");

  const { filterLoader, studentFilter } = useSelector((state) => state.filterInfo);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);
  const {
    grievancesLoader, allGrievances
  } = useSelector((state) => state.grievances)

  const Initialgrievances = ({ pageNo, paginateNo, isFindManual, isReset }) => {
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
      getAllGrievancesAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload
      })
    );
  };

  const resetFilter = () => {
    setIsFind(false);
    setSearchStudent([]);
    Initialgrievances({
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
    Initialgrievances({});
  }, [paginationpage, perPageNumber]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Grievances | {`${tabTitle}`} </title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Grievances"
        links={[
          { name: "Grievances", href: "" },
          // { name: "Grievances", href: "" }
        ]}
      />
      <CustomTable
        columnheight="30px"
        loader={grievancesLoader}
        data={allGrievances?.data}
        columns={reportcolumns({
          openPopover,
          handleOpenPopover,
          setGrievances,
          paginationpage
        })}
        totalcount={allGrievances?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupNotice
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        getGrievances={getGrievances}
        paginationpage={paginationpage}
        perPageNumber={perPageNumber}
      />
    </Container>

  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
