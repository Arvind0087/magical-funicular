
import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getAllStateAsync } from "./cityAndState.async";
import {getAllCityByStateIdAsync} from "./cityAndState.async";
import { getCityByIdAsync } from "./cityAndState.async";
import {getStateByIdAsync} from "./cityAndState.async";
const initialState = {
    getAllStateLoader: false,
    getAllStateBy: [],

    //city by id
    getAllCityByStateIdLoader: false,
    AllCityByStateId: [],

    //get only city by id
    getCityByIdLoader: false,
    OnlyCityById: [],

    //get only state by id
    getStateByIdLoader: false,
    OnlyStateById: [],
}

export const getStateAndCitySlice = createSlice({
  name: "SateAndCity",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(getAllStateAsync.pending), (state) => {
      state.getAllStateLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllStateAsync.fulfilled),
      (state, action) => {
        state.getAllStateLoader = false;
        state. getAllStateBy = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllStateAsync.rejected),
      (state, action) => {
        state.getAllStateLoader = false;
      }
    );
    builder.addMatcher(isAnyOf(getAllCityByStateIdAsync.pending), (state) => {
      state.getAllCityByStateIdLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getAllCityByStateIdAsync.fulfilled),
      (state, action) => {
        state.getAllCityByStateIdLoader = false;
        state.AllCityByStateId = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllCityByStateIdAsync.rejected),
      (state, action) => {
        state.getAllCityByStateIdLoader = false;
      }
    );
    builder.addMatcher(isAnyOf(getCityByIdAsync.pending), (state) => {
      state.getCityByIdLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getCityByIdAsync.fulfilled),
      (state, action) => {
        console.log("action",action)
        state.getCityByIdLoader = false;
        state.OnlyCityById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getCityByIdAsync.rejected),
      (state, action) => {
        console.log("action",action)
        state.getCityByIdLoader = false;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllCityByStateIdAsync.rejected),
      (state, action) => {
        state.getAllCityByStateIdLoader = false;
      }
    );
    builder.addMatcher(isAnyOf(getStateByIdAsync.pending), (state) => {
      state.getStateByIdLoader = true;
    });
    builder.addMatcher(
      isAnyOf(getStateByIdAsync.fulfilled),
      (state, action) => {
        console.log("action",action)
        state.getStateByIdLoader = false;
        state.OnlyStateById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getStateByIdAsync.rejected),
      (state, action) => {
        console.log("action",action)
        state.getStateByIdLoader = false;
      }
    );
  },
});

export default getStateAndCitySlice.reducer;
