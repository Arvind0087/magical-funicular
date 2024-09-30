// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const BASE = "/";
const ROOTS_AUTH = "/auth";
const ROOTS_DASHBOARD = "/app";
const ROOTS_CREATE_ACCOUNT = "/create-account";
// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  base: BASE,
  login: path(ROOTS_AUTH, "/login"),
  register: path("/register"),
  loginUnprotected: path(ROOTS_AUTH, "/login-unprotected"),
  registerUnprotected: path(ROOTS_AUTH, "/register-unprotected"),
  verify: path(ROOTS_AUTH, "/verify"),
  resetPassword: path(ROOTS_AUTH, "/reset-password"),
  newPassword: path(ROOTS_AUTH, "/new-password"),
  createAccount: ROOTS_CREATE_ACCOUNT,
};

export const PATH_PAGE = {
  comingSoon: "/coming-soon",
  maintenance: "/maintenance",
  pricing: "/pricing",
  payment: "/payment",
  about: "/about-us",
  contact: "/contact-us",
  page403: "/403",
  page404: "/404",
  page500: "/500",
  components: "/components",
  startTest: "/start-test",
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  app: path(ROOTS_DASHBOARD, "/dashboard"),
  syllabus: path(ROOTS_DASHBOARD, "/syllabus"),
  chapters: path(ROOTS_DASHBOARD, "/chapters"),
  modalpaper: path(ROOTS_DASHBOARD, "/modelpaper"),
  notes: path(ROOTS_DASHBOARD, "/notes"),
  impQuestionChapter: path(ROOTS_DASHBOARD, "/imp-question/chapters"),
  notesChapter: path(ROOTS_DASHBOARD, "/notes-chapter"),
  pyqs: path(ROOTS_DASHBOARD, "/pyqs"),
  courses: path(ROOTS_DASHBOARD, "/courses"),
  livecourses: path(ROOTS_DASHBOARD, "/live-courses"),
  quiz: path(ROOTS_DASHBOARD, "/quiz"),
  helpAndSupport: path(ROOTS_DASHBOARD, "/help-Support"),
  UpdateProfile: path(ROOTS_DASHBOARD, "/UpdateProfile"),
  recentActivity: path(ROOTS_DASHBOARD, "/recentActivity"),
  myLearningReports: path(ROOTS_DASHBOARD, "/MyLearningReports"),
  subscription: path(ROOTS_DASHBOARD, "/subscription"),
  referearn: path(ROOTS_DASHBOARD, "/referearn"),
  player: path(ROOTS_DASHBOARD, `/player`),
  faqs: path(ROOTS_DASHBOARD, "/faqs"),
  shorts: path(ROOTS_DASHBOARD, "/shorts"),
  favoriteShorts: path(ROOTS_DASHBOARD, "/favourite-Shorts?tab=0"),
  videoPlayer: (id) => path(ROOTS_DASHBOARD, `/shorts/${id}`),
  // assignment..
  assignment: path(ROOTS_DASHBOARD, "/assignment"),
  instruction: (id) => path(ROOTS_DASHBOARD, `/instruction/${id}`),
  // assignment..
  orderDetail: path(ROOTS_DASHBOARD, "/orderDetail"),

  // create test...
  syllabusplayerId: path(ROOTS_DASHBOARD, "/syllabus/:id"),
  resource: path(ROOTS_DASHBOARD, "syllabus/resource/:id"),
  createTest: path(ROOTS_DASHBOARD, "/test/create-test"),
  answerKey: path(ROOTS_DASHBOARD, "/answer-key"),
  ViewExplanation: path(ROOTS_DASHBOARD, "/view-explanation"),
  reportSummary: path(ROOTS_DASHBOARD, "/report"),
  selectChapters: path(ROOTS_DASHBOARD, "/select-test-chapter"),
  myBookmarks: path(ROOTS_DASHBOARD, "/myBookmarks"),
  mentorship: path(ROOTS_DASHBOARD, "/mentorship"),
  scholarshipTest: path(ROOTS_DASHBOARD, "/scholarshipTest"),
  favoriteShorts: path(ROOTS_DASHBOARD, "/favourite-Shorts"),
  revision: path(ROOTS_DASHBOARD, "/revision"),
  doubts: path(ROOTS_DASHBOARD, "/doubts"),
  solutionsByStudents: path(ROOTS_DASHBOARD, "/solutionsByStudents"),
  solutionsByTeacher: path(ROOTS_DASHBOARD, "/solutionsByTeacher"),
  event: path(ROOTS_DASHBOARD, "/event"),
  freeevent: path(ROOTS_DASHBOARD, "/free-event"),
  myevents: path(ROOTS_DASHBOARD, "/my-events"),
  calender: path(ROOTS_DASHBOARD, "/calender"),
  demoCalender: path(ROOTS_DASHBOARD, "/schedule-demo"),
  videoPlayer: (id) => path(ROOTS_DASHBOARD, `/shorts/${id}`),
  resourcePage: path(ROOTS_DASHBOARD, "/resources"),
  mentorshipBookCalender: path(ROOTS_DASHBOARD, "/mentorship-book"),
  viewAllNotifications: path(ROOTS_DASHBOARD, "/all-notifications"),
  myProfile: path(ROOTS_DASHBOARD, "/myProfile"),
  orderDetail: path(ROOTS_DASHBOARD, "/orderDetail"),

  master: {
    master: path(ROOTS_DASHBOARD, "/master"),
    courses: path(ROOTS_DASHBOARD, "/master/courses"),
    addcourses: path(ROOTS_DASHBOARD, "/master/courses/add"),
    board: path(ROOTS_DASHBOARD, "/master/board"),
    addboards: path(ROOTS_DASHBOARD, "/master/board/add"),
    batch: path(ROOTS_DASHBOARD, "/master/batch"),
    addbatch: path(ROOTS_DASHBOARD, "/master/batch/add"),
    class: path(ROOTS_DASHBOARD, "/master/class"),
    addClass: path(ROOTS_DASHBOARD, "/master/class/addclass"),
    subject: path(ROOTS_DASHBOARD, "/master/subject"),
    addsubject: path(ROOTS_DASHBOARD, "/master/subject/add"),
    batchDate: path(ROOTS_DASHBOARD, "/master/batchDate"),
    addbatchDate: path(ROOTS_DASHBOARD, "/master/batchDate/add"),
    chapter: path(ROOTS_DASHBOARD, "/master/chapter"),
    addchapter: path(ROOTS_DASHBOARD, "/master/chapter/add"),
    banner: path(ROOTS_DASHBOARD, "/master/banner"),
    addbanner: path(ROOTS_DASHBOARD, "/master/banner/add"),
    addteacher: path(ROOTS_DASHBOARD, "/teacher/add"),
  },

  kanban: path(ROOTS_DASHBOARD, "/kanban"),
  calendar: path(ROOTS_DASHBOARD, "/calendar"),
  fileManager: path(ROOTS_DASHBOARD, "/files-manager"),
  permissionDenied: path(ROOTS_DASHBOARD, "/permission-denied"),
  blank: path(ROOTS_DASHBOARD, "/blank"),

  student: {
    root: ROOTS_DASHBOARD,
    student: path(ROOTS_DASHBOARD, "/students"),
    studentid: path(ROOTS_DASHBOARD, "/student/:id"),
  },

  teacher: {
    root: ROOTS_DASHBOARD,
    teacher: path(ROOTS_DASHBOARD, "/teachers"),
  },

  // root: ROOTS_DASHBOARD,
  // kanban: path(ROOTS_DASHBOARD, "/kanban"),
  // calendar: path(ROOTS_DASHBOARD, "/calendar"),
  // fileManager: path(ROOTS_DASHBOARD, "/files-manager"),
  // permissionDenied: path(ROOTS_DASHBOARD, "/permission-denied"),
  // blank: path(ROOTS_DASHBOARD, "/blank"),
  general: {
    app: path(ROOTS_DASHBOARD, "/dashboard"),
    ecommerce: path(ROOTS_DASHBOARD, "/ecommerce"),
    analytics: path(ROOTS_DASHBOARD, "/analytics"),
    banking: path(ROOTS_DASHBOARD, "/banking"),
    booking: path(ROOTS_DASHBOARD, "/booking"),
    file: path(ROOTS_DASHBOARD, "/file"),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, "/mail"),
    all: path(ROOTS_DASHBOARD, "/mail/all"),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, "/chat"),
    new: path(ROOTS_DASHBOARD, "/chat/new"),
    view: (name) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  },
  user: {
    root: path(ROOTS_DASHBOARD, "/user"),
    new: path(ROOTS_DASHBOARD, "/user/new"),
    list: path(ROOTS_DASHBOARD, "/user/list"),
    cards: path(ROOTS_DASHBOARD, "/user/cards"),
    profile: path(ROOTS_DASHBOARD, "/user/profile"),
    account: path(ROOTS_DASHBOARD, "/user/account"),
    edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, "/e-commerce"),
    shop: path(ROOTS_DASHBOARD, "/e-commerce/shop"),
    list: path(ROOTS_DASHBOARD, "/e-commerce/list"),
    checkout: path(ROOTS_DASHBOARD, "/e-commerce/checkout"),
    new: path(ROOTS_DASHBOARD, "/e-commerce/product/new"),
    view: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
    edit: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
    demoEdit: path(
      ROOTS_DASHBOARD,
      "/e-commerce/product/nike-blazer-low-77-vintage/edit"
    ),
    demoView: path(
      ROOTS_DASHBOARD,
      "/e-commerce/product/nike-air-force-1-ndestrukt"
    ),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, "/invoice"),
    list: path(ROOTS_DASHBOARD, "/invoice/list"),
    new: path(ROOTS_DASHBOARD, "/invoice/new"),
    view: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
    demoEdit: path(
      ROOTS_DASHBOARD,
      "/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit"
    ),
    demoView: path(
      ROOTS_DASHBOARD,
      "/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5"
    ),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, "/blog"),
    posts: path(ROOTS_DASHBOARD, "/blog/posts"),
    new: path(ROOTS_DASHBOARD, "/blog/new"),
    view: (title) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(
      ROOTS_DASHBOARD,
      "/blog/post/apply-these-7-secret-techniques-to-improve-event"
    ),
  },
};

export const PATH_DOCS = {
  root: "https://docs.minimals.cc",
  changelog: "https://docs.minimals.cc/changelog",
};

export const PATH_ZONE_ON_STORE =
  "https://mui.com/store/items/zone-landing-page/";

export const PATH_MINIMAL_ON_STORE =
  "https://mui.com/store/items/minimal-dashboard/";

export const PATH_FREE_VERSION =
  "https://mui.com/store/items/minimal-dashboard-free/";

export const PATH_FIGMA_PREVIEW =
  "https://www.figma.com/file/OBEorYicjdbIT6P1YQTTK7/%5BPreview%5D-Minimal-Web.15.10.22?node-id=0%3A1";
