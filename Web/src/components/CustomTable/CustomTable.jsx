import React from "react";
import DataTable from "react-data-table-component";
import CustomComponentLoader from "../CustomComponentLoader";

const CustomTable = ({
  columns,
  data,
  loader,
  columnheight,
  totalcount,
  onChangeRowsPerPage,
  onChangePage,
  expandableRows,
  expandableRowsComponent,
}) => {
  const customStyles = {
    rows: {
      style: {
        whiteSpace: "normal",
        minHeight: "50px",
        fontSize: "14px",
        fontFamily: "Abel",
      },
    },
    headCells: {
      style: {
        background: "#F2F5F7",
      },
    },
    cells: {
      style: {
        height: columnheight,
      },
    },
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
        fixedHeader={true}
        paginationTotalRows={totalcount}
        onChangeRowsPerPage={onChangeRowsPerPage}
        onChangePage={onChangePage}
        // sortIcon={<AiOutlineSortAscending />}
      />
    </>
  );
};

export default React.memo(CustomTable);
