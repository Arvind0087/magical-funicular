import { lazy } from "react";
import { Loader } from "../components/Loader";

export const SyllabusPlayerId = Loader(
  lazy(() => import("../pages/Syllabus/SyllabusPlayerId/SyllabusPlayerId"))
);
export const syllabusResourceOpen = Loader(
  lazy(() => import("../pages/Syllabus/Syllabus/ResourceOpen"))
);
export const Dashboard = Loader(lazy(() => import("../pages/dashboard")));
export const Syllabus = Loader(
  lazy(() => import("../pages/Syllabus/Syllabus/Syllabus"))
);

//Contents List
export const Contents = Loader(
  lazy(() => import("../pages/Contents/Contents/Contents"))
);

//Display Chapter
export const DisplayContent = Loader(
  lazy(() => import("../pages/Contents/Contents/DisplayContent"))
);

//Courses
export const Courses = Loader(
  lazy(() => import("../pages/Courses/Courses/Courses"))
);

//Free Resources
export const ModalPaper = Loader(
  lazy(() => import("../pages/freeresources/ModalPaper/ModalPaper"))
);

export const DisplayModalPaper = Loader(
  lazy(() => import("../pages/freeresources/ModalPaper/DisplayModalPaper"))
);

export const FreeNotes = Loader(
  lazy(() => import("../pages/freeresources/Notes/Notes"))
);

export const FreeNotesChapter = Loader(
  lazy(() => import("../pages/freeresources/Notes/Chapters"))
);

export const DisplayNotesData = Loader(
  lazy(() => import("../pages/freeresources/Notes/DisplayNotes"))
);

export const ImpQuestion = Loader(
  lazy(() => import("../pages/freeresources/impquestions/Impquestions"))
);

export const DisplayImpChapter = Loader(
  lazy(() => import("../pages/freeresources/impquestions/Chapters"))
);

export const DisplayImpQuestion = Loader(
  lazy(() => import("../pages/freeresources/impquestions/DisplayImpQues"))
);

export const FreePyqs = Loader(
  lazy(() => import("../pages/freeresources/pyqs/Pyqs"))
);

export const DisplayPyqs = Loader(
  lazy(() => import("../pages/freeresources/pyqs/DisplayPyqs"))
);

export const FreePyqsVideo = Loader(
  lazy(() => import("../pages/freeresources/VidePlayer"))
);

//Live Courses
export const LiveCourses = Loader(
  lazy(() => import("../pages/Courses/Courses/LiveCourses"))
);

//Display Chapter
export const CourseList = Loader(
  lazy(() => import("../pages/Courses/Courses/DisplayCourses"))
);

//Update Profile
export const UpdateProfilePage = Loader(
  lazy(() => import("../pages/updateProfile/UpdateProfile.jsx"))
);
//Recent Activity
export const RecentActivityPage = Loader(
  lazy(() => import("../pages/recentActivity/RecentActivity.jsx"))
);
//MyProfile
export const MyProfile = Loader(lazy(() => import("../pages/MyProfile")));
//oder detail
export const OrderDetail = Loader(lazy(() => import("../pages/OrderDetail")));
//Subscription
export const Subscription = Loader(
  lazy(() => import("../pages/Subscription/Subscription"))
);
//Quiz section
export const Quiz = Loader(lazy(() => import("../pages/dashboard/Quiz/Quiz")));
//refer and earn
export const ReferAndEarn = Loader(
  lazy(() => import("../pages/ReferAndEarn/ReferAndEarn"))
);

//video player
export const SyllabusVideoPlayer = Loader(
  lazy(() => import("../pages/VideoPlayer/VideoPlayer"))
);
// helpful resources
export const Resources = Loader(
  lazy(() => import("../pages/VideoPlayer/VideoPlayer"))
);
// Faqs Page.............
export const Faqs = Loader(lazy(() => import("../pages/Faqs")));
//revision
export const Revision = Loader(
  lazy(() => import("../pages/Revision/Revision"))
);
export const RevisionDetail = Loader(
  lazy(() => import("../pages/Revision/RevisionDetails"))
);
export const Doubts = Loader(lazy(() => import("../pages/dashboard/Doubts")));

export const SolutionsByStudents = Loader(
  lazy(() => import("../pages/dashboard/SolutionsByStudents"))
);
export const SolutionsByTeacher = Loader(
  lazy(() => import("../pages/dashboard/SolutionsByTeacher"))
);

// MASTERS
export const Masters = Loader(lazy(() => import("../pages/dashboard/Master")));
export const Course = Loader(
  lazy(() => import("../pages/dashboard/Master/Courses"))
);
export const Class = Loader(
  lazy(() => import("../pages/dashboard/Master/Class"))
);
export const AddClass = Loader(
  lazy(() => import("../pages/dashboard/Master/Class/AddClass"))
);
export const AddCourse = Loader(
  lazy(() => import("../pages/dashboard/Master/Courses/AddCourses"))
);
export const Board = Loader(
  lazy(() => import("../pages/dashboard/Master/Board"))
);
export const AddBoards = Loader(
  lazy(() => import("../pages/dashboard/Master/Board/AddBoards"))
);
export const Subject = Loader(
  lazy(() => import("../pages/dashboard/Master/Subject"))
);
export const AddSubject = Loader(
  lazy(() => import("../pages/dashboard/Master/Subject/AddSubject"))
);
export const Batch = Loader(
  lazy(() => import("../pages/dashboard/Master/Batch"))
);
export const AddBatches = Loader(
  lazy(() => import("../pages/dashboard/Master/Batch/AddBatces"))
);
export const BatchDate = Loader(
  lazy(() => import("../pages/dashboard/Master/BatchDate"))
);
export const AddBatchDate = Loader(
  lazy(() => import("../pages/dashboard/Master/BatchDate/AddBatchDate"))
);
export const Chapter = Loader(
  lazy(() => import("../pages/dashboard/Master/Chapter"))
);
export const AddChapter = Loader(
  lazy(() => import("../pages/dashboard/Master/Chapter/AddChapter"))
);
export const Banner = Loader(
  lazy(() => import("../pages/dashboard/Master/Banner"))
);
export const AddBanner = Loader(
  lazy(() => import("../pages/dashboard/Master/Banner/AddBanner"))
);
export const Students = Loader(
  lazy(() => import("../pages/dashboard/Student"))
);
export const StudentProfile = Loader(
  lazy(() => import("../pages/dashboard/Student/StudentProfile"))
);
export const Teachers = Loader(
  lazy(() => import("../pages/dashboard/Teacher"))
);
export const AddTeacher = Loader(
  lazy(() => import("../pages/dashboard/Teacher/Addteachers/Addteachers"))
);

export const LoginPage = Loader(lazy(() => import("../pages/auth/LoginPage")));
export const ViewAllNotifications = Loader(
  lazy(() => import("../pages/ViewAllNotifications"))
);

// AUTH

export const RegisterPage = Loader(
  lazy(() => import("../pages/auth/RegisterPage"))
);
export const VerifyCodePage = Loader(
  lazy(() => import("../pages/auth/VerifyCodePage"))
);
export const NewPasswordPage = Loader(
  lazy(() => import("../pages/auth/NewPasswordPage"))
);
export const ResetPasswordPage = Loader(
  lazy(() => import("../pages/auth/ResetPasswordPage"))
);
// create-account page url..
export const CreateAccount = Loader(
  lazy(() => import("../pages/auth/CreateAccount"))
);

// shorts page url from dashboard..
export const ShortsPage = Loader(
  lazy(() => import("../pages/dashboard/Shorts/ShortsPage"))
);
export const FavouriteShortsPage = Loader(
  lazy(() => import("../pages/dashboard/Shorts/FavouriteShortsPage"))
);
export const VideoPlayer = Loader(
  lazy(() => import("../pages/dashboard/Shorts/VideoPlayer"))
);
// Assignment page...............
export const AssignmentPage = Loader(
  lazy(() => import("../pages/dashboard/Assignment/AssignmentPage"))
);

// Instruction page...............
export const InstructionPage = Loader(
  lazy(() => import("../pages/dashboard/Assignment/InstructionPage"))
);
//myBookmarks page url from dashboard..
export const MyBookmarksPage = Loader(
  lazy(() => import("../pages/dashboard/MyBookmarks/MyBookmarksPage"))
);

// create new test page...............
export const CreateTestPage = Loader(
  lazy(() => import("../pages/dashboard/CreateTest/CreateTestPage"))
);
// create view explanation page...............
export const ViewExplanationPage = Loader(
  lazy(() => import("../pages/dashboard/CreateTest/ViewExplanationPage"))
);

// create view answer key page...............
export const AnswerKeyPage = Loader(
  lazy(() => import("../pages/dashboard/CreateTest/AnswerKeyPage"))
);

// create report and summary page...............
export const ReportSummaryPage = Loader(
  lazy(() => import("../pages/dashboard/CreateTest/ReportPage"))
);

// select chapters page............................
export const SelectTestChapters = Loader(
  lazy(() => import("../pages/dashboard/CreateTest/selectChapters"))
);

// Live/event Page ..........................................
export const EventPage = Loader(
  lazy(() => import("../pages/dashboard/Live/LivePage"))
);

//Event Video Player
export const EventVideoPage = Loader(
  lazy(() => import("../pages/dashboard/Live/components/VideoPlayer"))
);

//Free live event..........................................
export const MyFreeEventPage = Loader(
  lazy(() => import("../pages/FreeLiveClass/FreeLiveClass"))
);

// my events  Page ..........................................
export const MyEventPage = Loader(
  lazy(() => import("../pages/dashboard/Live/MyEventsPage"))
);

// teacher calender..................................
export const TeacherCalenderPage = Loader(
  lazy(() => import("../pages/Calender"))
);
// demo calender
export const DemoCalenderPage = Loader(
  lazy(() => import("../pages/DemoCalender"))
);
// mentorship book calender
export const MentorshipBookCalenderPage = Loader(
  lazy(() => import("../pages/MentorshipBookCalender"))
);
//myBookmarks page url from dashboard..
export const MentorshipPage = Loader(
  lazy(() => import("../pages/dashboard/Mentorship/MentorshipPage"))
);
//countsession page url
export const CountSession = Loader(
  lazy(() => import("../pages/dashboard/Mentorship/CountSession.jsx"))
);
//ScholarshipTest page url from dashboard..
export const ScholarshipTestPage = Loader(
  lazy(() => import("../pages/dashboard/ScholarshipTest/ScholarshipTestPage"))
);

// DASHBOARD: GENERAL
export const GeneralAppPage = Loader(
  lazy(() => import("../pages/dashboard/GeneralAppPage"))
);

export const GeneralAnalyticsPage = Loader(
  lazy(() => import("../pages/dashboard/GeneralAnalyticsPage"))
);
export const GeneralBankingPage = Loader(
  lazy(() => import("../pages/dashboard/GeneralBankingPage"))
);
export const GeneralBookingPage = Loader(
  lazy(() => import("../pages/dashboard/GeneralBookingPage"))
);
export const GeneralFilePage = Loader(
  lazy(() => import("../pages/dashboard/GeneralFilePage"))
);

// DASHBOARD: ECOMMERCE
export const EcommerceShopPage = Loader(
  lazy(() => import("../pages/dashboard/EcommerceShopPage"))
);
export const EcommerceProductDetailsPage = Loader(
  lazy(() => import("../pages/dashboard/EcommerceProductDetailsPage"))
);
export const EcommerceProductListPage = Loader(
  lazy(() => import("../pages/dashboard/EcommerceProductListPage"))
);
export const EcommerceProductCreatePage = Loader(
  lazy(() => import("../pages/dashboard/EcommerceProductCreatePage"))
);
export const EcommerceProductEditPage = Loader(
  lazy(() => import("../pages/dashboard/EcommerceProductEditPage"))
);
export const EcommerceCheckoutPage = Loader(
  lazy(() => import("../pages/dashboard/EcommerceCheckoutPage"))
);

// DASHBOARD: INVOICE
export const InvoiceListPage = Loader(
  lazy(() => import("../pages/dashboard/InvoiceListPage"))
);
export const InvoiceDetailsPage = Loader(
  lazy(() => import("../pages/dashboard/InvoiceDetailsPage"))
);
export const InvoiceCreatePage = Loader(
  lazy(() => import("../pages/dashboard/InvoiceCreatePage"))
);
export const InvoiceEditPage = Loader(
  lazy(() => import("../pages/dashboard/InvoiceEditPage"))
);

// DASHBOARD: USER
export const UserProfilePage = Loader(
  lazy(() => import("../pages/updateProfile/UpdateProfile.jsx"))
);

export const UserCardsPage = Loader(
  lazy(() => import("../pages/dashboard/UserCardsPage"))
);

export const UserAccountPage = Loader(
  lazy(() => import("../pages/dashboard/UserAccountPage"))
);
export const UserCreatePage = Loader(
  lazy(() => import("../pages/dashboard/UserCreatePage"))
);
export const UserEditPage = Loader(
  lazy(() => import("../pages/dashboard/UserEditPage"))
);

// DASHBOARD: BLOG
export const BlogPostsPage = Loader(
  lazy(() => import("../pages/dashboard/BlogPostsPage"))
);
export const BlogPostPage = Loader(
  lazy(() => import("../pages/dashboard/BlogPostPage"))
);
export const BlogNewPostPage = Loader(
  lazy(() => import("../pages/dashboard/BlogNewPostPage"))
);

// DASHBOARD: FILE MANAGER
export const FileManagerPage = Loader(
  lazy(() => import("../pages/dashboard/FileManagerPage"))
);

// DASHBOARD: APP
export const ChatPage = Loader(
  lazy(() => import("../pages/dashboard/ChatPage"))
);
export const MailPage = Loader(
  lazy(() => import("../pages/dashboard/MailPage"))
);
export const CalendarPage = Loader(
  lazy(() => import("../pages/dashboard/CalendarPage"))
);
export const KanbanPage = Loader(
  lazy(() => import("../pages/dashboard/KanbanPage"))
);

// TEST RENDER PAGE BY ROLE
export const PermissionDeniedPage = Loader(
  lazy(() => import("../pages/dashboard/PermissionDeniedPage"))
);

// BLANK PAGE
export const BlankPage = Loader(
  lazy(() => import("../pages/dashboard/BlankPage"))
);

// BLANK PAGE
export const PhonepayPaymentResponse = Loader(
  lazy(() => import("../pages/payment/phonepaysuccess.js"))
);

// MAIN
export const Page500 = Loader(lazy(() => import("../pages/Page500")));
export const Page403 = Loader(lazy(() => import("../pages/Page403")));
export const Page404 = Loader(lazy(() => import("../pages/Page404")));
export const HomePage = Loader(lazy(() => import("../pages/HomePage")));
export const FaqsPage = Loader(lazy(() => import("../pages/FaqsPage")));
export const AboutPage = Loader(lazy(() => import("../pages/AboutPage")));
export const Contact = Loader(lazy(() => import("../pages/ContactPage")));
export const PricingPage = Loader(lazy(() => import("../pages/PricingPage")));
export const PaymentPage = Loader(lazy(() => import("../pages/PaymentPage")));
export const StartTest = Loader(lazy(() => import("../pages/StartTest")));
export const ComingSoonPage = Loader(
  lazy(() => import("../pages/ComingSoonPage"))
);
export const MaintenancePage = Loader(
  lazy(() => import("../pages/MaintenancePage"))
);

// DEMO COMPONENTS
// ----------------------------------------------------------------------

export const ComponentsOverviewPage = Loader(
  lazy(() => import("../pages/components/ComponentsOverviewPage"))
);

// FOUNDATION
export const FoundationColorsPage = Loader(
  lazy(() => import("../pages/components/foundation/FoundationColorsPage"))
);
export const FoundationTypographyPage = Loader(
  lazy(() => import("../pages/components/foundation/FoundationTypographyPage"))
);
export const FoundationShadowsPage = Loader(
  lazy(() => import("../pages/components/foundation/FoundationShadowsPage"))
);
export const FoundationGridPage = Loader(
  lazy(() => import("../pages/components/foundation/FoundationGridPage"))
);
export const FoundationIconsPage = Loader(
  lazy(() => import("../pages/components/foundation/FoundationIconsPage"))
);

// MUI COMPONENTS
export const MUIAccordionPage = Loader(
  lazy(() => import("../pages/components/mui/MUIAccordionPage"))
);
export const MUIAlertPage = Loader(
  lazy(() => import("../pages/components/mui/MUIAlertPage"))
);
export const MUIAutocompletePage = Loader(
  lazy(() => import("../pages/components/mui/MUIAutocompletePage"))
);
export const MUIAvatarPage = Loader(
  lazy(() => import("../pages/components/mui/MUIAvatarPage"))
);
export const MUIBadgePage = Loader(
  lazy(() => import("../pages/components/mui/MUIBadgePage"))
);
export const MUIBreadcrumbsPage = Loader(
  lazy(() => import("../pages/components/mui/MUIBreadcrumbsPage"))
);
export const MUIButtonsPage = Loader(
  lazy(() => import("../pages/components/mui/MUIButtonsPage"))
);
export const MUICheckboxPage = Loader(
  lazy(() => import("../pages/components/mui/MUICheckboxPage"))
);
export const MUIChipPage = Loader(
  lazy(() => import("../pages/components/mui/MUIChipPage"))
);
export const MUIDataGridPage = Loader(
  lazy(() => import("../pages/components/mui/MUIDataGridPage"))
);
export const MUIDialogPage = Loader(
  lazy(() => import("../pages/components/mui/MUIDialogPage"))
);
export const MUIListPage = Loader(
  lazy(() => import("../pages/components/mui/MUIListPage"))
);
export const MUIMenuPage = Loader(
  lazy(() => import("../pages/components/mui/MUIMenuPage"))
);
export const MUIPaginationPage = Loader(
  lazy(() => import("../pages/components/mui/MUIPaginationPage"))
);
export const MUIPickersPage = Loader(
  lazy(() => import("../pages/components/mui/MUIPickersPage"))
);
export const MUIPopoverPage = Loader(
  lazy(() => import("../pages/components/mui/MUIPopoverPage"))
);
export const MUIProgressPage = Loader(
  lazy(() => import("../pages/components/mui/MUIProgressPage"))
);
export const MUIRadioButtonsPage = Loader(
  lazy(() => import("../pages/components/mui/MUIRadioButtonsPage"))
);
export const MUIRatingPage = Loader(
  lazy(() => import("../pages/components/mui/MUIRatingPage"))
);
export const MUISliderPage = Loader(
  lazy(() => import("../pages/components/mui/MUISliderPage"))
);
export const MUIStepperPage = Loader(
  lazy(() => import("../pages/components/mui/MUIStepperPage"))
);
export const MUISwitchPage = Loader(
  lazy(() => import("../pages/components/mui/MUISwitchPage"))
);
export const MUITablePage = Loader(
  lazy(() => import("../pages/components/mui/MUITablePage"))
);
export const MUITabsPage = Loader(
  lazy(() => import("../pages/components/mui/MUITabsPage"))
);
export const MUITextFieldPage = Loader(
  lazy(() => import("../pages/components/mui/MUITextFieldPage"))
);
export const MUITimelinePage = Loader(
  lazy(() => import("../pages/components/mui/MUITimelinePage"))
);
export const MUITooltipPage = Loader(
  lazy(() => import("../pages/components/mui/MUITooltipPage"))
);
export const MUITransferListPage = Loader(
  lazy(() => import("../pages/components/mui/MUITransferListPage"))
);
// export const MUITreesViewPage = Loader(
//   lazy(() => import("../pages/components/mui/MUITreesViewPage"))
// );

// EXTRA
export const DemoAnimatePage = Loader(
  lazy(() => import("../pages/components/extra/DemoAnimatePage"))
);
export const DemoCarouselsPage = Loader(
  lazy(() => import("../pages/components/extra/DemoCarouselsPage"))
);
export const DemoChartsPage = Loader(
  lazy(() => import("../pages/components/extra/DemoChartsPage"))
);
export const DemoCopyToClipboardPage = Loader(
  lazy(() => import("../pages/components/extra/DemoCopyToClipboardPage"))
);
export const DemoEditorPage = Loader(
  lazy(() => import("../pages/components/extra/DemoEditorPage"))
);
export const DemoFormValidationPage = Loader(
  lazy(() => import("../pages/components/extra/DemoFormValidationPage"))
);
export const DemoImagePage = Loader(
  lazy(() => import("../pages/components/extra/DemoImagePage"))
);
export const DemoLabelPage = Loader(
  lazy(() => import("../pages/components/extra/DemoLabelPage"))
);
export const DemoLightboxPage = Loader(
  lazy(() => import("../pages/components/extra/DemoLightboxPage"))
);
export const DemoMapPage = Loader(
  lazy(() => import("../pages/components/extra/DemoMapPage"))
);
export const DemoMegaMenuPage = Loader(
  lazy(() => import("../pages/components/extra/DemoMegaMenuPage"))
);
export const DemoMultiLanguagePage = Loader(
  lazy(() => import("../pages/components/extra/DemoMultiLanguagePage"))
);
export const DemoNavigationBarPage = Loader(
  lazy(() => import("../pages/components/extra/DemoNavigationBarPage"))
);
export const DemoOrganizationalChartPage = Loader(
  lazy(() => import("../pages/components/extra/DemoOrganizationalChartPage"))
);
export const DemoScrollbarPage = Loader(
  lazy(() => import("../pages/components/extra/DemoScrollbarPage"))
);
export const DemoSnackbarPage = Loader(
  lazy(() => import("../pages/components/extra/DemoSnackbarPage"))
);
export const DemoTextMaxLinePage = Loader(
  lazy(() => import("../pages/components/extra/DemoTextMaxLinePage"))
);
export const DemoUploadPage = Loader(
  lazy(() => import("../pages/components/extra/DemoUploadPage"))
);
export const MyLearningReports = Loader(
  lazy(() => import("../pages/MyLearningReports/MyLearningReports"))
);
// Help&Support page...
export const HelpSupport = Loader(lazy(() => import("../pages/HelpSupport")));
