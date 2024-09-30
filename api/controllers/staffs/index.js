const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { Op } = require("sequelize");
const uploadFileS3 = require("../../helpers/uploadFileS3");
const getSignedUrl = require("../../helpers/getSignedUrl");
const { checkIfArraysMatch } = require("./service");
const AdminUser = db.admin;
const RolePermission = db.permissionRole;
const TeacherAdmin = db.teachers;
const TeacherSubjectMap = db.teacher_subject_map;
const Course = db.courses;
const Boards = db.boards;
const Class = db.class;
const BatchType = db.batchTypes;
const BatchStartDate = db.batchDate;
const Subject = db.subject;

//ANCHOR - Get all Staff Details
const getAllStaffDetails = async (req, res) => {
  try {
    const allStaff = [];
    const { page, limit, search, department, classes } = req.query;

    //NOTE - add pagination
    const query =
      page && limit
        ? {
          offset: Number(page - 1) * limit,
          limit: Number(limit),
        }
        : {};

    //NOTE - filter based on name, email and phone
    const searchParams = search
      ? {
        [Op.or]: [
          { name: { [Op.like]: "%" + search + "%" } },
          { phone: { [Op.like]: "%" + search + "%" } },
          { email: { [Op.like]: "%" + search + "%" } },
        ],
      }
      : undefined;

    //NOTE - department filter
    const departmentParams = department
      ? { department: department }
      : undefined;

    //NOTE - filter by class
    const classParams = classes ? { classId: classes } : undefined;

    let teacherId;
    if (req.user)
      if (["teacher", "mentor"].includes(req.user?.role.toLowerCase())) {
        teacherId = {
          id: req.user.id,
        };
      }

    //NOTE - Get details from Admin table
    const { count, rows } = await AdminUser.findAndCountAll({
      ...query,
      where: { ...searchParams, ...departmentParams, ...teacherId },
      exclude: ["createdAt", "updatedAt"],
      include: [
        {
          model: RolePermission,
          attributes: ["role"],
        },
        {
          model: TeacherAdmin,
          attributes: ["dob"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    for (const adminUsers of rows) {
      const getClass = await TeacherSubjectMap.findAll({
        where: { teacherId: adminUsers.id },
        include: [
          {
            model: Class,
            attributes: ["id", "name"],
          },
          {
            model: BatchType,
            attributes: ["id", "name"],
          },
          {
            model: BatchStartDate,
            attributes: ["id", "date"],
          },
          {
            model: Subject,
            attributes: ["id", "name"],
          },
        ],
      });

      const uniqueClasses = new Set();
      const uniqueBatchTypes = new Set();
      const uniqueBatchDates = new Set();
      const uniqueSubject = new Set();

      getClass.forEach((item) => {
        const classId = item.class && item.class.id;
        const className = item.class && item.class.name;
        const batchTypeId = item.batchType && item.batchType.id;
        const batchTypeName = item.batchType && item.batchType.name;
        const batchStartDateId = item.batchDate && item.batchDate.id;
        const batchDate = item.batchDate && item.batchDate.date;
        const subjectId = item.subject && item.subject.id;
        const subjectName = item.subject && item.subject.name;

        if (classId && className) {
          uniqueClasses.add(classId); //TODO: Store only the unique class ID
        }

        if (batchTypeId && batchTypeName) {
          uniqueBatchTypes.add(batchTypeId); //TODO: Store only the unique batch type ID
        }

        if (batchStartDateId && batchDate) {
          uniqueBatchDates.add(batchStartDateId); //TODO: Store only the unique batch date ID
        }

        if (subjectId && subjectName) {
          uniqueSubject.add(subjectId); //TODO: Store only the unique subject ID
        }
      });

      //NOTE - get the details , who created the staff
      const creatorStaff = await AdminUser.findOne({
        where: { id: adminUsers.createdById },
        include: [
          {
            model: RolePermission,
            attributes: ["role"],
          },
        ],
      });

      //NOTE - get the details , who update the staff details
      const updaterStaff = await AdminUser.findOne({
        where: { id: adminUsers.updatedById },
        include: [
          {
            model: RolePermission,
            attributes: ["role"],
          },
        ],
      });
      //TODO: Convert the sets to arrays of objects
      const classes = Array.from(uniqueClasses).map((classId) => ({
        id: classId,
        name: getClass.find((item) => item.class.id === classId)?.class.name,
      }));

      const batchTypes = Array.from(uniqueBatchTypes).map((batchTypeId) => ({
        id: batchTypeId,
        name: getClass.find((item) => item.batchType.id === batchTypeId)
          ?.batchType.name,
      }));

      const batchDates = Array.from(uniqueBatchDates).map(
        (batchStartDateId) => ({
          id: batchStartDateId,
          date: getClass.find((item) => item.batchDate.id === batchStartDateId)
            ?.batchDate.date,
        })
      );

      const subjects = Array.from(uniqueSubject).map((subjectId) => ({
        id: subjectId,
        name: getClass.find((item) => item.subject.id === subjectId)?.subject
          .name,
      }));

      //NOTE - Final data push
      allStaff.push({
        id: adminUsers.id,
        name: adminUsers.name,
        email: adminUsers.email,
        phone: adminUsers.phone,
        teacherInfo: adminUsers?.teacherInfo,
        dob: ["teacher", "mentor", "Teacher", "Mentor"].includes(
          adminUsers.permission_role.role
        )
          ? adminUsers.teacher?.dob
          : adminUsers.dob,
        department: adminUsers.permission_role.role,
        gender: adminUsers.gender,
        avatar: adminUsers.avatar
          ? await getSignedUrl(adminUsers.avatar)
          : null,
        class: classes, //TODO: Add unique class names to the array
        batchType: batchTypes, //TODO: Add unique batch types to the array
        batchDate: batchDates, //TODO: Add unique batch dates to the array
        subject: subjects, //TODO: Add unique subject to the array
        createdByName: creatorStaff ? creatorStaff.name : null,
        createdByRole: creatorStaff
          ? creatorStaff?.permission_role?.role
          : null,
        updateByName: updaterStaff ? updaterStaff?.name : null,
        updateByRole: updaterStaff ? updaterStaff?.permission_role.role : null,
        intro_video: adminUsers?.intro_video,
      });
    }

    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      count: count,
      data: allStaff,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get Staff by Id
const getStaffDetailsByID = async (req, res) => {
  try {
    const { id } = req.params;
    let data = {};
    const classDetails = [];
    const subjectDetails = [];
    const batchTypeDetails = [];
    const courseDetails = [];
    const boardDetails = [];

    //NOTE - Get adminuser details from admin table
    const admin_details = await AdminUser.findOne({
      where: { id: id },
      include: [
        {
          model: RolePermission,
          attributes: ["id", "role"],
        },
      ],
    });

    //NOTE - Get Teacher Details ferom teacher table
    const teacher_details = await TeacherAdmin.findOne({
      where: { id: admin_details.typeId },
    });

    //NOTE - get Teacher subject details
    const subject_details = await TeacherSubjectMap.findAll({
      where: { teacherId: admin_details.id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Course,
          attributes: ["id", "name"],
        },
        {
          model: Boards,
          attributes: ["id", "name"],
        },
        {
          model: Class,
          attributes: ["id", "name"],
        },
        {
          model: BatchType,
          attributes: ["id", "name"],
        },
        {
          model: Subject,
          attributes: ["id", "name"],
        },
      ],
    });

    for (const sub of subject_details) {
      //NOTE: push class details
      classDetails.push({ id: sub?.class.id, name: sub?.class.name });
      courseDetails.push({
        id: sub?.course.id,
        course: sub?.course?.name,
      });

      boardDetails.push({
        id: sub?.board.id,
        board: sub?.board?.name,
      });

      //NOTE - push batch type details
      if (sub.batchType)
        batchTypeDetails.push({
          id: sub?.batchType?.id,
          name: sub?.batchType?.name,
          course: sub?.course?.name,
          board: sub?.board?.name,
          class: sub?.class?.name,
        });

      //NOTE - Push Subject details
      if (sub.subject)
        subjectDetails.push({
          id: sub?.subject?.id,
          name: sub?.subject.name,
          batchType: sub?.batchType?.name,
        });
    }

    let uniqueBatch = [];
    //NOTE - Get Unique Class
    if (batchTypeDetails) {
      const batchkey = "id";
      uniqueBatch = [
        ...new Map(
          batchTypeDetails.map((item) => [item[batchkey], item])
        ).values(),
      ].sort();
    }

    //NOTE - Get Unique Class
    const key = "id";
    const uniqueClass = [
      ...new Map(classDetails.map((item) => [item[key], item])).values(),
    ].sort();

    let uniqueSubject = [];
    if (subjectDetails) {
      //NOTE - Get Subject Class
      const subjectkey = "id";
      uniqueSubject = [
        ...new Map(
          subjectDetails.map((item) => [item[subjectkey], item])
        ).values(),
      ].sort();
    }

    //NOTE: Finalizing the response
    data = {
      id: admin_details.id,
      name: admin_details.name,
      email: admin_details.email,
      phone: admin_details.phone,
      teacherInfo: admin_details?.teacherInfo,
      intro_video: admin_details?.intro_video,
      departmentId: admin_details.permission_role.id,
      departmentName: admin_details.permission_role.role,
      dob: ["teacher", "mentor", "Teacher", "Mentor"].includes(
        admin_details.permission_role.role
      )
        ? teacher_details?.dob
        : admin_details.dob,
      gender: admin_details?.gender,
      avatar: admin_details.avatar
        ? await getSignedUrl(admin_details.avatar)
        : null,
      courseId: subject_details && subject_details[0]?.course.id,
      course: subject_details && subject_details[0]?.course.name,
      boardId: subject_details && subject_details[0]?.board?.id,
      board: subject_details && subject_details[0]?.board?.name,
      classDetails: uniqueClass,
      batchTypes: uniqueBatch,
      subjectDetails: uniqueSubject,
    };
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Update Staff By Id
const updateStaffById = async (req, res) => {
  try {
    const ID = req.params.id;

    const { name, email, phone, dob, gender, avatar, classId, department, teacherInfo } =
      req.body;

    //NOTE - decoding token
    const token = req.user.id;

    //NOTE - Get details from Admin table
    const users = await AdminUser.findOne({
      where: { id: ID },
      include: {
        model: RolePermission,
        attributes: ["role"],
      },
    });

    if (!users)
      return res.status(400).send({
        status: 400,
        message: msg.INVALID_ROLE,
      });

    let payload = {
      name: name,
      email: email,
      phone: phone,
      gender: gender,
      dob: dob,
      department: department,
      teacherInfo: teacherInfo,
      updatedById: token,
    };

    //NOTE - upload avatar
    if (avatar && avatar.includes("base64")) {
      const uploadAvatar = await uploadFileS3(avatar, msg.ADMIN_FOLDER_CREATED);
      payload = { ...payload, avatar: uploadAvatar.key };
    }

    //NOTE -  update staff in Admin Table
    await AdminUser.update(payload, { where: { id: users.id } });

    //NOTE - update staff on Teacher table
    await TeacherAdmin.update({ dob: dob }, { where: { id: users.typeId } });

    if (
      ["teacher", "mentor", "Teacher", "Mentor"].includes(
        users.permission_role?.role
      )
    ) {
      const checkClass = await TeacherSubjectMap.findAll({
        where: {
          teacherId: users.id,
          classId: { [Op.in]: classId }, //TODO: Assuming classId is an array of class IDs to check against
        },
      });

      //NOTE - get the class id is there
      const classIdsFound = checkClass.map((item) => item.classId);

      if (classIdsFound.length === 0) {
        // NOTE - Destroy all data
        await TeacherSubjectMap.destroy({
          where: {
            teacherId: users.id,
          },
        });
      }

      //NOTE - get the class id is not there
      const classIdsNotFound = classId.filter(
        (id) => !classIdsFound.includes(id)
      );

      // NOTE - Create multiple classes
      if (classIdsNotFound.length > 0) {
        const classes = await Class.findAll({
          where: {
            id: { [Op.in]: classIdsNotFound }, //TODO: Assuming classId is an array of class IDs to create
          },
        });

        //NOTE - create subjcet map
        const teacherSubjectMaps = classes.map((getClass) => ({
          teacherId: users.id,
          courseId: getClass.courseId,
          boardId: getClass.boardId,
          classId: getClass.id,
        }));

        await TeacherSubjectMap.bulkCreate(teacherSubjectMaps);
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.STAFF_UPDATED,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - delete Staff
const deleteStaffById = async (req, res) => {
  try {
    const ID = req.params.id;
    const users = await AdminUser.findOne({
      where: { id: ID },
      include: [
        {
          model: RolePermission,
          attributes: ["role"],
        },
      ],
    });

    if (!users) {
      return res.status(400).send({ status: 400, message: msg.INVALID_USER });
    }

    if (["teacher"].includes(users.permission_role?.role)) {
      //NOTE - Destory all data for mapping table
      await TeacherSubjectMap.destroy({
        where: {
          teacherId: users.id,
        },
      });
      const teachers = await TeacherAdmin.findOne({
        where: { id: users.typeId },
      });
      //NOTE - destory data from teachers table
      await teachers.destroy();
    }

    //NOTE - Destory data in users table
    await users.destroy();

    return res
      .status(200)
      .send({ status: 200, id: users.id, message: msg.STAFF_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - Get all Staff Details by subjectId
const getAllStaffDetailsBySubjectId = async (req, res) => {
  try {
    const allStaff = [];
    const { subjectId } = req.query;

    const subjects = await TeacherSubjectMap.findAll({
      where: {
        subjectId: subjectId,
      },
      include: [
        {
          model: Subject,
          attributes: ["name"],
        },
      ],
    });

    //NOTE - Get details from Admin table
    for (let teacher of subjects) {
      const adminUsers = await AdminUser.findOne({
        where: { id: teacher.teacherId },
        exclude: ["createdAt", "updatedAt"],
        include: [
          {
            model: RolePermission,
            attributes: ["role"],
          },
          {
            model: TeacherAdmin,
            attributes: ["dob"],
          },
        ],
      });
      if (!adminUsers) {
        return res
          .status(400)
          .send({ status: 400, message: msg.STAFF_NOT_FOUND });
      }
      //NOTE - Final data push
      allStaff.push({
        id: adminUsers.id,
        name: adminUsers.name,
        departmentId: adminUsers?.department,
        department: adminUsers.permission_role.role,
        gender: adminUsers.gender,
        avatar: adminUsers.avatar
          ? await getSignedUrl(adminUsers.avatar)
          : null,
        subject: teacher.subject?.name,
      });
    }

    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allStaff,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get all Staff
const getAllStaffOnly = async (req, res) => {
  try {
    const { type } = req.query;
    const allStaff = [];

    //NOTE - If login by a teacher or mentor
    let depart;
    if (req.user)
      if (["admin", "superadmin"].includes(req.user?.role.toLowerCase())) {
        // params = {
        //   teacherId: req.user.id,
        // };
        if (type === "Demo Class") {
          const roles_details = await RolePermission.findOne({
            where: { role: "teacher" },
            attributes: ["id"],
          });

          depart = {
            department: roles_details.id,
          };
        }

        if (type === "Mentorship") {
          const roles_details = await RolePermission.findOne({
            where: { role: "mentor" },
            attributes: ["id"],
          });

          depart = {
            department: roles_details.id,
          };
        }
      }

    //NOTE - only filter staff
    let onlyStaff;
    if (req.user)
      if (!["admin", "superadmin"].includes(req.user?.role.toLowerCase())) {
        onlyStaff = {
          id: req.user.id,
        };
      }

    //NOTE - get all admin user
    const adminUsers = await AdminUser.findAndCountAll({
      exclude: ["createdAt", "updatedAt"],
      where: { ...depart, ...onlyStaff },
      include: [
        {
          model: RolePermission,
          attributes: ["role"],
        },
        {
          model: TeacherAdmin,
          attributes: ["dob"],
        },
      ],
    });
    if (!adminUsers) {
      return res
        .status(400)
        .send({ status: 400, message: msg.STAFF_NOT_FOUND });
    }
    //NOTE - Final data push
    for (let admin_details of adminUsers.rows) {
      allStaff.push({
        id: admin_details.id,
        name: admin_details.name,
        departmentId: admin_details?.department,
        department: admin_details.permission_role.role,
      });
    }
    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allStaff,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

const updateStaffBatchDetails = async (req, res) => {
  try {
    const id = req.params.id;

    const { batchTypeIds, batchDateIds, subjectIds } = req.body;

    //NOTE - Get admin details
    const getAdmin = await AdminUser.findOne({
      where: { id: id },
    });

    //NOTE - check class details
    const classDetails = await TeacherSubjectMap.findAll({
      where: { teacherId: getAdmin.id },
    });

    const classIds = classDetails.map((data) => data.classId);

    const batchTypeClassIds = await BatchType.findAll({
      where: { id: { [Op.in]: batchTypeIds } },
      attributes: ["classId"],
    });

    const allClassForBatch = batchTypeClassIds.map((batch) => batch.classId);
    const arraysMatchBatch = checkIfArraysMatch(allClassForBatch, classIds); //TODO - check batch

    if (!arraysMatchBatch)
      return res.status(400).send({
        status: 400,
        message: msg.PLEASE_ENTER_BATCH,
      });

    const batchDates = await BatchStartDate.findAll({
      where: { id: { [Op.in]: batchDateIds } },
      attributes: ["batchTypeId"],
    });

    const allBatchForDates = batchDates.map((date) => date.batchTypeId);

    const arraysMatchBatchDate = checkIfArraysMatch(
      allBatchForDates,
      batchTypeIds
    ); //TODO - check batch date

    if (!arraysMatchBatchDate)
      return res.status(400).send({
        status: 400,
        message: msg.PLEASE_ENTER_BATCH_DATE,
      });

    const subjectBatchTypes = await Subject.findAll({
      where: { id: { [Op.in]: subjectIds } },
      attributes: ["batchTypeId"],
    });

    const allSubjectBatch = subjectBatchTypes.map(
      (subject) => subject.batchTypeId
    );

    const arraysMatchSubject = checkIfArraysMatch(
      allSubjectBatch,
      batchTypeIds
    ); //TODO - check subject

    if (!arraysMatchSubject)
      return res.status(400).send({
        status: 400,
        message: msg.PLEASE_ENTER_SUBJECT,
      });

    //NOTE - Destory all data
    await TeacherSubjectMap.destroy({
      where: {
        teacherId: getAdmin.id,
      },
    });

    //NOTE - check batch dates
    const batchStartDateIds = await BatchStartDate.findAll({
      where: {
        batchTypeId: { [Op.in]: batchTypeIds },
      },
      attributes: ["id", "batchTypeId"],
    });

    //NOTE - check Subjects
    const subjectDetails = await Subject.findAll({
      where: {
        id: { [Op.in]: subjectIds },
        batchTypeId: { [Op.in]: batchTypeIds },
      },
      attributes: ["id", "courseId", "boardId", "classId", "batchTypeId"],
    });

    for (const batchStartDate of batchStartDateIds) {
      const { batchTypeId } = batchStartDate;

      for (const subjectDetail of subjectDetails) {
        const { id: subjectId, courseId, boardId, classId } = subjectDetail;

        if (subjectDetail.batchTypeId === batchTypeId) {
          const push_subject_map = new TeacherSubjectMap({
            teacherId: getAdmin.id,
            courseId,
            boardId,
            classId,
            subjectId,
            batchStartDateId: batchStartDate.id,
            batchTypeId,
          });

          await push_subject_map.save();
        }
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.STAFF_UPDATED,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

module.exports = {
  getAllStaffDetails,
  getStaffDetailsByID,
  updateStaffById,
  deleteStaffById,
  getAllStaffDetailsBySubjectId,
  getAllStaffOnly, //TODO - Use on live section
  updateStaffBatchDetails, //TODO - use in admin panel update staff section
};
