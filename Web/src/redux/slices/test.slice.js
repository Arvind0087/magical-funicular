import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { getTestInstructionAsync, getchaptersBysubjectIdAsync, getAllTestsAsync, getAllTestOfTestSerisAsync, getAllTestOfMockTestAsync, getTestByUserId, getTestByUserIdAsync, getTestDetailByTestIdAsync, submitTestAsync, getTestAttemptedCountAsync, getScoreSummaryAsync, questionAnalysisAsync, questionTimeAnalysisAsync, timeSpendForTestAsync, getTestReportAsync, testAttemptedAsync, getQuestionByIdAsync, getRelatedQuestionsByIdAsync,createQuizAsync, getExamSummaryAsync, getOwnTestByUserIdAsync, getQuestionByAssignmentIdAsync, assignmentAtttemptedAsync } from "../async.api";

const initialState = {
    testInstructionLoader: false,
    testinstruction: [],
    getChapterLoader: false,
    getchaptersBySubjectId: [],
    getTestsByCategoryLoader:false,
    getTestsByCategory:[],
    getTestByUserId:[],
    getTestByUserIdLoader:false, 
    getOwnTestByUserId:[],
    getOwnTestByUserIdLoader:false,
    getTestDetailLoader: false,
    getTestDetail: {},
    testSubmitLoader : false,
    testSubmitResponce: {},
    createQuizLoader:false,
    createQuizResponse:{},
    getTestAttemptedCount:[],
    getTestAttemptedCountLoader:false,
    getScoreSummaryLoader:false,
    getScoreSummary:{},
    getQuestionAnalysisData:{},
    getQuestionAnalysisLoader:false,
    getQuestionTimeAnalysis:[],
    getQuestionTimeAnalysisLoader:false,
    getTimeSpendForTest:{},
    getTimeSpendForTestLoader:false,
    getTestReportforTest:{},
    getTestReportforTestLoader:false,
    testAttemptedforTest:{},
    testAttemptedforTestLoader:false,
    getQuestionById:{},
    getQuestionByIdLoader:false,
    getRelatedQuestionsById:[],
    getRelatedQuestionsByIdLoader:false,
    getExamSummary:{},
    getExamSummaryLoader:false,
    getAssignmentTestQues:{},
    getAssignmentTestQuesLoader:false
};

export const testSlice = createSlice({
    name: "test",
    initialState,
    extraReducers: (builder) => {
        builder.addMatcher(isAnyOf(getTestInstructionAsync.pending), (state) => {
            state.testInstructionLoader = true;
        });
        builder.addMatcher(isAnyOf(getTestInstructionAsync.fulfilled), (state, action) => {
            state.testinstruction = action?.payload?.data;
            state.testInstructionLoader = false;
        });
        builder.addMatcher(isAnyOf(getTestInstructionAsync.rejected), (state, action) => {
            state.testInstructionLoader = false;
        });
        // get chapter
        builder.addMatcher(isAnyOf(getchaptersBysubjectIdAsync.pending), (state) => {
            state.getChapterLoader = true;
        });
        builder.addMatcher(isAnyOf(getchaptersBysubjectIdAsync.fulfilled), (state, action) => {
            state.getchaptersBySubjectId = action?.payload?.data;
            state.getChapterLoader = false;
        });
        builder.addMatcher(isAnyOf(getchaptersBysubjectIdAsync.rejected), (state, action) => {
            state.getChapterLoader = false;
        });  
        //   get all tests by category=test series
        builder.addMatcher(isAnyOf(getAllTestOfTestSerisAsync.pending), (state) => {
            state.getTestSeriesTestLoader = true;
            state.getTestSeriesTest = [];
        });
        builder.addMatcher(isAnyOf(getAllTestOfTestSerisAsync.fulfilled), (state, action) => {
            state.getTestSeriesTestLoader = false;
            state.getTestSeriesTest = action?.payload?.data;
        });
        builder.addMatcher(isAnyOf(getAllTestOfTestSerisAsync.rejected), (state, action) => {
            state.getTestSeriesTestLoader = false;
            state.getTestSeriesTest = [];
        });
        //   get all tests by category=mock test
        builder.addMatcher(isAnyOf(getAllTestOfMockTestAsync.pending), (state) => {
            state.getMockTestLoader = true;
            state.getMockTest = [];
        });
        builder.addMatcher(isAnyOf(getAllTestOfMockTestAsync.fulfilled), (state, action) => {
            state.getMockTestLoader = false;
            state.getMockTest = action?.payload?.data;
        });
        builder.addMatcher(isAnyOf(getAllTestOfMockTestAsync.rejected), (state, action) => {
            state.getMockTestLoader = false;
            state.getMockTest = []
        });
        // get all test by user id
        builder.addMatcher(isAnyOf(getTestByUserIdAsync.pending), (state) => {
            state.getTestByUserIdLoader = true;
            state.getTestByUserId = [];
        });
        builder.addMatcher(isAnyOf(getTestByUserIdAsync.fulfilled), (state, action) => {
            state.getTestByUserIdLoader = false;
            state.getTestByUserId = action?.payload;
        });
        builder.addMatcher(isAnyOf(getTestByUserIdAsync.rejected), (state, action) => {
            state.getTestByUserIdLoader = false;
            state.getTestByUserId = []
        });
        // get test all details by test id
        builder.addMatcher(isAnyOf(getTestDetailByTestIdAsync.pending), (state) => {
            state.getTestDetailLoader = true;
            state.getTestDetail = {};
        });
        builder.addMatcher(isAnyOf(getTestDetailByTestIdAsync.fulfilled), (state, action) => {
            state.getTestDetailLoader = false;
            state.getTestDetail = action?.payload?.data || {};
        });
        builder.addMatcher(isAnyOf(getTestDetailByTestIdAsync.rejected), (state, action) => {
            state.getTestDetailLoader = false;
            state.getTestDetail = {}
        });
         // get  assignment test questions
         builder.addMatcher(isAnyOf(getQuestionByAssignmentIdAsync.pending), (state) => {
            state.getTestDetailLoader = true;
            state.getTestDetail = {};
        });
        builder.addMatcher(isAnyOf(getQuestionByAssignmentIdAsync.fulfilled), (state, action) => {
            state.getTestDetailLoader = false;
            state.getTestDetail = action?.payload?.data || {};
        });
        builder.addMatcher(isAnyOf(getQuestionByAssignmentIdAsync.rejected), (state, action) => {
            state.getTestDetailLoader = false;
            state.getAssignmentTgetTestDetailestQues = {}
        });
        //submit test
        builder.addMatcher(isAnyOf(submitTestAsync.pending), (state) => {
            state.testSubmitLoader = true;
            state.testSubmitResponce = {};
        });
        builder.addMatcher(isAnyOf(submitTestAsync.fulfilled), (state, action) => {
            state.testSubmitLoader = false;
            state.testSubmitResponce = action?.payload?.data || {};
        });
        builder.addMatcher(isAnyOf(submitTestAsync.rejected), (state, action) => {
            state.testSubmitLoader = false;
            state.testSubmitResponce = {}
        });
        // attemptCount
        builder.addMatcher(isAnyOf(getTestAttemptedCountAsync.pending), (state) => {
            state.getTestAttemptedCountLoader = true;
            state.getTestAttemptedCount = {};
        });
        builder.addMatcher(isAnyOf(getTestAttemptedCountAsync.fulfilled), (state, action) => {
            state.getTestAttemptedCountLoader = false;
            state.getTestAttemptedCount = action?.payload?.data || {};
        });
        builder.addMatcher(isAnyOf(getTestAttemptedCountAsync.rejected), (state, action) => {
            state.getTestAttemptedCountLoader = false;
            state.getTestAttemptedCount = {}
        });
        // score summary
        builder.addMatcher(isAnyOf(getScoreSummaryAsync.pending), (state) => {
            state.getTestAttemptedCountLoader = true;
            state.getScoreSummary = {};
        });
        builder.addMatcher(isAnyOf(getScoreSummaryAsync.fulfilled), (state, action) => {
            state.getTestAttemptedCountLoader = false;
            state.getScoreSummary = action?.payload?.data || {};
        });
        builder.addMatcher(isAnyOf(getScoreSummaryAsync.rejected), (state, action) => {
            state.getTestAttemptedCountLoader = false;
            state.getScoreSummary = {}
        });
        // question analysis
        builder.addMatcher(isAnyOf(questionAnalysisAsync.pending), (state) => {
            state.getQuestionAnalysisLoader = true;
            state.getQuestionAnalysisData = {};
        });
        builder.addMatcher(isAnyOf(questionAnalysisAsync.fulfilled), (state, action) => {
            state.getQuestionAnalysisLoader = false;
            state.getQuestionAnalysisData = action?.payload?.data || {};
        });
        builder.addMatcher(isAnyOf(questionAnalysisAsync.rejected), (state, action) => {
            state.getQuestionAnalysisLoader = false;
            state.getQuestionAnalysisData = {}
        });
        // question analysis for table data
        builder.addMatcher(isAnyOf(questionTimeAnalysisAsync.pending), (state) => {
            state.getQuestionTimeAnalysisLoader = true;
            state.getQuestionTimeAnalysis = {};
        });
        builder.addMatcher(isAnyOf(questionTimeAnalysisAsync.fulfilled), (state, action) => {
            state.getQuestionTimeAnalysisLoader = false;
            state.getQuestionTimeAnalysis = action?.payload?.data || {};
        });
        builder.addMatcher(isAnyOf(questionTimeAnalysisAsync.rejected), (state, action) => {
            state.getQuestionTimeAnalysisLoader = false;
            state.getQuestionTimeAnalysis = {}
        });
        // time spend
        builder.addMatcher(isAnyOf(timeSpendForTestAsync.pending), (state) => {
            state.getTimeSpendForTestLoader = true;
            state.getTimeSpendForTest = {};
        });
        builder.addMatcher(isAnyOf(timeSpendForTestAsync.fulfilled), (state, action) => {
            state.getTimeSpendForTestLoader = false;
            state.getTimeSpendForTest = action?.payload?.data || {};
        });
        builder.addMatcher(isAnyOf(timeSpendForTestAsync.rejected), (state, action) => {
            state.getTimeSpendForTestLoader = false;
            state.getTimeSpendForTest = {}
        });
        // Test Report
        builder.addMatcher(isAnyOf(getTestReportAsync.pending), (state) => {
            state.getTestReportforTestLoader = true;
            state.getTestReportforTest = {};
        });
        builder.addMatcher(isAnyOf(getTestReportAsync.fulfilled), (state, action) => {
            state.getTestReportforTestLoader = false;
            state.getTestReportforTest = action?.payload?.data || {};
        });
        builder.addMatcher(isAnyOf(getTestReportAsync.rejected), (state, action) => {
            state.getTestReportforTestLoader = false;
            state.getTestReportforTest = {}
        });
         // Test Report
         builder.addMatcher(isAnyOf(testAttemptedAsync.pending), (state) => {
            state.testAttemptedforTestLoader = true;
            state.testAttemptedforTest = {};
        });
        builder.addMatcher(isAnyOf(testAttemptedAsync.fulfilled), (state, action) => {
            state.testAttemptedforTestLoader = false;
            state.testAttemptedforTest = action?.payload?.data || {};
        });
        builder.addMatcher(isAnyOf(testAttemptedAsync.rejected), (state, action) => {
            state.testAttemptedforTestLoader = false;
            state.testAttemptedforTest = {}
        });
        // assignmet test report
        builder.addMatcher(isAnyOf(assignmentAtttemptedAsync.pending), (state) => {
            state.testAttemptedforTestLoader = true;
            state.testAttemptedforTest = {};
        });
        builder.addMatcher(isAnyOf(assignmentAtttemptedAsync.fulfilled), (state, action) => {
            state.testAttemptedforTestLoader = false;
            state.testAttemptedforTest = action?.payload?.data || {};
        });
        builder.addMatcher(isAnyOf(assignmentAtttemptedAsync.rejected), (state, action) => {
            state.testAttemptedforTestLoader = false;
            state.testAttemptedforTest = {}
        });
        // GET QUESTION BY ID
        builder.addMatcher(isAnyOf(getQuestionByIdAsync.pending), (state) => {
            state.getQuestionByIdLoader = true;
            state.getQuestionById = {};
        });
        builder.addMatcher(isAnyOf(getQuestionByIdAsync.fulfilled), (state, action) => {
            state.getQuestionByIdLoader = false;
            state.getQuestionById = action?.payload?.data || {};
        });
        builder.addMatcher(isAnyOf(getQuestionByIdAsync.rejected), (state, action) => {
            state.getQuestionByIdLoader = false;
            state.getQuestionById = {}
        });
        // GET RELATED QUESTION BY QUES ID
        builder.addMatcher(isAnyOf(getRelatedQuestionsByIdAsync.pending), (state) => {
            state.getRelatedQuestionsByIdLoader = true;
            state.getRelatedQuestionsById = [];
        });
        builder.addMatcher(isAnyOf(getRelatedQuestionsByIdAsync.fulfilled), (state, action) => {
            state.getRelatedQuestionsByIdLoader = false;
            state.getRelatedQuestionsById = action?.payload?.data || [];
        });
        builder.addMatcher(isAnyOf(getRelatedQuestionsByIdAsync.rejected), (state, action) => {
            state.getRelatedQuestionsByIdLoader = false;
            state.getRelatedQuestionsById = []
        });
        //create test
        builder.addMatcher(isAnyOf(createQuizAsync.pending), (state) => {
            state.createQuizLoader = true;
            state.createQuizResponse = {};
        });
        builder.addMatcher(isAnyOf(createQuizAsync.fulfilled), (state, action) => {
            state.createQuizLoader = false;
            state.createQuizResponse = action?.payload?.data || {};
        });
        builder.addMatcher(isAnyOf(createQuizAsync.rejected), (state, action) => {
            state.createQuizLoader = false;
            state.createQuizResponse = {}
        });
        // exam summary popup data
        // /getExamSummary
        builder.addMatcher(isAnyOf(getExamSummaryAsync.pending), (state) => {
            state.getExamSummaryLoader = true;
            state.getExamSummary = {};
        });
        builder.addMatcher(isAnyOf(getExamSummaryAsync.fulfilled), (state, action) => {
            state.getExamSummaryLoader = false;
            state.getExamSummary = action?.payload?.data || {};
        });
        builder.addMatcher(isAnyOf(getExamSummaryAsync.rejected), (state, action) => {
            state.getExamSummaryLoader = false;
            state.getExamSummary = {}
        });
        // get Own test
         builder.addMatcher(isAnyOf(getOwnTestByUserIdAsync.pending), (state) => {
            state.getOwnTestByUserIdLoader = true;
            state.getOwnTestByUserId = [];
        });
        builder.addMatcher(isAnyOf(getOwnTestByUserIdAsync.fulfilled), (state, action) => {
            state.getOwnTestByUserIdLoader = false;
            state.getOwnTestByUserId = action?.payload?.data || [];
        });
        builder.addMatcher(isAnyOf(getOwnTestByUserIdAsync.rejected), (state, action) => {
            state.getOwnTestByUserIdLoader = false;
            state.getOwnTestByUserId = []
        });
    },

    //   reducers: {
    //     emptyotp: (state) => {
    //       return {
    //         ...initialState,
    //       };
    //     },
    //   },
});

// export const { emptyotp } = verifyOtpSlice.actions;

export default testSlice.reducer;