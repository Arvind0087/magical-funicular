import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getAllLikeShortsByStudentIdAsync, getNewShortsByStudentIdAsync, getNextShortsAsync, getOneShortsByStudentIdAsync, getPreviousShortsAsync, getShortsByStudentIdAsync, likeShortsAsync } from "../async.api";

const initialState = {

  // for new videos.................
  newVideosLoader:false,
  newVideos:[],

  // for all shorts..................
  ShortsBystudentIdLoader: false,
  ShortsBystudentId: [],

  // favorite page shorts...............

  likedShortsByStudentIdLoader: false,
  likedShortsByStudentId: [],

  // subject wise favorite page shorts...............
  likedShortsBySubjectIdLoader: false,
  likedShortsBySubjectIdId: [],

  // for video player url....
  shortUrl: "",

  // for next video.....
    getNextVideoLoader:false,
    getNextVideo:[],

  // for previous video....
    getPreviousVideoLoader:false,
    getPreviousVideo:[],

  // get one short.....
  getOneshortLoader: false,
  getOneShort: [],

  // like shorts..........
  likeShortLoader: false,
  likeShort: [],

  // dislike shorts.........
  dislikeShortLoader: false,
  dislikeShort: [],
};

export const shortsSlice = createSlice({
  name: "shorts",
  initialState,
  extraReducers: (builder) => {

    // for new videos..................
  builder.addMatcher(
    (state) => {
      state.newVideosLoader = true;
    }
  );
  builder.addMatcher(isAnyOf(getNewShortsByStudentIdAsync.fulfilled), (state, action) => {
      state.newVideosLoader = false;
      state.newVideos = action.payload.data;
  });
  builder.addMatcher(isAnyOf(getNewShortsByStudentIdAsync.rejected), (state, action) => {
    state.newVideosLoader = false;
  });

    //  get all shorts................
    builder.addMatcher(
      isAnyOf(getShortsByStudentIdAsync.pending),
      (state) => {
        state.ShortsBystudentIdLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getShortsByStudentIdAsync.fulfilled), (state, action) => {
      state.ShortsBystudentIdLoader = false;
      state.ShortsBystudentId = action.payload;
    });
    builder.addMatcher(isAnyOf(getShortsByStudentIdAsync.rejected), (state, action) => {
      state.ShortsBystudentIdLoader = false;
      // state.ShortsBystudentId = action.payload;
    });

    // one short..........................

    builder.addMatcher(
      isAnyOf(getOneShortsByStudentIdAsync.pending),
      (state) => {
        state.getOneshortLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getOneShortsByStudentIdAsync.fulfilled), (state, action) => {
      state.getOneshortLoader = false;
      state.getOneShort = action.payload;
    });
    builder.addMatcher(isAnyOf(getOneShortsByStudentIdAsync.rejected), (state, action) => {
      state.getOneshortLoader = false;
      state.getOneShort = action.payload;
    });

    // like short...................................

    builder.addMatcher(
      isAnyOf(likeShortsAsync.pending),
      (state) => {
        state.likeShortLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(likeShortsAsync.fulfilled), (state, action) => {
      state.likeShortLoader = false;
      state.likeShort = action.payload;
    });
    builder.addMatcher(isAnyOf(likeShortsAsync.rejected), (state, action) => {
      state.likeShortLoader = false;
      state.likeShort = action.payload;
    });

    // dislike short....................................

    builder.addMatcher(
      isAnyOf(likeShortsAsync.pending),
      (state) => {
        state.dislikeShortLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(likeShortsAsync.fulfilled), (state, action) => {
      state.dislikeShortLoader = false;
      state.likedShortsBySubjectIdId = action.payload;
    });
    builder.addMatcher(isAnyOf(likeShortsAsync.rejected), (state, action) => {
      state.dislikeShortLoader = false;
      state.likedShortsBySubjectIdId = action.payload;
    });

    // favorite shorts api's...........................
        // for all liked shorts............
    builder.addMatcher(
      isAnyOf(getAllLikeShortsByStudentIdAsync.pending),
      (state) => {
        state.likedShortsByStudentIdLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getAllLikeShortsByStudentIdAsync.fulfilled), (state, action) => {
      state.likedShortsByStudentIdLoader = false;
      state.likedShortsByStudentId = action.payload;
    });
    builder.addMatcher(isAnyOf(getAllLikeShortsByStudentIdAsync.rejected), (state, action) => {
      state.likedShortsByStudentIdLoader = false;
      state.likedShortsByStudentId = action.payload;
    });

    // go next short............................

    builder.addMatcher(
      isAnyOf(getNextShortsAsync.pending),
      (state) => {
        state.getNextVideoLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getNextShortsAsync.fulfilled), (state, action) => {
      state.getNextVideoLoader = false;
      state.getNextVideo = action.payload;
    });
    builder.addMatcher(isAnyOf(getNextShortsAsync.rejected), (state, action) => {
      state.getNextVideoLoader = false;
      state.getNextVideo = action.payload;
    });

    // go to Previous shorts............................................
    builder.addMatcher(
      isAnyOf(getPreviousShortsAsync.pending),
      (state) => {
        state.getPreviousVideoLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getPreviousShortsAsync.fulfilled), (state, action) => {
      state.getPreviousVideoLoader = false;
      state.getPreviousVideo = action.payload;
    });
    builder.addMatcher(isAnyOf(getPreviousShortsAsync.rejected), (state, action) => {
      state.getPreviousVideoLoader = false;
      state.getPreviousVideo = action.payload;
    });
  },
  reducers: {
    setUrl: (state, payload) => {
      state.shortUrl = payload.payload.url
    }
  }
});

export const { setUrl } = shortsSlice.actions;

export default shortsSlice.reducer;
