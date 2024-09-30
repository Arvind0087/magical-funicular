import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addSyllabusTopicAsync,
  getAllSyllabusTopicAsync,
  getSyllausTopicByIdAsync,
  updateSyllausTopicByIdAsync,
  addSyllabusContentAsync,
  updateSyllabusContentAsync,
  getSyllausContentByIdAsync,
  getAllSyllabusContentAsync,
  getSubjectByMultipleClassBatchAsync,
  getChapterByMultipleClassBatchSubjectAsync,
  getTopicByMultipleClassBatchSubjectChapterAsync,
  getsyllabusTopicStatusAsync,
  deleteSyllabusContentByIdAsync,
  updateContentSequenceAsync,
} from "./syllabus.async";

const initialState = {
  syllabusLoader: false,
  syllabustopic: [],
  syllabustopiccreate: [],
  syllabustopicId: [],
  syllabustopicupdate: [],
  syllabuscontentcreate: [],
  syllabuscontentupdate: [],
  syllabuscontentById: [],
  syllabuscontent: [],
  SubjectByMultipleClassBatch: [],
  chapterByMultipleClassBatchSubject: [],
  TopicByMultipleClassBatchSubjectChapter: [],
  getsyllabusTopicStatus: [],
  syllabusContentDelete: [],
  updateSeqData: [],
};

export const syllabusSlice = createSlice({
  name: "syllabus",
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        getAllSyllabusTopicAsync.pending,
        addSyllabusTopicAsync.pending,
        getSyllausTopicByIdAsync.pending,
        updateSyllausTopicByIdAsync.pending,
        addSyllabusContentAsync.pending,
        updateSyllabusContentAsync.pending,
        getSyllausContentByIdAsync.pending,
        getAllSyllabusContentAsync.pending,
        getSubjectByMultipleClassBatchAsync.pending,
        getChapterByMultipleClassBatchSubjectAsync.pending,
        getTopicByMultipleClassBatchSubjectChapterAsync.pending,
        getsyllabusTopicStatusAsync.pending,
        deleteSyllabusContentByIdAsync.pending,
        updateContentSequenceAsync.pending
      ),
      (state) => {
        state.syllabusLoader = true;
      }
    );
    builder.addMatcher(
      isAnyOf(updateContentSequenceAsync.fulfilled),
      (state, action) => {
        state.syllabusLoader = false;
        state.updateSeqData = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllSyllabusTopicAsync.fulfilled),
      (state, action) => {
        state.syllabusLoader = false;
        state.syllabustopic = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(addSyllabusTopicAsync.fulfilled),
      (state, action) => {
        state.syllabusLoader = false;
        state.syllabustopiccreate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getSyllausTopicByIdAsync.fulfilled),
      (state, action) => {
        state.syllabusLoader = false;
        state.syllabustopicId = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(deleteSyllabusContentByIdAsync.fulfilled),
      (state, action) => {
        state.syllabusLoader = false;
        state.syllabusContentDelete = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(updateSyllausTopicByIdAsync.fulfilled),
      (state, action) => {
        state.syllabusLoader = false;
        state.syllabustopicupdate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(addSyllabusContentAsync.fulfilled),
      (state, action) => {
        state.syllabusLoader = false;
        state.syllabuscontentcreate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(updateSyllabusContentAsync.fulfilled),
      (state, action) => {
        state.syllabusLoader = false;
        state.syllabuscontentupdate = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getSyllausContentByIdAsync.fulfilled),
      (state, action) => {
        state.syllabusLoader = false;
        state.syllabuscontentById = action.payload.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllSyllabusContentAsync.fulfilled),
      (state, action) => {
        state.syllabusLoader = false;
        state.syllabuscontent = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(getSubjectByMultipleClassBatchAsync.fulfilled),
      (state, action) => {
        state.syllabusLoader = false;
        state.SubjectByMultipleClassBatch = action.payload?.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getChapterByMultipleClassBatchSubjectAsync.fulfilled),
      (state, action) => {
        state.syllabusLoader = false;
        state.chapterByMultipleClassBatchSubject = action.payload?.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getTopicByMultipleClassBatchSubjectChapterAsync.fulfilled),
      (state, action) => {
        state.syllabusLoader = false;
        state.TopicByMultipleClassBatchSubjectChapter = action.payload?.data;
      }
    );
    builder.addMatcher(
      isAnyOf(getsyllabusTopicStatusAsync.fulfilled),
      (state, action) => {
        state.syllabusLoader = false;
        state.getsyllabusTopicStatus = action.payload;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllSyllabusTopicAsync.rejected,
        addSyllabusTopicAsync.rejected,
        getSyllausTopicByIdAsync.rejected,
        updateSyllausTopicByIdAsync.rejected,
        addSyllabusContentAsync.rejected,
        updateSyllabusContentAsync.rejected,
        getSyllausContentByIdAsync.rejected,
        getAllSyllabusContentAsync.rejected,
        getSubjectByMultipleClassBatchAsync.rejected,
        getChapterByMultipleClassBatchSubjectAsync.rejected,
        getTopicByMultipleClassBatchSubjectChapterAsync.rejected,
        getsyllabusTopicStatusAsync.rejected,
        deleteSyllabusContentByIdAsync.rejected,
        updateContentSequenceAsync.rejected
      ),
      (state, action) => {
        state.syllabusLoader = false;
      }
    );
  },
  reducers: {
    emptysyllabusTopic: (state) => initialState,
  },
});
export const { emptysyllabusTopic } = syllabusSlice.actions;

export default syllabusSlice.reducer;
