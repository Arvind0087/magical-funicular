import { useState } from "react";
import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import { useNavigate } from "react-router";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Iconify from "components/iconify/Iconify";
import { PATH_DASHBOARD } from "routes/paths";
import DoubtReplyDialog from "../DoubtReply/DoubtReplyDialog";

const MenuPopup = ({
  openPopover,
  handleClosePopover,
  replyinfo,
  paginationpage,
  perPageNumber,
}) => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 200 }}
      >
        {replyinfo?.image ? (
          <MenuItem
            onClick={() => {
              handleClosePopover();
              window.open(replyinfo?.image, "_blank", "noreferrer");
            }}
          >
            <FileDownloadIcon icon="eva:edit-fill" />
            Download Image
          </MenuItem>
        ) : null}

        <MenuItem
          onClick={() => {
            handleClosePopover();
            // navigate(`${PATH_DASHBOARD.doubts}/${replyinfo?.id}`);
            setOpenDialog(true);
          }}
        >
          <Iconify icon="eva:eye-fill" />
          Reply
        </MenuItem>
      </MenuPopover>

      <DoubtReplyDialog
        doubtId={replyinfo?.id}
        setOpenDialog={setOpenDialog}
        openDialog={openDialog}
        handleClose={handleClose}
        paginationpage={paginationpage}
        perPageNumber={perPageNumber}
      />
    </>
  );
};

export default MenuPopup;
