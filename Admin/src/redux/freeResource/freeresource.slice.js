import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addPyqsAsync,
  getPyqsByIdAsync,
  updatePyqsByIdAsync,
  getAllPyqsAsync,
  deletePyqsAsync,
  getAllModalPaperAsync,
  addModalPaperAsync,
  getModalPaperByIdAsync,
  updateModalPaperByIdAsync,
  deleteModalPaperAsync,
} from "./freeresource.async";

const initialState = {
  createPyqsLoader: false,
  createPyqs: [],
  getByIdPyqsLoader: false,
  getByIdPyqs: [],
  updatePyqsLoader: false,
  updatePyqs: [],
  allPyqsLoader: false,
  allPyqs: [],
  deletePyqsLoader: false,
  deletePyqs: [],

  createMPaperLoader: false,
  createMPaper: [],
  getByIdMPaperLoader: false,
  getByIdMPaper: [],
  updateMPaperLoader: false,
  updateMPaper: [],
  allMPaperLoader: false,
  allMPaper: [],
  deleteMPaperLoader: false,
  deleteMPaper: [],
};

export const freeresourceSlice = createSlice({
  name: "freeresource",
  initialState,

  extraReducers: (builder) => {
    //PYQS
    builder.addMatcher(isAnyOf(addPyqsAsync.pending), (state) => {
      state.createPyqsLoader = true;
    });
    builder.addMatcher(isAnyOf(addPyqsAsync.fulfilled), (state, action) => {
      state.createPyqsLoader = false;
      state.createPyqs = action.payload;
    });
    builder.addMatcher(isAnyOf(addPyqsAsync.rejected), (state, action) => {
      state.createPyqsLoader = false;
    });

    builder.addMatcher(isAnyOf(getPyqsByIdAsync.pending), (state) => {
      state.getByIdPyqsLoader = true;
    });
    builder.addMatcher(isAnyOf(getPyqsByIdAsync.fulfilled), (state, action) => {
      state.getByIdPyqsLoader = false;
      state.getByIdPyqs = action.payload;
    });
    builder.addMatcher(isAnyOf(getPyqsByIdAsync.rejected), (state, action) => {
      state.getByIdPyqsLoader = false;
    });

    builder.addMatcher(isAnyOf(updatePyqsByIdAsync.pending), (state) => {
      state.updatePyqsLoader = true;
    });
    builder.addMatcher(
      isAnyOf(updatePyqsByIdAsync.fulfilled),
      (state, action) => {
        state.updatePyqsLoader = false;
        state.updatePyqs = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(updatePyqsByIdAsync.rejected),
      (state, action) => {
        state.updatePyqsLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(getAllPyqsAsync.pending), (state) => {
      state.allPyqsLoader = true;
    });
    builder.addMatcher(isAnyOf(getAllPyqsAsync.fulfilled), (state, action) => {
      state.allPyqsLoader = false;
      state.allPyqs = action.payload;
    });
    builder.addMatcher(isAnyOf(getAllPyqsAsync.rejected), (state, action) => {
      state.allPyqsLoader = false;
    });

    builder.addMatcher(isAnyOf(deletePyqsAsync.pending), (state) => {
      state.deletePyqsLoader = true;
    });
    builder.addMatcher(isAnyOf(deletePyqsAsync.fulfilled), (state, action) => {
      state.deletePyqsLoader = false;
      state.deletePyqs = action.payload;
    });
    builder.addMatcher(isAnyOf(deletePyqsAsync.rejected), (state, action) => {
      state.deletePyqsLoader = false;
    });

    //Modal Paper
    builder.addMatcher(isAnyOf(addModalPaperAsync.pending), (state) => {
      state.createMPaperLoader = true;
    });
    builder.addMatcher(
      isAnyOf(addModalPaperAsync.fulfilled),
      (state, action) => {
        state.createMPaperLoader = false;
        state.createMPaper = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(addModalPaperAsync.rejected),
      (state, action) => {
        state.createMPaperLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(getModalPaperByIdAsync.pending), (state) => {
      state.getByIdMPaperLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getModalPaperByIdAsync.fulfilled),
      (state, action) => {
        state.getByIdMPaperLoader = false;
        state.getByIdMPaper = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getModalPaperByIdAsync.rejected),
      (state, action) => {
        state.getByIdMPaperLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(updateModalPaperByIdAsync.pending), (state) => {
      state.updateMPaperLoader = true;
    });
    builder.addMatcher(
      isAnyOf(updateModalPaperByIdAsync.fulfilled),
      (state, action) => {
        state.updateMPaperLoader = false;
        state.updateMPaper = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(updateModalPaperByIdAsync.rejected),
      (state, action) => {
        state.updateMPaperLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(getAllModalPaperAsync.pending), (state) => {
      state.allMPaperLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllModalPaperAsync.fulfilled),
      (state, action) => {
        state.allMPaperLoader = false;
        state.allMPaper = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllModalPaperAsync.rejected),
      (state, action) => {
        state.allMPaperLoader = false;
      }
    );

    builder.addMatcher(isAnyOf(deleteModalPaperAsync.pending), (state) => {
      state.deleteMPaperLoader = true;
    });
    builder.addMatcher(
      isAnyOf(deleteModalPaperAsync.fulfilled),
      (state, action) => {
        state.deleteMPaperLoader = false;
        state.deleteMPaper = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(deleteModalPaperAsync.rejected),
      (state, action) => {
        state.deleteMPaperLoader = false;
      }
    );
  },

  reducers: {
    emptyfreeresourceSlice: () => initialState,
  },
});

export const { emptyfreeresourceSlice } = freeresourceSlice.actions;

export default freeresourceSlice.reducer;
