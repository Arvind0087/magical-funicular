import React, { useState, useEffect } from "react";
import { MenuItem, Divider } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";
// ----Added Area
import { useDispatch, useSelector } from "react-redux";
import { getBoardStatus, getboardAsync } from "redux/board/board.async";
import { emptyboard } from "redux/board/board.slice";
import { toastoptions } from "utils/toastoptions";
import { toast } from "react-hot-toast";

const MenuPopupBoard = ({ openPopover, handleClosePopover, boardinfo }) => {
  const [getBoardState, setBoardStatus] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { modulePermit } = useSelector((state) => state.menuPermission);
  const { boardLoader, boardStatus, boards } = useSelector(
    (state) => state.board
  );
  useEffect(() => {
    if (boardinfo.status === 1) {
      setBoardStatus(true);
    }
  }, [boardinfo, boards]);

  useEffect(() => {
    if (boardStatus.status === 200) {
      toast.success(boardStatus.message, toastoptions);
      dispatch(emptyboard());
      dispatch(getboardAsync({ page: 1, limit: 10, status: "all" }));
    }
  }, [boardStatus]);

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
            navigate(`${PATH_DASHBOARD.editboard}/${boardinfo.id}`);
          }}
          disabled={!Boolean(modulePermit?.edit)}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
        <Divider sx={{ borderStyle: "dashed" }} />
        <MenuItem
          onClick={() => {
            handleClosePopover();
            const payload = {
              boardId: boardinfo.id,
              status: boardinfo.status === 1 ? 0 : 1,
            };
            dispatch(getBoardStatus(payload));
          }}
        >
          <Iconify icon="eva:eye-fill" />
          {boardinfo?.status === 1 ? "Inactive" : "Active"}
        </MenuItem>
      </MenuPopover>
    </>
  );
};

export default MenuPopupBoard;
