import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
    getDoubtByStudentIdAsync,
    getDoubtByIdAsync,
    createDoubtAsync,
    createReplyAsync,
    getAllDoubtOfStudentsAsync,
} from "../async.api";

const initialState = {
    doubtLoader: false,
    myDoubtList: [],
    doubtDetail: {},
    doubt: {},
    searchDoubt: [],
    studentReplyDoubt: [],
    allDoubts: []
};

export const doubtSlice = createSlice({
    name: "doubt",
    initialState,
    extraReducers: (builder) => {
        builder.addMatcher(isAnyOf(getDoubtByStudentIdAsync.pending), (state, action) => {
            state.doubtLoader = true;
            state.myDoubtList = []
        });
        builder.addMatcher(isAnyOf(getDoubtByStudentIdAsync.fulfilled), (state, action) => {
            state.doubtLoader = false;
            state.myDoubtList = action.payload?.data;
        });
        builder.addMatcher(isAnyOf(getDoubtByStudentIdAsync.rejected), (state, action) => {
            state.doubtLoader = false;
            state.myDoubtList = [];
        });

        builder.addMatcher(isAnyOf(getDoubtByIdAsync.pending), (state, action) => {
            state.doubtLoader = true;
            state.doubtDetail = {};
        });
        builder.addMatcher(isAnyOf(getDoubtByIdAsync.fulfilled), (state, action) => {
            state.doubtLoader = false;
            state.doubtDetail = action.payload?.data;
        });
        builder.addMatcher(isAnyOf(getDoubtByIdAsync.rejected), (state, action) => {
            state.doubtLoader = false;
            state.doubtDetail = {};
        });
        builder.addMatcher(isAnyOf(createDoubtAsync.fulfilled), (state, action) => {
            state.doubtLoader = false;
            state.doubt = action.payload;
        });
        //------------------------------------------------
        builder.addMatcher(isAnyOf(createReplyAsync.pending), (state, action) => {
            state.doubtLoader = true;
            state.studentReplyDoubt = []
        });
        builder.addMatcher(isAnyOf(createReplyAsync.fulfilled), (state, action) => {
            state.doubtLoader = false;
            state.studentReplyDoubt = action.payload;
        });
        builder.addMatcher(isAnyOf(createReplyAsync.rejected), (state, action) => {
            state.doubtLoader = false;
            state.studentReplyDoubt = [];
        });
        //----------------------------------------------------------//
        builder.addMatcher(isAnyOf(getAllDoubtOfStudentsAsync.pending), (state, action) => {
            state.doubtLoader = true;
            state.allDoubts = []
        });
        builder.addMatcher(isAnyOf(getAllDoubtOfStudentsAsync.fulfilled), (state, action) => {
            state.doubtLoader = false;
            state.allDoubts = action.payload;
        });
        builder.addMatcher(isAnyOf(getAllDoubtOfStudentsAsync.rejected), (state, action) => {
            state.doubtLoader = false;
            state.allDoubts = [];
        });

    },
    reducers: {
        emptydoubt: (state) => {
            return {
                ...initialState,
            };
        },
    },
});

export const { emptydoubt } = doubtSlice.actions;

export default doubtSlice.reducer;
