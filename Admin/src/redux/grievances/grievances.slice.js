import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
    getAllGrievancesAsync,
    getGrievancesCategoryAsync,
    getAllCategoryAsync,
    createGrievancesCategoryAsync,
    getGrievancesCategoryByIdAsync,
    updatGrievancesCategoryIdAsync,
    deleteGrievancesCategoryByIdAsync,
    getSubGrievancesCategoryAsync,
    createGrievancesSubCategoryAsync,
    getGrievancesSubCategoryByIdAsync,
    updatGrievancesSubCategoryIdAsync,
    deleteGrievancesSubCategoryByIdAsync,
} from "./grievances.async";

const initialState = {
    grievancesLoader: false,
    allGrievances: [],
    allGrievancesCategory: [],
    allCategory: [],
    createGrievancesCategory: [],
    grievancesCategoryById: [],
    updatGrievancesCategory: [],
    deleteGrievancesCategory: [],
    allSubGrievancesCategory: [],
    createGrievancesSubCategory: [],
    getGrievancesSubCategoryById: [],
    updatGrievancesSubCategory: [],
    deleteGrievancesSubCategoryById: [],
};

export const grievancesSlice = createSlice({
    name: "grievances",
    initialState,
    extraReducers: (builder) => {
        builder.addMatcher(
            isAnyOf(
                getAllGrievancesAsync.pending,
                getGrievancesCategoryAsync.pending,
                getAllCategoryAsync.pending,
                createGrievancesCategoryAsync.pending,
                getGrievancesCategoryByIdAsync.pending,
                updatGrievancesCategoryIdAsync.pending,
                deleteGrievancesCategoryByIdAsync.pending,
                getSubGrievancesCategoryAsync.pending,
                createGrievancesSubCategoryAsync.pending,
                getGrievancesSubCategoryByIdAsync.pending,
                updatGrievancesSubCategoryIdAsync.pending,
                deleteGrievancesSubCategoryByIdAsync.pending,
            ),
            (state) => {
                state.grievancesLoader = true;
            }
        );
        builder.addMatcher(isAnyOf(getAllGrievancesAsync.fulfilled), (state, action) => {
            state.grievancesLoader = false;
            state.allGrievances = action.payload;
        });
        builder.addMatcher(isAnyOf(getGrievancesCategoryAsync.fulfilled), (state, action) => {
            state.grievancesLoader = false;
            state.allGrievancesCategory = action.payload;
        });
        builder.addMatcher(isAnyOf(getAllCategoryAsync.fulfilled), (state, action) => {
            state.grievancesLoader = false;
            state.allCategory = action.payload;
        });
        builder.addMatcher(isAnyOf(createGrievancesCategoryAsync.fulfilled), (state, action) => {
            state.grievancesLoader = false;
            state.createGrievancesCategory = action.payload;
        });
        builder.addMatcher(isAnyOf(getGrievancesCategoryByIdAsync.fulfilled), (state, action) => {
            state.grievancesLoader = false;
            state.grievancesCategoryById = action.payload.data;
        });
        builder.addMatcher(isAnyOf(updatGrievancesCategoryIdAsync.fulfilled), (state, action) => {
            state.grievancesLoader = false;
            state.updatGrievancesCategory = action.payload;
        });
        builder.addMatcher(isAnyOf(deleteGrievancesCategoryByIdAsync.fulfilled), (state, action) => {
            state.grievancesLoader = false;
            state.deleteGrievancesCategory = action.payload;
        });
        builder.addMatcher(isAnyOf(getSubGrievancesCategoryAsync.fulfilled), (state, action) => {
            state.grievancesLoader = false;
            state.allSubGrievancesCategory = action.payload;
        });
        builder.addMatcher(isAnyOf(createGrievancesSubCategoryAsync.fulfilled), (state, action) => {
            state.grievancesLoader = false;
            state.createGrievancesSubCategory = action.payload;
        });
        builder.addMatcher(isAnyOf(getGrievancesSubCategoryByIdAsync.fulfilled), (state, action) => {
            state.grievancesLoader = false;
            state.getGrievancesSubCategoryById = action.payload.data;
        });
        builder.addMatcher(isAnyOf(updatGrievancesSubCategoryIdAsync.fulfilled), (state, action) => {
            state.grievancesLoader = false;
            state.updatGrievancesSubCategory = action.payload;
        });
        builder.addMatcher(isAnyOf(deleteGrievancesSubCategoryByIdAsync.fulfilled), (state, action) => {
            state.grievancesLoader = false;
            state.deleteGrievancesSubCategoryById = action.payload;
        });

        builder.addMatcher(
            isAnyOf(
                getAllGrievancesAsync.rejected,
                getGrievancesCategoryAsync.rejected,
                getAllCategoryAsync.rejected,
                createGrievancesCategoryAsync.rejected,
                getGrievancesCategoryByIdAsync.rejected,
                updatGrievancesCategoryIdAsync.rejected,
                deleteGrievancesCategoryByIdAsync.rejected,
                getSubGrievancesCategoryAsync.rejected,
                createGrievancesSubCategoryAsync.rejected,
                getGrievancesSubCategoryByIdAsync.rejected,
                updatGrievancesSubCategoryIdAsync.rejected,
                deleteGrievancesSubCategoryByIdAsync.rejected,
            ),
            (state, action) => { state.grievancesLoader = false; }
        );
    },
    reducers: {
        emptyGrievances: (state) => initialState,
        // emptyById: (state) => {state.stateById = []},
    },
});

export const { emptyGrievances } = grievancesSlice.actions;

export default grievancesSlice.reducer;
