import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  getAllGalleryAsync,
  getGalleryByIdAsync,
  createGalleryAsync,
  updateGalleryByIdAsync,
  deleteGalleryByIdAsync,
} from "./gallery.async.api";

const initialState = {
  galleryLoader: false,
  gallery: [],
  galleryadd: [],
  galleryId: {},
  galleryupdateId: [],
  gallerydelete: [],
};

export const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllGalleryAsync.pending,
        createGalleryAsync.pending,
        updateGalleryByIdAsync.pending,
        createGalleryAsync.pending,
        deleteGalleryByIdAsync.pending
      ),
      (state) => {
        state.galleryLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllGalleryAsync.fulfilled),
      (state, action) => {
        state.galleryLoader = false;
        state.gallery = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(createGalleryAsync.fulfilled),
      (state, action) => {
        state.galleryLoader = false;
        state.galleryadd = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getGalleryByIdAsync.fulfilled),
      (state, action) => {
        state.galleryLoader = false;
        state.galleryId = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updateGalleryByIdAsync.fulfilled),
      (state, action) => {
        state.galleryLoader = false;
        state.galleryupdateId = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(deleteGalleryByIdAsync.fulfilled),
      (state, action) => {
        state.galleryLoader = false;
        state.gallerydelete = action.payload;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getAllGalleryAsync.rejected,
        getGalleryByIdAsync.rejected,
        updateGalleryByIdAsync.rejected,
        createGalleryAsync.rejected,
        deleteGalleryByIdAsync.rejected
      ),
      (state, action) => {
        state.galleryLoader = false;
      }
    );
  },
  reducers: {
    emptygallery: (state) => initialState,
    emptygalleryId: (state, action) => {
      state.galleryId = {};
    },
  },
});
export const { emptygallery, emptygalleryId } = gallerySlice.actions;

export default gallerySlice.reducer;
