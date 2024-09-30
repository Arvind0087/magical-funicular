import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createCityAsync,
  deleteCityByIdAsync,
  getAllCityByStateIdAsync,
  getCityAsync,
  getCityByIdAsync,
  updatCityByIdAsync,
  getAllCityByMultipleStateId,
  getCityByMultipleStateIdAsync
} from "./cities.async";

const initialState = {
  cityLoader: false,
  city: [],
  cityadd: [],
  cityById: [],
  updateCityById: [],
  deleteCityById: [],
  CityByStateId: [],
  cityByAllStateId: [],
  cityByMultipleStateId:[]
};

export const citySlice = createSlice({
  name: "city",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getCityAsync.pending,
        createCityAsync.pending,
        getCityByIdAsync.pending,
        updatCityByIdAsync.pending,
        deleteCityByIdAsync.pending,
        getAllCityByStateIdAsync.pending,
        getAllCityByMultipleStateId.pending,
        getCityByMultipleStateIdAsync.pending
      ),
      (state) => {
        state.cityLoader = true;
      }
    );
    builder.addMatcher(isAnyOf(getAllCityByMultipleStateId.fulfilled), (state, action) => {
      state.cityLoader = false;
      state.cityByAllStateId = action.payload;
    });
    builder.addMatcher(isAnyOf(getCityAsync.fulfilled), (state, action) => {
      state.cityLoader = false;
      state.city = action.payload;
    });
    builder.addMatcher(isAnyOf(createCityAsync.fulfilled), (state, action) => {
      state.cityLoader = false;
      state.cityadd = action.payload;
    });
    builder.addMatcher(isAnyOf(getCityByIdAsync.fulfilled), (state, action) => {
      state.cityLoader = false;
      state.cityById = action.payload.data;
    });
    //for state
    builder.addMatcher(
      isAnyOf(getAllCityByStateIdAsync.fulfilled),
      (state, action) => {
        state.cityLoader = false;
        state.CityByStateId = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(updatCityByIdAsync.fulfilled),
      (state, action) => {
        state.cityLoader = false;
        state.updateCityById = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(deleteCityByIdAsync.fulfilled),
      (state, action) => {
        state.cityLoader = false;
        state.deleteCityById = action.payload;
      }
    );
// City By Multiple State Id
    builder.addMatcher(isAnyOf(getCityByMultipleStateIdAsync.fulfilled), (state, action) => {
      state.cityLoader = false;
      state.cityByMultipleStateId = action.payload.data;
    });

    builder.addMatcher(
      isAnyOf(
        getCityAsync.rejected,
        createCityAsync.rejected,
        getCityByIdAsync.rejected,
        updatCityByIdAsync.rejected,
        deleteCityByIdAsync.rejected,
        getAllCityByStateIdAsync.rejected,
        getAllCityByMultipleStateId.rejected,
        getCityByMultipleStateIdAsync.rejected
      ),
      (state, action) => {
        state.cityLoader = false;
      }
    );
  },
  reducers: {
    emptycity: (state) => initialState,
    emptyByid: (state) => {
      state.cityById = [];
    },
  },
});

export const { emptycity, emptyByid } = citySlice.actions;

export default citySlice.reducer;
