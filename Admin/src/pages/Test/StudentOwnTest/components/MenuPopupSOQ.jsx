import { Divider, MenuItem } from "@mui/material";
import MenuPopover from "components/menu-popover/MenuPopover";
import Iconify from "components/iconify/Iconify";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "routes/paths";
import { toast } from "../../../../../node_modules/react-hot-toast/dist/index";
// import { toast } from "../../../node_modules/react-hot-toast/dist/index";
import { toastoptions } from "utils/toastoptions";

const MenuPopupSOQ = ({
    openPopover,
    handleClosePopover,
    SOQinfo,
    setOpenConfirm,
}) => {
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
                        {
                            SOQinfo?.attempted === false ? (
                                toast.error(
                                    "Test Not Attempted Yet",
                                    toastoptions
                                )) : (
                                navigate(
                                    `/app/test/student-own-test/${SOQinfo?.id}?testId=${SOQinfo.id}&studentId=${SOQinfo.studentId}`
                                )
                            )
                        }

                    }}
                    disabled={SOQinfo?.attempted === false}
                >
                    <Iconify icon="eva:eye-fill" />
                    View
                </MenuItem>
            </MenuPopover>
        </>
    );
};

export default MenuPopupSOQ;
