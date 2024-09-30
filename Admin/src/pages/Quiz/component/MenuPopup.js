import { MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";

const MenuPopupChapter = ({ openPopover, handleClosePopover, Idinfo }) => {
  const navigate = useNavigate();

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
              `${PATH_DASHBOARD.quizreportview}/${Idinfo?.id}?quizId=${Idinfo.quizId}&studentId=${Idinfo.studentId}`
            );
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem>
      </MenuPopover>
    </>
  );
};

export default MenuPopupChapter;
