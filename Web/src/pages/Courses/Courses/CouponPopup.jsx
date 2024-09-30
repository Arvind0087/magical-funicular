import { useState, useMemo, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { useSelector, useDispatch } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { voucherByUserIdAsync } from "redux/syllabus/syllabus.async";
import SearchIcon from "@mui/icons-material/Search";

export default function CouponPopup({
  title,
  content,
  content2,
  action,
  open,
  onClose,
  getCoursePackageById,
  setDiscountedPrice,
  setCheckedData,
  checkedData,
  setIsApplied,
  isApplied,
  ...other
}) {
  const [isChecked, setIsChecked] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [searchVal, setSearchVal] = useState("");
  const dispatch = useDispatch();

  const { getVoucherLoader, getVoucher } = useSelector(
    (state) => state?.syllabusAsy
  );

  const closeHandler = () => {
    onClose();
  };

  const handleCheckboxChange = (event, index, currentData) => {
    const textContent = event?.target?.value;

    setSelectedIdx(index === selectedIdx ? null : index);
    setIsChecked(event.target.checked);
    if (event?.target?.checked) {
      setCheckedData(textContent);
      setSelectedContent(currentData);
    } else {
      setCheckedData("");
    }
  };

  const calculateDiscount = (data) => {
    const amount = getCoursePackageById?.package_selling_price;
    const percentage = data?.voucher_discount;
    const calculatedPercentage = Math.floor(amount * (percentage / 100));
    return calculatedPercentage;
  };

  const totalDiscount = useMemo(
    () => calculateDiscount(selectedContent),
    [selectedContent]
  );

  const applyCoupon = (event) => {
    setSearchVal(event?.target?.value);
  };

  const couponApplyHandler = () => {
    if (totalDiscount && isChecked) {
      const amount = getCoursePackageById?.package_selling_price;

      if (totalDiscount && isChecked) {
        const afterDiscountPrice = amount - totalDiscount;
        setDiscountedPrice(afterDiscountPrice);
        setIsApplied(true);
      } else {
        setDiscountedPrice(amount);
        setIsApplied(false);
      }
      onClose();
      setSearchVal("");
    }
  };

  useEffect(() => {
    let payload = {
      packageId: getCoursePackageById?.id,
      searchVoucher: searchVal,
    };
    dispatch(voucherByUserIdAsync(payload));
  }, []);

  const searchCoupons = () => {
    let payload = {
      packageId: getCoursePackageById?.id,
      searchVoucher: searchVal,
    };
    dispatch(voucherByUserIdAsync(payload));
  };

  const filteredVoucher =
    getVoucher?.length > 0 &&
    getVoucher?.filter((item) => item?.show_voucher == 1);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mr: 3,
          mt: 2,
          cursor: "pointer",
        }}
      >
        <CloseIcon onClick={closeHandler} sx={{ color: "orange" }} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "80%",
          margin: "0 auto",
          mt: 6,
        }}
      >
        <Typography sx={{ fontSize: "16px" }}>Enter Coupon Code</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            mt: 1,
            mb: 6,
          }}
        >
          <TextField
            required
            fullWidth
            // label="Required"
            value={searchVal}
            onChange={applyCoupon}
            inputProps={{
              sx: { width: "83%" },
            }}
          />
          <Button sx={{ ml: -8, p: "17px 5px" }}>
            <SearchIcon sx={{ fontSize: "25px" }} onClick={searchCoupons} />
          </Button>
        </Box>
      </Box>
      <FormGroup>
        {getVoucherLoader ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress sx={{ width: "50px", height: "50px" }} />
          </Box>
        ) : filteredVoucher?.length > 0 ? (
          filteredVoucher?.map((item, index) => (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: "80%",
                margin: "0 auto",
              }}
            >
              <Box sx={{ mb: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedIdx === index}
                      value={item?.voucher_code}
                      onChange={(event) =>
                        handleCheckboxChange(event, index, item)
                      }
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color: "red",
                        fontWeight: "bold",
                        padding: "5px",
                        ml: 2,

                        border: "1px dashed #ea5805",
                      }}
                    >
                      {item?.voucher_code}
                    </Typography>
                  }
                />
              </Box>
              <Box sx={{ mb: 2, ml: 4 }}>
                <Typography>{item?.voucher_description}</Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 600,
              fontSize: "18px",
              color: "#ff8331",
            }}
          >
            No coupon available!
          </Box>
        )}
      </FormGroup>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "80%",
          margin: "0 auto",
          mt: 6,
        }}
      >
        <Box>
          <Typography>Maximum Discount</Typography>
          <Typography sx={{ fontWeight: 600, fontSize: "18px" }}>
            ₹ {totalDiscount && isChecked ? totalDiscount : 0}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            color="error"
            onClick={couponApplyHandler}
            disabled={!isChecked}
          >
            Apply
          </Button>
        </Box>
      </Box>
      <DialogActions>{action}</DialogActions>
    </Dialog>
  );
}
