import React, { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { Helmet } from "react-helmet-async";
import { Button, Container } from "@mui/material";
import { PATH_DASHBOARD } from "routes/paths";
import CustomBreadcrumbs from "components/custom-breadcrumbs";
import { useSettingsContext } from "components/settings";
import { useDispatch, useSelector } from "react-redux";
import { getRolesAsync } from "redux/Roles/roles.async";
import CustomTable from "components/CustomTable";
import { columns } from "./utils";
import MenuPopupBoard from "./component/MenuPopupRoles";
import AddRoles from "./CreateRoles/CreateRoles";
import DialogBox from "components/DialogBox/index";
import { emptyById } from "redux/Roles/roles.slice";
import { Box } from "../../../../node_modules/@material-ui/core/index";

export default function Roles() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();

  const [actionModal, setActionModal] = useState(false);
  const [IsFlagAction, setIsFlagAction] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);
  const [InfoId, setInfoId] = useState("");

  const [paginationpage, setPaginationpage] = useState(1);
  const [perPageNumber, setperPageNumber] = useState(10);

  const { rolesLoader, roles } = useSelector((state) => state.roles);
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const tabTitle = useSelector((state) => state?.admin?.adminSetting?.siteTitle)

  const InitialRoles = ({ pageNo, paginateNo, isFindManual, isReset }) => {
    if (pageNo && paginateNo) {
      setPaginationpage(pageNo);
      setperPageNumber(paginateNo);
    }
    let payload = {};
    dispatch(
      getRolesAsync({
        page: pageNo || paginationpage,
        limit: paginateNo || perPageNumber,
        ...payload,
      })
    );
  };

  const handlePageChange = (page) => {
    setPaginationpage(page);
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    setperPageNumber(newPerPage);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };
  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  useEffect(() => {
    InitialRoles({});
  }, [paginationpage, perPageNumber]);

  const handleCloseActionModal = () => {
    setInfoId("");
    setActionModal(false);
    setIsFlagAction(false);
    dispatch(emptyById());
  };

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Roles | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Roles"
        links={[
          { name: "Master", href: "" },
          { name: "Roles" },
        ]}
        action={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setIsFlagAction(false);
                setActionModal(true);
              }}
              disabled={!Boolean(modulePermit?.add)}
            >
              <AddIcon />
            </Button>
          </Box>
        }
      />
      <CustomTable
        columnheight="50px"
        loader={rolesLoader}
        data={roles?.data}
        columns={columns({
          openPopover,
          handleOpenPopover,
          setInfoId,
          paginationpage,
        })}
        totalcount={roles?.count}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        expandableRows={false}
        expandableRowsComponent={ExpandedComponent}
      />
      <MenuPopupBoard
        {...{
          openPopover,
          handleClosePopover,
          InfoId,
          setActionModal,
          setIsFlagAction,
        }}
      />

      {/* MODAL FOR ADD AND UPDATE  */}
      <DialogBox
        open={actionModal}
        title={IsFlagAction ? "Update Roles" : "Add Roles"}
        onClose={handleCloseActionModal}
      >
        <AddRoles
          {...{
            InfoId,
            InitialRoles,
            setInfoId,
            setActionModal,
            IsFlagAction,
          }}
        />
      </DialogBox>
    </Container>
  );
}

const ExpandedComponent = ({ data }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);
