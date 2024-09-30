import { createSlice, isAnyOf } from "@reduxjs/toolkit";

const initialState = {
 subject:[],
 level:[],
 time:[],
 questions:[]
,
};

export const createTestSlice = createSlice({
  name: "course",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getcourseAsync.pending,
        createcourseAsync.pending,
        getcoursebyidAsync.pending,
        updatecoursebyidAsync.pending
      ),
      (state) => {
        state.courseLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getcourseAsync.fulfilled), (state, action) => {
      state.courseLoader = false;
      state.course = action.payload.data;
    });
    builder.addMatcher(
      isAnyOf(createcourseAsync.fulfilled),
      (state, action) => {
        state.courseLoader = false;
        state.courseadd = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getcoursebyidAsync.fulfilled),
      (state, action) => {
        console.log(action.payload.data);
        state.courseLoader = false;
        state.courseId = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updatecoursebyidAsync.fulfilled),
      (state, action) => {
        state.courseLoader = false;
        state.updateId = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getcourseAsync.rejected,
        createcourseAsync.rejected,
        getcoursebyidAsync.rejected,
        updatecoursebyidAsync.rejected
      ),
      (state, action) => {
        state.courseLoader = false;
      }
    );
  },
  reducers: {
    emptycourse: (state) => {
      return {
        ...initialState,
      }
      
    },
    addValue: (state) => {
        return {
          ...initialState,
        }
        
      },
  },
});

export const { emptycourse } = coursesSlice.actions;

export default coursesSlice.reducer;
