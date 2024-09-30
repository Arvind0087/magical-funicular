import { configureStore } from "@reduxjs/toolkit";
// IMPORTED ADMIN LOGIN SLICE
import loginSlice from "./slices/login.slice";
import ResetPasswordSlice from "./slices/ResetPassword.slice.js";
import studentSlice from "./slices/student.slice";
import errorSlice from "./slices/error.slice";
import teacherSlice from "./slices/teacher.slice";
import signupSlice from "./slices/signup.slice";
import faqSlice from "./slices/faq.slice";
import eventsSlice from "./slices/events.slice";
import shortsSlice from "./slices/shorts.slice";
import calenderSlice from "./slices/calender.slice";
import onlySlice from "./slices/only.slice";
import noticeSlice from "./slices/notice.slice";
import doubtsSlice from "./slices/doubts.slice";
import subscriptionSlice from "./slices/subscription.slice";
import masterSlice from "./slices/packagemaster.slice";
import ordersSlice from "./slices/orders.slice";
import packageboardSlice from "./slices/packageboard.slice";
import revisionSlice from "./slices/revision.slice";
import userinfoSlice from "./slices/userinfo.slice";
import feedbackSlice from "./slices/feedback.slice";
import scholorshipsSlice from "./slices/scholorships.slice";
import routesSlices from "./slices/routes/routes.slices";
import scholorshipSlice from "./slices/scholorshipSlice/scholorship.slice";
import featureSlice from "./slices/FeatureSlice/feature.slice";
import youneedSlice from "./slices/WhyYouNeedSlice/youneed.slice";
import helpsSlice from "./slices/Helps/helps.slice";
import otpSlice from "./slices/otpslice/otp.slice";
import subjectsSlice from "./slices/subjectslice/subject.async";
import instructionSlice from "./slices/SiteSettingsSlice/Instruction.slice";
import gallerySlice from "./slices/GallerySlice/gallery.slice";
import permissionSlice from "./slices/permission/permission.slice";
import PaymentSettingsSlice from "./slices/SiteSettingsSlice/PaymentSetting.slice";
import testSlice from "./slices/TestSlice/test.slice";
import testreportSlice from "./slices/TestSlice/testreport.slice";
import liveclassSlice from "./liveclass/liveclass.slice";
import scholarshipAppSlice from "./slices/ScholarshipApplicationSlice/scholarshipApp.slice";
import enquirySlice from "./enquery/enquery.slice";
import attendanceSlice from "./slices/StudentAttendanceSlice/Attendance.slice";
import WebSlice from "./slices/SiteSettingsSlice/Web.slice";
import syllabusSlice from "./syllabuus/syllabus.slice";
import coursesSlice from "./course/course.slice";
import boardsSlice from "./board/board.slice";
import classSlice from "./class/class.slice";
import batchtypeSlice from "./batchtype/batchtype.slice";
import batchdateSlice from "./batchdate/batchdate.slice";
import subjectSlice from "./subject/subject.slice";
import chapterSlice from "./chapter/chapter.slice";
import bannerSlice from "./banner/banner.slice";
import StateSlice from "./state/states.slice";
import citySlice from "./city/cities.slice";
import wantSlice from "./wantotbe/wantotbe.slice";
import staffSlice from "./staff/staff.slice";
import paymentSlice from "./payment/payments.slice";
import changePasswordSlice from "./changepassword/changepassword.slice";
import dashboardSlice from "./dashboard/dashboard.slice";
import MobileSlice from "./slices/SiteSettingsSlice/Mobile.slice";
import AdminSlice from "./slices/SiteSettingsSlice/Admin.slice";
import assignmentSlice from "./slices/assignment/assignment.slice";
import historySlice from "./history/history.slice";
import activitySlice from "./activity/activity.slice";
import scheduleSlice from "./schedule/schedule.slice";
import doubtdemorquestSlice from "./doubtdemorequest/doubtdemorequest.slice";
import studentRequestSlice from "./StudentRequest/StudentRequest.slice";
import NoticeBackLinkSlice from "./slices/NoticeBackLinkSlice/NoticeBackLink.slice";
import rolesSlice from "./Roles/roles.slice";
import subjectFilterSlice from "redux/filter/subject/subject.slice";
import shortsFilterSlice from "redux/filter/shorts/shorts.slice";
import staffFilterSlice from "redux/filter/staff/staff.slice";
import galleryFilterSlice from "redux/filter/gallery manager/gallery.slice";
import ScholarshipFilterSlice from "redux/filter/scholarship/scholarshipClass/scholarship.slice";
import revisionFilterSlice from "redux/filter/revision/revision.slice";
import feedbackFilterSlice from "redux/filter/feedback/feedback.slice";
import bannerFilterSlice from "redux/filter/banner/banner.slice";
import studentBulkSlice from "redux/slices/bulkupload/studentbulk/studentBulk.slice";
import FilterActivitySlice from "./filter/Activity/Activity.slice";
import FilterNoticeSlice from "./filter/Notice/notice.slice";
import FilterQuestionBankSlice from "./filter/QuestionBank/QuestionBank.slice";
import myDataSlice from "redux/slices/individualSetting/individualSliceContainer";
import individualSettingSlice from "../redux/slices/individualSetting/individualSetting.slice";
import testReportFilterSlice from "./filter/TestReport/TestReport.slice";
import testQuestionsFilterSlice from "./filter/TestQuestions/TestQuestions.slice";
import staffBulkSlice from "redux/slices/bulkupload/StaffBulkSlice/StaffBulk.slice";
import studentFilterSlice from "./filter/student/student.slice";
import classFilterSlice from "./filter/class/class.slice";
import quizReportSlice from "redux/slices/QuizReportSlice/quiz.slice";
import highlightSlice from "redux/slices/TopHighlightSlice/highlight.slice";
// import questionBulkSlice from "redux/slices/bulkupload/questionbulk/questionBulk.slice";
import filterSlice from "./filter/filter.slice";
import topicBulkSlice from "redux/slices/bulkupload/topicBulkSlice/topicBulk.slice";
import chapterBulkSlice from "redux/slices/bulkupload/chapterBulkSlice/chapterBulk.slice";
import revisionBulkSlice from "redux/slices/bulkupload/revisionbulk/RevisionBulk.slice";
import staffAttendanceSlice from "redux/slices/StaffAttendanceSlice/Attendance.slice";
import PackageFilterSlice from "redux/filter/PackageMaster/packageMaster.slice";
import SubcriptionPlanFilterSlice from "redux/filter/SubscriptionPlan/SubscriptionPlan.slice";
import menupermissionSlice from "./menusPermission/menupermission";
import studentOwnTestSlice from "../redux/StudentOwnTestSlice/StudentOwnTest.slice";
import questionBankSlice from "./questionbank/questionbank.slice";
import mentorshippackageSlice from "./mentorshippackage/mentorshippackage.slice";
import FirebaseSettingsSlice from "redux/slices/SiteSettingsSlice/FirebaseSlice/Firebase.slice";
import ratingSlice from "./rating/rating.slice";
import zoomSettingSlice from "./ZoomSetting/ZoomSetting.slice";
import TopicSlice from "./slices/TopicSlice/Topic.slice";
import contentBulkSlice from "./slices/bulkupload/topicVideoBulkSlice/topicBulk.slice";
import grievancesSlice from "./grievances/grievances.slice";
import studentStrengthGraphSlice from "../redux/graph/studentStrengthslice";
import studentAttendanceGraphSlice from "../redux/graph/studentAttendanceslice";
import registeredSlice from "../redux/registeredUser/registered.slice";
import liveClassUserSlice from "../redux/liveUser/live.slice";
import liveTestContentSlice from "../redux/liveTestContentReport/liveTestContent.slice";
import sudentStatusSlice from "../redux/studentStatus/sudentStatus.slice";
import livechatSlice from "./liveChat/livechat.slice";
import productPackageSlice from "./productPackage/productPackage.slice";
import languageSlice from "../redux/language/language.slice";
import voucherSlice from "../redux/voucher/voucher.slice";
import freeresourceSlice from "../redux/freeResource/freeresource.slice";

export const store = configureStore({
  reducer: {
    menuPermission: menupermissionSlice,
    course: coursesSlice,
    board: boardsSlice,
    class: classSlice,
    batch: batchtypeSlice,
    batchdate: batchdateSlice,
    subject: subjectSlice,
    chapter: chapterSlice,
    banner: bannerSlice,
    state: StateSlice,
    liveChat: livechatSlice,
    package: productPackageSlice,
    city: citySlice,
    wants: wantSlice,
    staff: staffSlice,
    payments: paymentSlice,
    changePassword: changePasswordSlice,
    dashboard: dashboardSlice,
    registeredUser: registeredSlice,
    liveClassUser: liveClassUserSlice,
    enquiry: enquirySlice,
    liveclass: liveclassSlice,
    liveTestContent: liveTestContentSlice,
    history: historySlice,

    mentorshippackage: mentorshippackageSlice,
    freeresource: freeresourceSlice,
    login: loginSlice,
    ResetPassword: ResetPasswordSlice,
    userinfo: userinfoSlice,

    student: studentSlice,
    language: languageSlice,
    voucher: voucherSlice,
    error: errorSlice,
    teachers: teacherSlice,
    signup: signupSlice,
    syllabus: syllabusSlice,
    events: eventsSlice,
    faq: faqSlice,
    shorts: shortsSlice,
    calender: calenderSlice,
    only: onlySlice,
    notice: noticeSlice,
    doubts: doubtsSlice,
    subscription: subscriptionSlice,
    master: masterSlice,

    orders: ordersSlice,
    packageboard: packageboardSlice,
    revision: revisionSlice,
    scholorships: scholorshipsSlice,
    feedback: feedbackSlice,
    routesRedux: routesSlices,

    feature: featureSlice,
    youneed: youneedSlice,
    helps: helpsSlice,
    otp: otpSlice,

    subjects: subjectsSlice,
    scholorship: scholorshipSlice,
    questionbank: questionBankSlice,
    instruction: instructionSlice,
    gallery: gallerySlice,
    permission: permissionSlice,

    PaymentSettings: PaymentSettingsSlice,
    tests: testSlice,
    testreport: testreportSlice,

    scholarshipApp: scholarshipAppSlice,

    attendance: attendanceSlice,
    web: WebSlice,
    mobile: MobileSlice,
    assignment: assignmentSlice,
    activity: activitySlice,
    schedule: scheduleSlice,
    doubtdemorquest: doubtdemorquestSlice,
    StudentRequest: studentRequestSlice,
    NoticeBackLink: NoticeBackLinkSlice,
    roles: rolesSlice,
    subjectFilter: subjectFilterSlice,
    shortsFilter: shortsFilterSlice,
    staffFilter: staffFilterSlice,
    galleryFilter: galleryFilterSlice,
    revisionFilter: revisionFilterSlice,
    feedbackFilter: feedbackFilterSlice,
    studentFilter: studentFilterSlice,
    studentBulk: studentBulkSlice,
    ScholarshipClassFilter: ScholarshipFilterSlice,
    bannerFilter: bannerFilterSlice,
    FilterActivty: FilterActivitySlice,
    FilterQuestionBank: FilterQuestionBankSlice,
    FilterNotice: FilterNoticeSlice,
    myDataSlice: myDataSlice,
    individualSetting: individualSettingSlice,
    TestReportFilter: testReportFilterSlice,
    TestQuestionsFilter: testQuestionsFilterSlice,
    staffBulk: staffBulkSlice,
    quizReport: quizReportSlice,
    admin: AdminSlice,
    classFilter: classFilterSlice,
    highlight: highlightSlice,
    filterInfo: filterSlice,
    topicBulk: topicBulkSlice,
    chapterBulk: chapterBulkSlice,
    revisionBulk: revisionBulkSlice,
    staffAttendance: staffAttendanceSlice,
    PackageFilter: PackageFilterSlice,
    SubscriptionPlanFilter: SubcriptionPlanFilterSlice,
    ownTest: studentOwnTestSlice,
    // ownQuestion: StudentOwnQuesSlice,
    FirebaseSettings: FirebaseSettingsSlice,
    ratings: ratingSlice,
    zooSetting: zoomSettingSlice,
    Topic: TopicSlice,
    contentBulk: contentBulkSlice,
    grievances: grievancesSlice,
    perBatchStudentStrength: studentStrengthGraphSlice,
    perStudentAttendance: studentAttendanceGraphSlice,
    studentStatus: sudentStatusSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
