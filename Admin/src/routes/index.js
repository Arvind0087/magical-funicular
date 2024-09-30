import { Navigate, useRoutes } from "react-router-dom";
import GuestGuard from "auth/GuestGuard";
import CompactLayout from "layouts/compact";
import DashboardLayout from "layouts/dashboard";
import BlankLayout from "layouts/BlankLayout";
import {
  Banner,
  Batch,
  BatchDate,
  Board,
  ChangePassword,
  Chapter,
  City,
  Class,
  Content,
  Course,
  CreateBanner,
  CreateBatch,
  CreateBatchDate,
  CreateBoard,
  CreateChapter,
  CreateClass,
  CreateContent,
  CreateCourse,
  CreateFeature,
  CreateGallery,
  CreateHowItHelps,
  CreateLiveClass,
  CreatePackage,
  CreatePakacgeSubscription,
  CreateShorts,
  CreateStaff,
  CreateSubject,
  CreateSubscriptionList,
  CreateTopic,
  CreateWantToBe,
  CreateWhyYouNeed,
  Dashboard,
  Doubts,
  DoubtsReply,
  Enquiry,
  Feature,
  Gallery,
  HowItHelps,
  Instructions,
  LiveClass,
  Login,
  NewPassword,
  Orders,
  Package,
  PackageSubscription,
  PackageSubscriptionList,
  Page404,
  PaymentSettings,
  Payments,
  Permission,
  ResetPassword,
  Schedule,
  CreateSchedule,
  ScholarshipApplication,
  Shorts,
  SiteSettings,
  State,
  Subject,
  Topic,
  VerifyCode,
  WantToBe,
  WhyYouNeed,
  ZoomMeeting,
  CreateFaq,
  Faq,
  CreateOnlyForYou,
  OnlyForYou,
  CreateStudent,
  StudentProfile,
  StudentAttendance,
  QuestionBulkUpload,
  Notice,
  CreateNotice,
  Revision,
  CreateRevision,
  UploadBulkRevision,
  TestReportList,
  TestReportId,
  TestQuestion,
  QuestionBank,
  CreateQuestionBank,
  TestQuestionView,
  Scholarship,
  CreateScholarship,
  ScholarshipClass,
  CreateScholarshipClass,
  HistoryLive,
  Assignment,
  CreateAssignment,
  AssignmentResult,
  DoubtDemoRequest,
  Activity,
  BulkUploadStudent,
  IndivisualSetting,
  Students,
  StudentRequest,
  Roles,
  Feedback,
  // CreateTest,
  Staff,
  BulkUploadStaff,
  QuizReportList,
  QuizReportId,
  TopHighlight,
  CreateHighlight,
  Offline,
  Online,
  BulkTopic,
  StaffAttendance,
  Questions,
  BulkVideo,
  StudentOwnTest,
  StudentOwnTestId,
  Ratings,
  LiveClassRatings,
  MentorshipPackage,
  ZoomSetting,
  FireBaseSetting,
  CreateZoomSetting,
  ScholarshipTest,
  CreateScholarshipTest,
  ImagesBookmark,
  ScholarshipTestReport,
  ProductPackage,
  CreateProductPackage,
  Category,
  SubCategory,
  GrievancesList,
  CreateVideoManagerBulk,
  ChapterBulkUpload,
  YoutubeMeeting,
  Language,
  CreateLanguage,
  Voucher,
  CreateVoucher,
  OrderHistory,
  StudentProfileinPackage,
  StudentProfileinDashboard,
  PyqsList,
  CreatePyqs,
  ModalPaperList,
  CreateModalPaper,
  FreeLiveClass,
  CreateFreeLiveClass,
} from "./elements";
import AuthMiddleware from "layouts/Middleware/AuthMiddleware";
import NavigateMiddleware from "layouts/Middleware/NavigateMiddleware";
import RoutePermissionMiddleware from "layouts/Middleware/RoutePermissionMiddleware";

export default function Router() {
  return useRoutes([
    {
      path: "auth",
      children: [
        {
          path: "login",
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          element: <CompactLayout />,
          children: [
            { path: "reset-password", element: <ResetPassword /> },
            { path: "new-password", element: <NewPassword /> },
            { path: "verify", element: <VerifyCode /> },
          ],
        },
      ],
    },
    {
      path: "app",
      element: (
        <AuthMiddleware>
          <NavigateMiddleware>
            <RoutePermissionMiddleware>
              <DashboardLayout />
            </RoutePermissionMiddleware>
          </NavigateMiddleware>
        </AuthMiddleware>
      ),
      children: [
        { path: "dashboard", element: <Dashboard /> },

        // COURSE
        { path: "master/course", element: <Course /> },
        { path: "master/course/create", element: <CreateCourse /> },
        { path: "master/course/edit/:id", element: <CreateCourse /> },
        // BOARD
        { path: "master/board", element: <Board /> },
        { path: "master/board/create", element: <CreateBoard /> },
        { path: "master/board/edit/:id", element: <CreateBoard /> },
        // CLASS
        { path: "master/class", element: <Class /> },
        { path: "master/class/create", element: <CreateClass /> },
        { path: "master/class/edit/:id", element: <CreateClass /> },
        // BATCH TYPE
        { path: "master/batch-type", element: <Batch /> },
        { path: "master/batch-type/create", element: <CreateBatch /> },
        { path: "master/batch-type/edit/:id", element: <CreateBatch /> },
        // BATCH DATE
        { path: "master/batch-date", element: <BatchDate /> },
        { path: "master/batch-date/create", element: <CreateBatchDate /> },
        { path: "master/batch-date/edit/:id", element: <CreateBatchDate /> },
        // SUBJECT
        { path: "master/subject", element: <Subject /> },
        { path: "master/subject/create", element: <CreateSubject /> },
        { path: "master/subject/edit/:id", element: <CreateSubject /> },
        // CHAPTER
        { path: "master/chapter", element: <Chapter /> },
        { path: "master/chapter/create", element: <CreateChapter /> },
        { path: "master/chapter/edit/:id", element: <CreateChapter /> },
        // STATES
        { path: "master/state", element: <State /> },
        // CITY
        { path: "master/city", element: <City /> },

        //Product
        { path: "master/package", element: <ProductPackage /> },
        { path: "master/package/create", element: <CreateProductPackage /> },
        {
          path: "master/package/edit/:id",
          element: <CreateProductPackage />,
        },
        {
          path: "master/package/student/profile/:id",
          element: <StudentProfileinPackage />,
        },
        {
          path: "dashboard/profile/:id",
          element: <StudentProfileinDashboard />,
        },

        //Language
        { path: "master/language", element: <Language /> },
        { path: "master/language/create", element: <CreateLanguage /> },
        { path: "master/language/edit/:id", element: <CreateLanguage /> },

        //Voucher
        { path: "master/voucher", element: <Voucher /> },
        { path: "master/voucher/create", element: <CreateVoucher /> },
        { path: "master/voucher/edit/:id", element: <CreateVoucher /> },

        // Category
        { path: "master/category", element: <Category /> },
        // SubCategory
        { path: "master/subcategory", element: <SubCategory /> },
        // Images Bookmark
        { path: "master/images-bookmark", element: <ImagesBookmark /> },
        // WANT TO BE
        { path: "master/want-to-be", element: <WantToBe /> },
        { path: "master/want-to-be/create", element: <CreateWantToBe /> },
        { path: "master/want-to-be/edit/:id", element: <CreateWantToBe /> },
        // STAFF
        { path: "staff-manager/staff-list", element: <Staff /> },
        { path: "staff-manager/staff/create", element: <CreateStaff /> },
        { path: "staff-manager/staff/edit/:id", element: <CreateStaff /> },
        {
          path: "staff-manager/staff-attendance/:id",
          element: <StaffAttendance />,
        },
        {
          path: "staff-manager/bulk-upload-staff",
          element: <BulkUploadStaff />,
        },
        //Free Resource
        { path: "freeresource/pyqs", element: <PyqsList /> },
        { path: "freeresource/pyqs/create", element: <CreatePyqs /> },
        { path: "freeresource/pyqs/edit/:id", element: <CreatePyqs /> },

        //Modal Paper
        { path: "freeresource/model-paper", element: <ModalPaperList /> },
        {
          path: "freeresource/model-paper/create",
          element: <CreateModalPaper />,
        },
        {
          path: "freeresource/model-paper/edit/:id",
          element: <CreateModalPaper />,
        },

        //Bulk Upload chapter
        {
          path: "master/chapter/bulk-upload-Chapter",
          element: <ChapterBulkUpload />,
        },
        // BANNER
        { path: "master/banner", element: <Banner /> },
        { path: "master/banner/create", element: <CreateBanner /> },
        { path: "master/banner/edit/:id", element: <CreateBanner /> },
        // SYLLABUS TOPIC
        { path: "syllabus/topic", element: <Topic /> },
        { path: "syllabus/topic/create", element: <CreateTopic /> },
        { path: "syllabus/topic/edit/:id", element: <CreateTopic /> },
        { path: "syllabus/bulk-upload-topic", element: <BulkTopic /> },
        { path: "syllabus/bulk-upload-video", element: <BulkVideo /> },
        // SYLLABUS CONTENT
        { path: "syllabus/content", element: <Content /> },
        { path: "syllabus/content/create", element: <CreateContent /> },
        { path: "syllabus/content/edit/:id", element: <CreateContent /> },
        // SYLLABUS CONTENT BULK Hide For Now
        // { path: "syllabus/Createvideomanagerbulk/create", element: <CreateVideoManagerBulk /> },
        // SCHEDULE
        { path: "schedule", element: <Schedule /> },
        { path: "schedule/create", element: <CreateSchedule /> },
        // NOTICE
        { path: "notice", element: <Notice /> },
        { path: "notice/create", element: <CreateNotice /> },
        { path: "notice/edit/:id", element: <CreateNotice /> },
        // REVISION
        { path: "revision", element: <Revision /> },
        { path: "revision/create", element: <CreateRevision /> },
        { path: "revision/edit/:id", element: <CreateRevision /> },
        {
          path: "revision/revision-bulkupload",
          element: <UploadBulkRevision />,
        },
        // QUESTION BANK
        {
          path: "questionbank/questionbank-singleupload",
          element: <QuestionBank />,
        },
        { path: "questionbank/:id", element: <CreateQuestionBank /> },
        { path: "questionbank/create", element: <CreateQuestionBank /> },
        { path: "questionbank/edit/:id", element: <CreateQuestionBank /> },
        {
          path: "questionbank/questionbank-bulkupload",
          element: <QuestionBulkUpload />,
        },
        // STUDENT
        { path: "student-manager/student-list", element: <Students /> },
        {
          path: "student-manager/student/profile/:id",
          element: <StudentProfile />,
        },
        { path: "student-manager/student/create", element: <CreateStudent /> },
        {
          path: "student-manager/student/edit/:id",
          element: <CreateStudent />,
        },
        {
          path: "ratings/app-ratings",
          element: <Ratings />,
        },
        {
          path: "ratings/liveclass-ratings",
          element: <LiveClassRatings />,
        },
        // STUDENT ATTENDENCE
        {
          path: "student-manager/student-attendance/:id",
          element: <StudentAttendance />,
        },
        //BULK UPLOAD
        {
          path: "student-manager/student/bulk-upload",
          element: <BulkUploadStudent />,
        },
        // STUDENT REQUEST
        {
          path: "student-manager/student-request",
          element: <StudentRequest />,
        },
        {
          path: "student-manager/feedback",
          element: <Feedback />,
        },
        { path: "student-manager/order", element: <Orders /> },
        { path: "student-manager/payment", element: <Payments /> },
        // DOUBTS
        { path: "doubts", element: <Doubts /> },
        { path: "doubts/:id", element: <DoubtsReply /> },
        // SHORTS
        { path: "short", element: <Shorts /> },
        { path: "short/create", element: <CreateShorts /> },
        { path: "short/edit/:id", element: <CreateShorts /> },
        // FAQ
        { path: "faq", element: <Faq /> },
        { path: "faq/create", element: <CreateFaq /> },
        { path: "faq/edit/:id", element: <CreateFaq /> },
        // ACTIVITY
        { path: "activity", element: <Activity /> },
        // SCHOLORSHIP
        { path: "scholarship/scholarship-create", element: <Scholarship /> },
        { path: "scholarship/create", element: <CreateScholarship /> },
        { path: "scholarship/edit/:id", element: <CreateScholarship /> },
        {
          path: "scholarship/scholarship-class",
          element: <ScholarshipClass />,
        },
        {
          path: "scholarship/scholarship-class/create",
          element: <CreateScholarshipClass />,
        },
        {
          path: "scholarship/scholarship-class/edit/:id",
          element: <CreateScholarshipClass />,
        },
        { path: "scholarship/top-highlight", element: <TopHighlight /> },

        {
          path: "scholarship/top-highlight/create",
          element: <CreateHighlight />,
        },
        {
          path: "scholarship/top-highlight/edit/:id",
          element: <CreateHighlight />,
        },
        //Create Scholarship Test
        {
          path: "scholarshiptest/scholarship-test",
          element: <ScholarshipTest />,
        },
        { path: "scholarshiptest/create", element: <CreateScholarshipTest /> },
        {
          path: "scholarshiptest/edit/:id",
          element: <CreateScholarshipTest />,
        },

        // ASSIGNMENT
        { path: "assignment/assignment-create", element: <Assignment /> },
        { path: "assignment/create", element: <CreateAssignment /> },
        { path: "assignment/edit/:id", element: <CreateAssignment /> },
        { path: "assignment/assignment-result", element: <AssignmentResult /> },
        {
          path: "assignment/assignment-offline-mode/:id",
          element: <Offline />,
        },
        { path: "assignment/assignment-online-mode/:id", element: <Online /> },
        // PACKAGE
        { path: "subscription/package-master", element: <Package /> },
        {
          path: "subscription/package-master/create",
          element: <CreatePackage />,
        },
        {
          path: "subscription/package-master/edit/:id",
          element: <CreatePackage />,
        },
        {
          path: "subscription/package-details",
          element: <PackageSubscription />,
        },
        {
          path: "subscription/package-details/create",
          element: <CreatePakacgeSubscription />,
        },
        {
          path: "subscription/package-details/edit/:id",
          element: <CreatePakacgeSubscription />,
        },
        {
          path: "subscription/Subscription-plan",
          element: <PackageSubscriptionList />,
        },
        {
          path: "subscription/Subscription-plan/create",
          element: <CreateSubscriptionList />,
        },
        {
          path: "subscription/Subscription-plan/edit/:id",
          element: <CreateSubscriptionList />,
        },
        // ONLY FOR YOU
        { path: "only-for-you", element: <OnlyForYou /> },
        { path: "only-for-you/create", element: <CreateOnlyForYou /> },
        { path: "only-for-you/edit/:id", element: <CreateOnlyForYou /> },
        // TEST
        { path: "test/test-report", element: <TestReportList /> },
        { path: "test/test-report/:id", element: <TestReportId /> },
        { path: "test/test-questions", element: <TestQuestion /> },
        { path: "test/test-questions/questions", element: <Questions /> },
        { path: "test/test-questions/:id", element: <TestQuestionView /> },
        { path: "test/student-own-test", element: <StudentOwnTest /> },
        { path: "test/student-own-test/:id", element: <StudentOwnTestId /> },
        // MENTORSHIP
        { path: "mentorship/feature", element: <Feature /> },
        { path: "mentorship/feature/create", element: <CreateFeature /> },
        { path: "mentorship/feature/edit/:id", element: <CreateFeature /> },

        { path: "mentorship/why-you-need", element: <WhyYouNeed /> },
        {
          path: "mentorship/why-you-need/create",
          element: <CreateWhyYouNeed />,
        },
        {
          path: "mentorship/why-you-need/edit/:id",
          element: <CreateWhyYouNeed />,
        },
        { path: "mentorship/how-it-help", element: <HowItHelps /> },
        {
          path: "mentorship/how-it-help/create",
          element: <CreateHowItHelps />,
        },
        {
          path: "mentorship/how-it-help/edit/:id",
          element: <CreateHowItHelps />,
        },
        {
          path: "mentorship/mentorship-package",
          element: <MentorshipPackage />,
        },
        // CHANGE PASSWORD
        { path: "change-password", element: <ChangePassword /> },
        // GENERAL SETTINGS
        {
          path: "general-setting/instruction-setting",
          element: <Instructions />,
        },
        {
          path: "general-setting/payment-setting",
          element: <PaymentSettings />,
        },
        { path: "general-setting/site-setting", element: <SiteSettings /> },
        {
          path: "general-setting/indivisual-setting",
          element: <IndivisualSetting />,
        },

        {
          path: "general-setting/zoom-setting",
          element: <ZoomSetting />,
        },
        {
          path: "general-setting/zoom-setting/create",
          element: <CreateZoomSetting />,
        },

        {
          path: "general-setting/zoom-setting/edit/:id",
          element: <CreateZoomSetting />,
        },

        {
          path: "general-setting/fire-base-setting",
          element: <FireBaseSetting />,
        },
        // GALLARY MANAGER
        { path: "gallery", element: <Gallery /> },
        { path: "gallery/create", element: <CreateGallery /> },
        { path: "gallery/edit/:id", element: <CreateGallery /> },
        // ACEDEMICS LIVE
        { path: "academics/live-class", element: <LiveClass /> },
        { path: "academics/live-class/:id", element: <YoutubeMeeting /> },
        { path: "academics/live-class/create", element: <CreateLiveClass /> },
        { path: "academics/live-class/edit/:id", element: <CreateLiveClass /> },
        { path: "academics/freelive-class", element: <FreeLiveClass /> },
        {
          path: "academics/freelive-class/create",
          element: <CreateFreeLiveClass />,
        },
        {
          path: "academics/freelive-class/edit/:id",
          element: <CreateFreeLiveClass />,
        },
        { path: "academics/history", element: <HistoryLive /> },
        { path: "academics/doubt-demo-request", element: <DoubtDemoRequest /> },
        // SCHOLARSHIP APPLICATION
        {
          path: "scholorship-application",
          element: <ScholarshipApplication />,
        },
        {
          path: "scholorship-application/scholarship-testReport/:id",

          element: <ScholarshipTestReport />,
        },

        // ENQUIRY
        { path: "enquiry", element: <Enquiry /> },
        // ROLES
        { path: "master/roles", element: <Roles /> },
        // Quiz
        { path: "quiz/quiz-report", element: <QuizReportList /> },
        { path: "quiz/quiz-report/view/:id", element: <QuizReportId /> },
        { path: "master/roles/permission/:id", element: <Permission /> },

        // Grievances
        { path: "grievances", element: <GrievancesList /> },

        //order History
        { path: "orders", element: <OrderHistory /> },
      ],
    },
    {
      element: <CompactLayout />,
      children: [{ path: "404", element: <Page404 /> }],
    },
    {
      element: <BlankLayout />,
      children: [{ path: "app/meeting/:id", element: <ZoomMeeting /> }],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
