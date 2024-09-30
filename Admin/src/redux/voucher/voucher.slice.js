import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addVoucherAsync,
  getAllVoucherAsync,
  getVoucherByIdAsync,
  updateVoucherByIdAsync,
  updateVoucherStatusAsync,
} from "./voucher.async";

const initialState = {
  voucherLoader: false,
  addVoucher: [],
  allLangLoader: false,
  getAllLanguage: [],
  getVoucherByIdLoader: false,
  getVoucherById: [],
  updateLoader: false,
  updateVoucher: [],
  statusLoader: false,
  getStatus: [],
};

export const voucherSlice = createSlice({
  name: "language",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(addVoucherAsync.pending), (state) => {
      state.voucherLoader = true;
    });
    builder.addMatcher(isAnyOf(addVoucherAsync.fulfilled), (state, action) => {
      state.voucherLoader = false;
      state.addVoucher = action.payload;
    });
    builder.addMatcher(isAnyOf(addVoucherAsync.rejected), (state, action) => {
      state.voucherLoader = false;
    });

    builder.addMatcher(isAnyOf(getAllVoucherAsync.pending), (state) => {
      state.allVoucherLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllVoucherAsync.fulfilled),
      (state, action) => {
        state.allVoucherLoader = false;
        state.getAllVoucher = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllVoucherAsync.rejected),
      (state, action) => {
        state.allVoucherLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(getVoucherByIdAsync.pending), (state) => {
      state.getVoucherByIdLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getVoucherByIdAsync.fulfilled),
      (state, action) => {
        state.getVoucherByIdLoader = false;
        state.getVoucherById = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getVoucherByIdAsync.rejected),
      (state, action) => {
        state.getVoucherByIdLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(updateVoucherByIdAsync.pending), (state) => {
      state.updateLoader = true;
    });
    builder.addMatcher(
      isAnyOf(updateVoucherByIdAsync.fulfilled),
      (state, action) => {
        state.updateLoader = false;
        state.updateVoucher = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(updateVoucherByIdAsync.rejected),
      (state, action) => {
        state.updateLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(updateVoucherStatusAsync.pending), (state) => {
      state.statusLoader = true;
    });
    builder.addMatcher(
      isAnyOf(updateVoucherStatusAsync.fulfilled),
      (state, action) => {
        state.statusLoader = false;
        state.getStatus = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(updateVoucherStatusAsync.rejected),
      (state, action) => {
        state.statusLoader = false;
      }
    );
  },

  reducers: {
    emptyVoucher: () => initialState,
  },
});

export const { emptyVoucher } = voucherSlice.actions;

export default voucherSlice.reducer;
