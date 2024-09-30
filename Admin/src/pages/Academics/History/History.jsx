import { Helmet } from "react-helmet-async";
import { Container } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { historycolumns } from "./utils";
import { getLiveClassHistoryAsync } from "redux/history/history.async";

export default function Liveclasshistory() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const { historyLoader, history } = useSelector((state) => state.history);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle);

  const InitialHistory = () => {
    dispatch(
      getLiveClassHistoryAsync({
        page: paginationpage,
        limit: perPageNumber,
      })
    );
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
    InitialHistory();
  }, [paginationpage, perPageNumber]);

  return (
    <>
     

     <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>History | {`${tabTitle}`}</title>
      </Helmet>
        <CustomBreadcrumbs
          // heading="Live Class History"
          links={[
            // { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Academic", href:"" },
            { name: "Live Class History" },
          ]}
        />
        <CustomTable
          columnheight="70px"
          loader={historyLoader}
          data={history?.data}
          columns={historycolumns({
            paginationpage,
          })}
          totalcount={history?.count}
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
