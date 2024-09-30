import { useFormik } from "formik";
import { Helmet } from "react-helmet-async";
import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import CustomComponentLoader from "components/CustomComponentLoader/CustomComponentLoader";
import {
  Box,
  Checkbox,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
  Container,
  Typography,
} from "@mui/material";
import { getAllRoutesAsync } from "redux/slices/routes/routes.async";
import { useDispatch } from "react-redux";
import _, { capitalize } from "lodash";
import styled from "styled-components";
import { LoadingButton } from "@mui/lab";
import { useSettingsContext } from "components/settings";
import CustomBreadcrumbs from "components/custom-breadcrumbs/CustomBreadcrumbs";
import { useNavigate, useParams } from "react-router";
import {
  addPermissionByIdAsync,
  getPermissionByRoleIdAsync,
} from "redux/slices/permission/permission.async";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
import { emptypermission } from "redux/slices/permission/permission.slice";
import { PATH_DASHBOARD } from "routes/paths";
import Label from "components/label/Label";

const Permission = () => {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [RoutesPermission, setRoutesPermission] = useState([]);
  const [AllCheck, setAllCheck] = useState(false);
  const { routeLoader, allRoutes } = useSelector((state) => state.routesRedux);
  const { permissionLoader, permissionadd, rolepermissions } = useSelector(
    (state) => state.permission
  );
  const tabTitle = useSelector(
    (state) => state?.admin?.adminSetting?.siteTitle
  );
  const onSubmit = async (values) => {
    const permission = RoutesPermission?.filter((ev) => ev.view === true)?.map(
      (ev) => {
        return {
          id: Number(ev.id),
          add: ev.add,
          edit: ev.edit,
          remove: ev.remove,
          view: ev.view,
        };
      }
    );
    dispatch(
      addPermissionByIdAsync({
        roleId: Number(id),
        permission: permission,
      })
    );
  };

  const handleCheckPermission = (row, string, condition) => {
    const indexNum = RoutesPermission.findIndex((item) => item.id === row.id);
    let updateRow;
    if (string === "add") {
      updateRow = { ...row, add: condition };
    } else if (string === "edit") {
      updateRow = { ...row, edit: condition };
    } else if (string === "view") {
      updateRow = {
        ...row,
        view: condition,
      };
      if (string === "view" && condition === false) {
        updateRow = {
          ...updateRow,
          add: false,
          edit: false,
          remove: false,
        };
      }
    } else if (string === "remove") {
      updateRow = { ...row, remove: condition };
    }
    if (indexNum !== -1) {
      const stateInfo = [...RoutesPermission];
      stateInfo.splice(indexNum, 1, { ...stateInfo[indexNum], ...updateRow });
      setRoutesPermission(stateInfo);
    }
  };

  const handleAllCheck = (permission) => {
    const permissionall = _.map(RoutesPermission, (evv) => {
      if (evv.title === "Dashboard") {
        return {
          ...evv,
          add: true,
          edit: true,
          view: true,
          remove: true,
        };
      }
      return {
        ...evv,
        add: permission,
        edit: permission,
        view: permission,
        remove: permission,
      };
    });
    setRoutesPermission(permissionall);
  };

  useEffect(() => {
    dispatch(getAllRoutesAsync()).then((ev) => {
      if (id) dispatch(getPermissionByRoleIdAsync(id));
    });
  }, []);

  useEffect(() => {
    if (allRoutes) {
      const mapRoute = _.map(allRoutes, (item) => {
        if (item.title === "Dashboard") {
          return {
            ...item,
            add: true,
            edit: true,
            remove: true,
            view: true,
          };
        }
        return item;
      });
      setRoutesPermission(mapRoute);
    }
  }, [allRoutes]);

  useEffect(() => {
    if (rolepermissions.length > 0) {
      const updateroute = _.map(allRoutes, (evv) => {
        const filterinfo = _.find(
          rolepermissions,
          (evvv) => evvv.id === evv.id
        );
        if (filterinfo) {
          return {
            ...evv,
            add: filterinfo.add,
            edit: filterinfo.edit,
            view: filterinfo.view,
            remove: filterinfo.remove,
          };
        }
        return evv;
      });
      setRoutesPermission(updateroute);
    }
  }, [rolepermissions]);

  useEffect(() => {
    if (permissionadd.status === 200) {
      toast.success(permissionadd.message, toastoptions);
      dispatch(emptypermission());
      formik.resetForm();
      navigate(PATH_DASHBOARD.roles);
    }
  }, [permissionadd]);

  useEffect(() => {
    if (RoutesPermission.length > 0 && allRoutes.length > 0) {
      const permissionall = RoutesPermission.filter(
        (ev) =>
          ev.add === true &&
          ev.view === true &&
          ev.edit === true &&
          ev.remove === true
      );
      if (permissionall.length === allRoutes.length) {
        setAllCheck(true);
      } else {
        setAllCheck(false);
      }
    }
  }, [RoutesPermission, allRoutes]);

  const formik = useFormik({
    initialValues: {},
    onSubmit,
  }); // FOMRIK

  return (
    <Container maxWidth={themeStretch ? "lg" : false}>
      <Helmet>
        <title>Roles | {`${tabTitle}`}</title>
      </Helmet>
      <CustomBreadcrumbs
        // heading="Permission"
        links={[
          { name: "Master", href: "" },
          { name: "Roles", href: `${PATH_DASHBOARD.roles}` },
          { name: "Permission" },
        ]}
        action={
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={permissionLoader}
              onClick={formik.handleSubmit}
            >
              Assign Permission
            </LoadingButton>
          </Stack>
        }
      />

      <Box>
        {routeLoader ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 5,
            }}
          >
            <CustomComponentLoader padding="0 0" size={20} />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ maxWidth: "100%" }}>
            <Box sx={{ display: "flex" }}>
              <Typography
                variant="h4"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "15px !important",
                  lineHeight: "30px !important",
                  fontWeight: "500 !important",
                }}
              >
                <Checkbox
                  sx={{
                    p: 0,
                    mr: 1,
                  }}
                  checked={AllCheck}
                  onClick={(e) => {
                    setAllCheck(e.target.checked);
                    handleAllCheck(e.target.checked);
                  }}
                />{" "}
                Permissions According To Roles
              </Typography>
            </Box>
            <Table aria-label="customized table" sx={{ marginTop: "21px" }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    sx={{
                      backgroundColor: "#F2F3F7 !important",
                      color: "#000000 !important",
                      fontWeight: 700,
                    }}
                  >
                    MODULE
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      backgroundColor: "#F2F3F7 !important",
                      color: "#000000 !important",
                      fontWeight: 700,
                    }}
                    align="right"
                  >
                    VIEW
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      backgroundColor: "#F2F3F7 !important",
                      color: "#000000 !important",
                      fontWeight: 700,
                    }}
                    align="right"
                  >
                    EDIT
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      backgroundColor: "#F2F3F7 !important",
                      color: "#000000 !important",
                      fontWeight: 700,
                    }}
                    align="right"
                  >
                    CREATE
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      backgroundColor: "#F2F3F7 !important",
                      color: "#000000 !important",
                      fontWeight: 700,
                    }}
                    align="right"
                  >
                    DELETE
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {RoutesPermission?.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell
                      component="th"
                      scope="row"
                      sx={{ py: "12px !important" }}
                    >
                      {capitalize(row?.title)}
                      {Boolean(row?.parent) && (
                        <Label
                          variant="soft"
                          color="success"
                          sx={{ textTransform: "capitalize", ml: 2 }}
                        >
                          {row?.parent}
                        </Label>
                      )}
                    </StyledTableCell>
                    <StyledTableCell
                      align="right"
                      sx={{ py: "0px !important" }}
                    >
                      <Checkbox
                        {...label}
                        checked={row.view}
                        onChange={(e) => {
                          const permission = row.view ? false : true;
                          handleCheckPermission(row, "view", permission);
                        }}
                        // disabled={Boolean(row.title === "Dashboard")}
                      />
                    </StyledTableCell>
                    <StyledTableCell
                      align="right"
                      sx={{ py: "0px !important" }}
                    >
                      <Checkbox
                        {...label}
                        checked={row.edit}
                        onChange={(e) => {
                          const permission = row.edit ? false : true;
                          handleCheckPermission(row, "edit", permission);
                        }}
                        // disabled={!row.view || Boolean(row.title === "Dashboard")}
                      />
                    </StyledTableCell>
                    <StyledTableCell
                      align="right"
                      sx={{ py: "0px !important" }}
                    >
                      <Checkbox
                        {...label}
                        checked={row.add}
                        onChange={(e) => {
                          const permission = row.add ? false : true;
                          handleCheckPermission(row, "add", permission);
                        }}
                        // disabled={!row.view || Boolean(row.title === "Dashboard")}
                      />
                    </StyledTableCell>
                    <StyledTableCell
                      align="right"
                      sx={{ py: "0px !important" }}
                    >
                      <Checkbox
                        {...label}
                        checked={row.remove}
                        onChange={(e) => {
                          const permission = row.remove ? false : true;
                          handleCheckPermission(row, "remove", permission);
                        }}
                        // disabled={!row.view || Boolean(row.title === "Dashboard")}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default Permission;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {},
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {},
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const label = { inputProps: { "aria-label": "Checkbox demo" } };
