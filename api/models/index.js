const { config } = require("../config/db.config");
const { Sequelize, DataTypes } = require("sequelize");

//NOTE: database connection
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: 0,
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//NOTE: Connect with database Table
db.admin = require("./adminUsers")(sequelize, DataTypes);
db.courses = require("./courses")(sequelize, DataTypes);
db.boards = require("./boards")(sequelize, DataTypes);
db.class = require("./class")(sequelize, DataTypes);
db.batchTypes = require("./batchType")(sequelize, DataTypes);
db.batchDate = require("./batchDate")(sequelize, DataTypes);
db.teachers = require("./teacher")(sequelize, DataTypes);
db.teacher_subject_map = require("./teacher_subject_map")(sequelize, DataTypes);
db.users = require("./users")(sequelize, DataTypes);
db.student = require("./student")(sequelize, DataTypes);
db.parent = require("./parent")(sequelize, DataTypes);
db.parent_student_map = require("./parent_student_map")(sequelize, DataTypes);
db.student_secondary_map = require("./student_secondary_map")(
  sequelize,
  DataTypes
);

db.otp = require("./otp")(sequelize, DataTypes);
db.subject = require("./subject")(sequelize, DataTypes);
db.chapter = require("./chapter")(sequelize, DataTypes);
db.topic = require("./topic")(sequelize, DataTypes);
db.syllabus = require("./syllabus")(sequelize, DataTypes);
db.banner = require("./banner")(sequelize, DataTypes);
db.banner_course_map = require("./banner_course_map")(sequelize, DataTypes);
db.shorts = require("./shorts")(sequelize, DataTypes);
db.faq = require("./faq")(sequelize, DataTypes);
db.doubt = require("./doubt")(sequelize, DataTypes);
db.doubtReply = require("./doubtReply")(sequelize, DataTypes);
db.feedback = require("./feedback")(sequelize, DataTypes);
db.bookmark = require("./bookmark")(sequelize, DataTypes);
db.event = require("./event")(sequelize, DataTypes);
db.notice = require("./notice")(sequelize, DataTypes);
db.packages = require("./packages")(sequelize, DataTypes);
db.onlyForYou = require("./onlyForYou")(sequelize, DataTypes);
db.subscription = require("./subscription")(sequelize, DataTypes);
db.package_class_map = require("./package_class_map")(sequelize, DataTypes);
db.student_notice_map = require("./student_notice_map")(sequelize, DataTypes);
db.questionBank = require("./questionBank")(sequelize, DataTypes);
db.test = require("./test")(sequelize, DataTypes);
db.test_question_map = require("./test_question_map")(sequelize, DataTypes);
db.test_subject_map = require("./test_subject_map")(sequelize, DataTypes);
db.test_batch_map = require("./test_batch_map")(sequelize, DataTypes);
db.student_test_map = require("./student_test_map")(sequelize, DataTypes);
db.test_student_attempt_map = require("./test_student_attempt_map")(
  sequelize,
  DataTypes
);
db.orders = require("./order")(sequelize, DataTypes);
db.revisions = require("./revision")(sequelize, DataTypes);
db.scholarship = require("./scholarship")(sequelize, DataTypes);
db.scholarship_class_map = require("./scholarship_class_map")(
  sequelize,
  DataTypes
);
db.scholarship_student_map = require("./scholarship_student_map")(
  sequelize,
  DataTypes
);
db.mentorship = require("./mentorship")(sequelize, DataTypes);
db.shorts_like_map = require("./shorts_like_map")(sequelize, DataTypes);
db.permission = require("./permission")(sequelize, DataTypes);
db.wantToBe = require("./wantToBe")(sequelize, DataTypes);
db.mentorshipHelp = require("./mentorshipHelp")(sequelize, DataTypes);
db.route = require("./routes")(sequelize, DataTypes);
db.setting = require("./setting")(sequelize, DataTypes);
db.upload = require("./upload")(sequelize, DataTypes);
db.cart = require("./cart")(sequelize, DataTypes);
db.state = require("./state")(sequelize, DataTypes);
db.city = require("./city")(sequelize, DataTypes);
db.enquiry = require("./enquiry")(sequelize, DataTypes);
db.highlight = require("./highlight")(sequelize, DataTypes);
db.activity = require("./activity")(sequelize, DataTypes);
db.content = require("./content")(sequelize, DataTypes);
db.assignment = require("./assignment")(sequelize, DataTypes);
db.assignment_question_map = require("./assignment_question_map")(
  sequelize,
  DataTypes
);
db.assignment_student_map = require("./assignment_student_map")(
  sequelize,
  DataTypes
);
db.assignment_board_map = require("./assignment_board_map")(
  sequelize,
  DataTypes
);
db.assignment_answer_map = require("./assignment_answer_map")(
  sequelize,
  DataTypes
);

db.assignment_startTime_map = require("./assignment_startTime_map")(
  sequelize,
  DataTypes
);

db.teacher_schedule = require("./teacher_schedule")(sequelize, DataTypes);
db.student_event_map = require("./student_event_map")(sequelize, DataTypes);
db.teacher_book_map = require("./teacher_book_map")(sequelize, DataTypes);

db.siteSetting = require("./siteSetting")(sequelize, DataTypes);
db.schedule_time_map = require("./schedule_time_map")(sequelize, DataTypes);
db.event_demo_map = require("./event_demo_map")(sequelize, DataTypes);
db.requestCall = require("./requestCall")(sequelize, DataTypes);
db.pageBackLink = require("./pageBacklink")(sequelize, DataTypes);
db.permissionRole = require("./permission_role")(sequelize, DataTypes);
db.bulkUploadFiles = require("./bulkUpload_files")(sequelize, DataTypes);
db.internalSetting = require("./internalSetting")(sequelize, DataTypes);
db.mobile_token_map = require("./mobile_token_map")(sequelize, DataTypes);
db.coins = require("./coins")(sequelize, DataTypes);
db.coin_transaction = require("./coin_transaction")(sequelize, DataTypes);
db.quiz = require("./quiz")(sequelize, DataTypes);
db.quiz_test_answer_map = require("./quiz_test_answer_map")(
  sequelize,
  DataTypes
);
db.reminder_time = require("./reminder_time")(sequelize, DataTypes);
db.revision_title_map = require("./revision_title_map")(sequelize, DataTypes);
db.event_student_attendance = require("./event_student_attendance")(
  sequelize,
  DataTypes
);
db.event_teacher_attendance = require("./event_teacher_attendance")(
  sequelize,
  DataTypes
);
db.rating = require("./rating")(sequelize, DataTypes);
db.zoom_teacher_map = require("./zoom_teacher_map")(sequelize, DataTypes);
db.student_subscription_map = require("./student_subscription_map")(
  sequelize,
  DataTypes
);
db.user_device_token = require("./user_device_token")(sequelize, DataTypes);
db.student_plan_map = require("./student_plan_map")(sequelize, DataTypes);
db.recentActivity = require("./recentActivity")(sequelize, DataTypes);
db.student_leaderboard_map = require("./student_leaderboard_map")(
  sequelize,
  DataTypes
);
db.time_cron_map = require("./time_cron_map")(sequelize, DataTypes);
db.student_spend_time_map = require("./student_spend_time_map")(
  sequelize,
  DataTypes
);
db.grievance_category = require("./grievance_category")(sequelize, DataTypes);
db.grievance_subCategory = require("./grievance_subCategory")(
  sequelize,
  DataTypes
);
db.grievance_subCategory = require("./grievance_subCategory")(
  sequelize,
  DataTypes
);
db.girevancesCategory_subCategory_map =
  require("./girevancesCategory_subCategory_map")(sequelize, DataTypes);
db.shorts_course_map = require("./shorts_course_map")(sequelize, DataTypes);
db.icic_payment_details = require("./icic_payment_details")(
  sequelize,
  DataTypes
);
db.error = require("./error")(sequelize, DataTypes);
db.event_attend_map = require("./event_attend_map")(sequelize, DataTypes);
db.new_content = require("./new_content")(sequelize, DataTypes);
db.content_course_map = require("./content_course_map")(sequelize, DataTypes);
db.liveclass_report = require("./liveclass_report")(sequelize, DataTypes);
db.liveclass_teacher_report = require("./liveclass_teacher_report")(sequelize, DataTypes);
db.payment = require("./payment")(sequelize, DataTypes);
db.login_user = require("./login_user")(sequelize, DataTypes);
db.address = require("./address")(sequelize, DataTypes);
db.event_track_map = require("./event_track_map")(sequelize, DataTypes);
db.event_chat_map = require("./event_chat_map")(sequelize, DataTypes);
db.course_package_map = require("./course_package_map")(sequelize, DataTypes);
db.student_course_package_map = require("./student_course_package_map")(sequelize, DataTypes);
db.package_demo_video_map = require("./package_demo_video_map")(sequelize, DataTypes);
db.course_package_faq_map = require("./course_package_faq_map")(sequelize, DataTypes);


//STUB - All Relation

//NOTE - event-track-map
db.event_chat_map.belongsTo(db.users, {
  foreignKey: "userId",
  otherKey: "id",
  onDelete: 'CASCADE',
});
db.event_chat_map.belongsTo(db.admin, {
  foreignKey: "teacherId",
  otherKey: "id",
  onDelete: 'CASCADE',
});


//NOTE - event-track-map
db.event_track_map.belongsTo(db.event, {
  foreignKey: "eventId",
  otherKey: "id",
  onDelete: 'CASCADE',
});

//NOTE - student spend time map
db.student_spend_time_map.belongsTo(db.users, {
  foreignKey: "studentId",
  otherKey: "id",
  onDelete: 'CASCADE',
});
//NOTE : grivances
db.girevancesCategory_subCategory_map.belongsTo(db.grievance_category, {
  foreignKey: "categoryId",
  otherKey: "id",
  onDelete: 'CASCADE',
});

db.girevancesCategory_subCategory_map.belongsTo(db.grievance_subCategory, {
  foreignKey: "subCategoryId",
  otherKey: "id",
  onDelete: 'CASCADE',
});

db.girevancesCategory_subCategory_map.belongsTo(db.users, {
  foreignKey: "userId",
  otherKey: "id",
  as: "user",
  onDelete: 'CASCADE',
});

db.girevancesCategory_subCategory_map.belongsTo(db.users, {
  foreignKey: "parentId",
  otherKey: "id",
  as: "parent",
  onDelete: 'CASCADE',
});

//NOTE - add cascading
db.girevancesCategory_subCategory_map.belongsTo(db.grievance_category, {
  foreignKey: "categoryId",
  otherKey: "id",
  onDelete: 'CASCADE',
});
db.girevancesCategory_subCategory_map.belongsTo(db.grievance_subCategory, {
  foreignKey: "subCategoryId",
  otherKey: "id",
  onDelete: 'CASCADE',
});

//NOTE : grivances subcategory with category
db.grievance_subCategory.belongsTo(db.grievance_category, {
  foreignKey: "categoryId",
  otherKey: "id",
  onDelete: 'CASCADE',
});

//NOTE : internalSetting
db.internalSetting.belongsTo(db.admin, {
  foreignKey: "userId",
  otherKey: "id",
});

//NOTE : onlyForYOU
db.onlyForYou.belongsTo(db.pageBackLink, {
  foreignKey: "buttonLinkId",
  otherKey: "id",
});

db.onlyForYou.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.onlyForYou.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//requestCall RELATION
db.requestCall.belongsTo(db.users, { foreignKey: "userId", otherKey: "id" });

//event demo,doub and mentorship request
db.event_demo_map.belongsTo(db.users, {
  foreignKey: "studentId",
  otherKey: "id",
});
db.event_demo_map.belongsTo(db.admin, {
  foreignKey: "teacherId",
  otherKey: "id",
});
db.event_demo_map.belongsTo(db.subject, {
  foreignKey: "subjectId",
  otherKey: "id",
});

//NOTE - activity RELATION
db.activity.belongsTo(db.users, { foreignKey: "userId", otherKey: "id" });

//NOTE : CITY STATE RELATION
db.city.belongsTo(db.state, { foreignKey: "stateId", otherKey: "id" });
db.city.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.city.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - Cart
db.cart.belongsTo(db.users, { foreignKey: "userId", otherKey: "id" });
db.cart.belongsTo(db.packages, { foreignKey: "packageId", otherKey: "id" });
db.cart.belongsTo(db.subscription, {
  foreignKey: "subscriptionId",
  otherKey: "id",
});

//NOTE - board relations with course
db.courses.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.courses.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - board relations with course
db.boards.belongsTo(db.courses, { foreignKey: "courseId", otherKey: "id" });
db.boards.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.boards.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - class relations course and board
db.class.belongsTo(db.courses, { foreignKey: "courseId", otherKey: "id" });
db.class.belongsTo(db.boards, { foreignKey: "boardId", otherKey: "id" });

db.class.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.class.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - batchType relations
db.batchTypes.belongsTo(db.courses, { foreignKey: "courseId", otherKey: "id" });
db.batchTypes.belongsTo(db.boards, { foreignKey: "boardId", otherKey: "id" });
db.batchTypes.belongsTo(db.class, { foreignKey: "classId", otherKey: "id" });
db.batchTypes.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.batchTypes.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - batchDate relations
db.batchDate.belongsTo(db.courses, { foreignKey: "courseId", otherKey: "id" });
db.batchDate.belongsTo(db.boards, { foreignKey: "boardId", otherKey: "id" });
db.batchDate.belongsTo(db.class, { foreignKey: "classId", otherKey: "id" });
db.batchDate.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});
//db.batchDate.belongsTo(db.batchTypes, { foreignKey: "batchName"});



db.batchDate.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.batchDate.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - subject relations
db.subject.belongsTo(db.courses, { foreignKey: "courseId", otherKey: "id" });
db.subject.belongsTo(db.boards, { foreignKey: "boardId", otherKey: "id" });
db.subject.belongsTo(db.class, { foreignKey: "classId", otherKey: "id" });
db.subject.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});
db.subject.hasMany(db.chapter, { foreignKey: "subjectId", as: "chapters" });

db.subject.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.subject.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - chapter relations
db.chapter.belongsTo(db.courses, { foreignKey: "courseId", otherKey: "id" });
db.chapter.belongsTo(db.boards, { foreignKey: "boardId", otherKey: "id" });
db.chapter.belongsTo(db.class, { foreignKey: "classId", otherKey: "id" });
db.chapter.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});
db.chapter.belongsTo(db.subject, { foreignKey: "subjectId", otherKey: "id" });
db.chapter.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.chapter.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - topic relations
db.topic.belongsTo(db.courses, { foreignKey: "courseId", otherKey: "id" });
db.topic.belongsTo(db.boards, { foreignKey: "boardId", otherKey: "id" });
db.topic.belongsTo(db.class, { foreignKey: "classId", otherKey: "id" });
db.topic.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});
db.topic.belongsTo(db.subject, { foreignKey: "subjectId", otherKey: "id" });
db.topic.belongsTo(db.chapter, { foreignKey: "chapterId", otherKey: "id" });
db.topic.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.topic.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//BOOKMARK relation
//db.bookmark.belongsTo(db.content, { foreignKey: "typeId", otherKey: "id" });
// db.bookmark.belongsTo(db.questionBank, {
//   foreignKey: "typeId",
//   otherKey: "id",
// });
db.bookmark.belongsTo(db.subject, { foreignKey: "subjectId", otherKey: "id" });
db.bookmark.belongsTo(db.chapter, { foreignKey: "chapterId", otherKey: "id" });
//db.bookmark.belongsTo(db.topic, { foreignKey: "topicId", otherKey: "id" });
db.bookmark.belongsTo(db.users, { foreignKey: "userId", otherKey: "id" });

//NOTE - event relation
db.event.belongsTo(db.subject, { foreignKey: "subjectId", otherKey: "id" });
db.event.belongsTo(db.chapter, { foreignKey: "chapterId", otherKey: "id" });
db.event.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});

db.event.belongsTo(db.admin, { foreignKey: "teacherId", otherKey: "id" });
db.event.hasMany(db.student_event_map, {
  foreignKey: "eventId",
  otherKey: "id",
});

db.student_event_map.belongsTo(db.event, {
  foreignKey: "eventId",
  otherKey: "id",
});

//NOTE - feedback relations with student
db.feedback.belongsTo(db.users, { foreignKey: "studentId", otherKey: "id" });

//NOTE - bookmark relation with Syllabus
db.bookmark.belongsTo(db.chapter, { foreignKey: "chapterId", otherKey: "id" });

//NOTE - shorts relations
db.shorts_course_map.belongsTo(db.shorts, {
  foreignKey: "shortsId",
  otherKey: "id",
});
db.shorts_course_map.belongsTo(db.courses, {
  foreignKey: "courseId",
  otherKey: "id",
});
db.shorts_course_map.belongsTo(db.boards, {
  foreignKey: "boardId",
  otherKey: "id",
});
db.shorts_course_map.belongsTo(db.class, {
  foreignKey: "classId",
  otherKey: "id",
});
db.shorts_course_map.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});
db.shorts_course_map.belongsTo(db.subject, {
  foreignKey: "subjectId",
  otherKey: "id",
});

db.shorts_course_map.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.shorts_course_map.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});
db.shorts_like_map.belongsTo(db.shorts, {
  foreignKey: "shortsId",
  otherKey: "id",
});

db.shorts.hasMany(db.shorts_course_map, {
  foreignKey: "shortsId",
  as: "courseMap",
});
//db.shorts.hasMany(db.shorts_like_map, { foreignKey: 'shortsId' ,otherKey: "id",as:"likemap",});

//NOTE - DOUBT  and doubt reply relation
db.doubt.belongsTo(db.subject, { foreignKey: "subjectId", otherKey: "id" });
db.doubt.belongsTo(db.chapter, { foreignKey: "chapterId", otherKey: "id" });
db.doubt.belongsTo(db.users, { foreignKey: "studentId", otherKey: "id" });

//NOTE - relation for answer
db.doubt.hasMany(db.doubtReply, { foreignKey: "doubtId", as: "Answers" });
///db.doubtReply.belongsTo(db.users, { foreignKey: "replyId", otherKey: "id" });
//db.doubtReply.belongsTo(db.admin, { foreignKey: "replyId", otherKey: "id" });

//NOTE - NOTICE relation
db.notice.belongsTo(db.courses, { foreignKey: "courseId", otherKey: "id" });
db.notice.belongsTo(db.boards, { foreignKey: "boardId", otherKey: "id" });
db.notice.belongsTo(db.class, { foreignKey: "classId", otherKey: "id" });
db.notice.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});
db.student_notice_map.belongsTo(db.notice, {
  foreignKey: "noticeId",
  otherKey: "id",
});
db.student_notice_map.belongsTo(db.users, {
  foreignKey: "studentId",
  otherKey: "id",
});

db.notice.belongsTo(db.pageBackLink, {
  foreignKey: "backLinkId",
  otherKey: "id",
});

db.notice.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.notice.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - relation for test
db.test.belongsTo(db.users, { foreignKey: "createdId", otherKey: "id" });
// db.test.belongsTo(db.admin, { foreignKey: "createdId", otherKey: "id" });

db.test_subject_map.belongsTo(db.test, {
  foreignKey: "testId",
  otherKey: "id",
});
db.test_subject_map.belongsTo(db.courses, {
  foreignKey: "courseId",
  otherKey: "id",
});
db.test_subject_map.belongsTo(db.boards, {
  foreignKey: "boardId",
  otherKey: "id",
});
db.test_subject_map.belongsTo(db.class, {
  foreignKey: "classId",
  otherKey: "id",
});

//NOTE - question bank relations
db.questionBank.belongsTo(db.courses, {
  foreignKey: "courseId",
  otherKey: "id",
});
db.questionBank.belongsTo(db.boards, { foreignKey: "boardId", otherKey: "id" });
db.questionBank.belongsTo(db.class, { foreignKey: "classId", otherKey: "id" });
db.questionBank.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});
db.questionBank.belongsTo(db.subject, {
  foreignKey: "subjectId",
  otherKey: "id",
});
db.questionBank.belongsTo(db.chapter, {
  foreignKey: "chapterId",
  otherKey: "id",
});
db.questionBank.belongsTo(db.topic, { foreignKey: "topicId", otherKey: "id" });

db.questionBank.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.questionBank.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - User Student relation
db.users.belongsTo(db.student, { foreignKey: "typeId", otherKey: "id" });
db.users.belongsTo(db.parent, { foreignKey: "parentTypeId", otherKey: "id" });

db.users.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.users.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

db.coins.belongsTo(db.users, { foreignKey: "studentId", otherKey: "id" });

//NOTE - Admin Teacher relation
db.admin.belongsTo(db.teachers, { foreignKey: "typeId", otherKey: "id" });
db.admin.belongsTo(db.permissionRole, {
  foreignKey: "department",
  otherKey: "id",
});

//NOTE - Teacher subject relation
db.teacher_subject_map.belongsTo(db.admin, {
  foreignKey: "teacherId",
  otherKey: "id",
});
db.teacher_subject_map.belongsTo(db.subject, {
  foreignKey: "subjectId",
  otherKey: "id",
});

db.teacher_subject_map.belongsTo(db.class, {
  foreignKey: "classId",
  otherKey: "id",
});

db.teacher_subject_map.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});

db.teacher_subject_map.belongsTo(db.boards, {
  foreignKey: "boardId",
  otherKey: "id",
});

db.teacher_subject_map.belongsTo(db.courses, {
  foreignKey: "courseId",
  otherKey: "id",
});

db.teacher_subject_map.belongsTo(db.batchDate, {
  foreignKey: "batchStartDateId",
  otherKey: "id",
});

//NOTE - package-map
db.package_class_map.belongsTo(db.courses, {
  foreignKey: "courseId",
  otherKey: "id",
});
db.package_class_map.belongsTo(db.packages, {
  foreignKey: "packageId",
  otherKey: "id",
});
db.package_class_map.belongsTo(db.boards, {
  foreignKey: "boardId",
  otherKey: "id",
});
db.package_class_map.belongsTo(db.class, {
  foreignKey: "classId",
  otherKey: "id",
});
db.package_class_map.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});
db.package_class_map.belongsTo(db.batchDate, {
  foreignKey: "batchStartDateId",
  otherKey: "id",
});
db.package_class_map.belongsTo(db.subscription, {
  foreignKey: "subscriptionId",
  otherKey: "id",
});
db.package_class_map.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.package_class_map.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - package
db.packages.belongsTo(db.courses, { foreignKey: "courseId", otherKey: "id" });
db.packages.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.packages.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - Subscription
db.subscription.belongsTo(db.packages, {
  foreignKey: "packageId",
  otherKey: "id",
});

db.subscription.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.subscription.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - Order
db.orders.belongsTo(db.packages, { foreignKey: "packageId", otherKey: "id" });
db.orders.belongsTo(db.subscription, {
  foreignKey: "subscriptionId",
  otherKey: "id",
});
db.orders.belongsTo(db.users, { foreignKey: "userId", otherKey: "id" });
db.orders.belongsTo(db.course_package_map, { foreignKey: "coursePackageId", otherKey: "id" });

//NOTE - Student
db.student.belongsTo(db.courses, { foreignKey: "courseId", otherKey: "id" });
db.student.belongsTo(db.boards, { foreignKey: "boardId", otherKey: "id" });
db.student.belongsTo(db.class, { foreignKey: "classId", otherKey: "id" });
db.student.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});

db.student.belongsTo(db.batchDate, {
  foreignKey: "batchStartDateId",
  otherKey: "id",
});
db.student.belongsTo(db.state, { foreignKey: "stateId", otherKey: "id" });
db.student.belongsTo(db.city, { foreignKey: "cityId", otherKey: "id" });
db.student.belongsTo(db.wantToBe, {
  foreignKey: "wantsToBeId",
  otherKey: "id",
});

//NOTE - scholarship_class_map relation
db.scholarship_class_map.belongsTo(db.courses, {
  foreignKey: "courseId",
  otherKey: "id",
});
db.scholarship_class_map.belongsTo(db.boards, {
  foreignKey: "boardId",
  otherKey: "id",
});
// db.scholarship_class_map.belongsTo(db.class, {
//   foreignKey: "classId",
//   otherKey: "id",
// });
// db.scholarship_class_map.belongsTo(db.batchTypes, {
//   foreignKey: "batchTypeId",
//   otherKey: "id",
// });
db.scholarship_class_map.belongsTo(db.scholarship, {
  foreignKey: "scholarshipId",
  otherKey: "id",
});

db.scholarship_class_map.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.scholarship_class_map.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//db.scholarship_class_map.belongsTo(db.subject, { foreignKey: "subjectId", otherKey: "id" });
db.scholarship.hasMany(db.scholarship_class_map, {
  foreignKey: "scholarshipId",
  as: "details",
});

db.scholarship.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.scholarship.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - scholarship_student_map
db.scholarship_student_map.belongsTo(db.courses, {
  foreignKey: "courseId",
  otherKey: "id",
});
db.scholarship_student_map.belongsTo(db.boards, {
  foreignKey: "boardId",
  otherKey: "id",
});
db.scholarship_student_map.belongsTo(db.class, {
  foreignKey: "classId",
  otherKey: "id",
});
db.scholarship_student_map.belongsTo(db.users, {
  foreignKey: "userId",
  otherKey: "id",
});
db.scholarship_student_map.belongsTo(db.state, {
  foreignKey: "stateId",
  otherKey: "id",
});
db.scholarship_student_map.belongsTo(db.city, {
  foreignKey: "cityId",
  otherKey: "id",
});
db.scholarship_student_map.belongsTo(db.scholarship, {
  foreignKey: "scholarshipId",
  otherKey: "id",
});

//NOTE - Mentorship
db.mentorship.belongsTo(db.admin, { foreignKey: "teacherId", otherKey: "id" });
db.mentorship.belongsTo(db.users, { foreignKey: "studentId", otherKey: "id" });

//NOTE - Revisions
db.revisions.belongsTo(db.courses, { foreignKey: "courseId", otherKey: "id" });
db.revisions.belongsTo(db.boards, { foreignKey: "boardId", otherKey: "id" });
db.revisions.belongsTo(db.class, { foreignKey: "classId", otherKey: "id" });
db.revisions.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});
db.revisions.belongsTo(db.subject, { foreignKey: "subjectId", otherKey: "id" });
db.revisions.belongsTo(db.chapter, {
  foreignKey: "chapaterId",
  otherKey: "id",
});

db.revisions.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.revisions.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - Mentorship
db.permission.belongsTo(db.route, { foreignKey: "routeId", otherKey: "id" });
db.permission.belongsTo(db.admin, { foreignKey: "staffId", otherKey: "id" });

//NOTE - Test Reports
db.student_test_map.belongsTo(db.test, {
  foreignKey: "testId",
  otherKey: "id",
});
db.student_test_map.belongsTo(db.questionBank, {
  foreignKey: "questionId",
  otherKey: "id",
});
db.student_test_map.belongsTo(db.users, {
  foreignKey: "studentId",
  otherKey: "id",
});

db.student_test_map.belongsTo(db.quiz, {
  foreignKey: "quizId",
  otherKey: "id",
});

db.student_test_map.belongsTo(db.assignment, {
  foreignKey: "assignmentId",
  otherKey: "id",
});

db.test_batch_map.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});

db.test_student_attempt_map.belongsTo(db.test, {
  foreignKey: "testId",
  otherKey: "id",
});

db.test_student_attempt_map.belongsTo(db.users, {
  foreignKey: "studentId",
  otherKey: "id",
});

db.test_student_attempt_map.belongsTo(db.assignment, {
  foreignKey: "assignmentId",
  otherKey: "id",
});

db.test_student_attempt_map.belongsTo(db.quiz, {
  foreignKey: "quizId",
  otherKey: "id",
});

db.test_student_attempt_map.belongsTo(db.scholarship, {
  foreignKey: "scholarshipId",
  otherKey: "id",
});

//NOTE - Feedback
db.feedback.belongsTo(db.users, { foreignKey: "studentId", otherKey: "id" });

//NOTE - Test question map Relationship
db.test_question_map.belongsTo(db.questionBank, {
  foreignKey: "questionId",
  otherKey: "id",
});

db.test_question_map.belongsTo(db.test, {
  foreignKey: "testId",
  otherKey: "id",
});

db.test_question_map.belongsTo(db.quiz, {
  foreignKey: "quizId",
  otherKey: "id",
});

//NOTE - Enquries
db.enquiry.belongsTo(db.users, { foreignKey: "userId", otherKey: "id" });

//NOTE - Assignment board map
db.assignment_board_map.belongsTo(db.assignment, {
  foreignKey: "assignmentId",
  otherKey: "id",
});
db.assignment_board_map.belongsTo(db.boards, {
  foreignKey: "boardId",
  otherKey: "id",
});
db.assignment_board_map.belongsTo(db.class, {
  foreignKey: "classId",
  otherKey: "id",
});
db.assignment_board_map.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});
db.assignment_board_map.belongsTo(db.subject, {
  foreignKey: "subjectId",
  otherKey: "id",
});
db.assignment_board_map.belongsTo(db.chapter, {
  foreignKey: "chapterId",
  otherKey: "id",
});

//NOTE - Assignment Question map
db.assignment_question_map.belongsTo(db.assignment, {
  foreignKey: "assignmentId",
  otherKey: "id",
});
db.assignment_question_map.belongsTo(db.questionBank, {
  foreignKey: "questionId",
  otherKey: "id",
});

//NOTE - Assignment Student map
db.assignment_student_map.belongsTo(db.assignment, {
  foreignKey: "assignmentId",
  otherKey: "id",
});
db.assignment_student_map.belongsTo(db.users, {
  foreignKey: "studentId",
  otherKey: "id",
});

//NOTE - Assignment answer map
db.assignment_answer_map.belongsTo(db.assignment, {
  foreignKey: "assignmentId",
  otherKey: "id",
});

db.assignment_answer_map.belongsTo(db.questionBank, {
  foreignKey: "questionId",
  otherKey: "id",
});

db.assignment_answer_map.belongsTo(db.users, {
  foreignKey: "studentId",
  otherKey: "id",
});

//NOTE - CITY activity RELATION
db.content.belongsTo(db.topic, { foreignKey: "topicId", otherKey: "id" });
db.content.belongsTo(db.courses, {
  foreignKey: "courseId",
  otherKey: "id",
});
db.content.belongsTo(db.boards, { foreignKey: "boardId", otherKey: "id" });
db.content.belongsTo(db.class, { foreignKey: "classId", otherKey: "id" });
db.content.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});
db.content.belongsTo(db.subject, {
  foreignKey: "subjectId",
  otherKey: "id",
});
db.content.belongsTo(db.chapter, {
  foreignKey: "chapterId",
  otherKey: "id",
});

db.content.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.content.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - teacher_book_map RELATION
db.teacher_book_map.belongsTo(db.event, {
  foreignKey: "eventId",
  otherKey: "id",
});

//NOTE - Quiz relation
db.quiz.belongsTo(db.users, { foreignKey: "studentId", otherKey: "id" });
db.quiz.belongsTo(db.subject, { foreignKey: "subjectId", otherKey: "id" });

db.quiz_test_answer_map.belongsTo(db.questionBank, {
  foreignKey: "questionId",
  otherKey: "id",
});
db.quiz_test_answer_map.belongsTo(db.quiz, {
  foreignKey: "quizId",
  otherKey: "id",
});
db.quiz_test_answer_map.belongsTo(db.users, {
  foreignKey: "studentId",
  otherKey: "id",
});

//NOTE - recent activity
db.recentActivity.belongsTo(db.new_content, {
  foreignKey: "videoId",
  otherKey: "id",
});
db.recentActivity.belongsTo(db.content_course_map, {
  foreignKey: "videoId",
  otherKey: "contentId",
});

//NOTE - Banner relations
db.banner.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.banner.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

db.banner.hasMany(db.banner_course_map, {
  foreignKey: "bannerId",
  as: "banners",
});

//NOTE - banner course relation
db.banner_course_map.belongsTo(db.banner, {
  foreignKey: "bannerId",
  otherKey: "id",
});

db.banner_course_map.belongsTo(db.courses, {
  foreignKey: "courseId",
  otherKey: "id",
});

db.banner_course_map.belongsTo(db.boards, {
  foreignKey: "boardId",
  otherKey: "id",
});

db.banner_course_map.belongsTo(db.class, {
  foreignKey: "classId",
  otherKey: "id",
});

db.banner_course_map.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});

db.banner_course_map.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.banner_course_map.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - State relations
db.state.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.state.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - Wants relations
db.wantToBe.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.wantToBe.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - Permission relations
db.permissionRole.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.permissionRole.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - FAQ relations
db.faq.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.faq.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - upload
db.upload.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.upload.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - top highlight
db.highlight.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.highlight.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - mentorship help
db.mentorshipHelp.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.mentorshipHelp.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - ZOOM CREDENTIAL
db.zoom_teacher_map.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.zoom_teacher_map.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - ZOOM CREDENTIAL
db.event.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.event.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - TEST
db.test.belongsTo(db.admin, {
  foreignKey: "createdId",
  otherKey: "id",
  as: "creator",
});

//NOTE - Assignment admin
db.assignment.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});

//NOTE - ASSIGNMENT
db.assignment.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - bulk upload
db.bulkUploadFiles.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});

db.bulkUploadFiles.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

db.assignment_startTime_map.belongsTo(db.users, {
  foreignKey: "studentId",
  otherKey: "id",
});

db.assignment_startTime_map.belongsTo(db.assignment, {
  foreignKey: "assignmentId",
  otherKey: "id",
});

//NOTE -grevinces
db.grievance_category.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.grievance_category.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE -grevinces sub category
db.grievance_subCategory.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.grievance_subCategory.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - student attandance
db.event_student_attendance.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.event_student_attendance.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});
db.event_student_attendance.belongsTo(db.users, {
  foreignKey: "studentId",
  otherKey: "id",
});

//NOTE - student attandance
db.event_teacher_attendance.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.event_teacher_attendance.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});
db.event_teacher_attendance.belongsTo(db.admin, {
  foreignKey: "teacherId",
  otherKey: "id",
});

//NOTE - indexing for rating
db.rating.belongsTo(db.users, { foreignKey: "studentId", otherKey: "id" });


//NOTE - new syllabus content
db.content_course_map.belongsTo(db.courses, { foreignKey: "courseId", otherKey: "id" });
db.content_course_map.belongsTo(db.boards, { foreignKey: "boardId", otherKey: "id" });
db.content_course_map.belongsTo(db.class, { foreignKey: "classId", otherKey: "id" });
db.content_course_map.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});
db.content_course_map.belongsTo(db.subject, { foreignKey: "subjectId", otherKey: "id", });
db.content_course_map.belongsTo(db.chapter, { foreignKey: "chapterId", otherKey: "id" });
//db.content_course_map.belongsTo(db.topic, { foreignKey: "topicId", otherKey: "id" });
db.content_course_map.belongsTo(db.topic, {
  foreignKey: "topicId",
  otherKey: "id",
  onDelete: "cascade" // Change the onDelete option to "cascade"
});
db.content_course_map.belongsTo(db.new_content, { foreignKey: "contentId", otherKey: "id" });

db.content_course_map.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.content_course_map.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});

//NOTE - relation of course package
db.course_package_map.belongsTo(db.admin, {
  foreignKey: "createdById",
  otherKey: "id",
  as: "creator",
});
db.course_package_map.belongsTo(db.admin, {
  foreignKey: "updatedById",
  otherKey: "id",
  as: "updater",
});
db.course_package_map.belongsTo(db.courses, {
  foreignKey: "courseId",
  otherKey: "id",
});
db.course_package_map.belongsTo(db.boards, {
  foreignKey: "boardId",
  otherKey: "id",
});
db.course_package_map.belongsTo(db.class, {
  foreignKey: "classId",
  otherKey: "id",
});
db.course_package_map.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});
db.student_course_package_map.belongsTo(db.course_package_map, {
  foreignKey: "packageId",
  otherKey: "id",
});
db.courses.hasMany(db.batchTypes, { foreignKey: 'courseId' });


//NOTE - student course package map
db.student_course_package_map.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});



//NOTE -  teacher_schedule
db.teacher_schedule.belongsTo(db.admin, {
  foreignKey: "teacherId",
  otherKey: "id",
});


//NOTE - liveclass_report relation
db.liveclass_report.belongsTo(db.courses, {
  foreignKey: "courseId",
  otherKey: "id",
});
db.liveclass_report.belongsTo(db.boards, {
  foreignKey: "boardId",
  otherKey: "id",
});
db.liveclass_report.belongsTo(db.class, {
  foreignKey: "classId",
  otherKey: "id",
});
db.liveclass_report.belongsTo(db.batchTypes, {
  foreignKey: "batchTypeId",
  otherKey: "id",
});
db.liveclass_report.belongsTo(db.event, {
  foreignKey: "eventId",
  otherKey: "id",
});


//NOTE -it can delete all database data:// match:/sequlize$/
db.sequelize
  .sync({ force: false }) //it can delete all database data:// match:/sequlize$/
  .then(() => {
    console.log("sync again");
  });



module.exports = db;
