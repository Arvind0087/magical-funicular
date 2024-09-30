import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosClient } from "./AxiosClient";

export const adminsignupAsync = createAsyncThunk(
  "admin/adminsignup",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/adminsignup`, payload, toolkit);
  }
);

export const getAllordersAsync = createAsyncThunk(
  "admin/getAllorders",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllOrdersList?page=${payload.page}&limit=${payload.limit}`,
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

//STUDENT
export const getStudentAsync = createAsyncThunk(
  "admin/getAllStudents",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllStudents?page=${payload.page}&limit=${payload.limit}&course=${
        payload.course || ""
      }&classes=${payload.classes || ""}&search=${payload.search || ""}&type=${
        payload.type || ""
      }&courseId=${payload.courseId || ""}&packageId=${
        payload.packageId || ""
      }`,
      [],
      toolkit
    );
  }
);

export const usersBypackageIdAsync = createAsyncThunk(
  "admin/usersBypackageId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/usersBypackageId?page=${payload.page}&limit=${
        payload.limit
      }&packageId=${payload.packageId || ""}&search=${
        payload.search || ""
      }&fromDate=${payload.fromDate || ""}&toDate=${payload.toDate || ""}`,
      [],
      toolkit
    );
  }
);

export const getstudentbyidAsync = createAsyncThunk(
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
export const createStudentAsync = createAsyncThunk(
  "admin/createStudentAsync",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/adminAddStudents`, payload, toolkit);
  }
);

export const updateStudentByIdAsync = createAsyncThunk(
  "admin/updateStudentByIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PATCH",
      `/adminUpdateStudentById`,
      payload,
      toolkit
    );
  }
);

//Student Attendance
export const markStudentAttendanceAsync = createAsyncThunk(
  "admin/studentMarkAttandence",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/studentMarkAttandence`,
      payload,
      toolkit
    );
  }
);

// Bulk Subscription Change

export const bulkSubscriptionChangeAsync = createAsyncThunk(
  "admin/updateUserSubscriptionType",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PUT",
      `/updateUserSubscriptionType`,
      payload,
      toolkit
    );
  }
);

export const updateUserMPinByIdAsync = createAsyncThunk(
  "admin/updateUserMPinByIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateUserMPinById`, payload, toolkit);
  }
);

//

export const deleteStudentByIdAsync = createAsyncThunk(
  "admin/deleteOnlyById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteOnlyForYou/${payload}`,
      [],
      toolkit
    );
  }
);

//Assign Student
export const addUsersPackagesAsync = createAsyncThunk(
  "admin/addUsersPackages",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addUsersPackages`, payload, toolkit);
  }
);

export const deleteStudentCoursePackgeAsync = createAsyncThunk(
  "admin/deleteStudentCoursePackge",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteStudentCoursePackge`,
      payload,
      toolkit
    );
  }
);

// CLASS
export const getclassAsync = createAsyncThunk(
  "admin/getclass",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllClasses?page=${payload.page}&limit=${payload.limit}&search=${
        payload.search || ""
      }`,
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

//BATCH
export const getAllBatchTypes = createAsyncThunk(
  "admin/getbatch",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllBatchTypes?page=${payload.page}&limit=${payload.limit}&search=${
        payload.search || ""
      }`,
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

// BOARD
export const getboardAsync = createAsyncThunk(
  "admin/getboard",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllBoards?page=${payload.page}&limit=${payload.limit}&search=${
        payload.search || ""
      }`,
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
// SUBJECT
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
      `/getAllSubjects?page=${payload.page}&limit=${payload.limit}&search=${
        payload.search || ""
      }`,
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

//Chapter
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
      `/getAllChapters?page=${payload.page}&limit=${payload.limit}&subject=${
        payload.subject || ""
      }&chapter=${payload.chapter || ""}`,
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

// BatchDate
export const getAllBatchDatesAsync = createAsyncThunk(
  "admin/getAllBatchDates",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllBatchDates?page=${payload.page}&limit=${payload.limit}&search=${
        payload.search || ""
      }`,
      [],
      toolkit
    );
  }
);

//Banner

// TEACHERS
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
    return await AxiosClient("PUT", `/updateTeacherById`, payload, toolkit);
  }
);

//teacher filter api id

//Syllabus
export const getAllSyllabusAsync = createAsyncThunk(
  "admin/getAllSyllabus",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllSyllabus?page=${payload.page}&limit=${payload.limit}&search=${payload.search}`,
      [],
      toolkit
    );
  }
);

export const getChapterBySubjectId = createAsyncThunk(
  "admin/getChapterBySubjectId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "POST",
      `/getChapterBySubjectId`,
      payload,
      toolkit
    );
  }
);

export const addSyllabusAsync = createAsyncThunk(
  "admin/addTopic",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addTopic`, payload, toolkit);
  }
);

export const getSyllausByIdAsync = createAsyncThunk(
  "admin/getChapterByIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getSyllabusByTopicId/${payload}`,
      [],
      toolkit
    );
  }
);

export const updateSyllabusAsync = createAsyncThunk(
  "admin/updateSyllabusAsync",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateTopicById`, payload, toolkit);
  }
);

//FAQ
export const getAllFaqAsync = createAsyncThunk(
  "admin/getAllFaq",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllFaq?page=${payload.page}&limit=${payload.limit}&type=${
        payload.type || ""
      }&search=${payload.search || ""}`,
      [],
      toolkit
    );
  }
);

export const createFaqAsync = createAsyncThunk(
  "admin/createFaq",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createFaq`, payload, toolkit);
  }
);

export const updateFaqByIdAsync = createAsyncThunk(
  "admin/updateFaqById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PUT",
      `/updateFaqById/${payload.id}`,
      payload,
      toolkit
    );
  }
);

export const getFaqByIdAsync = createAsyncThunk(
  "admin/getFaqById",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getFaqById/${payload}`, [], toolkit);
  }
);

//Events
export const getAllEventsAsync = createAsyncThunk(
  "admin/getAllEvent",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllEvent?page=${payload.page}&limit=${payload.limit}`,
      [],
      toolkit
    );
  }
);

export const addEventAsync = createAsyncThunk(
  "admin/createEvent",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createEvent`, payload, toolkit);
  }
);

export const getEventByIdAsync = createAsyncThunk(
  "admin/getEventByIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getEventById/${payload}`, [], toolkit);
  }
);

export const updateEventAsync = createAsyncThunk(
  "admin/updateEventAsync",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateEventById`, payload, toolkit);
  }
);
export const deleteEventAsync = createAsyncThunk(
  "admin/deleteEventAsync",
  async (payload, toolkit) => {
    return await AxiosClient("DELETE", `/deleteEvent/${payload}`, [], toolkit);
  }
);

//Calender
export const getSecheduleByTeacherIdAsync = createAsyncThunk(
  "admin/getMentorshipByTeacherId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getMentorshipByTeacherId/${payload}`,
      payload,
      toolkit
    );
  }
);

//Shorts
export const getAllShortsAsync = createAsyncThunk(
  "admin/getAllShorts",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllShorts?page=${payload.page || ""}&limit=${
        payload.limit || ""
      }&subjects=${payload.subjects || ""}&search=${
        payload.search || ""
      }&classes=${payload.classes || ""}`,
      [],
      toolkit
    );
  }
);

export const getShortsByIdAsync = createAsyncThunk(
  "admin/getShortsByIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getShortsById/${payload}`, [], toolkit);
  }
);
export const addShortsAsync = createAsyncThunk(
  "admin/addShorts",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addShorts`, payload, toolkit);
  }
);
export const updateShortsAsync = createAsyncThunk(
  "admin/updateShorts",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateShortsById`, payload, toolkit);
  }
);

export const deleteShortAsync = createAsyncThunk(
  "admin/deleteShortAsync",
  async (payload, toolkit) => {
    return await AxiosClient("DELETE", `/deleteShort/${payload}`, [], toolkit);
  }
);

// Notice Section

export const getAllNoticeAsync = createAsyncThunk(
  "admin/getAllNotice",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllNotice?page=${payload.page}&limit=${payload.limit}&classes=${
        payload.classes || ""
      }&search=${payload.search || ""}`,
      [],
      toolkit
    );
  }
);

export const getStudentsForNoticeAsync = createAsyncThunk(
  "admin/getStudentByClassId",
  async (payload, toolkit) => {
    // return await AxiosClient("POST", `/getStudentByClassId`, payload, toolkit);
    return await AxiosClient(
      "POST",
      `/getStudentByBatchTypeId`,
      payload,
      toolkit
    );
  }
);

export const createNoticeAsync = createAsyncThunk(
  "admin/sendNotice",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/sendNotice`, payload, toolkit);
  }
);

export const deleteNoticeAsync = createAsyncThunk(
  "admin/deleteNoticeById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteNoticeById/${payload}`,
      [],
      toolkit
    );
  }
);

// Doubts
export const getAllDoubtsAsync = createAsyncThunk(
  "admin/getAllDoubt",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllDoubt?page=${payload.page || ""}&limit=${
        payload.limit || ""
      }&subjectId=${payload.subject || ""}`,
      [],
      toolkit
    );
  }
);
export const getDoubtsByIdAsync = createAsyncThunk(
  "admin/getDoubtsByIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getDoubtById/${payload}`, [], toolkit);
  }
);

export const postReplyAsync = createAsyncThunk(
  "admin/postReply",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/postReply`, payload, toolkit);
  }
);

//ONLY FOR YOU
export const getAllOnlyForYouAsync = createAsyncThunk(
  "admin/getAllOnlyForYou",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllOnlyForYou?page=${payload.page}&limit=${payload.limit}&search=${payload.search}`,
      [],
      toolkit
    );
  }
);

export const getOnlyForYouByIdAsync = createAsyncThunk(
  "admin/getOnlyForYouByIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getOnlyForYouById/${payload}`,
      [],
      toolkit
    );
  }
);
export const createOnlyForYouAsync = createAsyncThunk(
  "admin/createOnlyForYou",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createOnlyForYou`, payload, toolkit);
  }
);

export const updateOnlyForYouByIdAsync = createAsyncThunk(
  "admin/updateOnlyForYouById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateOnlyForYouById`, payload, toolkit);
  }
);

export const deleteOnlyByIdAsync = createAsyncThunk(
  "admin/deleteOnlyById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteOnlyForYou/${payload}`,
      [],
      toolkit
    );
  }
);

// Package Subscription
export const getAllSubscriptionsAsync = createAsyncThunk(
  "admin/getAllSubscriptions",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllSubscriptions?page=${payload.page}&limit=${
        payload.limit
      }&package=${payload.package || ""}&title=${payload.title || ""}`,
      [],
      toolkit
    );
  }
);

// Package Master

// Package Master

export const getAllPackagesAsync = createAsyncThunk(
  "admin/getAllPackages",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllPackages?page=${payload.page || ""}&limit=${
        payload.limit || ""
      }&search=${payload.search || ""}`,
      [],
      toolkit
    );
  }
);
// getPackagesMonth
export const getPackagesMonthAsync = createAsyncThunk(
  "admin/getPackagesMonth",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getPackagesMonth`, [], toolkit);
  }
);

//Subscription List view

export const getAllPackagesForBoardAsync = createAsyncThunk(
  "admin/getAllPackagesForBoard",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllPackagesForBoard?page=${payload.page}&limit=${payload.limit}`,
      [],
      toolkit
    );
  }
);

//----- subscription list view-----//
export const addMultipleClassAsync = createAsyncThunk(
  //create subscription list API
  "admin/addMultipleClass",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/addMultipleClass`, payload, toolkit);
  }
);

export const updateIndivisualPackageAsync = createAsyncThunk(
  //update subscription list API
  "admin/updateIndividualPackage",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PATCH",
      `/updateIndividualPackage`,
      payload,
      toolkit
    );
  }
);

export const getClassDetailsByIdAsync = createAsyncThunk(
  //Get subscription list by id
  "admin/getClassDetailsById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getClassDetailsById/${payload}`,
      [],
      toolkit
    );
  }
);

// Revision Section
export const getAllRevisionAsync = createAsyncThunk(
  "admin/getAllRevisionAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllRevisions?page=${payload.page || ""}&limit=${
        payload.limit || ""
      }&subject=${payload.subject || ""}&classes=${payload.classes || ""}`,
      [],
      toolkit
    );
  }
);
export const getScholorshipsByIdAsync = createAsyncThunk(
  "admin/getScholorshipsByIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getScholarshipById/${payload}`,
      [],
      toolkit
    );
  }
);

export const getRevisionTopicAsync = createAsyncThunk(
  "admin/getTopicByChapterId",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/getTopicByChapterId`, payload, toolkit);
  }
);

export const createRevisionAsync = createAsyncThunk(
  "admin/createRevisionList",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createRevisionList`, payload, toolkit);
  }
);

export const deleteRevisionAsync = createAsyncThunk(
  "admin/deleteRevisionById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteRevisionById/${payload}`,
      [],
      toolkit
    );
  }
);

export const getRevisionByIdAsync = createAsyncThunk(
  "admin/getRevisionsById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getRevisionsById/${payload}`,
      [],
      toolkit
    );
  }
);

export const updateRevisionAsync = createAsyncThunk(
  "admin/updateRevisionById",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateRevisionById`, payload, toolkit);
  }
);
// Feedback Section
export const getAllFeedbackAsync = createAsyncThunk(
  "admin/getAllOnlyForYou",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllFeedback?page=${payload.page || ""}&limit=${
        payload.limit || ""
      }&search=${payload.search || ""}`,
      [],
      toolkit
    );
  }
);
export const updatePackageByIdAsync = createAsyncThunk(
  "admin/updatePackageById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PATCH",
      `/updatePackageById/${payload.id}`,
      payload,
      toolkit
    );
  }
);
//add package master
export const addPackageAsync = createAsyncThunk(
  "admin/createNewPackages",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createNewPackages`, payload, toolkit);
  }
);
//get only id package master

export const getpackageByIdAsync = createAsyncThunk(
  "admin/getpackageByIdAsync",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getPackagesById/${payload}`, [], toolkit);
  }
);
export const updateSubscriptionByIdAsync = createAsyncThunk(
  "admin/updateSubscriptionById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PATCH",
      `/updateSubscriptionById/${payload.id}`,
      payload,
      toolkit
    );
  }
);
export const createSubscriptionsAsync = createAsyncThunk(
  "admin/createSubscriptions",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createSubscriptions`, payload, toolkit);
  }
);
export const getSubscriptionsByIdAsync = createAsyncThunk(
  "admin/getSubscriptionById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getSubscriptionById/${payload}`,
      [],
      toolkit
    );
  }
);

//get Subscription By Package Id of subscription list
export const getSubscriptionByPackageIdAsync = createAsyncThunk(
  "admin/getSubscriptionByPackageId",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getSubscriptionByPackageId/${payload.packageId}`,
      [],
      toolkit
    );
  }
);

//Scholorships

export const getAllScholorshipsAsync = createAsyncThunk(
  "admin/getAllScholorships",
  async (payload, toolkit) => {
    return await AxiosClient(
      "GET",
      `/getAllScholarship?page=${payload.page}&limit=${payload.limit}`,
      [],
      toolkit
    );
  }
);
export const addScholorshipsAsync = createAsyncThunk(
  "admin/addScholorships",
  async (payload, toolkit) => {
    return await AxiosClient("POST", `/createScholarship`, payload, toolkit);
  }
);

export const updateScholorshipsByIdAsync = createAsyncThunk(
  "admin/updateScholorships",
  async (payload, toolkit) => {
    return await AxiosClient("PUT", `/updateScholarshipById`, payload, toolkit);
  }
);

export const deleteScholorshipsByIdAsync = createAsyncThunk(
  "admin/deleteScholarshipById",
  async (payload, toolkit) => {
    return await AxiosClient(
      "DELETE",
      `/deleteScholarshipById/${payload}`,
      [],
      toolkit
    );
  }
);

// changeOnlyForYouStatus
export const updateOnlyForYouStatusAsync = createAsyncThunk(
  "admin/changeOnlyForYouStatus",
  async (payload, toolkit) => {
    return await AxiosClient(
      "PATCH",
      `/changeOnlyForYouStatus`,
      payload,
      toolkit
    );
  }
);

//STUDENT Gender Data report by Pie  Graph
export const getUserGenderDataAsync = createAsyncThunk(
  "admin/getUserGenderData",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getUserGenderData`, [], toolkit);
  }
);
//STUDENT free and premium  Data report by Pie  Graph
export const getStudentSubscriptionAsync = createAsyncThunk(
  "admin/getStudentSubscription",
  async (payload, toolkit) => {
    return await AxiosClient("GET", `/getUserSubscriptionDetails`, [], toolkit);
  }
);
