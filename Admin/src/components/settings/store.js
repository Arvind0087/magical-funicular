// store.js
import { configureStore,createSlice } from '@reduxjs/toolkit';

const initialState = {
  myData: null,
};

const myDataSlice = createSlice({
  name: 'myData',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.myData = action.payload;
    },
  },
});

export const { setData } = myDataSlice.actions;
export default myDataSlice.reducer;

