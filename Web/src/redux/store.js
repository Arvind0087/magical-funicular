import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

//IMPORTED ADMIN LOGIN SLICE
import loginSlice from "./slices/login.slice";
//IMPORTED ALL MASTER SLICES
import coursesSlice from "./slices/course.slice";
import boardsSlice from "./slices/boards.slice";
import classSlice from "./slices/class.slice";
import batchSlice from "./slices/batch.slice";
import batchdateSlice from "./slices/batchdate.slice";
import subjectSlice from "./slices/subject.slice";
import chapterSlice from "./slices/chapter.slice";
//IMPORTED STUDENT SLICE
import studentSlice from "./slices/student.slice";
//IMPORTED BANNER SLICE
import bannerSlice from "./slices/banner.slice";
//IMPORTED ERROR SLICE
import errorSlice from "./slices/error.slice";
import teacherSlice from "./slices/teacher.slice";
import signupSlice from "./slices/signup.slice";
import generateOtpSlice from "./slices/generateOtp.slice";
import createFeedbackSlice from "./slices/feedback.slice";
import faqsSlice from "./slices/faqs.slice";
import shortsSlice from "./slices/shorts.slice";
import completeProfileSlice from "./slices/completeProfileSlice";
import packageSlice from "./slices/package.slice";
import loginwithUserIdSlice from "./slices/loginWithUserId.slice";
import registerSlice from "./register/register.slice";
import userInfoSlice from "./loggedInInfo/loggedIn.slice";
import dashboardSlice from "./slices/dashboard.slice";
import assignmentSlice from "./slices/assignment.slice";
import subscriptionSlice from "./slices/subscription.slice";
import chapterAsyncSlice from "./chapter/chapter.slice";
import syllabusSlice from "./syllabus/syllabus.slice";
import doubtsSlice from "./slices/doubt.slice";
import chapterTopicsCountSlice from "./Revision/chapterTopicsCount.slice";
import revisionSlice from "./Revision/revision.slice";
import revisionBookMarkSlice from "./Revision/revisionBookMark.slice";
import bookmarkSlice from "./slices/bookmark.slice";
import mentorshipHelpSlice from "./mentorship/mentorship.slice";
import getStateAndCitySlice from "./cityAndState/cityAndSate.slice";
import uploadAvatarSlice from "./slices/uploadAvatar.slice";
import wantToBeSlice from "./slices/wantToBe.slice";
import updateStudentSlice from "./slices/updateStudent.slice";
import requestCallbackSlice from "./slices/requestCallback.slice";
import testSlice from "./slices/test.slice";
import liveSlice from "./slices/live.slice";
import scheduleSlice from "./slices/schedule.slice";
import getOnlySiteSettingSlice from "./slices/getOnlySiteSetting.slice";
import scholarshipSlice from "./slices/scholarship.slice";
import bookmarkAsyncSlice from "./bookmark/bookmark.slice";
import OrderDetailSlice from "./slices/order.slice";
import activitySlice from "./slices/activity.slice";
import notificationSlice from "./slices/notification.slice";
import userLeaderBoardSlice from "./slices/leaderBoard.slice";
import ratingSlice from "./slices/rating.slice";
import deactivateUserSlice from "./slices/inactiveUser.slice";
import liveChatSlice from "./slices/livechat.slice";
import freeLiveClassSlice from "../redux/freeliveClass/freeliveClass.slice";
import phonepeSlice from "../redux/payment/phonepe.slice";
import freeResourceSlice from "../redux/freeResource/freeResource.slice";
import activeSlice from "../redux/dashboard/dashboard.slice";

const persistConfig = {
  key: "root",
  storage,
};

const combinedReducer = combineReducers({
  phonepe: phonepeSlice,
  bookmark: bookmarkAsyncSlice,
  syllabusAsy: syllabusSlice,
  chapterAsy: chapterAsyncSlice,
  register: registerSlice,
  userInfo: userInfoSlice,
  login: loginSlice,
  course: coursesSlice,
  board: boardsSlice,
  class: classSlice,
  batch: batchSlice,
  batchdate: batchdateSlice,
  subject: subjectSlice,
  chapter: chapterSlice,
  student: studentSlice,
  banner: bannerSlice,
  error: errorSlice,
  teachers: teacherSlice,
  signup: signupSlice,
  generateOtp: generateOtpSlice,
  createFeedback: createFeedbackSlice,
  allFaqs: faqsSlice,
  shorts: shortsSlice,
  assignment: assignmentSlice,
  dashboard: dashboardSlice,
  packages: packageSlice,
  completeProfile: completeProfileSlice,
  loginWithUserId: loginwithUserIdSlice,
  subscription: subscriptionSlice,
  doubt: doubtsSlice,
  chapterTopicsCount: chapterTopicsCountSlice,
  revision: revisionSlice,
  revisionBookmark: revisionBookMarkSlice,
  bookmarked: bookmarkSlice,
  mentorshipHelp: mentorshipHelpSlice,
  StateAndCity: getStateAndCitySlice,
  uploadAvatar: uploadAvatarSlice,
  wantToBe: wantToBeSlice,
  updateStudent: updateStudentSlice,
  requestCallback: requestCallbackSlice,
  test: testSlice,
  live: liveSlice,
  freeLive: freeLiveClassSlice,
  liveChat: liveChatSlice,
  schedule: scheduleSlice,
  scholarshipTest: scholarshipSlice,
  deactivateUser: deactivateUserSlice,
  getOnlySiteSetting: getOnlySiteSettingSlice,
  orderDetail: OrderDetailSlice,
  activity: activitySlice,
  notification: notificationSlice,
  userLeaderBoard: userLeaderBoardSlice,
  rating: ratingSlice,
  freeResource: freeResourceSlice,
  activatUser: activeSlice,
});

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT") {
    state = undefined;
    storage.removeItem("persist:root");
    localStorage.removeItem("persist:root");
  }
  return combinedReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
});
