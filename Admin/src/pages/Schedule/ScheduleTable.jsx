import CustomTable from "components/CustomTable/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { getScheduleByTeacherIdAsync } from "redux/schedule/schedule.async";
import { schedulecolumns } from "./utils";
import { useEffect, useState } from "react";

export default function ScheduleTable() {
  const dispatch = useDispatch();
  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);

  const { userinfo } = useSelector((state) => state.userinfo);
  const { scheduleLoader, schedulesByIdteacher } = useSelector(
    (state) => state.schedule
  );

  const InitialSchedule = () => {
    dispatch(
      getScheduleByTeacherIdAsync({
        page: paginationpage,
        limit: perPageNumber,
        id: userinfo.id,
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
    InitialSchedule();
  }, [paginationpage, perPageNumber]);

  return (
    <>
      <CustomTable
        columnheight="50px"
        loader={scheduleLoader}
        data={schedulesByIdteacher?.data}
        columns={schedulecolumns({
          paginationpage,
        })}
        totalcount={schedulesByIdteacher?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
    </>
  );
}

const ExpandedComponent = ({ data }) => {
  return;
};
