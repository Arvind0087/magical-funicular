const moment = require("moment");
const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { getDuration, createActivity } = require("./service");
const { Sequelize, Op } = require("sequelize");
const { retriveLeads } = require("../../helpers/leadsquard");
const { config } = require("../../config/db.config");
const { bathDetails } = require("../../helpers/batchValidator");
const { captureLead } = require("../users/service");
const Scholarship = db.scholarship;
const scholarship_class_map = db.scholarship_class_map;
const Boards = db.boards;
const Course = db.courses;
const Class = db.class;
const scholarshipApply = db.scholarship_student_map;
const User = db.users;
const batchType = db.batchTypes;
const Subject = db.subject;
const Student = db.student;
const State = db.state;
const City = db.city;
const AdminDetails = db.admin;
const Test = db.test;
const Test_Question_Map = db.test_question_map;
const TestSubjectMap = db.test_subject_map;
const TestBatchMap = db.test_batch_map;
const AllQuestions = db.questionBank;
const TopicDetails = db.topic;
const RolePermission = db.permissionRole;
const TeacherSubjectMap = db.teacher_subject_map;

//ANCHOR : create scholarship with class
const createScholarshipWithClass = async (req, res) => {
  try {
    const date = moment(req.body.date).add(1, "day").toDate();
    const {
      scholarshipId,
      subjectId,
      classId,
      courseId,
      boardId,
      batchTypeId,
      startTime,
      endTime,
    } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    //NOTE - checking class already exist or not
    const batches = JSON.stringify(batchTypeId);
    const getScholarshipClass = await scholarship_class_map.findOne({
      where: {
        batchTypeId: batches,
      },
    });

    if (getScholarshipClass) {
      const getScholarship = await Scholarship.findOne({
        where: {
          id: scholarshipId,
          lastDateOfRegistration: {
            [Sequelize.Op.gt]: date,
          },
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (!getScholarship) {
        return res.status(400).send({
          status: 400,
          message: msg.SCHOLARSHIP_ALREADY_EXIST_WITH_CLASS,
        });
      }
    }

    //NOTE - find all batches
    const Batch = await batchType.findAll({
      attributes: ["id", "name", "classId"],
      where: {
        id: {
          [Sequelize.Op.in]: batchTypeId,
        },
      },
    });

    //NOTE - comparing class with batch type
    const getClassWithBatch = classId.filter((cls) => {
      const batches = Batch.filter((batch) => batch.classId === cls);
      return batches.length > 0;
    });

    // if (getClassWithBatch.length !== classId.length) {
    //   return res.status(400).send({
    //     status: 400,
    //     message: `At least one batch for every ${cls}`,
    //   });
    // }

    //NOTE - find all subject for each class and batch
    const getSubject = await Subject.findAll({
      attributes: ["batchTypeId", "classId", "id", "name"],
      where: {
        id: {
          [Sequelize.Op.in]: subjectId,
        },
        classId: {
          [Sequelize.Op.in]: getClassWithBatch,
        },
        batchTypeId: {
          [Sequelize.Op.in]: batchTypeId,
        },
      },
    });

    // check if all classes and batches have at least one subject

    getClassWithBatch.forEach((cls) => {
      Batch.filter((batch) => batch.classId === cls).forEach((batch) => {
        const subjects = getSubject.filter(
          (subject) =>
            subject.batchTypeId === batch.id && subject.classId === cls
        );
        if (subjects.length === 0) {
          return res.status(400).send({
            status: 400,
            message: `At least one subject is required for class ${cls} and batch ${batch.name}`,
          });
        }
      });
    });

    //NOTE - create scholarship class
    const scholarshipClass = await scholarship_class_map.create({
      scholarshipId: scholarshipId,
      courseId: courseId,
      boardId: boardId,
      classId: JSON.stringify(classId),
      batchTypeId: JSON.stringify(batchTypeId),
      date: req.body.date,
      subjectId: JSON.stringify(subjectId),
      startTime: startTime,
      endTime: endTime,
      createdById: token,
    });

    return res.status(200).send({
      status: 200,
      message: msg.SCHOLARSHIP_CLASS_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : create scholarship only
const createScholarship = async (req, res) => {
  try {
    const { title, lastDateOfRegistration } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    const createScholarship = await Scholarship.create({
      title: title,
      lastDateOfRegistration: lastDateOfRegistration,
      createdById: token,
    });
    return res.status(200).send({
      status: 200,
      message: msg.SCHOLARSHIP_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get only scholarship BY ID
const getSingleScholarshipById = async (req, res) => {
  try {
    const scholarshipId = req.params.id;
    const getScholarship = await Scholarship.findOne({
      where: { id: scholarshipId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (!getScholarship)
      return res
        .status(400)
        .send({ status: 400, message: msg.SCHOLARSHIP_NOT_FOUND });

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getScholarship,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//ANCHOR: get scholarship Class by course ,board id
const getScholarshipClassByUserId = async (req, res) => {
  try {
    //NOTE - get user id from token
    const token = req.user.id;

    let classes = [];
    let obj = [];

    //NOTE - Check user deatils
    const userDetails = await User.findOne({
      where: { id: token, type: "Student" },
      include: {
        model: Student,
        attributes: ["courseId", "boardId", "classId"],
      },
    });
    //NOTE - If user details not there
    if (!userDetails)
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });

    const currentDateTime = new Date();

    const cls = JSON.stringify(userDetails.student?.classId);
    const userScholarship = await scholarship_class_map.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        classId: {
          [Sequelize.Op.like]: `%${[cls]}%`,
        },
        date: { [Op.gte]: currentDateTime },
      },
    });

    //NOTE - get scholarship class details from scholarship_class_map table
    const getScholarshipClass = await scholarship_class_map.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        courseId: userDetails.student?.courseId,
        boardId: userDetails.student?.boardId,
        date: { [Op.gte]: currentDateTime },
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
          model: Scholarship,
          attributes: ["title", "lastDateOfRegistration"],
        },
      ],
      //limit: 1,
    });

    if (!getScholarshipClass) {
      return res.status(200).send({
        status: 200,
        message: msg.SCHOLARSHIP_NOT_FOUND,
      });
    }

    let finalScholarship;
    for (let data of getScholarshipClass.rows) {
      //NOTE -  get all class
      const getClass = await Class.findAll({
        attributes: ["id", "name"],
        where: {
          id: {
            [Sequelize.Op.in]: JSON.parse(data?.classId),
          },
        },
      });

      obj.push(getClass.map((item) => item.name));

      //NOTE - Get class Values
      const classValues = getClass.map((item) => {
        return { id: item.id, name: item.name };
      });

      //NOTE -  get all subjects
      const getSubject = await Subject.findAll({
        attributes: ["id", "name"],
        where: {
          id: {
            [Sequelize.Op.in]: JSON.parse(data?.subjectId),
          },
        },
      });

      //NOTE - Get Subject Values
      let subjects = getSubject.map((item) => {
        return { id: item.id, name: item.name };
      });

      //NOTE - Push all class final Data
      classes.push({
        id: data.id,
        endTime: data.endTime,
        startTime: data.startTime,
        date: data.date,
        classes: classValues,
        subjects: subjects,
      });

      //NOTE : create title for scholarship
      var newArray = Array.prototype.concat.apply([], obj);
      newArray.sort(function (a, b) {
        return Number(a) - Number(b);
      });

      let totalClass = `${newArray[0]} to ${newArray[newArray.length - 1]}`;

      //NOTE - checking user is already apply for scholarship
      const getScholarshipApply = await scholarshipApply.findOne({
        where: {
          userId: token,
          scholarshipId: getScholarshipClass.rows[0]?.scholarshipId,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      if (getScholarshipClass.count >= 1) {
        finalScholarship = {
          scholarshipId: getScholarshipClass.rows[0]?.scholarshipId,
          title: getScholarshipClass.rows[0]?.scholarship?.title,
          class: totalClass,
          lastDateOfRegistration:
            getScholarshipClass.rows[0]?.scholarship?.lastDateOfRegistration,
          apply: getScholarshipApply && getScholarshipApply ? true : false,
        };
      }
    }

    //NOTE - FINAL PUSH
    let finals = {
      finalScholarship,
      date: userScholarship?.date, //TODO - for only user class
      endTime: userScholarship?.endTime, //TODO - for only user class
      startTime: userScholarship?.startTime, //TODO - for only user class
      classes,
    };

    //NOTE - FINAL RETURN
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: finals,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get scholarship BY ID
const getScholarshipClassOnlyById = async (req, res) => {
  try {
    const getScholarshipClass = await scholarship_class_map.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        id: req.params.id,
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
          model: Scholarship,
          attributes: ["title"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    let allClasses;
    if (getScholarshipClass !== null) {
      //NOTE - find all classes
      const getClass = await Class.findAll({
        attributes: ["id", "name"],
        where: {
          id: {
            [Sequelize.Op.in]: JSON.parse(getScholarshipClass?.classId),
          },
        },
      });

      //NOTE - find all subjects
      const getSubject = await Subject.findAll({
        attributes: ["id", "name"],
        where: {
          id: {
            [Sequelize.Op.in]: JSON.parse(getScholarshipClass?.subjectId),
          },
        },
      });

      //NOTE - find all batches
      const getBatches = await batchType.findAll({
        attributes: ["id", "name"],
        where: {
          id: {
            [Sequelize.Op.in]: JSON.parse(getScholarshipClass?.batchTypeId),
          },
        },
      });

      allClasses = {
        id: getScholarshipClass.id,
        scholarshipId: getScholarshipClass.scholarshipId,
        title: getScholarshipClass.scholarship.title,
        courseId: getScholarshipClass.courseId,
        course: getScholarshipClass.course?.name,
        boardId: getScholarshipClass.boardId,
        board: getScholarshipClass.board?.name,
        date: getScholarshipClass.date,
        startTime: getScholarshipClass.startTime,
        endTime: getScholarshipClass.endTime,
        classes: getClass,
        batchType: getBatches,
        subjects: getSubject,
      };
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: allClasses ? allClasses : [],
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - DELETE SCHOLARSHIP class by id
const deleteScholarshipClassById = async (req, res) => {
  try {
    const Id = req.params.id;
    const getScholarshipClass = await scholarship_class_map.findOne({
      where: { id: Id },
    });

    if (!getScholarshipClass) {
      return res.status(400).send({ status: 400, message: msg.NOT_FOUND });
    }
    await scholarship_class_map.destroy({
      where: {
        id: Id,
      },
    });
    return res
      .status(200)
      .send({ status: 200, message: msg.BOOKMARk_CLASS_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get all courses
const getAllScholarship = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const result = [];
    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    let val;
    if (search) {
      val = {
        [Op.or]: [
          { id: search },
          { title: search },
          { title: { [Op.like]: "%" + search + "%" } },
        ],
      };
    }

    const getScholarship = await Scholarship.findAndCountAll({
      ...query,
      where: {
        ...val,
      },
      include: [
        {
          model: AdminDetails,
          as: "creator",
          attributes: ["id", "name"],
          include: {
            model: RolePermission,
            attributes: ["role"],
          },
        },
        {
          model: AdminDetails,
          as: "updater",
          attributes: ["id", "name"],
          include: {
            model: RolePermission,
            attributes: ["role"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["createdAt", "DESC"]],
    });

    if (!getScholarship)
      return res
        .status(400)
        .send({ status: 400, message: msg.SCHOLARSHIP_NOT_FOUND });

    for (const data of getScholarship.rows) {
      result.push({
        id: data.id,
        title: data?.title,
        lastDateOfRegistration: data?.lastDateOfRegistration,
        createdByName: data.creator ? data.creator?.name : null,
        createdByRole: data.creator
          ? data.creator?.permission_role?.role
          : null,
        updateByName: data.updater ? data.updater?.name : null,
        updateByRole: data.updater ? data.updater?.permission_role.role : null,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getScholarship.count,
      data: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get all scholarship CLASS
const getAllScholarshipClass = async (req, res) => {
  try {
    const { page, limit, search, boards, classes } = req.query;
    let result = [];

    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    //NOTE - class filter
    let cls;
    if (classes) {
      cls = {
        classId: `[${classes}]`,
      };
    }

    //NOTE - board filter
    let brd;
    if (boards) {
      brd = {
        id: boards,
      };
    }

    //NOTE - title filter
    let titles;
    if (search) {
      titles = {
        title: { [Op.like]: "%" + search + "%" },
      };
    }

    //NOTE - If login by a teacher or mentor
    let params;
    if (req.user)
      if (["teacher", "mentor", "Teacher", "Mentor"].includes(req.user?.role)) {
        //NOTE - Get  User details from token
        const getAdmin = await AdminDetails.findOne({
          where: { id: req.user.id },
        });
        //NOTE - get Teacher subject details
        subject_details = await TeacherSubjectMap.findAll({
          where: { teacherId: getAdmin.id },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });

        //NOTE - push all user class Ids for
        const ClassIds = subject_details.map((item) => item.dataValues.classId);
        //NOTE - push all batch ids
        const batchIds = subject_details.map(
          (item) => item.dataValues.batchTypeId
        );

        // const classids = '[' + ClassIds.join(', ') + ']';
        // const batchids = '[' + batchIds.join(', ') + ']';
        if (batchIds.every((id) => id === null)) {
          //NOTE - filter based on classId only
          params = {
            classId: { [Op.like]: `%[${ClassIds}]%` },
          };
        } else {
          //NOTE - filter based on batchTypeId
          params = {
            batchTypeId: { [Op.like]: `%[${batchIds}]%` },
          };
        }
      }

    //NOTE - get all scholarship class
    const getScholarshipClass = await scholarship_class_map.findAndCountAll({
      ...query,
      where: { ...cls, ...params },
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
          attributes: ["id", "name"],
          where: brd,
        },
        {
          model: Scholarship,
          attributes: ["id", "title"],
          where: titles,
        },
        {
          model: AdminDetails,
          as: "creator",
          attributes: ["id", "name"],
          include: {
            model: RolePermission,
            attributes: ["role"],
          },
        },
        {
          model: AdminDetails,
          as: "updater",
          attributes: ["id", "name"],
          include: {
            model: RolePermission,
            attributes: ["role"],
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    console.log(getScholarshipClass);
    if (getScholarshipClass !== null) {
      for (let data of getScholarshipClass.rows) {
        result.push({
          id: data?.id,
          title: data?.scholarship?.title,
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          course: data.course?.name,
          board: data.board?.name,
          createdByName: data.creator ? data.creator?.name : null,
          createdByRole: data.creator
            ? data.creator?.permission_role?.role
            : null,
          updateByName: data.updater ? data.updater?.name : null,
          updateByRole: data.updater
            ? data.updater?.permission_role.role
            : null,
        });
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getScholarshipClass.count,
      data: result,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : update only Scholarship
const updateScholarshipById = async (req, res) => {
  try {
    const { scholarshipId, title, lastDateOfRegistration } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    const getScholarship = await Scholarship.findOne({
      where: { id: scholarshipId },
    });
    if (!getScholarship) {
      return res
        .status(400)
        .send({ status: 400, message: msg.SCHOLARSHIP_NOT_FOUND });
    }

    const updatedScholarship = await Scholarship.update(
      {
        title: title,
        lastDateOfRegistration: lastDateOfRegistration,
        updatedById: token,
      },
      { where: { id: scholarshipId } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.SCHOLARSHIP_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - update scholarship with class
const updateScholarshipClassById = async (req, res) => {
  try {
    const {
      subjectId,
      classId,
      courseId,
      boardId,
      batchTypeId,
      date,
      startTime,
      endTime,
      scholarshipId,
      Id,
    } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    const getScholarship = await Scholarship.findOne({
      where: { id: scholarshipId },
    });
    if (!getScholarship) {
      return res
        .status(400)
        .send({ status: 400, message: msg.SCHOLARSHIP_NOT_FOUND });
    }

    const getScholarship_class_map = await scholarship_class_map.findOne({
      where: { id: Id },
    });

    const updatedScholarship_class_map = await scholarship_class_map.update(
      {
        scholarshipId: scholarshipId,
        courseId: courseId,
        boardId: boardId,
        classId: JSON.stringify(classId),
        batchTypeId: JSON.stringify(batchTypeId),
        date: date,
        subjectId: JSON.stringify(subjectId),
        startTime: startTime,
        endTime: endTime,
        updatedById: token,
      },
      {
        where: { id: Id },
      }
    );

    return res.status(200).send({
      status: 200,
      message: msg.SCHOLARSHIP_CLASS_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - DELETE SCHOLARSHIP
const deleteScholarshipById = async (req, res) => {
  try {
    const scholarshipId = req.params.id;
    const getScholarship = await Scholarship.findOne({
      where: { id: scholarshipId },
    });
    if (!getScholarship) {
      return res
        .status(400)
        .send({ status: 400, message: msg.SCHOLARSHIP_NOT_FOUND });
    }
    await Scholarship.destroy({
      where: {
        id: scholarshipId,
      },
    });

    await scholarship_class_map.destroy({
      where: {
        scholarshipId: scholarshipId,
      },
    });
    return res
      .status(200)
      .send({ status: 200, message: msg.SCHOLARSHIP_DELETED });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: student_scholarship_apply
const applyScholarship = async (req, res) => {
  try {
    const { scholarshipId, stateId, cityId } = req.body;

    if (!scholarshipId || scholarshipId === null) {
      return res
        .status(400)
        .send({ status: 400, message: msg.SCHOLARSHIP_REQUIRED });
    }

    //NOTE - GETTING ID FROM TOKEN
    const token = req.user.id;

    //NOTE - user details
    const userDetails = await User.findOne({
      where: { type: "Student", id: token },
      include: {
        model: Student,
        attributes: ["courseId", "boardId", "classId", "batchTypeId"],
      },
    });
    if (!userDetails) {
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });
    }

    //NOTE - get all details using batch
    const batchDetail = await bathDetails(userDetails.student.batchTypeId);

    //NOTE - leadsquard post activity
    let retriveData;
    retriveData = await retriveLeads(
      config.LEADSQUARD_API_KEY,
      config.LEADSQUARD_CLIENT_SECRET,
      config.LEADSQUARD_HOST,
      userDetails.phone
    );

    if (retriveData.length < 1) {
      //NOTE - lead capture
      await captureLead(
        config.LEADSQUARD_API_KEY,
        config.LEADSQUARD_CLIENT_SECRET,
        config.LEADSQUARD_HOST,
        userDetails.name,
        batchDetail.course.name,
        batchDetail.board.name,
        batchDetail.class.name,
        userDetails.phone
      );
    }

    //NOTE - if lead capture for user
    if (retriveData.length < 1) {
      retriveData = await retriveLeads(
        config.LEADSQUARD_API_KEY,
        config.LEADSQUARD_CLIENT_SECRET,
        config.LEADSQUARD_HOST,
        userDetails.phone
      );
    }

    //NOTE - create activity for user
    const data = await createActivity(
      config.LEADSQUARD_API_KEY,
      config.LEADSQUARD_CLIENT_SECRET,
      config.LEADSQUARD_HOST,
      retriveData[0].ProspectID,
      userDetails.name,
      scholarshipId,
      stateId,
      cityId,
      batchDetail.course.name,
      batchDetail.board.name,
      batchDetail.class.name
    );

    //NOTE - scholarship Applyed
    await scholarshipApply.create({
      scholarshipId: scholarshipId,
      courseId: userDetails.student?.courseId,
      boardId: userDetails.student?.boardId,
      classId: userDetails.student?.classId,
      batchTypeId: userDetails.student?.batchTypeId,
      userId: userDetails.id,
      stateId: stateId,
      cityId: cityId,
    });

    return res.status(200).send({
      status: 200,
      message: msg.SCHOLARSHIP_APPLY,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : student_scholarship_apply
const getAllScholarshipApply = async (req, res) => {
  try {
    const { page, limit, search, classes, title } = req.query;
    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    //NOTE - filter user by name
    let final = {};
    if (search) {
      final = {
        name: { [Op.like]: "%" + search + "%" },
      };
    }

    //NOTE - class filter
    let cls = {};
    if (classes) {
      cls = {
        classId: classes,
      };
    }

    //NOTE - title filter
    let titles;
    if (title) {
      titles = {
        title: title,
      };
    }

    //NOTE - If login by a teacher or mentor
    let params;
    if (req.user)
      if (["teacher", "mentor", "Teacher", "Mentor"].includes(req.user?.role)) {
        //NOTE - Get  User details from token
        const getAdmin = await AdminDetails.findOne({
          where: { id: req.user.id },
        });
        //NOTE - get Teacher subject details
        subject_details = await TeacherSubjectMap.findAll({
          where: { teacherId: getAdmin.id },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });

        //NOTE - push all user class Ids for
        const ClassIds = subject_details.map((item) => item.dataValues.classId);

        //NOTE - push all batch ids
        const batchIds = subject_details.map(
          (item) => item.dataValues.batchTypeId
        );

        if (batchIds.every((id) => id === null)) {
          //NOTE - filter based on classId only
          params = {
            classId: {
              [Sequelize.Op.in]: ClassIds,
            },
          };
        } else {
          //NOTE - filter based on batchTypeId
          params = {
            batchTypeId: {
              [Sequelize.Op.in]: batchIds,
            },
          };
        }
      }

    //NOTE - get all apply scholarship student
    const getScholarshipApply = await scholarshipApply.findAndCountAll({
      ...query,
      where: { ...cls, ...params }, //TODO - class filter and teacher based filter
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Scholarship,
          attributes: ["title", "id"],
          where: titles, //TODO - filter scholarship by title
        },

        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"] },
        {
          model: User,
          attributes: ["name"],
          where: { type: "Student", ...final },
        },
        { model: State, attributes: ["id", "name"] },
        { model: City, attributes: ["id", "name"] },
      ],

      order: [["createdAt", "DESC"]],
    });
    if (!getScholarshipApply) {
      return res.status(409).send({
        status: 409,
        message: msg.SCHOLARSHIP_APPLY_NOT_FOUND,
      });
    }

    let allScholarship = [];
    for (let data of getScholarshipApply.rows) {
      //NOTE - find user
      const userDetails = await User.findOne({
        where: { id: data.userId, type: "Student" },
        attributes: ["typeId"],
        include: {
          model: Student,
          attributes: ["batchTypeId"],
          include: {
            model: batchType,
            attributes: ["name"],
          },
        },
      });

      //NOTE - final push
      allScholarship.push({
        id: data.id,
        scholarshipId: data.scholarshipId,
        title: data?.scholarship?.title ? data?.scholarship?.title : null,
        batchType: userDetails.student?.batchType?.name,
        userId: data.userId,
        user: data.user?.name,
        classId: data.classId,
        class: data.class?.name,
        stateId: data.stateId,
        state: data.state?.name,
        cityId: data.cityId,
        city: data.city?.name,
        date: data.createdAt,
      });
    }

    //NOTE - final return
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getScholarshipApply.count,
      data: allScholarship,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get batchType by all class ids
const getBatchTypeByMultiplesClassId = async (req, res) => {
  try {
    const { courseId, boardId, classId } = req.body;

    let response = [];

    //NOTE - If login by a teacher or mentor
    let params;
    if (["teacher", "mentor"].includes(req.user.role.toLowerCase())) {
      //NOTE - check teachers details
      const staffDetails = await TeacherSubjectMap.findAll({
        where: { teacherId: req.user.id },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      //NOTE - filter all batch type ids
      const batchTypeIds = staffDetails
        .filter((data) => data.batchTypeId !== null)
        .map((data) => data.batchTypeId);

      //NOTE - if batch type ids are there
      if (batchTypeIds.length > 0) {
        params = {
          id: { [Sequelize.Op.in]: batchTypeIds },
        };
      }
    }

    await Promise.all(
      classId.map(async (id) => {
        //NOTE - get all batch type details
        const getBatchType = await batchType.findAll({
          where: {
            courseId,
            boardId,
            classId: id,
            ...params,
            status: 1,
          },
          attributes: ["id", "name"],
          include: [{ model: Class, attributes: ["id", "name"] }],
        });

        //NOTE - push all result
        response.push(
          ...getBatchType
            .filter((batches) => batches && batches.id && batches.name)
            .map((batches) => ({
              id: batches.id,
              name: batches.name,
              classId: batches?.class?.id,
              class: batches?.class?.name,
            }))
        );
      })
    );

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: response,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR: get scholarship status by student id
const getScholarshipStatus = async (req, res) => {
  try {
    const { scholarshipId } = req.query;
    const studentId = req.user.id;

    const studentDetails = await User.findOne({
      where: { type: "Student", id: studentId },
    });
    if (!studentDetails)
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });

    const getScholarshipApply = await scholarshipApply.findOne({
      where: { userId: studentDetails.id, scholarshipId: scholarshipId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (!getScholarshipApply)
      return res
        .status(400)
        .send({ status: 400, message: msg.SCHOLARSHIP_NOT_FOUND });

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: getScholarshipApply,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//ANCHOR - create test for Scholarship
const createScholarshipTest = async (req, res) => {
  try {
    const {
      scholarshipId,
      courseId,
      boardId,
      classId,
      selectionProcess,
      questionsId,
    } = req.body;
    let topicIds = [];

    //NOTE - Get  User details from token
    const getAdmin = await AdminDetails.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: RolePermission,
          attributes: ["role"],
        },
      ],
    });

    //NOTE - Check if test already craeted for that same Scholarship class or not
    const checkTest = await TestSubjectMap.findOne({
      where: {
        scholarshipId: scholarshipId,
        courseId: courseId,
        boardId: boardId,
        classId: classId,
      },
    });
    if (checkTest)
      return res
        .status(400)
        .send({ status: 400, message: msg.SCHOLARSHIP_TEST_ALREADY_THERE });

    //NOTE - get Scholarship details
    const scholarshipData = await scholarship_class_map.findOne({
      where: {
        scholarshipId: scholarshipId,
        courseId: courseId,
        boardId: boardId,
        classId: {
          [Sequelize.Op.like]: `%${[classId]}%`,
        },
      },
    });

    //NOTE - Create test for Scholarship
    const newTest = new Test({
      scholarshipId: scholarshipId,
      category: "Scholarship Test",
      type: "Scholarship",
      selectionProcess: selectionProcess,
      numberOfQuestions:
        !!questionsId && questionsId.length > 0 ? questionsId.length : null,
      testTime: await getDuration(
        scholarshipData.startTime,
        scholarshipData.endTime
      ),
      createdId: getAdmin.id,
      createdBy: getAdmin.permission_role?.role,
    });

    const createdTest = await newTest.save();

    //NOTE - get Scholarship details
    const getScholarshipClass = await scholarship_class_map.findOne({
      where: {
        scholarshipId: scholarshipId,
        courseId: courseId,
        boardId: boardId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    //NOTE - get all classes
    const classes = JSON.parse(getScholarshipClass?.classId);

    //NOTE - convert subjcet ids
    const subjectIds = JSON.parse(getScholarshipClass.subjectId);

    let questionParams;
    if (selectionProcess === "Manual") {
      questionParams = {
        id: {
          [Sequelize.Op.in]: questionsId,
        },
      };
    } else {
      questionParams = {
        courseId: courseId,
        boardId: boardId,
        classId: {
          [Sequelize.Op.in]: classes,
        },
        subjectId: {
          [Sequelize.Op.in]: subjectIds,
        },
      };
    }

    //NOTE - Find all questions details
    const questionDetails = await AllQuestions.findAll({
      where: {
        ...questionParams,
      },
    });

    //NOTE - checking length of question
    if (questionDetails.length === 0) {
      await Test.destroy({
        where: {
          id: newTest.id,
          scholarshipId: scholarshipId,
        },
      });

      return res.status(400).send({
        status: 400,
        message: msg.QUESTION_CLASS_LENGTH,
      });
    }

    //NOTE - if questions bget subject and chapter ids
    for (const qu of questionDetails) {
      //NOTE -  push chapter
      topicIds.push(qu.topicId);
    }

    //NOTE - get unique chapter
    const uniqueArrTopic = topicIds.filter(
      (value, index) => topicIds.indexOf(value) === index
    );

    if (uniqueArrTopic) {
      for (const ids of uniqueArrTopic) {
        const getTopic = await TopicDetails.findOne({
          where: {
            id: ids,
          },
        });
        //NOTE - Push all subject and chapter
        const mappingSubject = new TestSubjectMap({
          testId: createdTest.id,
          scholarshipId: createdTest.scholarshipId,
          courseId: getTopic.courseId,
          boardId: getTopic.boardId,
          classId: getTopic.classId,
          batchTypeId: getTopic.batchTypeId,
          subjectId: getTopic.subjectId,
          chapterId: getTopic.chapterId,
          topicId: getTopic.id,
        });
        await mappingSubject.save();
      }
    }

    if (questionsId) {
      //NOTE - push all questions
      for (const id of questionsId) {
        const mappingQuestions = new Test_Question_Map({
          testId: createdTest.id,
          scholarshipId: createdTest.scholarshipId,
          questionId: id,
        });
        await mappingQuestions.save();
      }
    } else {
      //NOTE - push all questions
      for (const qu of questionDetails) {
        const mappingQuestions = new Test_Question_Map({
          testId: createdTest.id,
          scholarshipId: createdTest.scholarshipId,
          questionId: qu.id,
        });
        await mappingQuestions.save();
      }
    }

    //NOTE - get all batches
    const batches = JSON.parse(getScholarshipClass?.batchTypeId);

    //NOTE - match the class and get
    const matchedValue = classes.find((value) => value === classId) || null;

    //NOTE - get batch details based on the class
    const batchesDetails = await batchType.findAll({
      where: { classId: matchedValue },
    });

    //NOTE - get matching batch types
    const matchingBatchIds = batchesDetails
      .filter((obj) => batches.includes(obj.id))
      .map((obj) => obj.id);

    for (const id of matchingBatchIds) {
      const mappingBatch = new TestBatchMap({
        testId: createdTest.id,
        batchTypeId: id,
        scholarshipId: scholarshipId,
      });
      await mappingBatch.save();
    }

    if (selectionProcess === "Automated")
      //NOTE - update test quesstion length
      await Test.update(
        {
          numberOfQuestions: questionDetails.length,
        },
        { where: { scholarshipId: scholarshipId } }
      );

    return res.status(200).send({
      status: 200,
      message: msg.TEST_CREATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR : get all Scholarship test
const getAllScholarshipTest = async (req, res) => {
  try {
    const { page, limit } = req.query;
    let getAllTest = [];

    //NOTE - query for page and limit
    let query;
    if (page && limit) {
      query = {
        offset: Number(page - 1) * limit,
        limit: Number(limit),
      };
    } else {
      query = {};
    }

    //NOTE - user filter based on class and batch type
    let testParams = null;
    if (
      req.user?.role &&
      ["teacher", "mentor"].includes(req?.user?.role.toLowerCase())
    ) {
      //NOTE - get staff details
      const getAdmin = await AdminDetails.findOne({
        where: { id: req.user.id },
      });
      //NOTE - get staff class and batch details
      const teachersSubject = await TeacherSubjectMap.findAll({
        where: { teacherId: getAdmin.id },
        attributes: ["classId", "batchTypeId"],
      });

      //NOTE - get all class details
      const classesIds = teachersSubject.map((item) => item.classId);
      //NOTE - get all batch details
      const batchIds = teachersSubject.map((item) => item.batchTypeId);

      //NOTE - params based on class or batch type
      const idParams = batchIds.every((id) => id === null)
        ? { classId: { [Sequelize.Op.in]: classesIds } }
        : { batchTypeId: { [Sequelize.Op.in]: batchIds } };

      //NOTE - get all student details
      const tests = await TestSubjectMap.findAll({
        where: {
          ...idParams,
          scholarshipId: {
            [Op.not]: null, //NOTE - null scholarshipId can be neglated
          },
        },
        attributes: ["scholarshipId"],
      });

      //NOTE - Get test unique
      const testkey = "scholarshipId";
      const uniqueScholarship = [
        ...new Map(tests.map((item) => [item[testkey], item])).values(),
      ].sort();
      const scholarshipIds = uniqueScholarship.map(
        (item) => item.dataValues.scholarshipId
      );
      testParams = { scholarshipId: { [Sequelize.Op.in]: scholarshipIds } };
    }

    //NOTE - get test details
    const getTest = await Test.findAndCountAll({
      ...query,
      where: { category: "Scholarship Test", ...testParams },
      order: [["createdAt", "DESC"]],
    });
    for (const allTest of getTest.rows) {
      //NOTE - get created user detauils
      const adminUser = await AdminDetails.findOne({
        where: { id: allTest.createdId },
        attributes: ["name"],
        include: {
          model: RolePermission,
          attributes: ["role"],
        },
      });

      //NOTE - get Scholarship details
      const getScholarship = await Scholarship.findOne({
        where: {
          id: allTest.scholarshipId,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      //NOTE - get Scholarship test class details
      const getClassData = await TestSubjectMap.findOne({
        where: { testId: allTest.id, scholarshipId: allTest.scholarshipId },
      });

      const dateValue = await scholarship_class_map.findOne({
        where: {
          scholarshipId: allTest.scholarshipId,
          classId: {
            [Sequelize.Op.like]: `%${[getClassData?.classId]}%`,
          },
        },
      });

      //NOTE - push final data
      getAllTest.push({
        id: allTest.id,
        scholarshipId: getScholarship?.id,
        category: allTest?.category,
        selectionProcess: allTest?.selectionProcess,
        title: getScholarship?.title,
        numberOfQuestions: allTest.numberOfQuestions,
        examDate: dateValue?.date,
        startTime: dateValue?.startTime,
        endTime: dateValue?.endTime,
        createdByName: adminUser ? adminUser.name : null,
        createdByRole: adminUser ? adminUser.permission_role?.role : null,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      count: getTest.count,
      data: getAllTest,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Start Scholarship Test
const startScholarshipTest = async (req, res) => {
  try {
    const { scholarshipId } = req.body;
    //NOTE - constant to push result
    let questionResult = [];

    //NOTE - Get  User details from token
    const getUserDetails = await User.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: Student,
          attributes: ["courseId", "boardId", "classId"],
        },
      ],
    });

    if (!getUserDetails)
      return res.status(400).send({
        status: 400,
        message: msg.USER_NOT_FOUND,
      });

    //NOTE - get Scholarship Test details
    const testDetails = await TestSubjectMap.findOne({
      where: {
        scholarshipId: scholarshipId,
        courseId: getUserDetails.student?.courseId,
        boardId: getUserDetails.student?.boardId,
        classId: getUserDetails.student?.classId,
      },
    });

    //NOTE - find all test question from question map table
    const questions = await Test_Question_Map.findAll({
      where: {
        testId: testDetails.testId,
        scholarshipId: testDetails.scholarshipId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Test,
          attributes: ["id", "numberOfQuestions", "testTime"],
        },
        {
          model: AllQuestions,
          attributes: [
            "question",
            "A",
            "B",
            "C",
            "D",
            "answer",
            "difficultyLevel",
          ],
        },
      ],
    });

    //NOTE : push all question
    for (const data of questions) {
      questionResult.push({
        id: data.id,
        question: data.questionBank.question,
        A: data.questionBank.A,
        B: data.questionBank.B,
        C: data.questionBank.C,
        D: data.questionBank.D,
      });
    }

    //NOTE - push final data
    let finalResult = {
      questionCount: questions[0].test.numberOfQuestions,
      time: questions[0].test.testTime,
      questions: questionResult,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: finalResult,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - get all Scholarship Details with class and board
const getScholarshipDetails = async (req, res) => {
  try {
    //NOTE - get all Scholarship class details
    const getScholarshipClass = await scholarship_class_map.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },

      include: [
        { model: Course, attributes: ["id", "name"] },
        { model: Boards, attributes: ["id", "name"] },
        { model: Scholarship, attributes: ["id", "title"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    //NOTE - push final result
    const result = await Promise.all(
      getScholarshipClass.map(async (data) => {
        const classIds = JSON.parse(data?.classId);

        const classes = await Class.findAll({
          attributes: ["id", "name"],
          where: {
            id: {
              [Sequelize.Op.in]: classIds,
            },
            status: 1,
          },
        });

        return {
          id: data.scholarship?.id,
          name: data.scholarship?.title,
          courseId: data.courseId,
          courseName: data.course?.name,
          boardId: data.boardId,
          boardName: data.board?.name,
          class: classes,
        };
      })
    );

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR : get  Scholarship test by id
const getScholarshipTestById = async (req, res) => {
  try {
    const { id } = req.params;

    const questionResult = [];

    //NOTE - get test details
    const getTest = await Test.findOne({
      where: { id: id, type: "Scholarship" },
    });

    //NOTE - get created user detauils
    const adminUser = await AdminDetails.findOne({
      where: { id: getTest.createdId },
      attributes: ["name"],
    });

    //NOTE - get Scholarship details
    const getScholarship = await Scholarship.findOne({
      where: {
        id: getTest.scholarshipId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    //NOTE - get Scholarship test couser,  board and class details
    const getClassData = await TestSubjectMap.findOne({
      where: { testId: getTest.id, scholarshipId: getTest.scholarshipId },
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
      ],
    });
    //NOTE - get Scholarship test time details
    const dateValue = await scholarship_class_map.findOne({
      where: {
        scholarshipId: getTest.scholarshipId,
        classId: {
          [Sequelize.Op.like]: `%${[getClassData?.classId]}%`,
        },
      },
    });

    //NOTE - get Scholarship test question details
    const getQuestion = await Test_Question_Map.findAll({
      where: { testId: getTest.id, scholarshipId: getTest.scholarshipId },
      include: {
        model: AllQuestions,
        attributes: ["id", "question", "A", "B", "C", "D", "difficultyLevel"],
      },
    });

    //NOTE - Push questions result
    for (const qu of getQuestion) {
      questionResult.push({
        id: qu.questionBank.id,
        question: qu.questionBank.question,
        A: qu.questionBank.A,
        B: qu.questionBank.B,
        C: qu.questionBank.C,
        D: qu.questionBank.D,
        difficultyLevel: qu.questionBank.difficultyLevel,
      });
    }

    //NOTE - push final data
    let result = {
      id: getTest.id,
      category: getTest.category,
      selectionProcess: getTest.selectionProcess,
      scholarshipId: getScholarship.id,
      title: getScholarship.title,
      numberOfQuestions: getTest.numberOfQuestions,
      examDate: dateValue.date,
      startTime: dateValue.startTime,
      endTime: dateValue.endTime,
      createdId: getTest.createdId,
      createdBy: getTest.createdBy,
      createdName: adminUser.name,
      courseId: getClassData.courseId,
      courseName: getClassData.course?.name,
      boardId: getClassData.boardId,
      boardName: getClassData.board?.name,
      classId: getClassData.classId,
      className: getClassData.class?.name,
      questions: questionResult,
    };

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

module.exports = {
  createScholarship,
  getSingleScholarshipById,
  getAllScholarship,
  updateScholarshipById,
  updateScholarshipClassById,
  deleteScholarshipById,
  applyScholarship,
  getAllScholarshipApply,
  createScholarshipWithClass,
  getAllScholarshipClass,
  getScholarshipClassByUserId,
  getBatchTypeByMultiplesClassId,
  getScholarshipClassOnlyById,
  deleteScholarshipClassById,
  getScholarshipStatus,
  createScholarshipTest, //TODO - use is admin panel to create scholarship test
  getAllScholarshipTest, //TODO -  use is admin panel
  startScholarshipTest, //TODO - use for web and mobile
  getScholarshipDetails, //TODO - use is admin panel (it will get all class board and course details)
  getScholarshipTestById, //TODO - use is admin panel
};
