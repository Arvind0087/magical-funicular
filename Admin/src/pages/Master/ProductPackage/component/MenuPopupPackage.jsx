import React, { useState, useEffect } from "react";
import { MenuItem, Divider } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";
import PreviewIcon from "@mui/icons-material/Preview";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { getBoardStatus, getboardAsync } from "redux/board/board.async";
import {
  updateCoursePackageStatusAsync,
  allCoursePackagesAsync,
} from "redux/productPackage/productPackage.async";
import { emptyboard } from "redux/board/board.slice";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
import StaffDialog from "./StaffDialog";
import AddStudentDialog from "./AddStudentDialog";
import DeleteIcon from "@mui/icons-material/Delete";

const MenuPopupPackage = ({ openPopover, handleClosePopover, packageInfo }) => {
  const theme = useTheme();
  const [getPackageState, setPackageStatus] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [studentDialog, setStudentDialog] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { boardLoader, boardStatus, boards } = useSelector(
    (state) => state.board
  );

  const { packageStatusLoader, packageStatus } = useSelector(
    (state) => state.package
  );

  useEffect(() => {
    if (packageInfo.status === 1) {
      setPackageStatus(true);
    }
  }, [packageInfo, boards]);

  // useEffect(() => {
  //   if (packageStatus.status === 200) {
  //     toast.success(packageStatus.message, toastoptions);
  //     dispatch(allCoursePackagesAsync({ page: 1, limit: 10 }));
  //   }
  // }, [packageStatus]);

  const handleClickOpen = (value) => {
    if (value == "staff") {
      setOpenDialog(true);
    } else {
      setOpenDialog(false);
    }
  };

  const handleAssignOpen = (value) => {
    if (value == "staff") {
      setStudentDialog(true);
    } else {
      setStudentDialog(false);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleStudentClose = () => {
    setStudentDialog(false);
  };

  return (
    <>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            handleClosePopover();
            navigate(`${PATH_DASHBOARD.editproductpackage}/${packageInfo.id}`);
          }}
          disabled={!Boolean(modulePermit?.edit)}
        >
          <Iconify icon="eva:edit-fill" />
          <span style={{ fontSize: "12px" }}>Edit</span>
        </MenuItem>
        <Divider sx={{ borderStyle: "dashed" }} />
        <MenuItem
          onClick={() => {
            handleClosePopover();
            const payload = {
              Id: packageInfo?.id,
              status: packageInfo.status === 1 ? 0 : 1,
            };
            dispatch(updateCoursePackageStatusAsync(payload)).then((res) => {
              if (res.payload.status == 200) {
                toast.success(packageStatus.message, toastoptions);
                dispatch(allCoursePackagesAsync({ page: 1, limit: 10 }));
              }
            });
          }}
        >
          <DeleteIcon />
          {packageInfo?.status === 1 ? (
            <span style={{ fontSize: "12px" }}>Delete</span>
          ) : (
            <span style={{ fontSize: "12px" }}>Active</span>
          )}
        </MenuItem>
        <Divider sx={{ borderStyle: "dashed" }} />
        <MenuItem
          onClick={() => {
            handleClickOpen("staff");
            handleClosePopover();
          }}
        >
          <PreviewIcon />
          <span style={{ fontSize: "12px" }}>Remove Student</span>
        </MenuItem>
        <Divider sx={{ borderStyle: "dashed" }} />
        <MenuItem
          onClick={() => {
            handleClosePopover();
            handleAssignOpen("staff");
          }}
        >
          <PersonAddAltIcon />
          <span style={{ fontSize: "12px" }}>Assign Student</span>
        </MenuItem>
      </MenuPopover>
      <StaffDialog
        handleClose={handleClose}
        packageInfo={packageInfo}
        openDialog={openDialog}
      />
      <AddStudentDialog
        handleClose={handleStudentClose}
        packageInfo={packageInfo}
        openDialog={studentDialog}
      />
    </>
  );
};

export default MenuPopupPackage;
