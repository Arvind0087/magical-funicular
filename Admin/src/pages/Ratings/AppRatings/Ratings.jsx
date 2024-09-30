import { Helmet } from "react-helmet-async";
import { Container } from "@mui/material";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import CustomTable from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { PATH_DASHBOARD } from "routes/paths";
import _ from "lodash";
import { columns } from "./utils";
import { getAllRatingAsync } from "redux/rating/rating.async";

export default function Ratings() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);
  const { ratingLoader, rating } = useSelector((state) => state.ratings);
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );

  const InitialRatings = ({ pageNo, paginateNo }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = { type: "app" };
    dispatch(
      getAllRatingAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
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

  useEffect(() => {
    InitialRatings({});
  }, [paginationpage, perPageNumber]);

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Ratings | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Student Ratings"
        links={[{ name: "Ratings", href: "" }, { name: "App Ratings" }]}
      />
      <CustomTable
        columnheight="30px"
        loader={ratingLoader}
        data={rating?.data}
        columns={columns({
          paginationpage,
        })}
        totalcount={rating?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
