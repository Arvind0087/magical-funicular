import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "./AxiosClient";

export const generateOtpAsync = createAsyncThunk(
  "users/generateOTP",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/generateOTP`, payload, toolkit);
  }
);
export const verifyOtpAsync = createAsyncThunk(
  "users/verifyOTP",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/verifyOTP`, payload, toolkit).then(
      (response) => {
        return response;
      }
    );
  }
);
export const loginWithUserIdAsync = createAsyncThunk(
  "users/loginWithUserId",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/loginWithUserId`, payload, toolkit).then(
      (response) => {
        return response;
      }
    );
  }
);
export const createFeedbackAsync = createAsyncThunk(
  "users/createFeedback",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createFeedback`, payload, toolkit);
  }
);
export const getAllFaqsAsync = createAsyncThunk(
  "user/getAllFAqs",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllFaq?page=1&limit=&type=${payload.type}`,
      payload,
      toolkit
    );
  }
);
export const getFaqByIdAsync = createAsyncThunk(
  "user/getFaqById",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getFaqById/1`, payload, toolkit);
  }
);
export const getAllBannerByTypeAsync = createAsyncThunk(
  "user/getAllBannerByType",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllBannerByType?type=${payload.type}`,
      payload,
      toolkit
    );
  }
);

export const getAssignmentsByStudentIdAsync = createAsyncThunk(
  "user/getAssignmentsByStudentId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getAssignmentsByStudentId`,
      payload,
      toolkit
    );
  }
);
export const getAllCoursesAsync = createAsyncThunk(
  "user/getAllCourses",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllCourses`, payload, toolkit);
  }
);
export const getClassByBoardIdAsync = createAsyncThunk(
  "user/getClassByBoardId",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getClassByBoardId`, payload, toolkit);
  }
);
export const getBatchDateByBatchTypeIdAsync = createAsyncThunk(
  "user/getBatchDateByBatchTypeId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getBatchDateByBatchTypeId`,
      payload,
      toolkit
    );
  }
);
export const getSubjectsAsync = createAsyncThunk(
  "user/getAllSubjects",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllSubjects`, payload, toolkit);
  }
);
export const getAllShortsAsync = createAsyncThunk(
  "user/getAllShorts",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllShorts`, payload, toolkit);
  }
);
export const likeShortsAsync = createAsyncThunk(
  "user/likeShorts",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/likeDislikeShorts`, payload, toolkit);
  }
);
export const dislikeShortsAsync = createAsyncThunk(
  "user/dislike",
  async (payload, toolkit) => {
    return await AxiosClient("DELETE", `/likeDislikeShorts`, payload, toolkit);
  }
);
export const getAllLikeShortsByStudentIdAsync = createAsyncThunk(
  "user/getAllLikeShortsByStudentId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getAllLikeShortsByStudentId`,
      payload,
      toolkit
    );
  }
);
export const adminsignupAsync = createAsyncThunk(
  "admin/adminsignup",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/adminsignup`, payload, toolkit);
  }
);
export const getOneShortsByStudentIdAsync = createAsyncThunk(
  "admin/getOneShortsByStudentId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getOneShortsByStudentId`,
      payload,
      toolkit
    );
  }
);
export const getcourseAsync = createAsyncThunk(
  "admin/getcourse",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllCourses?page=${payload.page}&limit=${payload.limit}`,
      [],
      toolkit
    );
  }
);
export const getloginAsync = createAsyncThunk(
  "admin/adminlogin",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/adminLoginWithEmail`, payload, toolkit);
  }
);
export const getstudentAsync = createAsyncThunk(
  "admin/getAllstudents",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllstudents?page=${payload.page}&limit=${payload.limit}`,
      [],
      toolkit
    );
  }
);
export const getStudentByIdAsync = createAsyncThunk(
  "admin/getStudentById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getStudentById?userId=${payload?.userId}&batchTypeId=${payload?.batchTypeId}`,
      [],
      toolkit
    );
  }
);
export const getAllUserDetails = createAsyncThunk(
  "admin/getAllUserDetails",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllUserDetails/${payload}`,
      [],
      toolkit
    );
  }
);
export const getpackagebyidAsync = createAsyncThunk(
  "admin/getPackagesById",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getPackagesById/${payload}`, [], toolkit);
  }
);
export const getCoursebystudentidAsync = createAsyncThunk(
  "admin/getCourseByStudentId",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getCourseByStudentId`, [], toolkit);
  }
);
export const createcourseAsync = createAsyncThunk(
  "admin/createcourse",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createCourse`, payload, toolkit);
  }
);
export const getcoursebyidAsync = createAsyncThunk(
  "admin/getcoursebyid",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getCourseById/${payload}`, [], toolkit);
  }
);
export const updatecoursebyidAsync = createAsyncThunk(
  "admin/updatecoursebyid",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PUT",
      `/updatedCourseById/${payload.id}`,
      payload,
      toolkit
    );
  }
);
export const getclassAsync = createAsyncThunk(
  "admin/getclass",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllClasses?page=${payload.page}&limit=${payload.limit}`,
      payload,
      toolkit
    );
  }
);
export const createClassAsync = createAsyncThunk(
  "admin/createClass",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createClass`, payload, toolkit);
  }
);
export const getClassByIdAsync = createAsyncThunk(
  "admin/getClassById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getClassById/${payload}`,
      payload,
      toolkit
    );
  }
);
export const updateClassByIdAsync = createAsyncThunk(
  "admin/updateClassById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateClassById`, payload, toolkit);
  }
);
export const getClassByBoardAndCourseIdAsync = createAsyncThunk(
  "admin/getClassByBoardAndCourseId",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getClassByBoardId`, payload, toolkit);
  }
);
export const getAllBatchTypes = createAsyncThunk(
  "admin/getbatch",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllBatchTypes?page=${payload.page}&limit=${payload.limit}`,
      [],
      toolkit
    );
  }
);
export const createbatchTypesAsync = createAsyncThunk(
  "admin/createbatch",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addBatchType`, payload, toolkit);
  }
);
export const getBatchTypeByIdAsync = createAsyncThunk(
  "admin/getBatchTypeById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getBatchTypeById/${payload}`,
      [],
      toolkit
    );
  }
);
export const updatedBatchTypeByIdAsync = createAsyncThunk(
  "admin/updatedBatchTypeById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updatedBatchTypeById`, payload, toolkit);
  }
);
export const getBatchByCourseBoardClassAsync = createAsyncThunk(
  "admin/getBatchTypeByClassId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getBatchTypeByClassId`,
      payload,
      toolkit
    );
  }
);
export const getboardAsync = createAsyncThunk(
  "admin/getboard",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllBoards?page=${payload.page}&limit=${payload.limit}`,
      [],
      toolkit
    );
  }
);
export const createBoardAsync = createAsyncThunk(
  "admin/createBoard",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createBoard`, payload, toolkit);
  }
);
export const getBoardByIdAsync = createAsyncThunk(
  "admin/getBoardById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getBoardById/${payload}`,
      payload,
      toolkit
    );
  }
);
export const updatBoardByIdAsync = createAsyncThunk(
  "admin/updatBoardById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PUT",
      `/updateBoardById/${payload.id}`,
      payload,
      toolkit
    );
  }
);
export const getBoardsByCourseIdAsync = createAsyncThunk(
  "admin/getBoardsByCourseId",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getBoardsByCourseId`, payload, toolkit);
  }
);
export const getNewShortsByStudentIdAsync = createAsyncThunk(
  "user/getShortsByStudentId",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getShortsByStudentId`, payload, toolkit);
  }
);
export const getShortsByStudentIdAsync = createAsyncThunk(
  "admin/getShortsByStudentId",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getShortsByStudentId`, payload, toolkit);
  }
);
export const getNextShortsAsync = createAsyncThunk(
  "user/getNextShorts",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getNextShorts?studentId=${payload.studentId}&shortsId=${payload.shortsId}`,
      [],
      toolkit
    );
  }
);
export const getPreviousShortsAsync = createAsyncThunk(
  "user/getPreviousShorts",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getPreviousShorts?studentId=${payload.studentId}&shortsId=${payload.shortsId}`,
      [],
      toolkit
    );
  }
);
export const getSubjectsByStudentAsync = createAsyncThunk(
  "web/getSubjectsByStudent",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/subjectChapterCount`, payload, toolkit);
  }
);
export const getSubjectByBatchTypeIdAsync = createAsyncThunk(
  "admin/getSubjectByBatchTypeId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getSubjectByBatchTypeId`,
      payload,
      toolkit
    );
  }
);
export const getAllSubjectsAsync = createAsyncThunk(
  "admin/getAllSubjects",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllSubjects?page=${payload.page}&limit=${payload.limit}`,
      [],
      toolkit
    );
  }
);
export const addsubjectAsync = createAsyncThunk(
  "admin/addSubject",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addSubject`, payload, toolkit);
  }
);
export const getSubjectByIdAsync = createAsyncThunk(
  "admin/getSubjectById",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getSubjectById/${payload}`, [], toolkit);
  }
);
export const updatedSubjectByIdAsync = createAsyncThunk(
  "admin/updatedSubjectById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updatedSubjectById`, payload, toolkit);
  }
);
export const getChapterByIdAsync = createAsyncThunk(
  "admin/getChapterByIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getChapterById/${payload}`, [], toolkit);
  }
);
export const updateChapterAsync = createAsyncThunk(
  "admin/updateChapterAsync",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateChapterById`, payload, toolkit);
  }
);
export const getAllChaptersAsync = createAsyncThunk(
  "admin/getAllChapters",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllChapters?page=${payload.page}&limit=${payload.limit}`,
      [],
      toolkit
    );
  }
);
export const addChapterAsync = createAsyncThunk(
  "admin/addChapter",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addChapter`, payload, toolkit);
  }
);
export const addBatchDateAsync = createAsyncThunk(
  "admin/addBatchDate",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addBatchDate`, payload, toolkit);
  }
);
export const getBatchDateByIdAsync = createAsyncThunk(
  "admin/getBatchDateById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getBatchDateById/${payload}`,
      [],
      toolkit
    );
  }
);
export const updatedBatchDateByIdAsync = createAsyncThunk(
  "admin/updatedBatchDateById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updatedBatchDateById`, payload, toolkit);
  }
);
export const getAllBatchDatesAsync = createAsyncThunk(
  "admin/getAllBatchDates",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllBatchDates?page=${payload.page}&limit=${payload.limit}`,
      [],
      toolkit
    );
  }
);
export const getAllBannerAsync = createAsyncThunk(
  "admin/getAllBanner",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllBanner?page=${payload.page}&limit=${payload.limit}`,
      [],
      toolkit
    );
  }
);
export const getBannerByIdAsync = createAsyncThunk(
  "admin/getBannerById",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getBannerById/${payload}`, [], toolkit);
  }
);
export const createBannerAsync = createAsyncThunk(
  "admin/createBanner",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createBanner`, payload, toolkit);
  }
);
export const updateBannerAsync = createAsyncThunk(
  "admin/updateBanner",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateBannerById`, payload, toolkit);
  }
);
export const getAllTeachersAsync = createAsyncThunk(
  "admin/getAllTeacher",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllTeacher?page=${payload.page}&limit=${payload.limit}`,
      [],
      toolkit
    );
  }
);
export const getTeacherByIdAsync = createAsyncThunk(
  "admin/getTeacherById",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getTeacherById/${payload}`, [], toolkit);
  }
);
export const updateTeacherByIdAsync = createAsyncThunk(
  "admin/updateTeacherById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PATCH",
      `/updateTeacherById/${payload.id}`,
      payload,
      toolkit
    );
  }
);
export const deactivateUserByIdAsync = createAsyncThunk(
  "admin/deactivateUserById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PATCH",
      `/inactiveUser/${payload.id}`,
      payload,
      toolkit
    );
  }
);
export const getProductByIdAsync = createAsyncThunk(
  "user/getProductsById",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getProductsById/${payload}`, [], toolkit);
  }
);
export const getClassByBatchIdAsync = createAsyncThunk(
  "user/classList",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/packageList`, payload, toolkit);
  }
);
export const getBatchTypeByClassIdAsync = createAsyncThunk(
  "user/BatchTypeList",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/packageList`, payload, toolkit);
  }
);
export const getBatchStartDateByBatchTypeIdAsync = createAsyncThunk(
  "user/batchStartDateList",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/packageList`, payload, toolkit);
  }
);
export const getFinalPackagePriceByAllIdAsync = createAsyncThunk(
  "user/finalPackageList",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/packageList`, payload, toolkit);
  }
);
export const getDoubtByStudentIdAsync = createAsyncThunk(
  "user/getDoubtByStudentId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getDoubtByStudentId/${payload?.id}`,
      payload,
      toolkit
    );
  }
);

export const getAllDoubtOfStudentsAsync = createAsyncThunk(
  "user/getAllDoubtOfStudent",
  async (
    payload,
    { dispatch, rejectWithValue, fulfillWithValue, getState }
  ) => {
    return await AxiosClient(
      "GET",
      `/getAllDoubtOfStudent?page=${payload.page}&limit=${payload.limit}`,
      payload,
      {
        dispatch,
        rejectWithValue,
        fulfillWithValue,
        getState,
      }
    );
  }
);

export const getDoubtByIdAsync = createAsyncThunk(
  "user/getDoubtById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getDoubtById/${payload}`,
      payload,
      toolkit
    );
  }
);

export const createDoubtAsync = createAsyncThunk(
  "user/createDoubt",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createDoubt`, payload, toolkit);
  }
);

export const createReplyAsync = createAsyncThunk(
  "user/postReply",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/postReply`, payload, toolkit);
  }
);

// get bookmarked ques....
export const getAllbookmarkedQueAsync = createAsyncThunk(
  "user/getAllBookmark",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getAllBookmark`, payload, toolkit);
  }
);
export const getTestInstructionAsync = createAsyncThunk(
  "user/getSettingByType",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getSettingByType?type=${payload.type}`,
      [],
      toolkit
    );
  }
);
export const getchaptersBysubjectIdAsync = createAsyncThunk(
  "user/getChapterBySubjectId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getChapterBySubjectId`,
      payload,
      toolkit
    );
  }
);
export const getAllTestOfTestSerisAsync = createAsyncThunk(
  "user/getAllTestOfTestSerisAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllTest?category=${payload?.category}`,
      payload,
      toolkit
    );
  }
);
export const getAllTestOfMockTestAsync = createAsyncThunk(
  "user/getAllTestOfMockTestAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllTest?category=${payload?.category}`,
      payload,
      toolkit
    );
  }
);
export const uploadAvatarAsync = createAsyncThunk(
  "user/uploadAvatar",
  async (payload, toolkit) => {
    return await AxiosClient("PATCH", `/uploadAvatar`, payload, toolkit);
  }
);
export const getAllWantToBeAsync = createAsyncThunk(
  "user/getAllWantToBe",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllWantToBe`, payload, toolkit);
  }
);
export const getWantToBeByIdAsync = createAsyncThunk(
  "user/getWantToBeById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getWantToBeById/${payload.id}`,
      payload,
      toolkit
    );
  }
);

export const getPackageByUserIdAsync = createAsyncThunk(
  "user/getPackageByUserId",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getPackageByUserId`, payload, toolkit);
  }
);

export const getAllCoursesForWebAppAsync = createAsyncThunk(
  "user/getAllCoursesForWebApp",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllCoursesForWebApp`,
      payload,
      toolkit
    );
  }
);
export const getBoardsByCourseIdForWebAppAsync = createAsyncThunk(
  "admin/getBoardsByCourseIdForWebApp",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getBoardsByCourseIdForWebApp`,
      payload,
      toolkit
    );
  }
);
export const getClassByBoardIdForWebAppAsync = createAsyncThunk(
  "user/getClassByBoardIdForWebApp",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getClassByBoardIdForWebApp`,
      payload,
      toolkit
    );
  }
);
export const getBatchTypeByClassIdForWebAppAsync = createAsyncThunk(
  "admin/getBatchTypeByClassIdForWebApp",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getBatchTypeByClassIdForWebApp`,
      payload,
      toolkit
    );
  }
);

export const getBatchsByLanguageForWebAppAsync = createAsyncThunk(
  "admin/getBatchsByLanguageForWebApp",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getBatchsByLanguageForWebApp`,
      payload,
      toolkit
    );
  }
);

export const updateStudentByIdAsync = createAsyncThunk(
  "user/updateStudentById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PATCH",
      `/updateStudentById/${payload.id}`,
      payload,
      toolkit
    );
  }
);
export const createRequestCallAsync = createAsyncThunk(
  "user/createRequestCall",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createRequestCall`, payload, toolkit);
  }
);
export const getBatchDateByBatchTypeIdForWebAppAsync = createAsyncThunk(
  "user/getBatchDateByBatchTypeIdForWebApp",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getBatchDateByBatchTypeIdForWebApp`,
      payload,
      toolkit
    );
  }
);
export const getSelectedSubjectsAsync = createAsyncThunk(
  "user/getSelectedSubjectsAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/subjectWithChapterCount`,
      payload,
      toolkit
    );
  }
);
export const getcountBookmarkAsync = createAsyncThunk(
  "user/countBookmark",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/countBookmark`, payload, toolkit);
  }
);
export const getAllOnlyForYouAsync = createAsyncThunk(
  "user/getAllOnlyForYou",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllOnlyForYou`, payload, toolkit);
  }
);
export const createTestByStudentAsync = createAsyncThunk(
  "user/createTestByStudent",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createTestByStudent`, payload, toolkit);
  }
);

export const getAllEventByStudentIdAsync = createAsyncThunk(
  "user/getAllEventByStudentId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllEventByStudentId?day=${payload.day}&batchTypeId=${payload.batchTypeId}&date=${payload?.date}&packageId=${payload?.packageId}`,
      [],
      toolkit
    );
  }
);

export const getAllSchedulesAsync = createAsyncThunk(
  "user/getAllSchedules",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllSchedules`, [], toolkit);
  }
);

export const getLiveEventByIdAsync = createAsyncThunk(
  "admin/getLiveEventById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getLiveEventById/${payload?.id}`,
      [],
      toolkit
    );
  }
);

export const getEventByEventIdAsync = createAsyncThunk(
  "admin/getEventByEventId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getEventByEventId/${payload?.id}`,
      [],
      toolkit
    );
  }
);

export const getAllEventByStudentStatusIdAsync = createAsyncThunk(
  "user/getAllEventByStudentId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllEventByStudentId?status=${payload.status}&batchTypeId=${payload.batchTypeId}`,
      [],
      toolkit
    );
  }
);

export const createScheduleAsync = createAsyncThunk(
  "admin/createSchedule",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/CreateTeacherSchedule`,
      payload,
      toolkit
    );
  }
);

export const joinLiveClassAsync = createAsyncThunk(
  "admin/joinLiveClass",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/joinLiveClass`, payload, toolkit);
  }
);

export const watchingLiveClassAsync = createAsyncThunk(
  "admin/watchingLiveClass",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/watchingLiveClass`, payload, toolkit);
  }
);

// export const watchingLiveClassAsync = createAsyncThunk(
//   "admin/watchingLiveClass",
//   async (payload, toolkit) => {
//     return await AxiosClient("POST", `/watchingLiveClass`, payload, toolkit);
//   }
// );

export const getEventByStatusAsync = createAsyncThunk(
  "admin/getEventByStatus",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getEventByStatus?status=${payload.status}`,
      [],
      toolkit
    );
  }
);

export const getScheduleByTeacherIdAsync = createAsyncThunk(
  "admin/getScheduleByTeacherId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllScheduleByTeacherId?page=${payload.page}&limit=${payload.limit}&teacherId=${payload.id}`,
      [],
      toolkit
    );
  }
);
export const getScheduleByTeacherIdCalenderAsync = createAsyncThunk(
  "admin/getAllEventByTeacherId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllEventByTeacherId?teacherId=${payload.teacherId}&date=${payload.date}`,
      [],
      toolkit
    );
  }
);
export const getScholarshipClassByUserIdAsync = createAsyncThunk(
  "user/getScholarshipClassByUserId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getScholarshipClassByUserId?userId=${payload.userId}`,
      payload,
      toolkit
    );
  }
);
export const getAllHighlightAsync = createAsyncThunk(
  "user/getAllHighlight",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllHighlight`, payload, toolkit);
  }
);
export const getAllStaffDetailsBySubjectIdAsync = createAsyncThunk(
  "user/getAllStaffDetailsBySubjectId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllStaffDetailsBySubjectId?subjectId=${payload.subjectId}`,
      payload,
      toolkit
    );
  }
);
export const getTestByUserIdAsync = createAsyncThunk(
  "user/getTestByUserId",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getTestByUserId`, payload, toolkit);
  }
);
export const getAllScheduleOfMonthByTeacherIdAsync = createAsyncThunk(
  "user/getAllScheduleOfMonthByTeacherId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllScheduleOfMonthByTeacherId?teacherId=${payload.teacherId}`,
      payload,
      toolkit
    );
  }
);
export const getTeacherScheduleSlotsAsync = createAsyncThunk(
  "user/getScheduleByTeacherId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getScheduleByTeacherId`,
      payload,
      toolkit
    );
  }
);
export const getAllReminderTimeAsync = createAsyncThunk(
  "user//getAllReminderTime",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getAllReminderTime`, payload, toolkit);
  }
);
export const createEventRequestAsync = createAsyncThunk(
  "user/createEventRequest",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createEventRequest`, payload, toolkit);
  }
);
export const getOnlySiteSettingAsync = createAsyncThunk(
  "user/getOnlySiteSetting",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getOnlySiteSetting`, payload, toolkit);
  }
);
export const applyScholarshipAsync = createAsyncThunk(
  "user/applyScholarship",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/applyScholarship`, payload, toolkit);
  }
);

// get test details by test id
export const getTestDetailByTestIdAsync = createAsyncThunk(
  "user/getTestQuestions",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getTestQuestions?${payload.type}=${payload.id}`,
      null,
      toolkit
    );
  }
);
// get assignment ques in start test page
export const getQuestionByAssignmentIdAsync = createAsyncThunk(
  "user/getQuestionByAssignmentId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getQuestionByAssignmentId/${payload.testId}`,
      null,
      toolkit
    );
  }
);

// submit test.
export const submitTestAsync = createAsyncThunk(
  "user/submitTest",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/submitTest`, payload, toolkit);
  }
);
// /getAllowedSessionByUserId
export const getAllowedSessionByUserIdAsync = createAsyncThunk(
  "user/getAllowedSessionByUserId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllowedSessionByUserId?userId=${payload.userId}`,
      payload,
      toolkit
    );
  }
);

export const getStudentAllOrderBytIdAsync = createAsyncThunk(
  "user/getStudentAllOrderById",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getStudentAllOrderById`, {}, toolkit);
  }
);

// get demo and mentorship calender data

export const getCalendarMonthAsync = createAsyncThunk(
  "user/getCalendarMonth",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getCalendarMonth`, payload, toolkit);
  }
);

// get demo and mentorship calender data
export const getActivityReportOfUserAsync = createAsyncThunk(
  "user/getActivityReportOfUser",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getActivityReportOfUser`,
      payload,
      toolkit
    );
  }
);
export const getStudentLatestNoticeAsync = createAsyncThunk(
  "user/getStudentLatestNotice",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getStudentLatestNotice`,
      payload,
      toolkit
    );
  }
);
// get demo and mentorship calender data
export const getActivityOfUserAsync = createAsyncThunk(
  "user/getActivityOfUser",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getActivityOfUser?type=${payload.type}`,
      payload,
      toolkit
    );
  }
);

export const getAllNoticeByStudentIdAsync = createAsyncThunk(
  "user//getAllNoticeByStudentId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllNoticeByStudentId`,
      payload,
      toolkit
    );
  }
);
// createQuiz
export const createQuizAsync = createAsyncThunk(
  "user/createQuiz",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createQuiz`, payload, toolkit);
  }
);
// Test Report
// get test attempted count
export const getTestAttemptedCountAsync = createAsyncThunk(
  "user/getTestAttemptedCount",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getTestAttemptedCount?testId=${payload.testId}`,
      payload,
      toolkit
    );
  }
);
// get score summary
export const getScoreSummaryAsync = createAsyncThunk(
  "user/getScoreSummary",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getScoreSummary`, payload, toolkit);
  }
);
// time wise que analysis for boxes
export const questionAnalysisAsync = createAsyncThunk(
  "user/questionAnalysis",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/questionAnalysis`, payload, toolkit);
  }
);
// time analysis for table data
export const questionTimeAnalysisAsync = createAsyncThunk(
  "user/questionTimeAnalysis",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/questionTimeAnalysis
      `,
      payload,
      toolkit
    );
  }
);
// time spend
export const timeSpendForTestAsync = createAsyncThunk(
  "user/timeSpendForTest",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/timeSpendForTest
      `,
      payload,
      toolkit
    );
  }
);
// Test Report
export const getTestReportAsync = createAsyncThunk(
  "user/getTestReport",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getTestReport
      `,
      payload,
      toolkit
    );
  }
);
// Test Report
export const testAttemptedAsync = createAsyncThunk(
  "user/testAttempted",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/testAttempted
      `,
      payload,
      toolkit
    );
  }
);

// assignment attempt
export const assignmentAtttemptedAsync = createAsyncThunk(
  "user/assignmentAtttempted",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/assignmentAtttempted
      `,
      payload,
      toolkit
    );
  }
);

// get question by id

export const getQuestionByIdAsync = createAsyncThunk(
  "user/getQuestionById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getQuestionById/${payload.id}
      `,
      payload,
      toolkit
    );
  }
);
// get Related Questions By Id
export const getRelatedQuestionsByIdAsync = createAsyncThunk(
  "user/getRelatedQuestionsById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getRelatedQuestionsById`,
      payload,
      toolkit
    );
  }
);
// get Exam Summary in popup
export const getExamSummaryAsync = createAsyncThunk(
  "user/getExamSummary",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getExamSummary`, payload, toolkit);
  }
);
// get User Leader Board in quiz
export const getUserLeaderBoardAsync = createAsyncThunk(
  "user/getUserLeaderBoard",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getUserLeaderBoard`, payload, toolkit);
  }
);
// get own test
export const getOwnTestByUserIdAsync = createAsyncThunk(
  "user/getOwnTestByUserId",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getOwnTestByUserId`, payload, toolkit);
  }
);
//addRating
export const addRatingAsync = createAsyncThunk(
  "user/addRating",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addRating`, payload, toolkit);
  }
);
//addRating
export const getRatingByUserIdAsync = createAsyncThunk(
  "user/getRatingByUserId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getRatingByUserId?type=${payload.type}&eventId=${payload.eventId}`,
      payload,
      toolkit
    );
  }
);
// add userTimeSpend
export const addUserSpendTimeAsync = createAsyncThunk(
  "user/getRatingByUserId",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addUserSpendTime`, payload, toolkit);
  }
);

//  payment gateway
// initiate payment

export const initiatePaymentAsync = createAsyncThunk(
  "user/initiatePayment",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/initiatePayment`, payload, toolkit);
  }
);
