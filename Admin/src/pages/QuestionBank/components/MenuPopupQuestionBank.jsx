import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import {
  getAllQuestionAsync,
  deleteQuestionAsync,
} from "redux/questionbank/questionbank.async";
import { PATH_DASHBOARD } from "routes/paths";
import ConfirmDialog from "components/confirm-dialog/ConfirmDialog";

const MenuPopupQuestionBank = ({
  openPopover,
  handleClosePopover,
  questionBankInfo,
  perPageNumber,
  paginationpage,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { questionBankLoader, deleteQUestion } = useSelector(
    (state) => state.questionbank
  );
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };
  const deleteButton = () => {
    dispatch(deleteQuestionAsync(questionBankInfo.id));
  };
  useMemo(() => {
    if (deleteQUestion.status === 200) {
      toast.success(deleteQUestion.message, toastoptions);
      handleCloseConfirm();
      dispatch(
        getAllQuestionAsync({
          page: paginationpage,
          limit: perPageNumber,
        })
      );
    }
  }, [deleteQUestion]);

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
            navigate(
              `${PATH_DASHBOARD.viewquestionbank}/${questionBankInfo?.id}`
            );
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem
          onClick={() => {
            handleClosePopover();
            navigate(
              `${PATH_DASHBOARD.editquestionbank}/${questionBankInfo?.id}`
            );
          }}
          disabled={!Boolean(modulePermit?.edit)}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        {/*<Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: "error.main" }}
          disabled={!Boolean(modulePermit?.remove)}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem> */}
      </MenuPopover>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={questionBankLoader}
            onClick={deleteButton}
          >
            Delete
          </LoadingButton>
        }
      />
    </>
  );
};

export default MenuPopupQuestionBank;
