import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Button,
  Container,
  FormControl,
  Autocomplete,
  Box,
  TextField,
} from "@mui/material";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { PATH_DASHBOARD } from "routes/paths";
import { useSettingsContext } from "components/settings";
import { getAllDoubtsAsync } from "redux/async.api";
import { getFilterAsync } from "redux/filter/subject/subject.async";
import { doubtscolumns } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import MenuPopupEvents from "./componenets/MenuPopup";
import CustomTable from "components/CustomTable";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import _ from "lodash";

export default function Doubts() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();

  const [openPopover, setOpenPopover] = useState(null);
  const [replyinfo, setreplyinfo] = useState("");
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [searchSubject, setSearchSubject] = useState([]);
  const [isFind, setIsFind] = useState(false);
  const { doubts, doubtsLoader } = useSelector((state) => state.doubts);
  const { subjectfilterLoader, subjectFilter } = useSelector(
    (state) => state.subjectFilter
  );
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const InitialDoubtAsync = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        subject: searchSubject?.value,
      };
    }
    if (isReset) delete payload.subject;
    dispatch(
      getAllDoubtsAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
      })
    );
  };

  const resetFilter = () => {
    setIsFind(false);
    setSearchSubject();
    InitialDoubtAsync({
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
    InitialDoubtAsync({});
  }, [paginationpage, perPageNumber]);

  useEffect(() => {
    dispatch(getFilterAsync({}));
  }, []);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Doubts | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Doubts"
        links={[
          // { name: "Dashboard", href: PATH_DASHBOARD.root },
          { name: "Doubts", href: "" },
        ]}
        action={
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <FormControl>
              <Autocomplete
                size="small"
                sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                loading={subjectfilterLoader}
                loadingText={<CustomComponentLoader padding="0 0" size={20} />}
                value={searchSubject}
                options={_.map(subjectFilter, (ev) => {
                  return {
                    label: `${ev.subjectName} (${ev.class})`,
                    value: ev.id,
                  };
                })}
                onChange={(event, value) => setSearchSubject(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Subject" />
                )}
              />
            </FormControl>
            <Box>
              <Button
                variant="contained"
                sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                onClick={() => {
                  setIsFind(true);
                  InitialDoubtAsync({
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
          </Box>
        }
      />

      <CustomTable
        columnheight="30px"
        loader={doubtsLoader}
        data={doubts?.data}
        columns={doubtscolumns({
          openPopover,
          handleOpenPopover,
          setreplyinfo,
          paginationpage,
        })}
        totalcount={doubts?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupEvents
        openPopover={openPopover}
        handleClosePopover={handleClosePopover}
        replyinfo={replyinfo}
        paginationpage={paginationpage}
        perPageNumber={perPageNumber}
      />
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
