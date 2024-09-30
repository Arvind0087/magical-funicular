import { Loader } from "components/Loader/index";
import { lazy } from "react";

// DASHBOARD
export const Dashboard = Loader(
  lazy(() => import("../pages/DashboardPage/Dashboard"))
);
// COURSE
export const Course = Loader(
  lazy(() => import("../pages/Master/Courses/Courses"))
);
export const CreateCourse = Loader(
  lazy(() => import("../pages/Master/Courses/CreateCourse/CreateCourse"))
);
// BOARD
export const Board = Loader(lazy(() => import("../pages/Master/Board/Board")));
export const CreateBoard = Loader(
  lazy(() => import("../pages/Master/Board/CreateBoard/CreateBoard"))
);
// CLASS
export const Class = Loader(lazy(() => import("../pages/Master/Class/Class")));
export const CreateClass = Loader(
  lazy(() => import("../pages/Master/Class/CreateClass/CreateClass"))
);
// BATCH TYPE
export const Batch = Loader(lazy(() => import("../pages/Master/Batch/Batch")));
export const CreateBatch = Loader(
  lazy(() => import("../pages/Master/Batch/CreateBatch/CreateBatch"))
);

// Language
export const Language = Loader(
  lazy(() => import("../pages/Master/language/Language.jsx"))
);

export const CreateLanguage = Loader(
  lazy(() => import("../pages/Master/language/CreateLanguage/CreateLanguage"))
);

// Language
export const Voucher = Loader(
  lazy(() => import("../pages/Master/voucher/Voucher.jsx"))
);

export const CreateVoucher = Loader(
  lazy(() => import("../pages/Master/voucher/CreateVoucher/CreateVoucher"))
);

// BATCH DATE
export const BatchDate = Loader(
  lazy(() => import("../pages/Master/BatchDate/BatchDate"))
);
export const CreateBatchDate = Loader(
  lazy(() =>
    import("../pages/Master/BatchDate/CreateBatchDate/CreateBatchDate")
  )
);
// SUBJECT
export const Subject = Loader(
  lazy(() => import("../pages/Master/Subject/Subject"))
);
export const CreateSubject = Loader(
  lazy(() => import("../pages/Master/Subject/CreateSubject/CreateSubject"))
);
// CHAPTER
export const Chapter = Loader(
  lazy(() => import("../pages/Master/Chapter/Chapter"))
);
export const CreateChapter = Loader(
  lazy(() => import("../pages/Master/Chapter/CreateChapter/CreateChapter"))
);
// STATES
export const State = Loader(lazy(() => import("../pages/Master/State/State")));
// CITY
export const City = Loader(lazy(() => import("../pages/Master/City/City")));
// WANT TO BE
export const WantToBe = Loader(
  lazy(() => import("../pages/Master/WantToBe/WantToBe"))
);
export const CreateWantToBe = Loader(
  lazy(() => import("../pages/Master/WantToBe/CreateWantToBe/CreateWantToBe"))
);

export const ProductPackage = Loader(
  lazy(() => import("../pages/Master/ProductPackage/ProductPackage"))
);

export const CreateProductPackage = Loader(
  lazy(() =>
    import("../pages/Master/ProductPackage/CreatePackage/CreatePackage")
  )
);

//Free Resource
export const PyqsList = Loader(
  lazy(() => import("../pages/FreeResource/pyqs/PyqsList"))
);

export const CreatePyqs = Loader(
  lazy(() => import("../pages/FreeResource/pyqs/CreatePyqs/CreatePyqs"))
);

export const ModalPaperList = Loader(
  lazy(() => import("../pages/FreeResource/modalpaper/ModalPaper"))
);

export const CreateModalPaper = Loader(
  lazy(() =>
    import("../pages/FreeResource/modalpaper/CreateModal/CreateModalPaper")
  )
);

//Category
export const Category = Loader(
  lazy(() => import("../pages/Master/Category/Category"))
);
//Sub Category
export const SubCategory = Loader(
  lazy(() => import("../pages/Master/SubCategory/SubCategory"))
);
//Staff
export const Staff = Loader(
  lazy(() => import("../pages/StaffManager/Staff/Staff"))
);
export const CreateStaff = Loader(
  lazy(() => import("../pages/StaffManager/Staff/CreateStaff/CreateStaff"))
);
//Staff Bulk Upload
export const BulkUploadStaff = Loader(
  lazy(() => import("../pages/StaffManager/BulkUploadStaff/BulkUploadStaff"))
);
//Chapter Bulk Upload
export const ChapterBulkUpload = Loader(
  lazy(() => import("../pages/Master/Chapter/BulkUploadChapter"))
);
export const StaffAttendance = Loader(
  lazy(() => import("../pages/StaffManager/StaffAttendance/StaffAttendance"))
);
// BANNER
export const Banner = Loader(
  lazy(() => import("../pages/Master/Banner/Banner"))
);
export const CreateBanner = Loader(
  lazy(() => import("../pages/Master/Banner/CreateBanner/CreateBanner"))
);
// SYLLABUS TOPIC
export const Topic = Loader(
  lazy(() => import("../pages/Syllabus/Topic/Topic"))
);
export const CreateTopic = Loader(
  lazy(() => import("../pages/Syllabus/Topic/CreateTopic/CreateTopic"))
);
export const Content = Loader(
  lazy(() => import("../pages/Syllabus/Content/Content"))
);
export const CreateContent = Loader(
  lazy(() => import("../pages/Syllabus/Content/CreateContent/CreateContent"))
);
// Hide For Now
// export const CreateVideoManagerBulk = Loader(
//   lazy(() => import("../pages/Syllabus/VideoManagerBulk/createVideoManagerBulk/CreateVIdeoManagerBulk"))
// );
export const BulkTopic = Loader(
  lazy(() => import("../pages/Syllabus/UploadBulkTopic/BulkTopic"))
);
export const BulkVideo = Loader(
  lazy(() => import("../pages/Syllabus/UploadBulkVideo/BulkVideo"))
);
// SCHEDULE
export const Schedule = Loader(
  lazy(() => import("../pages/Schedule/Schedule"))
);
export const CreateSchedule = Loader(
  lazy(() => import("../pages/Schedule/CreateSchedule/CreateSchedule"))
);
// NOTICE
export const Notice = Loader(lazy(() => import("../pages/Notice/Notice")));
export const CreateNotice = Loader(
  lazy(() => import("../pages/Notice/CreateNotice/CreateNotice"))
);
// REVISION
// export const Revision = Loader(
//   lazy(() => import("../pages/RevisionManager/RevisionList/Revision"))
// );
// export const CreateRevision = Loader(
//   lazy(() => import("../pages/Revision/CreateRevision/CreateRevision"))
// );
//  Revision Manager
export const Revision = Loader(
  lazy(() => import("../pages/RevisionManager/RevisionList/Revision"))
);
export const CreateRevision = Loader(
  lazy(() =>
    import(
      "../pages/RevisionManager/RevisionList/CreateRevision/CreateRevision"
    )
  )
);
export const UploadBulkRevision = Loader(
  lazy(() =>
    import("../pages/RevisionManager/UploadBulkRevision/UploadBulkRevision")
  )
);
// QUESTION BANK
export const QuestionBank = Loader(
  lazy(() => import("../pages/QuestionBank/QuestionBank"))
);
export const QuestionBulkUpload = Loader(
  lazy(() =>
    import("../pages/QuestionBank/QuestionBulkUpload/QuestionBulkUpload")
  )
);

export const CreateQuestionBank = Loader(
  lazy(() =>
    import("../pages/QuestionBank/CreateQuestionBank/CreateQuestionBank")
  )
);
// STUDENT MANAGER
export const Students = Loader(
  lazy(() => import("../pages/StudentManager/Student"))
);
export const StudentProfile = Loader(
  lazy(() => import("../pages/StudentManager/Student/StudentProfile"))
);
export const CreateStudent = Loader(
  lazy(() => import("../pages/StudentManager/Student/addStudent/addStudent"))
);
export const Ratings = Loader(
  lazy(() => import("../pages/Ratings/AppRatings/Ratings"))
);

export const LiveClassRatings = Loader(
  lazy(() => import("../pages/Ratings/LiveClassRatings/Ratings"))
);

//Student Details in Package
export const StudentProfileinPackage = Loader(
  lazy(() =>
    import(
      "../pages/Master/ProductPackage/Student/StudentProfile/StudentProfile"
    )
  )
);

export const StudentProfileinDashboard = Loader(
  lazy(() =>
    import("../pages/DashboardPage/Student/StudentProfile/StudentProfile")
  )
);

// STUDENT ATTENDENCE
export const StudentAttendance = Loader(
  lazy(() => import("../pages/StudentManager/Student/StudentAttendance"))
);
// STUDENT UPLOAD
export const BulkUploadStudent = Loader(
  lazy(() => import("../pages/StudentManager/Student/BulkUpload/BulkUpload"))
);

// STUDENT REQUEST
export const StudentRequest = Loader(
  lazy(() => import("../pages/StudentManager/StudentRequest/StudentRequest"))
);
export const Feedback = Loader(
  lazy(() => import("../pages/StudentManager/Feedback/Feedback"))
);

export const Orders = Loader(
  lazy(() => import("../pages/StudentManager/Orders/Orders"))
);

export const Payments = Loader(
  lazy(() => import("../pages/StudentManager/Payments/Payments"))
);

export const OrderHistory = Loader(
  lazy(() => import("../pages/OrderHistory/Orders"))
);

// DOUBTS
export const Doubts = Loader(lazy(() => import("../pages/Doubts/Doubts")));
export const DoubtsReply = Loader(
  lazy(() => import("../pages/Doubts/DoubtReply/DoubtReply"))
);
// SHORTS
export const Shorts = Loader(lazy(() => import("../pages/Shorts/Shorts")));
export const CreateShorts = Loader(
  lazy(() => import("../pages/Shorts/CreateShorts/CreateShorts"))
);
// // FAQ
export const Faq = Loader(lazy(() => import("../pages/FAQ/Faq")));
export const CreateFaq = Loader(
  lazy(() => import("../pages/FAQ/CreateFAQ/Addfaqs"))
);
// // Activity

export const Activity = Loader(
  lazy(() => import("../pages/Activity/Activity"))
);
// // SCHOLARSHIP
export const Scholarship = Loader(
  lazy(() => import("../pages/Scholarship/Scholarship/Scholarship"))
);
export const CreateScholarship = Loader(
  lazy(() =>
    import(
      "../pages/Scholarship/Scholarship/CreateScholarship/CreateScholarship"
    )
  )
);
export const ScholarshipClass = Loader(
  lazy(() => import("../pages/Scholarship/ScholarshipClass/ScholarshipClass"))
);
export const CreateScholarshipClass = Loader(
  lazy(() =>
    import(
      "../pages/Scholarship/ScholarshipClass/CreateScholarshipClass/CreateScholarshipClass"
    )
  )
);
//scholarship test
export const ScholarshipTest = Loader(
  lazy(() => import("../pages/Scholarship/ScholarshipTest/ScholarshipTest"))
);
export const CreateScholarshipTest = Loader(
  lazy(() =>
    import(
      "../pages/Scholarship/ScholarshipTest/CreateScholarshipTest/CreateScholarshipTest"
    )
  )
);
export const TopHighlight = Loader(
  lazy(() => import("../pages/Scholarship/TopHighlight/TopHighlight"))
);
export const CreateHighlight = Loader(
  lazy(() =>
    import(
      "../pages/Scholarship/TopHighlight/CreateTopHighLight/CreateHighLight"
    )
  )
);

// ASSIGNMENT
export const Assignment = Loader(
  lazy(() => import("../pages/Assignment/CreateAssignment/Assignment"))
);
export const CreateAssignment = Loader(
  lazy(() =>
    import(
      "../pages/Assignment/CreateAssignment/CreateAssignment/CreateAssignment"
    )
  )
);
export const AssignmentResult = Loader(
  lazy(() => import("../pages/Assignment/Result/Result"))
);
export const Offline = Loader(
  lazy(() =>
    import("../pages/Assignment/Result/AssignmentMode/OfflineMode/Offline")
  )
);
export const Online = Loader(
  lazy(() =>
    import("../pages/Assignment/Result/AssignmentMode/OnlineMode/OnlineMode")
  )
);
// PACKAGE
export const Package = Loader(
  lazy(() => import("../pages/Package/Package/Package"))
);
export const CreatePackage = Loader(
  lazy(() => import("../pages/Package/Package/CreatePackage/CreatePackage"))
);
export const PackageSubscription = Loader(
  lazy(() => import("../pages/Package/PackageSubscription/PackageSubscription"))
);
export const CreatePakacgeSubscription = Loader(
  lazy(() =>
    import(
      "../pages/Package/PackageSubscription/CreateSubscription/CreateSubscription"
    )
  )
);
export const PackageSubscriptionList = Loader(
  lazy(() => import("../pages/Package/SubscriptionList/SubscriptionList"))
);
export const CreateSubscriptionList = Loader(
  lazy(() => import("../pages/Package/SubscriptionList/CreateList/CreateList"))
);
export const OnlyForYou = Loader(
  lazy(() => import("../pages/OnlyForYou/OnlyForYou"))
);
export const CreateOnlyForYou = Loader(
  lazy(() => import("../pages/OnlyForYou/CreateOnlyForYou/CreateOnly"))
);
// TEST
export const TestReportList = Loader(
  lazy(() => import("../pages/Test/TestReportList"))
);
export const TestReportId = Loader(
  lazy(() => import("../pages/Test/TestReportId/TestReportId"))
);
export const TestQuestion = Loader(
  lazy(() => import("../pages/Test/TestQuestions/TestQuestions"))
);
export const StudentOwnTest = Loader(
  lazy(() => import("../pages/Test/StudentOwnTest/StudentOwnTest"))
);
export const StudentOwnTestId = Loader(
  lazy(() =>
    import("../pages/Test/StudentOwnTest/StudentOwnTestView/StudentOwnTestId")
  )
);
// export const CreateTest = Loader(
//   lazy(() => import("../pages/Test/CreateTest/CreateTest"))
// );
export const Questions = Loader(
  lazy(() => import("../pages/Test/TestQuestions/Questions/Questions"))
);
export const TestQuestionView = Loader(
  lazy(() => import("../pages/Test/TestQuestions/QuestionView/QuestionView"))
);

// MENTORSHIP
export const Feature = Loader(
  lazy(() => import("../pages/Mentorship/Feature/Feature"))
);
export const CreateFeature = Loader(
  lazy(() => import("../pages/Mentorship/Feature/CreateFeature/CreateFeature"))
);
export const WhyYouNeed = Loader(
  lazy(() => import("../pages/Mentorship/WhyYouNeed/WhyYouNeed"))
);
export const CreateWhyYouNeed = Loader(
  lazy(() =>
    import("../pages/Mentorship/WhyYouNeed/CreateWhyYouNeed/CreateWhyYouNeed")
  )
);
export const HowItHelps = Loader(
  lazy(() => import("../pages/Mentorship/HowItHelps/HowItHelps"))
);
export const CreateHowItHelps = Loader(
  lazy(() =>
    import("../pages/Mentorship/HowItHelps/CreateHowItHelps/CreateHowItHelps")
  )
);
export const MentorshipPackage = Loader(
  lazy(() => import("../pages/Mentorship/MentorshipPackage/MentorshipPackage"))
);
// CHANGE PASSWORD
export const ChangePassword = Loader(
  lazy(() => import("../pages/auth/ChangePassword"))
);
// GENERAL SETTINGS
export const Instructions = Loader(
  lazy(() => import("../pages/GeneralSetting/Instructions"))
);
export const PaymentSettings = Loader(
  lazy(() => import("../pages/GeneralSetting/PaymentSettings/PaymentSettings"))
);
export const SiteSettings = Loader(
  lazy(() => import("../pages/GeneralSetting/SiteSettings/SiteSettings"))
);

export const IndivisualSetting = Loader(
  lazy(() =>
    import("../pages/GeneralSetting/IndivisualSetting/IndivisualSetting")
  )
);

export const ZoomSetting = Loader(
  lazy(() => import("../pages/GeneralSetting/ZoomSetting/zoomSetting"))
);

export const CreateZoomSetting = Loader(
  lazy(() =>
    import(
      "../pages/GeneralSetting/ZoomSetting/CreateZoomSetting/CreateZoomSetting"
    )
  )
);

export const FireBaseSetting = Loader(
  lazy(() => import("../pages/GeneralSetting/FireBaseSetting/FireBaseSetting"))
);

// GALLARY MANAGER
export const Gallery = Loader(
  lazy(() => import("../pages/GalleryManager/Gallery"))
);
export const CreateGallery = Loader(
  lazy(() => import("../pages/GalleryManager/CreateGallery/CreateGallery"))
);

// ACEDEMICS LIVE CLASS
export const LiveClass = Loader(
  lazy(() => import("../pages/Academics/Liveclass"))
);
export const CreateLiveClass = Loader(
  lazy(() => import("../pages/Academics/CreateLiveClass/CreateLiveClass"))
);
export const HistoryLive = Loader(
  lazy(() => import("../pages/Academics/History/History"))
);
export const DoubtDemoRequest = Loader(
  lazy(() => import("../pages/Academics/DoubtDemoRequest/DoubtDemoRequest"))
);

//Free Live Class

export const FreeLiveClass = Loader(
  lazy(() => import("../pages/Academics/FreeLiveclass"))
);
export const CreateFreeLiveClass = Loader(
  lazy(() =>
    import("../pages/Academics/CreateFreeLiveClass/CreateFreeLiveClass")
  )
);

// SCHOLARSHIP APPLICATION
export const ScholarshipApplication = Loader(
  lazy(() => import("../pages/ScholarshipApplication/ScholarshipApplication"))
);

export const ScholarshipTestReport = Loader(
  lazy(() =>
    import(
      "../pages/ScholarshipApplication/ScholarshipTestReport/ScholarshipTestReport"
    )
  )
);

// ENQUIRY
export const Enquiry = Loader(lazy(() => import("../pages/Enquiry/Enquiry")));

// LOGIN
export const Login = Loader(lazy(() => import("../pages/auth/Login")));
// VERFY CODE
export const VerifyCode = Loader(
  lazy(() => import("../pages/auth/VerifyCode"))
);
// NEW PASSWORD
export const NewPassword = Loader(
  lazy(() => import("../pages/auth/NewPassword"))
);
// RESET PASSWORD
export const ResetPassword = Loader(
  lazy(() => import("../pages/auth/ResetPassword"))
);
// PERMISSION DENIED
export const PermissionDeniedPage = Loader(
  lazy(() => import("../pages/DashboardPage/PermissionDeniedPage"))
);
// 404
export const Page404 = Loader(lazy(() => import("../pages/Page404")));
// ZOOM MEETING
export const ZoomMeeting = Loader(lazy(() => import("components/Zoom")));

// ZOOM MEETING
export const YoutubeMeeting = Loader(
  lazy(() => import("../pages/Academics/CreateLiveClass/YoutubeLive"))
);

//Roles
export const Roles = Loader(lazy(() => import("../pages/Master/Roles/Roles")));
//Quiz
export const QuizReportList = Loader(
  lazy(() => import("../pages/Quiz/QuizReportList"))
);
export const QuizReportId = Loader(
  lazy(() => import("../pages/Quiz/QuizReportId"))
);
//Grievances
export const GrievancesList = Loader(
  lazy(() => import("../pages/Grievances/Grievances"))
);

// export const Permission = Loader(
//   lazy(() => import("../pages/StaffManager/Staff/Permission/Permission"))
// );
export const Permission = Loader(
  lazy(() => import("../pages/Master/Roles/Permission/Permission"))
);
export const ImagesBookmark = Loader(
  lazy(() => import("../pages/Master/ImagesBookmark/ImagesBookmark"))
);
// export const TopHighlight = Loader(
//   lazy(() => import("../pages/TopHighlight/TopHighlight"))
// );
// export const CreateHighlight = Loader(
//   lazy(() => import("../pages/TopHighlight/CreateTopHighLight/CreateHighLight"))
// );
