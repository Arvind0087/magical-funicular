import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { addRatingAsync, getRatingByUserIdAsync } from "../async.api";
const initialState = {
    addRatingLoader:false,
    addRating:{},
    //getRatingByUserI
    getRatingByUserIdLoader:false,
    getRatingByUserId:{}
};

export const RatingSlice = createSlice({
  name: "Rating",
  initialState,
  extraReducers: (builder) =>{builder.addMatcher(isAnyOf(addRatingAsync .pending), (state) => {
      state.addRatingLoader = true;
    });
    builder.addMatcher(isAnyOf(addRatingAsync .fulfilled),
      (state, action) => {
        state.addRatingLoader = false;
        state.addRating = action.payload.data;
      }
    );
    builder.addMatcher(isAnyOf(addRatingAsync .rejected),
      (state, action) => {
        state.addRatingLoader = false;
      }
    );
    builder.addMatcher(isAnyOf(getRatingByUserIdAsync.pending), (state) => {
        state.getRatingByUserIdLoader = true;
      });
      builder.addMatcher(
        isAnyOf(getRatingByUserIdAsync.fulfilled),
        (state, action) => {
          state.getRatingByUserIdLoader = false;
          state.getRatingByUserId = action.payload.data;
        }
      );
      builder.addMatcher(
        isAnyOf(getRatingByUserIdAsync.rejected),
        (state, action) => {
          state.getRatingByUserIdLoader = false;
        }
      );
  },
});



export default RatingSlice.reducer;
