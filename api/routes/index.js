const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyToken } = require('../middleware/auth');
const { webVerifyToken } = require('../middleware/webAuth');
const { excelVerifyToken } = require('../middleware/excelAuth');
const admin = require('../controllers/admin/index');
const course = require('../controllers/course/index');
const board = require('../controllers/board/index');
const Class = require('../controllers/class/index');
const users = require('../controllers/users/index');
const student = require('../controllers/students/index');
const batchType = require('../controllers/batchType/index');
const batchDate = require('../controllers/batchDate/index');
const subject = require('../controllers/subject/index');
const chapter = require('../controllers/chapter/index');
const topic = require('../controllers/topics/index');
const syllabus = require('../controllers/syllabus/index');
const banner = require('../controllers/banner/index');
const teacher = require('../controllers/teacher/index');
const shorts = require('../controllers/shorts/index');
const faq = require('../controllers/FAQ/index');
const doubt = require('../controllers/doubt/index');
//const doubtReply = require("../controllers/doubt/index");
const feedback = require('../controllers/feedback/index');
const bookmark = require('../controllers/bookmark/index');
const event = require('../controllers/event/index');
const onlyForYou = require('../controllers/onlyForYou/index');
const notice = require('../controllers/notice');
const packageSubscription = require('../controllers/packageAndSubscription/index');
const questionBank = require('../controllers/questionBank/index');
const test = require('../controllers/test/index');
const order = require('../controllers/order/index');
const payments = require('../controllers/payment/index');
const revisions = require('../controllers/revision/index');
const scholarship = require('../controllers/scholarship/index');
const staffs = require('../controllers/staffs/index');
const permission = require('../controllers/permission/index');
const wantToBe = require('../controllers/wantToBe/index');
const mentorshipHelp = require('../controllers/mentorshipHelp/index');
const setting = require('../controllers/setting/index');
const dashboard = require('../controllers/dashboard/index');
const upload = require('../controllers/upload/index');
const studentTestMap = require('../controllers/studentTestAttempted/index');
const testReports = require('../controllers/testReports/index');
const excelSheets = require('../controllers/excelDownload/index');
const state = require('../controllers/state/index');
const city = require('../controllers/city/index');
const enquiry = require('../controllers/enquiry/index');
const highlight = require('../controllers/highlight/index');
const activity = require('../controllers/activity/index');
const assignment = require('../controllers/assignments/index');
const schedule = require('../controllers/schedule/index');
const requestCall = require('../controllers/requestCall/index');
const pageBackLink = require('../controllers/pageBackLink/index');
const role = require('../controllers/roles/index');
const bulkUpload = require('../controllers/bulkUpload/index');
const internalSetting = require('../controllers/internalSetting/index');
const quiz = require('../controllers/quiz/index');
const zoom = require('../controllers/zoom/index');
const rating = require('../controllers/rating/index');
const zoomCredential = require('../controllers/zoomCredential');
const recentActivity = require('../controllers/recentActivity');
const leaderBoard = require('../controllers/leaderboard');
const converterS3Name = require('../controllers/converterS3Name');
const grievances = require('../controllers/grievances');
const report = require('../controllers/report/index');
const newSyllabus = require('../controllers/newSyllabus/index');
const leadsquard = require('../controllers/leadsquard/index');
const coursePackage = require('../controllers/coursePackage/index');

//SECTION :parent section
const login = require('../controllers/parent/login/index');
const parentStudent = require('../controllers/parent/students/index');
const attandence = require('../controllers/attendance/index');
const { RedisgetAllSubject } = require('../controllers/subject/index');
const { RedisgetAllStudentEvent } = require('../controllers/event/index');

// CCAvenue Payment Controller
const ccPayment = require('../controllers/ccAvenuePayment/index');
const phonepayPayment = require('../controllers/phonepayPayment/index');

//NOTE: Admin
router.post('/adminSignup', verifyToken, admin.signupAdmin);
router.post('/adminLoginWithEmail', admin.loginAdmin);
router.put('/updateAdminPassword', admin.updateAdminPassword);

//NOTE: Dashboard
router.get('/dashboard', verifyToken, dashboard.dashboard);

//NOTE: Url upload
router.post('/uploadUrl', verifyToken, upload.uploadUrl);
router.get('/getUrlById/:id', verifyToken, upload.getUrlById);
router.get('/getAllUrl', verifyToken, upload.getAllUrl);
router.put('/updateUrlById', verifyToken, upload.updateUrlById);
router.delete('/deleteUrlById/:id', verifyToken, upload.deleteUrlById);

//NOTE: Course
router.post('/createCourse', verifyToken, course.createCourse);
router.get('/getCourseById/:id', verifyToken, course.getCourse);
router.get('/getAllCourses', verifyToken, course.getAllCourses);
router.put('/updatedCourseById', verifyToken, course.updateCoursesById);
router.delete('/deleteCourse/:id', verifyToken, course.deleteCourse);
router.get('/getCourseByStudentId', verifyToken, course.getCourseByStudentId);
router.put('/updateCourseStatus', verifyToken, course.updateCourseStatus);

//NOTE: Board
router.post('/createBoard', verifyToken, board.createBoards);
router.get('/getBoardById/:id', verifyToken, board.getBoardsById);
router.post('/getBoardsByCourseId', verifyToken, board.getBoardsByCourseId);
router.get('/getAllBoards', verifyToken, board.getAllBoards);
router.put('/updateBoardById/:id', verifyToken, board.updateBoards);
router.delete('/deleteBoard/:id', verifyToken, board.deleteBoards);
router.post(
  '/getBatchTypeClassByBoardId',
  verifyToken,
  board.getBatchTypeClassByBoardId
);
router.put('/updateBoardStatus', verifyToken, board.updateBoardStatus);

//NOTE: Class
router.post('/createClass', verifyToken, Class.createClass);
router.get('/getClassById/:id', verifyToken, Class.getClassById);
router.post('/getClassByBoardId', verifyToken, Class.getClassByBoardId);
router.get('/getAllClasses', verifyToken, Class.getAllClass);
router.put('/updateClassById', verifyToken, Class.updateClassById);
router.delete('/deleteClassById/:id', verifyToken, Class.deleteClassById);
router.put('/updateClassStatus', verifyToken, Class.updateClassStatus);

//NOTE -Batch Type routesH
router.post('/addBatchType', verifyToken, batchType.addBatchType);
router.get('/getBatchTypeById/:id', verifyToken, batchType.getBatchTypeById);
router.post(
  '/getBatchTypeByClassId',
  verifyToken,
  batchType.getBatchTypeByClassId
);
router.get('/getAllBatchTypes', verifyToken, batchType.getAllBatchType);
router.put('/updatedBatchTypeById', verifyToken, batchType.updateBatchTypeById);
router.delete(
  '/deleteBatchTypeById/:id',
  verifyToken,
  batchType.deleteBatchTypeById
);
router.post('/getMultipleBatch', verifyToken, batchType.getMultipleBatch);
router.get('/getBatchByBoardId', verifyToken, batchType.getBatchByBoardId);
router.put(
  '/updateBatchTypeStatus',
  verifyToken,
  batchType.updateBatchTypeStatus
);


//NOTE - Batch Date routes
router.post('/addBatchDate', verifyToken, batchDate.addBatchDate);
router.get('/getBatchDateById/:id', verifyToken, batchDate.getBatchDateById);
router.post(
  '/getBatchDateByBatchTypeId',
  verifyToken,
  batchDate.getBatchDateByBatchTypeId
);
router.get('/getAllBatchDates', verifyToken, batchDate.getAllBatchDate);
router.put('/updatedBatchDateById', verifyToken, batchDate.updateBatchDateById);
router.delete(
  '/deleteBatchDateById/:id',
  verifyToken,
  batchDate.deleteBatchDateById
);

router.post(
  '/getMultipleBatchDate',
  verifyToken,
  batchDate.getMultipleBatchDate
);
router.put(
  '/updateBatchDateStatus',
  verifyToken,
  batchDate.updateBatchDateStatus
);

//NOTE - Subject routes
router.post('/addSubject', verifyToken, subject.addSubject);
router.get('/getSubjectById/:id', verifyToken, subject.getSubjectById);
router.post(
  '/getSubjectByBatchTypeId',
  verifyToken,
  subject.getSubjectByBatchTypeId
);
router.get(
  '/getSubjectByOnlyBatchTypeId',
  verifyToken,
  subject.getSubjectByOnlyBatchTypeId
);
router.get('/getAllSubjects', verifyToken, subject.getAllSubject);
router.put('/updatedSubjectById', verifyToken, subject.updateSubjectById);
router.delete('/deleteSubjectById/:id', verifyToken, subject.deleteSubjectById);
router.post('/subjectChapterCount', verifyToken, subject.subjectChapterCount);
router.get('/getAllSubjectSelect', verifyToken, subject.getAllSubjectSelect);
router.post(
  '/getSubjectByMultipleClassId',
  verifyToken,
  subject.getSubjectByMultipleClassId
);
router.get(
  '/getAllSubjectwithClass',
  verifyToken,
  subject.getAllSubjectwithClass
);
router.post(
  '/getSubjectByMultipleClassIds',
  verifyToken,
  subject.getSubjectByMultipleClassIds
);
router.post(
  '/subjectWithChapterCount',
  verifyToken,
  subject.subjectWithChapterCount
);

router.get('/getSubjectByBoardId', verifyToken, subject.getSubjectByBoardId);
router.post('/chapterTopicsCount', verifyToken, subject.chapterTopicsCount);
router.put('/updateSubjectStatus', verifyToken, subject.updateSubjectStatus);

//NOTE - Chapter routes
router.post('/addChapter', verifyToken, chapter.addChapter);
router.get('/getChapterById/:id', verifyToken, chapter.getChapterById);
router.post(
  '/getChapterBySubjectId',
  verifyToken,
  chapter.getChapterBySubjectId
);
router.get(
  '/getChapterByOnlySubjectId',
  verifyToken,
  chapter.getChapterByOnlySubjectId
);
router.get('/getAllChapters', verifyToken, chapter.getAllChapter);
router.put('/updateChapterById', verifyToken, chapter.updateChapterById);
router.delete('/deleteChapterById/:id', verifyToken, chapter.deleteChapterById);
router.post(
  '/getChapterByMultipleSubjectId',
  verifyToken,
  chapter.getChapterByMultipleSubjectId
);

router.post(
  '/getChapterForQuestions',
  verifyToken,
  chapter.getChapterForQuestions
);

router.put('/updateChapterStatus', verifyToken, chapter.updateChapterStatus);
router.post('/userChapterBySubjectId', verifyToken, chapter.userChapterBySubjectId);


//NOTE - Topics routes
router.post('/addTopic', verifyToken, topic.addTopic);
router.get('/getTopicById/:id', verifyToken, topic.getTopicById);
router.post('/getTopicByChapterId', verifyToken, topic.getTopicByChapterId);
router.get('/getAllTopics', topic.getAllTopics);
router.put('/updateTopicById', verifyToken, topic.updateTopicById);
router.delete('/deleteTopics/:id', verifyToken, topic.deleteTopics);
router.put('/updateTopicStatus', verifyToken, topic.updateTopicStatus);

//NOTE - Syllabus routes
router.post('/addSyllabus', verifyToken, syllabus.addSyllabus); //TODO - only for testing
router.get(
  '/getSyllabusByTopicId/:id',
  verifyToken,
  syllabus.getSyllabusByTopicId
);
router.get('/getAllSyllabusTopic', verifyToken, syllabus.getAllSyllabus);
router.get('/getSyllabusById/:id', verifyToken, syllabus.getSyllabusById);
router.post(
  '/getAllSyllabusByChapterId',
  verifyToken,
  syllabus.getAllSyllabusByChapterId
);

//NOTE -syllabus Topics routes
router.post('/addSyllabusTopic', verifyToken, topic.addSyllabusTopic);
router.put(
  '/updateSyllabusTopicById',
  verifyToken,
  topic.updateSyllabusTopicById
);

//NOTE -syllabus Topics routes
router.post('/addSyllabusContent', verifyToken, syllabus.addSyllabusContent);
router.get(
  '/getAllSyllabusContent',
  verifyToken,
  syllabus.getAllSyllabusContent
);
router.get(
  '/getSyllabusContentById/:id',
  verifyToken,
  syllabus.getSyllabusContentById
);


//NOTE - Banner routes
router.post('/createBanner', verifyToken, banner.createBanner);
router.get('/getBannerById/:id', verifyToken, banner.getBannerById);
router.get('/getAllBanner', verifyToken, banner.getAllBanner);
router.put('/updateBannerById', verifyToken, banner.updateBannerById);
router.get('/getAllBannerByType', verifyToken, banner.getAllBannerByType); //TODO - use in web and mobile
router.delete('/deleteBannerById/:id', verifyToken, banner.deleteBannerById);

//NOTE - Shorts routes
router.post('/addShorts', verifyToken, shorts.addShorts);
router.get('/getAllShorts', verifyToken, shorts.getAllShorts);
router.get('/getShortsById/:id', verifyToken, shorts.getShortsById);
router.get('/getShortsBySubjectId', verifyToken, shorts.getShortsBySubjectId);
router.put('/updateShortsById', verifyToken, shorts.updateShortsById);
router.delete('/deleteShort/:id', verifyToken, shorts.deleteShort);
router.post('/getShortsByStudentId', verifyToken, shorts.getShortsByStudentId);
router.post('/likeDislikeShorts', verifyToken, shorts.likeDislikeShorts);
router.post(
  '/getAllLikeShortsByStudentId',
  verifyToken,
  shorts.getAllLikeShortsByStudentId
);
router.delete('/dislike', verifyToken, shorts.dislike);
router.post(
  '/getOneShortsByStudentId',
  verifyToken,
  shorts.getOneShortsByStudentId
);
router.get('/getPreviousShorts', verifyToken, shorts.getPreviousShorts);
router.get('/getNextShorts', verifyToken, shorts.getNextShorts);
router.get(
  '/getPreviousShortsMobileApp',
  verifyToken,
  shorts.getPreviousShortsMobileApp
);
router.get(
  '/getNextShortsMobileApp',
  verifyToken,
  shorts.getNextShortsMobileApp
);

//NOTE  - Faq
router.post('/createFaq', verifyToken, faq.createFaq);
router.get('/getAllFaq', verifyToken, faq.getAllFaq);
router.get('/getFaqById/:id', verifyToken, faq.getFaqById);
router.put('/updateFaqById/:id', verifyToken, faq.updateFaqById);
router.delete('/deleteFaqById/:id', verifyToken, faq.deleteFaqById);

//NOTE  - Doubt
router.post('/createDoubt', verifyToken, doubt.createDoubt);
router.post('/postReply', verifyToken, doubt.postReply);
router.get('/getAllDoubt', verifyToken, doubt.getAllDoubt);
router.get('/getDoubtById/:id', verifyToken, doubt.getDoubtById);
router.put('/updatePostReplyById', verifyToken, doubt.updatePostReplyById);
router.post('/getDoubtByStudentId/:id', verifyToken, doubt.getDoubtByStudentId);
router.get('/getAllDoubtOfStudent', verifyToken, doubt.getAllDoubtOfStudent);

//NOTE  - Feedback
router.post('/createFeedback', feedback.createFeedback);
router.get('/getAllFeedback', verifyToken, feedback.getAllFeedback);
router.get('/getFeedbackById/:id', verifyToken, feedback.getFeedbackById);
router.delete(
  '/deleteFeedbackById/:id',
  verifyToken,
  feedback.deleteFeedbackById
);

//NOTE  - Bookmark
router.post('/addBookmark', verifyToken, bookmark.addBookmark);
//router.post("/getAllBookmark", verifyToken, bookmark.getAllBookmark);
router.post('/getAllBookmark', verifyToken, bookmark.getAllBookmarkNew);
router.post('/getBookmarkById', verifyToken, bookmark.getBookmarkById);
router.delete('/deleteBookmarks/:id', verifyToken, bookmark.deleteBookmarks);
router.get('/countBookmark', verifyToken, bookmark.countBookmark);
//router.post("/getAllBookmarkNew", bookmark.getAllBookmarkNew);

//NOTE  - Event
router.post('/createLiveEvent', verifyToken, event.createEvent);
router.post('/createEventNew', verifyToken, event.createEventNew);
router.get('/getAllLiveEvent', verifyToken, event.getAllEvent);
router.get('/getLiveEventById/:id', verifyToken, event.getEventById);
router.put('/updateLiveEventById', verifyToken, event.updateEventById);
router.delete('/deleteLiveEvent/:id', verifyToken, event.deleteEvent);
router.get('/getLiveClassHistory', verifyToken, event.getLiveClassHistory);
router.get(
  '/getAllEventByStudentId',
  verifyToken,
  event.getAllEventByStudentId
);
router.post('/createEventRequest', verifyToken, event.createEventRequest);
router.post('/createEventForDemo', verifyToken, event.createEventForDemo);
router.get('/getAllEventRequested', verifyToken, event.getAllEventRequested);
router.get(
  '/getEventRequestedById/:id',
  verifyToken,
  event.getEventRequestedById
);
router.put('/statusUpdatedById', verifyToken, event.statusUpdatedById);
router.post('/createReminderTime', verifyToken, event.createReminderTime);
router.get('/getAllReminderTime', verifyToken, event.getAllReminderTime);
router.post('/attendLiveEvent', verifyToken, event.attendLiveEvent);
router.get('/eventParticipantReport', event.eventParticipantReport);
router.get('/EventAttendReport', event.EventAttendReport);
router.post('/joinLiveClass', verifyToken, event.joinEvent);
router.post('/exitLiveClass', verifyToken, event.exitEvent);
router.get('/getEventByStatus', verifyToken, event.getEventByStatus);
router.post('/sendMessage', verifyToken, event.sendMessage);
router.post('/getyoutubeChats', verifyToken, event.getyoutubeChats);
router.get('/getFreeEventByStudentId',verifyToken, event.getFreeEventByStudentId);
router.get('/getEventByEventId/:id',verifyToken, event.getEventByEventId);


//NOTE  - Only for you
router.post('/createOnlyForYou', verifyToken, onlyForYou.createOnlyForYou);
router.get('/getOnlyForYouById/:id', verifyToken, onlyForYou.getOnlyForYouById);
router.get('/getAllOnlyForYou', verifyToken, onlyForYou.getAllOnlyForYou); //TODO - use only in admin panel
router.put(
  '/updateOnlyForYouById',
  verifyToken,
  onlyForYou.updateOnlyForYouById
);
router.delete(
  '/deleteOnlyForYou/:id',
  verifyToken,
  onlyForYou.deleteOnlyForYou
);
router.get('/getActiveOnlyForYou', verifyToken, onlyForYou.getActiveOnlyForYou); //TODO - use only in web and mobile screen
router.patch(
  '/changeOnlyForYouStatus',
  verifyToken,
  onlyForYou.changeOnlyForYouStatus
); //TODO - use in admin panel

//NOTE  - Notice
router.post('/sendNotice', verifyToken, notice.sendNotice);
router.get('/getNoticeById/:id', verifyToken, notice.getNoticeById);
router.get('/getAllNotice', verifyToken, notice.getAllNotice);
router.delete('/deleteNoticeById/:id', verifyToken, notice.deleteNoticeById);
router.post('/getStudentByClassId', verifyToken, notice.getStudentByClassId);
router.get(
  '/getAllNoticeByStudentId',
  verifyToken,
  notice.getAllNoticeByStudentId
);

router.get(
  '/getStudentLatestNotice',
  verifyToken,
  notice.getStudentLatestNotice
);

//NOTE  - Question Bank
router.post(
  '/uploadBulkQuestion',
  multer().single('file'),
  verifyToken,
  bulkUpload.questionBulkWithConverter
);
router.post(
  '/createQuestionBank',
  verifyToken,
  questionBank.createQuestionBank
);
router.get('/getQuestionById/:id', verifyToken, questionBank.getQuestionById);
router.get('/getAllQuestion', verifyToken, questionBank.getAllQuestion);
router.post(
  '/getAllQuestionWithId',
  verifyToken,
  questionBank.getAllQuestionWithId
);
router.put(
  '/updateQuestionBankId',
  verifyToken,
  questionBank.updateQuestionBankId
);
router.delete(
  '/deleteQuestionById/:id',
  verifyToken,
  questionBank.deleteQuestionById
);
router.post('/filterAnswerById', verifyToken, questionBank.filterAnswerById);
router.get(
  '/getQuestionDetailsById/:id',
  verifyToken,
  questionBank.getQuestionDetailsById
); //TODO - use for web and mobile
router.post(
  '/getQuestionsByBatchType',
  verifyToken,
  questionBank.getQuestionsByBatchType
); //TODO - use for web and mobile
router.post(
  '/getQuestionBatchSubject',
  verifyToken,
  questionBank.getQuestionBatchSubject
); //TODO - use for web and mobile
router.post(
  '/getRelatedQuestionsById',
  verifyToken,
  questionBank.getRelatedQuestionsById
); //TODO - use for web and mobile
router.post(
  '/getScholarshipQuestions',
  verifyToken,
  questionBank.getScholarshipQuestions
); //TODO - use for web and mobile
router.patch(
  '/updateQuestionsStatus',
  verifyToken,
  questionBank.updateQuestionsStatus
); //TODO - use for admin


//NOTE  - TEST
router.post('/createTest', verifyToken, test.createTest);
router.post('/createTestByStudent', verifyToken, test.createTestByStudent);
router.get('/getAllTest', verifyToken, test.getAllTest);
router.get('/getTestById/:id', verifyToken, test.getTestById);
router.patch('/updateTestById/:id', verifyToken, test.updateTestById);
router.delete('/deleteTestById/:id', verifyToken, test.deleteTestById);
router.post('/getTestByUserId', verifyToken, test.getTestByUserId);
router.post('/getOwnTestByUserId', verifyToken, test.getOwnTestByUserId);
router.get('/getTestQuestions', verifyToken, test.getTestQuestions);
router.get('/getOwnTest', verifyToken, test.getOwnTest);

//NOTE  - SCHOLARSHIP
router.post('/createScholarship', verifyToken, scholarship.createScholarship);
router.post(
  '/createScholarshipWithClass',
  verifyToken,
  scholarship.createScholarshipWithClass
);
router.get(
  '/getSingleScholarshipById/:id',
  verifyToken,
  scholarship.getSingleScholarshipById
);
router.get(
  '/getScholarshipClassByUserId',
  verifyToken,
  scholarship.getScholarshipClassByUserId
);
router.get('/getAllScholarship', verifyToken, scholarship.getAllScholarship);
router.get(
  '/getAllScholarshipClass',
  verifyToken,
  scholarship.getAllScholarshipClass
);
router.put(
  '/updateScholarshipById',
  verifyToken,
  scholarship.updateScholarshipById
);
router.put(
  '/updateScholarshipClassById',
  verifyToken,
  scholarship.updateScholarshipClassById
);
router.delete(
  '/deleteScholarshipById/:id',
  verifyToken,
  scholarship.deleteScholarshipById
);
router.post('/applyScholarship', verifyToken, scholarship.applyScholarship);
router.get(
  '/getAllScholarshipApply',
  verifyToken,
  scholarship.getAllScholarshipApply
);
router.get(
  '/getScholarshipStatus',
  verifyToken,
  scholarship.getScholarshipStatus
);
router.post(
  '/getBatchTypeByMultiplesClassId',
  verifyToken,
  scholarship.getBatchTypeByMultiplesClassId
);
router.get(
  '/getScholarshipClassOnlyById/:id',
  verifyToken,
  scholarship.getScholarshipClassOnlyById
);
router.delete(
  '/deleteScholarshipClassById/:id',
  verifyToken,
  scholarship.deleteScholarshipClassById
);

router.post(
  '/createScholarshipTest',
  verifyToken,
  scholarship.createScholarshipTest
);

router.get(
  '/getAllScholarshipTest',
  verifyToken,
  scholarship.getAllScholarshipTest
);

router.post(
  '/startScholarshipTest',
  verifyToken,
  scholarship.startScholarshipTest
);

router.get(
  '/getScholarshipDetails',
  verifyToken,
  scholarship.getScholarshipDetails
);

router.get(
  '/getScholarshipTestById/:id',
  verifyToken,
  scholarship.getScholarshipTestById
);

//NOTE  - module and permission
router.post('/createModule', verifyToken, permission.createModules);
router.put('/updateModules', verifyToken, permission.updateModules);
router.post('/permission', verifyToken, permission.createPermission);
router.get('/getAllRoute', verifyToken, permission.getAllRoute);
router.get('/getRouteById/:id', verifyToken, permission.getRouteById);
router.get(
  '/getPermissionByStaffId/:id',
  verifyToken,
  permission.getPermissionByStaffId
);
router.get(
  '/getPermissionByRoleId/:id',
  verifyToken,
  permission.getPermissionByRoleId
);
router.put(
  '/updatePermissionByRoleId',
  verifyToken,
  permission.updatePermissionByRoleId
);
router.delete('/deleteRouteById/:id', verifyToken, permission.deleteRouteById);

//NOTE  - WantToBe
router.post('/createWantToBe', verifyToken, wantToBe.createWantToBe);
router.get('/getWantToBeById/:id', verifyToken, wantToBe.getWantToBeById);
router.get('/getAllWantToBe', verifyToken, wantToBe.getAllWantToBe);
router.put('/updateWantToBeById', verifyToken, wantToBe.updateWantToBeById);
router.delete(
  '/deleteWantToBeById/:id',
  verifyToken,
  wantToBe.deleteWantToBeById
);

//NOTE  - MentorshipHelp
router.post(
  '/createMentorshipHelp',
  verifyToken,
  mentorshipHelp.createMentorshipHelp
);
router.post(
  '/createMentorshipFeature',
  verifyToken,
  mentorshipHelp.createMentorshipFeature
);
router.post(
  '/createMentorshipWhyNeed',
  verifyToken,
  mentorshipHelp.createMentorshipWhyNeed
);
router.get(
  '/getMentorshipHelpById/:id',
  verifyToken,
  mentorshipHelp.getMentorshipHelpById
);
router.get(
  '/getAllMentorshipHelp',
  verifyToken,
  mentorshipHelp.getAllMentorshipHelp
);
router.put(
  '/updateMentorshipHelpById',
  verifyToken,
  mentorshipHelp.updateMentorshipHelpById
);
router.put(
  '/updateMentorshipFeatureById',
  verifyToken,
  mentorshipHelp.updateMentorshipFeatureById
);
router.put(
  '/updateMentorshipWhyYouNeedById',
  verifyToken,
  mentorshipHelp.updateMentorshipWhyYouNeedById
);
router.delete(
  '/deleteMentorshipHelpById/:id',
  verifyToken,
  mentorshipHelp.deleteMentorshipHelpById
);
router.delete(
  '/deleteMentorshipFeatureById/:id',
  verifyToken,
  mentorshipHelp.deleteMentorshipFeatureById
);
router.delete(
  '/deleteMentorshipWhyYouNeedById/:id',
  verifyToken,
  mentorshipHelp.deleteMentorshipWhyYouNeedById
);

//NOTE  - INSTRUCTION
router.post('/createInstruction', verifyToken, setting.createInstruction);
router.get('/getInstructionById/:id', verifyToken, setting.getInstructionById);
router.get('/getAllInstruction', verifyToken, setting.getAllInstruction);
router.put('/updateSettingByType', setting.updateSettingByType);
router.delete('/deleteInstruction/:id', verifyToken, setting.deleteInstruction);
router.get('/getSettingByType', setting.getSettingByType);
router.put('/updateInstructionByType', setting.updateSettingByType);
router.get('/getOnlySiteSetting', setting.getOnlySiteSetting);
router.get('/getSettingForAdmin', setting.getSettingForAdmin);
router.get('/getBookmarkImages', verifyToken, setting.getBookmarkImages);

//NOTE - User
router.post('/generateOtp', users.generateOtp);
router.post('/verifyOtp', users.verifyMobileOtp);
router.post('/userSignup', users.usersSignUp);
router.post('/loginWithMpin', users.userLoginWithMpin);
router.post('/loginWithUserId', users.loginWithUsersId);
router.put('/updateUserMPin', verifyToken, users.updateUserMPin);
router.post('/generateToken', verifyToken, users.generateToken);
router.patch('/deleteUserById/:id', verifyToken, users.deleteUserById); //TODO - Only use for testing
router.post(
  '/getStudentByBatchTypeId',
  verifyToken,
  users.getStudentByBatchTypeId
);
router.put('/updateUserMPinById', verifyToken, users.updateUserMPinById);

//NOTE - Students routes
router.get('/getAllStudents', verifyToken, student.getAllStudents);
//router.get('/getStudentById',verifyToken, student.getStudentById);
router.get('/getStudentById/:id', verifyToken, student.getStudentById);
router.patch('/updateStudentById/:id', verifyToken, student.updateStudentByID);
router.get(
  '/geSecondaryStudents/:id',
  verifyToken,
  student.getSecondaryStudentByID
);
router.patch('/uploadAvatar', verifyToken, student.uploadAvatar);
router.post('/adminAddStudents', verifyToken, student.adminAddStudents); //TODO - Use for Admin, if wants to add student
router.patch(
  '/adminUpdateStudentById',
  verifyToken,
  student.adminUpdateStudentDetails
);

router.get('/getAllUserDetails/:id', verifyToken, student.getAllUserDetails);
router.post('/switchAccount', verifyToken, student.switchAccount);
router.put(
  '/updateUserSubscriptionType',
  verifyToken,
  student.updateUserSubscriptionType
); //TODO - only for admin
router.patch('/inactiveUser/:id', verifyToken, student.inactiveUser); //TODO - use in web and mobile
router.patch('/activateUser/:id', verifyToken, student.activateUser); //TODO - use in Admin panel
router.patch('/updateAppTourStatus', verifyToken, student.updateAppTourStatus); //TODO - use in Admin panel

//NOTE - Teacher Routes
router.get('/getAllTeacher', verifyToken, teacher.getAllTeacherDetails);
router.get('/getTeacherById/:id', verifyToken, teacher.getTeacherByID);
router.put('/updateTeacherById', verifyToken, teacher.updateTeacherById);

router.delete('/deleteTeacherById/:id', verifyToken, teacher.deleteTeacherById);
router.post('/teachCreateSchedule', verifyToken, teacher.teachCreateSchedule); //TODO - Teacher create his/her availability.
router.get('/getAllMentor', verifyToken, teacher.getAllMentor);
router.get('/getEducators', verifyToken, teacher.getEducators);

//NOTE - Staff Routes
router.get('/getAllStaff', verifyToken, staffs.getAllStaffDetails);
router.get('/getStaffById/:id', verifyToken, staffs.getStaffDetailsByID);
router.patch('/updateStaffById/:id', verifyToken, staffs.updateStaffById);
router.delete('/deleteStaffById/:id', verifyToken, staffs.deleteStaffById);
router.get(
  '/getAllStaffDetailsBySubjectId',
  verifyToken,
  staffs.getAllStaffDetailsBySubjectId
);
router.get('/getAllStaffOnly', verifyToken, staffs.getAllStaffOnly);
router.patch(
  '/updateStaffBatchDetails/:id',
  verifyToken,
  staffs.updateStaffBatchDetails
);

//NOTE - Package and Subscription Routes
router.post(
  '/createNewPackages',
  verifyToken,
  packageSubscription.createPackages
);
router.post(
  '/createSubscriptions',
  verifyToken,
  packageSubscription.createSubscriptionPlan
);
router.post(
  '/addMultipleClass',
  verifyToken,
  packageSubscription.addMultipleClasses
);
router.get(
  '/getProductsById/:id',
  verifyToken,
  packageSubscription.getPackageDetailsById
);
router.post('/packageList', verifyToken, packageSubscription.packageListById);
router.get('/getAllPackages', verifyToken, packageSubscription.getAllPackages);
router.get(
  '/getPackagesMonth',
  verifyToken,
  packageSubscription.getPackagesMonth
);

router.get(
  '/getPackagesById/:id',
  verifyToken,
  packageSubscription.getPackageById
);

router.get(
  '/getAllSubscriptions',
  verifyToken,
  packageSubscription.getAllSubscriptions
);
router.get(
  '/getSubscriptionById/:id',
  verifyToken,
  packageSubscription.getSubscriptionDetailsById
);
router.get(
  '/getSubscriptionByPackageId/:id',
  verifyToken,
  packageSubscription.getSubscriptionByPackageId
);

router.patch(
  '/updatePackageById/:id',
  verifyToken,
  packageSubscription.updatePackageById
);
router.patch(
  '/updateSubscriptionById/:id',
  verifyToken,
  packageSubscription.updateSubscriptionById
);
router.get(
  '/getAllPackagesForBoard',
  verifyToken,
  packageSubscription.getAllPackagesForBoard
);
router.patch(
  '/updateIndividualPackage',
  verifyToken,
  packageSubscription.updateIndividualPackage
);
router.get(
  '/getClassDetailsById/:id',
  verifyToken,
  packageSubscription.getClassDetailsById
);

//NOTE - Order Routes
router.get('/getAllOrdersList', verifyToken, order.getAllOrdersList);
router.get('/getOrderById/:id', verifyToken, order.getOrderDetailsById);
router.get(
  '/getOrderDetailsByStudentId',
  verifyToken,
  order.getOrderDetailsByStudentId
);
router.get(
  '/getStudentAllOrderById',
  verifyToken,
  order.getStudentAllOrderById
);

//NOTE - Payment Routes
router.get('/getAllPaymentList', verifyToken, payments.getAllPaymentList);
router.get(
  '/getPaymentDetailsById/:id',
  verifyToken,
  payments.getPaymentDetailsById
);
router.post('/PaymentVerification', verifyToken, payments.PaymentVerification);
router.post('/initiatePayment', verifyToken, payments.initiatePayment);

router.post('/payment-details/confirmation', payments.paymentConfirmation);
router.post('/getPaymentStatus', payments.getPaymentStatus);

//NOTE - Revision Routes
router.post('/createRevisionList', verifyToken, revisions.createNewRevision);
router.get('/getAllRevisions', verifyToken, revisions.getAllRevisions);
router.get(
  '/getRevisionsById/:id',
  verifyToken,
  revisions.getRevisionsDetailsById
);
router.post(
  '/getRevisionByCategory',
  verifyToken,
  revisions.getRevisionByCategory
);
router.put('/updateRevisionById', verifyToken, revisions.updateRevisionById);
router.delete(
  '/deleteRevisionById/:id',
  verifyToken,
  revisions.deleteRevisionDetailsById
);
router.post(
  '/getAllRevisionBookmark',
  verifyToken,
  revisions.getAllRevisionBookmark
);

//NOTE - Student Attempt Test
router.post('/testAttempted', verifyToken, studentTestMap.testAttempted);
router.get(
  '/getTestAttemptedCount',
  verifyToken,
  studentTestMap.getTestAttemptedCount
);
router.get('/getAttemptCount', verifyToken, studentTestMap.getAttemptCount);

router.post('/submitTest', verifyToken, studentTestMap.submitTest);

//NOTE - Test Reports
router.get('/getAllTestReports', verifyToken, testReports.getAllTestReports); // NOTE - use on admin panel
router.post('/getTestReportById', verifyToken, testReports.getTestReportById); // NOTE - use on admin panel
router.post('/getScoreSummary', verifyToken, testReports.getScoreSummary); //NOTE - use on mobile and web
router.post('/timeSpendForTest', verifyToken, testReports.timeSpendForTest); //NOTE - use on mobile and web
router.post('/questionAnalysis', verifyToken, testReports.questionAnalysis); //NOTE - use on mobile and web
router.post('/getTestReport', verifyToken, testReports.getTestReport); //NOTE - use on mobile and web
router.post(
  '/questionTimeAnalysis',
  verifyToken,
  testReports.questionTimeAnalysis
); //NOTE - use on mobile and web
router.post('/getExamSummary', verifyToken, testReports.getExamSummary); //NOTE - use on mobile and web

router.post(
  '/getOwnTestReportById',
  verifyToken,
  testReports.getOwnTestReportById
); // NOTE - use on admin panel

//NOTE - Excel sheet
router.get(
  '/studentExcelDownload',
  excelVerifyToken,
  excelSheets.studentExcelDownload
);
router.get(
  '/teacherExcelDownload',
  excelVerifyToken,
  excelSheets.staffExcelDownload
);
router.get(
  '/feedbackExcelDownload',
  excelVerifyToken,
  excelSheets.feedbackExcelDownload
);
router.get(
  '/scholarshipExcelDownload',
  excelVerifyToken,
  excelSheets.scholarshipExcelDownload
);
router.get(
  '/enquiryExcelDownload',
  excelVerifyToken,
  excelSheets.enquiryExcelDownload
);
router.get(
  '/stateExcelDownload',
  excelVerifyToken,
  excelSheets.stateExcelDownload
);
router.get(
  '/cityExcelDownload',
  excelVerifyToken,
  excelSheets.cityExcelDownload
);

router.get(
  '/subjectExcelDownload',
  excelVerifyToken,
  excelSheets.subjectExcelDownload
);

router.get(
  '/topicExcelDownload',
  excelVerifyToken,
  excelSheets.topicExcelDownload
);

router.get(
  '/requestCallExcelDownload',
  excelVerifyToken,
  excelSheets.requestCallExcelDownload
);

//NOTE  - STATE
router.post('/addState', verifyToken, state.createState);
router.get('/getStateById/:id', verifyToken, state.getStateById);
router.get('/getAllState', state.getAllState);
router.put('/updateStateById', verifyToken, state.updateStateById);
router.delete('/deleteStateById/:id', verifyToken, state.deleteStateById);

//NOTE  - CITY
router.post('/addCity', verifyToken, city.addCity);
router.get('/getCityById/:id', verifyToken, city.getCityById);
router.get('/getAllCityByStateId/:id', verifyToken, city.getAllCityByStateId);
router.post(
  '/getCityByMultipleStateId',
  verifyToken,
  city.getCityByMultipleStateId
);
router.get('/getAllCity', verifyToken, city.getAllCity);
router.put('/updateCityById', verifyToken, city.updateCityById);
router.delete('/deleteCityById/:id', verifyToken, city.deleteCityById);

//NOTE  - Enquries
router.post('/createEnquiry', enquiry.createEnquiry);
router.get('/getEnquiryById/:id', verifyToken, enquiry.getEnquiryById);
router.get('/getAllEnquiry', verifyToken, enquiry.getAllEnquiry);

//NOTE  - Highlight
router.post('/createHighlight', verifyToken, highlight.createHighlight);
router.get('/getHighlightById/:id', verifyToken, highlight.getHighlightById);
router.get('/getAllHighlight', verifyToken, highlight.getAllHighlight);
router.put('/updateHighlightById', verifyToken, highlight.updateHighlightById);
router.delete('/deleteHighlight/:id', verifyToken, highlight.deleteHighlight);

//NOTE  - Activity
router.post('/createActivity', verifyToken, activity.createActivity);
router.get('/getAllActivity', verifyToken, activity.getAllActivity);
router.get('/getActivityById/:id', verifyToken, activity.getActivityById);
router.get(
  '/getActivityByStudentId/:id',
  verifyToken,
  activity.getActivityByStudentId
);
router.put('/updateActivityById', verifyToken, activity.updateActivityById);
router.delete(
  '/deleteActivityById/:id',
  verifyToken,
  activity.deleteActivityById
);

//NOTE - Assignments
router.post('/createAssignments', verifyToken, assignment.createAssignments);
router.get('/getAllAssignments', verifyToken, assignment.getAllAssignments);
router.get('/getAssignmentById/:id', verifyToken, assignment.getAssignmentById);
router.patch(
  '/updateAssignmentById',
  verifyToken,
  assignment.updateAssignmentById
);
router.patch(
  '/deleteAssignmentById/:id',
  verifyToken,
  assignment.deleteAssignmentById
);
router.post(
  '/getAssignmentsByStudentId',
  verifyToken,
  assignment.getAssignmentsByStudentId
); //TODO - use only for mobile and web screen
router.get(
  '/getQuestionByAssignmentId/:id',
  verifyToken,
  assignment.getQuestionByAssignmentId
); //TODO - use only for mobile and web screen

router.get(
  '/getAssignmentQuestionFile/:id',
  verifyToken,
  assignment.getAssignmentQuestionFile
); //TODO - use only for mobile and web screen

router.post('/uploadAnswerSheet', verifyToken, assignment.uploadAnswerSheet); //TODO - use only for mobile and web screen
router.post(
  '/assignmentAtttempted',
  verifyToken,
  assignment.assignmentAtttempted
); //TODO - use only for mobile and web screen

router.get(
  '/getAllAssignmentReports',
  verifyToken,
  assignment.getAllAssignmentReports
);

router.get(
  '/getAssignmentReportById',
  verifyToken,
  assignment.getAssignmentReportById
);

//NOTE  - schedule
router.post(
  '/CreateTeacherSchedule',
  verifyToken,
  schedule.CreateTeacherSchedule
);
router.post(
  '/getScheduleByTeacherId',
  verifyToken,
  schedule.getScheduleByTeacherId
);
router.post('/TeacherBooking', verifyToken, schedule.TeacherBook);
router.get(
  '/getAllScheduleByTeacherId',
  verifyToken,
  schedule.getAllScheduleByTeacherId
);
router.get(
  '/getAllScheduleOfMonthByTeacherId',
  verifyToken,
  schedule.getAllScheduleOfMonthByTeacherId
);
router.get(
  '/getAllScheduleOfMonthByTeacherIdAdmin',
  verifyToken,
  schedule.getAllScheduleOfMonthByTeacherIdAdmin
);
router.get(
  '/getAllScheduleByTeacherIdMobileApp',
  verifyToken,
  schedule.getAllScheduleByTeacherIdMobileApp
);

router.get(
  '/getAllEventByTeacherId',
  verifyToken,
  schedule.getAllEventByTeacherId
);

router.get('/getCalendarMonth', verifyToken, schedule.getCalendarMonth);
router.get(
  '/getCalendarMonthMobileApp',
  verifyToken,
  schedule.getCalendarMonthMobileApp
);
router.get(
  '/getTeacherScheduleDate',
  verifyToken,
  schedule.getTeacherScheduleDate
);

//NOTE  - requestCall
router.post('/createRequestCall', verifyToken, requestCall.createRequestCall);
router.get('/getRequestCallById', verifyToken, requestCall.getRequestCallById);
router.get('/getAllRequestCall', verifyToken, requestCall.getAllRequestCall);

//NOTE  - PAGE BACK LINK
router.post(
  '/createPageBackLink',
  verifyToken,
  pageBackLink.createPageBackLink
);
router.get(
  '/getPageBackLinkById/:id',
  verifyToken,
  pageBackLink.getPageBackLinkById
);
router.get('/getAllPageBackLink', verifyToken, pageBackLink.getAllPageBackLink);
router.put(
  '/updateBackLinksById',
  verifyToken,
  pageBackLink.updateBackLinksById
);

//NOTE - Role Permission
router.post('/createRoles', verifyToken, role.createRoles);
router.get('/getAllPermissionRoles', verifyToken, role.getAllPermissionRoles);
router.get('/getPermissionRoles', role.getPermissionRoles); //TODO - Will get data without superadmin

router.get('/getRoleById/:id', verifyToken, role.getRolesById);
router.patch('/updateRoleById/:id', verifyToken, role.updateRolesById);
router.delete('/deleteRoleById/:id', verifyToken, role.deleteRoleById);

//NOTE - Bulk Upload
router.get('/getAllBulkFiles', verifyToken, bulkUpload.getAllBulkFiles);
router.post('/uploadStudentExcel', verifyToken, bulkUpload.uploadStudentExcel);
router.post('/uploadStaffExcel', verifyToken, bulkUpload.uploadStaffExcel);
router.post('/uploadTopicExcel', verifyToken, bulkUpload.uploadTopicExcel);
router.post(
  '/uploadRevisionExcel',
  verifyToken,
  bulkUpload.uploadRevisionExcel
);
//router.post("/uploadBulkContent", verifyToken, bulkUpload.uploadBulkContent);
router.post('/uploadBulkContent', verifyToken, bulkUpload.uploadBulkContentNew);

router.post('/uploadBulkQuestions', verifyToken, bulkUpload.uploadQuestions);
router.post('/uploadStateExcel', verifyToken, bulkUpload.uploadStateExcel);
router.post('/uploadCityExcel', verifyToken, bulkUpload.uploadCityExcel);
router.post('/uploadChapterExcel', verifyToken, bulkUpload.uploadChapterExcel);
router.post(
  '/uploadGrivancesCategoryExcel',
  verifyToken,
  bulkUpload.uploadGrivancesCategoryExcel
);
router.post(
  '/uploadGrivancesSubCategoryExcel',
  verifyToken,
  bulkUpload.uploadGrivancesSubCategoryExcel
);

//NOTE - Internal Setting
router.post(
  '/createInternalSetting',
  verifyToken,
  internalSetting.createInternalSetting
);
router.get(
  '/getInternalSettingByUserId',
  internalSetting.getInternalSettingByUserId
);
router.put(
  '/updateInternalSettingByUserId',
  verifyToken,
  internalSetting.updateInternalSettingByUserId
);

//NOTE - WEB APIS

//NOTE - COURSE
router.get(
  '/getAllCoursesForWebApp',
  webVerifyToken,
  course.getAllCoursesForWebApp
);

//NOTE - BOARD
router.post(
  '/getBoardsByCourseIdForWebApp',
  webVerifyToken,
  board.getBoardsByCourseIdForWebApp
);

//NOTE - BOARD
router.post(
  '/getClassByBoardIdForWebApp',
  webVerifyToken,
  Class.getClassByBoardIdForWebApp

);

//NOTE - BatchType
router.post(
  '/getBatchTypeByClassIdForWebApp',
  webVerifyToken,
  batchType.getBatchTypeByClassIdForWebApp
);

//NOTE - BatchDate
router.post(
  '/getBatchDateByBatchTypeIdForWebApp',
  webVerifyToken,
  batchDate.getBatchDateByBatchTypeIdForWebApp
);

//NOTE - Quiz
router.post('/createQuiz', verifyToken, quiz.createQuiz);
router.get('/getAllQuiz', verifyToken, quiz.getAllQuiz);
router.get('/getQuizById/:id', verifyToken, quiz.getQuizById);
router.post('/getStudentQuizReport', verifyToken, quiz.getStudentQuizReport);

//NOTE - zoom meeting
router.post('/createZoom', zoom.createZoom);
router.post('/joinZoom', zoom.joinZoom);

//NOTE - rating
router.post('/addRating', verifyToken, rating.addRating);
router.get('/getRatingByUserId', verifyToken, rating.getRatingByUserId);
router.get('/getAllRating', verifyToken, rating.getAllRating);
router.delete(
  '/deleteRatingByUserId',
  verifyToken,
  rating.deleteRatingByUserId
);

//NOTE - zoom credential
router.post(
  '/addZoomCredential',
  verifyToken,
  zoomCredential.addZoomCredential
);
router.get(
  '/getZoomCredentialByTeacherId',
  verifyToken,
  zoomCredential.getZoomCredentialByTeacherId
);
router.get('/getAllCredential', verifyToken, zoomCredential.getAllCredential);
router.delete(
  '/deleteCredentialByTeacherId/:id',
  verifyToken,
  zoomCredential.deleteCredentialByTeacherId
);
router.put(
  '/updateCredentialById',
  verifyToken,
  zoomCredential.updateCredentialById
);

//NOTE - session allocation
router.post('/mentorAllocation', verifyToken, order.mentorAllocation);
router.get(
  '/getAllowedSessionByUserId',
  verifyToken,
  order.getAllowedSessionByUserId
);

//NOTE - RECENT ACTIVITY
router.post(
  '/addRecentActivity',
  verifyToken,
  recentActivity.addRecentActivity
);
//router.get("/getActivityOfUser", verifyToken, recentActivity.getActivityOfUser);
router.get(
  '/getActivityOfUser',
  verifyToken,
  recentActivity.getActivityOfUserNew
);
router.get(
  '/getActivityReportOfUser',
  verifyToken,
  recentActivity.getActivityOfUserCalculation
);
router.post('/addUserSpendTime', verifyToken, recentActivity.addUserSpendTime);
router.get('/getUserSpendTime', verifyToken, recentActivity.getUserSpendTime);

//router.get("/getActivityOfUserNew", verifyToken, recentActivity.getActivityOfUserNew);
//NOTE - RECENT ACTIVITY
router.get('/getUserLeaderBoard', verifyToken, leaderBoard.getUserLeaderBoard); //get user leader board
router.get('/DemoLeaderboard', verifyToken, leaderBoard.DemoLeaderboard); //get user leader board

//NOTE - converter
router.get('/convertS3Foldername', converterS3Name.convertS3Foldername);
router.get('/getS3Foldername', converterS3Name.getS3Foldername);
router.delete('/deleteContent/:id', verifyToken, converterS3Name.deleteContent);
router.get('/thumbnailConverter', converterS3Name.thumbnailConverter);
router.get('/getRecordings', event.getRecordings);

//SECTION - Parent App all apis

//NOTE - login apis
router.post('/parentgenerateOtp', login.parentgenerateOtp);
router.post('/parentVerifyOtp', login.parentVerifyOtp);
router.post('/parentLoginWithMpin', login.parentLoginWithMpin);

router.post(
  '/loginWithParentUserId',
  verifyToken,
  parentStudent.loginWithParentUserId
);
router.get('/getAllParentUsers', verifyToken, parentStudent.getAllParentUsers);

//TODO - grievance main
router.post('/createGrievance', verifyToken, grievances.createGrievance); //TODO - for mobile and web
router.get('/getAllGrievance', verifyToken, grievances.getAllGrievance);
router.get(
  '/getAllGrievanceByParentId',
  verifyToken,
  grievances.getAllGrievanceByParentId //TODO - for mobile and web
);

//TODO - grievance category
router.post(
  '/addGrievanceCategory',
  verifyToken,
  grievances.addGrievanceCategory
);
router.get(
  '/getAllGrievanceCategory',
  verifyToken,
  grievances.getAllGrievanceCategory //TODO - for admin
);
router.get(
  '/getAllGrievanceCategoryForWebApp',
  verifyToken,
  grievances.getAllGrievanceCategory //TODO - for mobile and web
);
router.get(
  '/getGrievanceCategoryById/:id',
  verifyToken,
  grievances.getGrievanceCategoryById
);
router.put(
  '/updateGrievanceCategoryById',
  verifyToken,
  grievances.updateGrievanceCategoryById
);
router.delete(
  '/deleteGrievanceCategoryById/:id',
  verifyToken,
  grievances.deleteGrievanceCategoryById
);

//TODO - grievance sub category
router.post(
  '/addGrievanceSubCategory',
  verifyToken,
  grievances.addGrievanceSubCategory
);
router.get(
  '/getAllGrievanceSubCategory',
  verifyToken,
  grievances.getAllGrievanceSubCategory
);
router.get(
  '/getGrievanceSubCategoryById/:id',
  verifyToken,
  grievances.getGrievanceSubCategoryById
);
router.get(
  '/getGrievanceSubCategoryByCategoryId/:id',
  verifyToken,
  grievances.getGrievanceSubCategoryByCategoryId
);

router.put(
  '/updateGrievanceSubCategoryById',
  verifyToken,
  grievances.updateGrievanceSubCategoryById
);
router.delete(
  '/deleteGrievanceSubCategoryById/:id',
  verifyToken,
  grievances.deleteGrievanceSubCategoryById
);

//NOTE - student attandence
router.post(
  '/studentMarkAttandence',
  verifyToken,
  attandence.studentMarkAttandence
);
router.post(
  '/staffMarkAttandence',
  verifyToken,
  attandence.staffMarkAttandence
);
router.get('/allUserAttandance', verifyToken, attandence.allUserAttandance);
router.get('/allStaffAttandance', verifyToken, attandence.allStaffAttandance);
router.get('/usersAttend', verifyToken, attandence.usersAttend);
router.get('/staffAttend', verifyToken, attandence.staffAttend);

router.get(
  '/getMentorshipHelpForMobile',
  verifyToken,
  mentorshipHelp.getMentorshipHelpForMobile
);

router.get('/test', syllabus.test);

//NOTE - Report data
router.get('/getUserGenderData', verifyToken, report.getUserGenderData);
router.get(
  '/studentDataByBatchTypeReport',
  verifyToken,
  report.studentDataByBatchTypeReport
);
router.get(
  '/getStudentTestReport/:id',
  verifyToken,
  report.getStudentTestReport
);
router.get(
  '/studentAttandenceReport',
  verifyToken,
  report.studentAttandenceReport
);
router.get(
  '/getUserSubscriptionDetails',
  verifyToken,
  report.getUserSubscriptionDetails
);
router.post('/userRegistered', verifyToken, report.userRegistered);
router.post('/liveClassReport', verifyToken, report.liveClassReport);
router.post('/demoContetn', verifyToken, bulkUpload.demoContetn);
router.post(
  '/testAndLearningContentReport',
  verifyToken,
  report.testAndLearningContentReport
);

//NOTE - new content crerate
router.post('/addNewContent', verifyToken, newSyllabus.addNewContent);
router.get('/getAllContent', verifyToken, newSyllabus.getAllContent);
router.get('/getContecntById/:id', verifyToken, newSyllabus.getContecntById);
router.put('/updateContentById', verifyToken, newSyllabus.updateContentById);

router.post(
  '/getSubjectByMultipleClassBatch',
  verifyToken,
  newSyllabus.getSubjectByMultipleClassBatch
);
router.post(
  '/getChapterByMultipleSubject',
  verifyToken,
  newSyllabus.getChapterByMultipleSubject
);
router.post(
  '/getTopicByMultipleChapter',
  verifyToken,
  newSyllabus.getTopicByMultipleChapter
);
router.post(
  '/getLearningContentById',
  verifyToken,
  newSyllabus.getLearnContentById //TODO - testing
);
router.get(
  '/getSyllabusContentByTopicId',
  verifyToken,
  newSyllabus.getSyllabContentByTopicId //TODO - testing
);
router.get('/resumeLearning', verifyToken, newSyllabus.resumeLearn); //TODO - testing
router.put(
  '/updateSyllabusContentById',
  verifyToken,
  newSyllabus.updateContentById
);
router.delete(
  '/deleteSyllabusContent/:id',
  verifyToken,
  newSyllabus.deleteSyllabusContent
);
router.patch(
  '/updateContentSequence',
  verifyToken,
  newSyllabus.updateContentSequence
);


//NOTE - Leadsquard
router.post('/createLead', leadsquard.createLead);
router.post('/captureLead', leadsquard.captureLead);
router.get('/retriveLead', leadsquard.retriveLead);

// CCAvenue Payment
router.post('/initPayment', ccPayment.initPayment);
router.post('/verifyPayment', ccPayment.paymentVerify);


// phonepay Payment
router.post('/initPaymentphonepay', verifyToken, phonepayPayment.initialPhonePePayment);
router.post('/initWebPaymentphonepay', verifyToken, phonepayPayment.initialWebPhonePePayment);

router.post('/verifyPaymentphonepay', verifyToken, phonepayPayment.phonepayPaymentConfirmation);
router.post('/initStorePayment', phonepayPayment.storePayment);
router.post('/verifyStorePayment', phonepayPayment.storePaymentConfirmation);


//NOTE - course product
router.post('/createCoursePackage', verifyToken, coursePackage.createCoursePackage);
router.put('/updateCoursePackageById', verifyToken, coursePackage.updateCoursePackageById);
router.get('/allCoursePackages', verifyToken, coursePackage.allCoursePackages);
router.get('/coursePackageById/:id', verifyToken, coursePackage.coursePackageById);
router.put('/updateCoursePackageStatus', verifyToken, coursePackage.updateCoursePackageStatus);
router.get('/coursePackagesByStudent', verifyToken, coursePackage.coursePackagesByStudent);
router.get('/userCoursePackageBypackageId', verifyToken, coursePackage.userCoursePackageBypackageId);



module.exports = router;
