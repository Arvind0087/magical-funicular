import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import React from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";

const CustomTable = ({
  columns,
  data,
  loader,
  columnheight,
  totalcount,
  onChangeRowsPerPage,
  onChangePage,
  expandableRows,
  expandableRowsComponent
}) => {
  const { getIndividualSetting } = useSelector(
    (state) => state.individualSetting
  );
  const customStyles = {
    rows: {
      style: {
        justifyContent: 'flex-start',
        alignItems: "center",
        display: "flex",
        whiteSpace: "normal",
        minHeight: "30px",
        fontSize: "14px",
        fontFamily: "Abel"
      }
    },
    headCells: {
      style: {
        background: "#F2F5F7"
      }
    },
    // cells: {
    //   style: {
    //     height: getIndividualSetting?.dense === "200%" ? columnheight : "30%"
    //   }
    // }
  };
  const paginationComponentOptions = {
    rowsPerPageText: 'Row Per Page',
    rangeSeparatorText: 'OF',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All',
  };

  return (
    <>
      <DataTable
        className="rounded-0"
        responsive
        pagination
        paginationServer
        expandableRows={expandableRows}
        expandableRowsComponent={expandableRowsComponent}
        columns={columns}
        data={data}
        customStyles={customStyles}
        progressPending={loader}
        progressComponent={<CustomComponentLoader padding="20px 0" size={40} />}
        persistTableHead={true}
        // fixedHeader
        // fixedHeaderScrollHeight="300px"
        paginationTotalRows={totalcount}
        onChangeRowsPerPage={onChangeRowsPerPage}
        onChangePage={onChangePage}
        // sortIcon={<AiOutlineSortAscending />}
        paginationComponentOptions={paginationComponentOptions}
      />
    </>
  );
};

export default React.memo(CustomTable);
