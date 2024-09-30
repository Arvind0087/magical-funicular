const db = require("../../models/index");
const { Op } = require("sequelize");
const ObjectsToCsv = require("objects-to-csv");
const UserDetails = db.users;
const StudentDetails = db.student;
const AdminUser = db.admin;
const TeacherSubjectMap = db.teacher_subject_map;
const Boards = db.boards;
const Course = db.courses;
const Class = db.class;
const batchType = db.batchTypes;
const scholarshipApply = db.scholarship_student_map;
const User = db.users;
const Subject = db.subject;
const Enquiry = db.enquiry;
const State = db.state;
const City = db.city;
const RolePermission = db.permissionRole;
const AllFeedback = db.feedback;
const BatchType = db.batchTypes;
const RequestCall = db.requestCall;
const Topic = db.topic;
const Chapter = db.chapter;

//NOTE : Excel sheet for student
const studentExcelDownload = async (req, res) => {
  try {
    let studentData = [];
    const { search, token, course, classes } = req.query;

    ///NOTE - If there is any search value
    let query;
    if (search) {
      query = {
        [Op.or]: [
          { name: { [Op.like]: "%" + search + "%" } },
          { phone: { [Op.like]: "%" + search + "%" } },
          { email: { [Op.like]: "%" + search + "%" } },
          { studentType: { [Op.like]: "%" + search + "%" } },
        ],
      };
    }

    //NOTE - If token
    let tokenValue;
    if (token) {
      tokenValue = token;
    } else {
      tokenValue = "";
    }

    //NOTE - class ans course filter
    let final;
    if (classes) {
      final = {
        classId: classes,
        ...final
      };
    }
    else if (course) {
      final = {
        ...final,
        courseId: course,
      };
    }

    //NOTE - get all user details
    const data = await UserDetails.findAll({
      ...tokenValue,
      where: {
        type: "student",
        ...query,
      },
      attributes: {
        exclude: ["updatedAt", "mPin", "typeId", "type", "status",],
      },

      include: {
        model: StudentDetails,
        attributes: ["dob", "classId", "courseId"],
        where: final,
        include: [
          { model: Course, attributes: ["name"] },
          { model: Class, attributes: ["name"] },
          { model: batchType, attributes: ["name"] },
        ],
      },
      order: [["createdAt", "DESC"]],
    });
    for (const dd of data) {
      //const far = dd.createdAt.split('.')
      const res = dd.createdAt.toString().split(".")[0];

      studentData.push({
        id: dd.id,
        vedaId: dd.vedaId,
        name: dd.name,
        email: dd.email,
        phone: dd.phone,
        studentType: dd.studentType,
        dob: new Date(dd.student.dob).toISOString().slice(0, 10),
        registrationDate: new Date(dd.createdAt).toISOString().slice(0, 10),
        subscriptionType: dd.subscriptionType,
        course: dd.student?.course?.name,
        class: dd.student?.class?.name,
        medium: dd.student.batchType.name,
        referralCode: dd?.student?.recommendReferralCode || null,
      });
    }

    const plainObject = JSON.parse(JSON.stringify(studentData));
    const csv = new ObjectsToCsv(plainObject);
    const csvString = await csv.toString();
    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=student_data.csv",
      "Content-Length": csvString.length,
    });
    return res.send(csvString);
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE : Excel scheet for staff
const staffExcelDownload = async (req, res) => {
  try {
    const allStaff = [];

    const { search, department, classes } = req.query;

    //NOTE - filte based on admin name,email, phone
    let val;
    if (search) {
      val = {
        [Op.or]: [
          { name: { [Op.like]: "%" + search + "%" } },
          { phone: { [Op.like]: "%" + search + "%" } },
          { email: { [Op.like]: "%" + search + "%" } },
        ],
      };
    }

    //NOTE - filter based on department
    let depart;
    if (department) {
      depart = {
        department: department,
      };
    }

    //NOTE - filter based on department
    let cls;
    if (classes) {
      cls = {
        id: classes,
      };
    }

    //NOTE - get all admin details
    const getClass = await TeacherSubjectMap.findAndCountAll({
      include: [
        { model: Class, attributes: ["id", "name"], where: cls },
        {
          model: Subject,
          attributes: ["id", "name"],
        },
        {
          model: AdminUser,
          attributes: [
            "id",
            "name",
            "email",
            "email",
            "dob",
            "department",
            "gender",
            "createdById",
            "updatedById",
          ],
          where: { ...depart, ...val },
          include: {
            model: RolePermission,
            attributes: ["role"],
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // NOTE - Get teacher id unique
    const teacherkey = "teacherId";
    const uniqueAdmin = [
      ...new Map(
        getClass.rows.map((item) => [item[teacherkey], item])
      ).values(),
    ].sort();

    for (let adminUsers of uniqueAdmin) {
      //NOTE - Final data push
      allStaff.push({
        id: adminUsers?.adminUser.id,
        name: adminUsers?.adminUser?.name,
        email: adminUsers?.adminUser?.email,
        phone: adminUsers?.adminUser?.phone,
        gender: adminUsers?.adminUser?.gender,
        dob: adminUsers?.adminUser?.dob,
        department: adminUsers?.adminUser?.permission_role.role,
      });
    }

    const plainObject = JSON.parse(JSON.stringify(allStaff));
    const csv = new ObjectsToCsv(plainObject);
    const csvString = await csv.toString();
    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=staff_data.csv",
      "Content-Length": csvString.length,
    });
    return res.send(csvString);
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE : Excel sheet for Feedback
const feedbackExcelDownload = async (req, res) => {
  try {
    let feedbacks = [];

    const { search, token, student } = req.query;
    let query;

    //NOTE - if value on search
    if (search) {
      query = {
        [Op.or]: [{ feedback: { [Op.like]: "%" + search + "%" } }],
      };
    }

    //NOTE - student filter
    let stu;
    if (student) {
      stu = {
        name: { [Op.like]: "%" + student + "%" },
      };
    }

    //NOTE - If token
    let tokenValue;
    if (token) {
      tokenValue = token;
    } else {
      tokenValue = "";
    }

    const getAllFeedbacks = await AllFeedback.findAll({
      ...tokenValue,
      where: {
        ...query,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: UserDetails,
          attributes: ["name", "email", "phone"],
          where: stu,
        },
      ],
    });

    for (const data of getAllFeedbacks) {
      feedbacks.push({
        id: data.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        feedback: data.feedback,
      });
    }
    const plainObject = JSON.parse(JSON.stringify(feedbacks));
    const csv = new ObjectsToCsv(plainObject);
    const csvString = await csv.toString();
    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=feedback_data.csv",
      "Content-Length": csvString.length,
    });
    return res.send(csvString);
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE : Excel sheet for scholarship
const scholarshipExcelDownload = async (req, res) => {
  try {
    let allScholar = [];
    const { search, token, classes } = req.query;

    let final = {};
    if (search) {
      final = {
        name: { [Op.like]: "%" + search + "%" },
      };
    }

    //NOTE - class filter
    let cls;
    if (classes) {
      cls = {
        classId: classes,
      };
    }

    //NOTE - If token
    let tokenValue;
    if (token) {
      tokenValue = token;
    } else {
      tokenValue = "";
    }

    const getScholarshipApply = await scholarshipApply.findAll({
      ...tokenValue,
      where: cls, //TODO - filter scholarship apply by class id
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Course,
          attributes: ["name"],
        },
        {
          model: Boards,
          attributes: ["name"],
        },
        {
          model: Class,
          attributes: ["name"],
        },
        {
          model: User,
          attributes: ["name"],
          where: { type: "student", ...final },
        },
      ],
    });

    for (let data of getScholarshipApply) {
      allScholar.push({
        id: data.id,
        class: data.class.name,
        user: data.user.name,
      });
    }

    const plainObject = JSON.parse(JSON.stringify(allScholar));
    const csv = new ObjectsToCsv(plainObject);
    const csvString = await csv.toString();
    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=scholarship_data.csv",
      "Content-Length": csvString.length,
    });
    return res.send(csvString);
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE:  enquiry excel sheet downlaod
const enquiryExcelDownload = async (req, res) => {
  try {
    let getAllEnquiry = [];
    const { search, token } = req.query;

    let val;
    if (search) {
      val = {
        [Op.or]: [
          { name: { [Op.like]: "%" + search + "%" } },
          { phone: { [Op.like]: "%" + search + "%" } },
          { email: { [Op.like]: "%" + search + "%" } },
        ],
      };
    }

    //NOTE - If token
    let tokenValue;
    if (token) {
      tokenValue = token;
    } else {
      tokenValue = "";
    }

    const getEnquiry = await Enquiry.findAndCountAll({
      ...tokenValue,
      include: [
        {
          model: User,
          attributes: ["name", "phone", "email"],
          where: val,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!getEnquiry) {
      return res
        .status(400)
        .send({ status: 400, message: msg.ENQUIRY_NOT_FOUND });
    }

    for (let data of getEnquiry.rows) {
      getAllEnquiry.push({
        id: data.id,
        userId: data.userId,
        name: data.user.name,
        phone: data.user.phone,
        email: data.user.email,
        subject: data.subject,
        message: data.message,
      });
    }
    const plainObject = JSON.parse(JSON.stringify(getAllEnquiry));
    const csv = new ObjectsToCsv(plainObject);
    const csvString = await csv.toString();
    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=enquiry_data.csv",
      "Content-Length": csvString.length,
    });
    return res.send(csvString);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE: get state csv
const stateExcelDownload = async (req, res) => {
  try {
    const { search, token } = req.query;

    let val;
    if (search) {
      val = {
        name: { [Op.like]: "%" + search + "%" },
      };
    }

    //NOTE - If token
    let tokenValue;
    if (token) {
      tokenValue = token;
    } else {
      tokenValue = "";
    }

    const getState = await State.findAll({
      ...tokenValue,
      where: val,
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["createdAt", "DESC"]],
    });

    let allState = [];
    for (let data of getState) {
      allState.push({
        name: data.name,
      });
    }

    const plainObject = JSON.parse(JSON.stringify(allState));
    const csv = new ObjectsToCsv(plainObject);
    const csvString = await csv.toString();
    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=state_data.csv",
      "Content-Length": csvString.length,
    });
    return res.send(csvString);
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE: get all city csv
const cityExcelDownload = async (req, res) => {
  try {
    const { state, city, token } = req.query;
    let allData = [];

    //NOTE - If state
    let states;
    if (state) {
      states = {
        name: state,
      };
    }

    //NOTE - If city
    let val;
    if (city) {
      val = {
        name: { [Op.like]: "%" + city + "%" },
      };
    }

    //NOTE - If token
    let tokenValue;
    if (token) {
      tokenValue = token;
    } else {
      tokenValue = "";
    }

    //NOTE: Get all city
    const getCity = await City.findAll({
      ...tokenValue,
      where: val,
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: State,
        attributes: ["name"],
        where: states,
      },
      order: [["createdAt", "DESC"]],
    });
    //NOTE: if city not there
    if (!getCity) {
      return res.status(400).send({ status: 400, message: msg.CITY_NOT_FOUND });
    }
    //NOTE: if city push all data
    for (let data of getCity) {
      allData.push({
        state: data.state?.name,
        city: data.name,
      });
    }

    const plainObject = JSON.parse(JSON.stringify(allData));
    const csv = new ObjectsToCsv(plainObject);
    const csvString = await csv.toString();
    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=city_data.csv",
      "Content-Length": csvString.length,
    });
    return res.send(csvString);
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE : Excel sheet for Subject
const subjectExcelDownload = async (req, res) => {
  try {
    let subjectData = [];
    const { search, token, classes } = req.query;

    ///NOTE - If there is any search value
    let query;
    if (search) {
      query = {
        [Op.or]: [{ name: { [Op.like]: "%" + search + "%" } }],
      };
    }

    //NOTE - class filter
    if (classes) {
      query = {
        ...query,
        classId: classes,
      };
    }

    //NOTE - If token
    let tokenValue;
    if (token) {
      tokenValue = token;
    } else {
      tokenValue = "";
    }

    //NOTE - get all subject
    const subjectsData = await Subject.findAll({
      ...tokenValue,
      where: query,
      attributes: {
        exclude: ["updatedAt", "createdAt"],
      },

      include: [
        {
          model: Course,
          attributes: ["name"],
        },
        {
          model: Boards,
          attributes: ["name"],
        },
        {
          model: Class,
          attributes: ["name"],
        },
        {
          model: BatchType,
          attributes: ["name"],
        },
      ],
    });
    for (const data of subjectsData) {
      subjectData.push({
        id: data.id,
        name: data.name,
        course: data.course?.name,
        board: data.board?.name,
        class: data.class?.name,
        batchType: data.batchType?.name,
      });
    }
    const plainObject = JSON.parse(JSON.stringify(subjectData));
    const csv = new ObjectsToCsv(plainObject);
    const csvString = await csv.toString();
    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=subject_data.csv",
      "Content-Length": csvString.length,
    });
    return res.send(csvString);
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : excel of all request call
const requestCallExcelDownload = async (req, res) => {
  try {
    const { search, token } = req.query;
    let result = [];

    //NOTE - filter based on student
    let final = {};
    if (search) {
      final = {
        userId: search,
      };
    }

    //NOTE - get all request call
    const getRequestCall = await RequestCall.findAndCountAll({
      where: final,
      include: [
        {
          model: UserDetails,
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (!RequestCall) {
      return res
        .status(400)
        .send({ status: 400, message: msg.REQUEST_NOT_FOUND });
    }

    //NOTE - push final data
    for (let data of getRequestCall.rows) {
      result.push({
        id: data.id,
        user: data.user?.name,
        reason: data.message,
        date: data.createdAt,
      });
    }

    //NOTE - converting into array of object to csv format
    const plainObject = JSON.parse(JSON.stringify(result));
    const csv = new ObjectsToCsv(plainObject);
    const csvString = await csv.toString();
    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=requestCall_data.csv",
      "Content-Length": csvString.length,
    });
    return res.send(csvString);
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE : Excel sheet for Subject
const topicExcelDownload = async (req, res) => {
  try {
    let topicData = [];
    const { search, token } = req.query;



    //NOTE - If token
    let tokenValue;
    if (token) {
      tokenValue = token;
    } else {
      tokenValue = "";
    }

    const today = new Date();
    //NOTE:  Set the start and end time of today
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );

    //NOTE - get all subject
    const topicsData = await Topic.findAll({
      ...tokenValue,
      where: {
        // createdAt: {
        //   [Op.between]: [startOfDay, endOfDay],
        // },
      },
      attributes: {
        exclude: ["updatedAt"],
      },

      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"] },
        { model: BatchType, attributes: ["name"] },
        {
          model: Subject,
          attributes: ["name"],
          options: {
            charset: "utf8mb4", // Set the charset option to 'utf8mb4'
          },
        },
        {
          model: Chapter,
          attributes: ["name"],
          options: {
            charset: "utf8mb4", // Set the charset option to 'utf8mb4'
          },
        },
      ],
    });
    const plainObject = topicsData.map((data) => {
      return {
        id: data.id,
        name: data.name,
        course: data.course?.name,
        board: data.board?.name,
        class: data.class?.name,
        batchType: data.batchType?.name,
        subject: data.subject?.name || "",
        chapter: data.chapter?.name || "",
        createdAt: new Date(data.createdAt).toLocaleDateString()
      };
    });

    const csv = new ObjectsToCsv(plainObject);
    const csvString = await csv.toString();

    const csvBuffer = Buffer.from(csvString, "utf-8");

    res.set({
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=topic_data.csv",
      "Content-Length": csvBuffer.length,
    });

    return res.send(csvBuffer);
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  studentExcelDownload,
  staffExcelDownload,
  feedbackExcelDownload,
  scholarshipExcelDownload,
  enquiryExcelDownload,
  stateExcelDownload,
  cityExcelDownload,
  subjectExcelDownload,
  requestCallExcelDownload,
  topicExcelDownload,
};
