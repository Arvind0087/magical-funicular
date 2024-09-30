import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  InputAdornment,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { useSettingsContext } from "components/settings/SettingsContext";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify/Iconify";
import MenuPopupModalPaper from "./component/MenuPopupModalPaper";
import CustomTable from "components/CustomTable";
import { getAllModalPaperAsync } from "redux/freeResource/freeresource.async";
import { topiccolumns } from "./utils";
import {
  getSubjectFilterAsync,
  getSubjectByClassIdFilterAsync,
  getChapterFilterAsync,
  getChapterBySubjectIdFilterAsync,
  getClassWithBoardFilterAsync,
} from "redux/filter/filter.async";
import _ from "lodash";
import AutoCompleteCustom from "components/AutoCompleteCustom/AutoCompleteCustom";

export default function Modalpaper() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(null);
  const [pyqsinfo, setPyqsinfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [searchYear, setSearchYear] = useState("");
  const [searchSubject, setSearchSubject] = useState([]);
  const [searchChapter, setSearchChapter] = useState([]);
  const [searchClass, setSearchClass] = useState([]);
  const [isFind, setIsFind] = useState(false);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { allMPaperLoader, allMPaper } = useSelector(
    (state) => state.freeresource
  );

  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const InitialPyqs = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        year: searchYear,
      };
    }
    if (isReset) {
      delete payload.classes;
      delete payload.subject;
      delete payload.chapter;
      delete payload.search;
    }
    dispatch(
      getAllModalPaperAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        // ...payload,
      })
    );
  };

  const resetFilter = () => {
    setIsFind(false);
    // setSearchClass([]);
    // setSearchSubject([]);
    // setSearchChapter([]);
    setSearchYear("");

    InitialPyqs({
      pageNo: 1,
      paginateNo: 10,
      isReset: true,
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
    InitialPyqs({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(getClassWithBoardFilterAsync({}));
    dispatch(getSubjectFilterAsync({}));
    dispatch(getChapterFilterAsync({}));
  }, []);

  useEffect(() => {
    dispatch(getSubjectByClassIdFilterAsync({ classId: [searchClass?.value] }));
  }, [searchClass]);

  useEffect(() => {
    dispatch(
      getChapterBySubjectIdFilterAsync({ subjectId: searchSubject?.value })
    );
  }, [searchSubject]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Free Resource | {`${tabTitle}`}</title>
      </Helmet>

      <CustomBreadcrumbs
        links={[
          { name: "Free Resource", href: "" },
          { name: "Model Paper", href: "" },
        ]}
        action={
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              flexWrap: "wrap",
              mt: 1,
            }}
          >
            {/*<Box>
              <TextField
                size="small"
                sx={{ width: 150, mr: 2, mb: { xs: 1, sm: 0 } }}
                value={searchYear}
                onChange={(e) => setSearchYear(e.target.value)}
                placeholder="Year"
                InputProps={{
                  sx: { borderRadius: "10px !important" },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify
                        icon="eva:search-fill"
                        sx={{ color: "text.disabled" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Box> */}
            <Box>
              {/* <Button
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                onClick={() => {
                  setIsFind(true);
                  InitialPyqs({
                    pageNo: 1,
                    paginateNo: 10,
                    isFindManual: true,
                  });
                }}
              >
                Filter
              </Button> */}
              <Button
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                onClick={resetFilter}
              >
                <AutorenewRoundedIcon />
              </Button>

              <Button
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                to={PATH_DASHBOARD.modalpapercreate}
                component={RouterLink}
                variant="contained"
                // disabled={!Boolean(modulePermit?.add)}
              >
                <AddIcon />
              </Button>
            </Box>
          </Box>
        }
      />
      <CustomTable
        columnheight="30px"
        loader={allMPaperLoader}
        data={allMPaper?.data}
        columns={topiccolumns({
          openPopover,
          handleOpenPopover,
          setPyqsinfo,
          paginationpage,
        })}
        totalcount={allMPaper?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupModalPaper
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        pyqsinfo={pyqsinfo}
      />
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
