import { Helmet } from "react-helmet-async";
import {
  Button,
  Container,
  InputAdornment,
  Box,
  TextField
} from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import Iconify from "components/iconify/Iconify";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllEnquiryAsync } from "redux/enquery/enquery.async";
import { EnquiryExcelDownloadAsync } from "redux/downloadexcel/excel.async";
import { enquirycolumns } from "./utils";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import excelDownload from "../../assets/excel/ExcelDownload.png";

export default function Enquiry() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const [searchName, setsearchName] = useState("");
  const [isFind, setIsFind] = useState(false);
  const { enquiryLoader, Enquiry } = useSelector((state) => state.enquiry);
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const InitialEnquiry = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    if (isFind || isFindManual) {
      payload = {
        search: searchName
      };
    }
    if (isReset) delete payload.search;
    dispatch(
      getAllEnquiryAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload
      })
    );
  };

  const resetFilter = () => {
    setIsFind(false);
    setsearchName();
    InitialEnquiry({
      pageNo: 1,
      paginateNo: 10,
      isReset: true
    });
  };

  // PAGINATION
  const handlePageChange = (page) => {
    setPaginationpage(page);
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    setperPageNumber(newPerPage);
  };

  //CALL API OF API FUNCTION
  useEffect(() => {
    InitialEnquiry({});
  }, [paginationpage, perPageNumber]);

  return (
    <>
      <Helmet>
        <title>Enquiry | {`${tabTitle}`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? "lg" : "false"}>
        <CustomBreadcrumbs
          // heading="Enquiry"
          links={[
            // { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Enquiry" }
          ]}
          action={
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap"
              }}
            >
              <Box>
                <TextField
                  width={220}
                  size="small"
                  value={searchName}
                  onChange={(e) => setsearchName(e.target.value)}
                  placeholder="Search"
                  sx={{ width: 150, mr: 2, mb: { xs: 1, md: 0 } }}
                  InputProps={{
                    sx: { borderRadius: "10px !important" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify
                          icon="eva:search-fill"
                          sx={{ color: "text.disabled" }}
                        />
                      </InputAdornment>
                    )
                  }}
                />
                <Button
                  variant="contained"
                  sx={{ borderRadius: "7px", mr: 1, mb: { xs: 1, md: 0 } }}
                  onClick={() => {
                    setIsFind(true);
                    InitialEnquiry({
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb:1.7,
                  cursor: 'pointer'
                }}
                variant="contained"
                onClick={() => EnquiryExcelDownloadAsync(searchName)}
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
          loader={enquiryLoader}
          data={Enquiry?.data}
          columns={enquirycolumns({
            paginationpage
          })}
          totalcount={Enquiry?.count}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          expandableRows={false}
          expandableRowsComponent={ExpandedComponent}
        />
      </Container>
    </>
  );
}

const ExpandedComponent = ({ data }) => {
  return;
};
