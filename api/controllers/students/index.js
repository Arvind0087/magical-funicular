const db = require("../../models/index");
const msg = require("../../constants/Messages");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Sequelize, Op, where } = require("sequelize");
const { bathDetails } = require("../../helpers/batchValidator");
const { captureLead } = require("../users/service");
const { config } = require("../../config/db.config");
const {
  validateUser,
  profilePercentage,
  convertDayIntoDate,
} = require("./service");
const {
  getTokenExpiryTime,
  getDefaultImage,
  generateVedaIdForStudent,
  generateVedaIdForParent,
} = require("../users/service");
const { getSignedUrlCloudFront } = require("../../helpers/cloudFront");
const uploadFileS3 = require("../../helpers/uploadFileS3");
const UserDetails = db.users;
const StudentDetails = db.student;
const ParentDetails = db.parent;
const StudentParentMap = db.parent_student_map;
const SecondaryStudentDetails = db.student_secondary_map;
const AllCourses = db.courses;
const Boards = db.boards;
const Class = db.class;
const batchType = db.batchTypes;
const BatchStartDate = db.batchDate;
const StateDetails = db.state;
const CityDetails = db.city;
const WantsToBeDetails = db.wantToBe;
const AdminUser = db.admin;
const TeacherSubjectMap = db.teacher_subject_map;
const Coins = db.coins;
const CoinTransactionHistory = db.coin_transaction;
const TokenDetails = db.mobile_token_map;
const studentPlanMap = db.student_plan_map;
const RolePermission = db.permissionRole;
const parentStudentmap = db.parent_student_map;
const DeviceToken = db.user_device_token;
const loginUser = db.login_user;
const coursePackage = db.course_package_map;
const studentCoursePackage = db.student_course_package_map;

//ANCHOR - Get all student Details
const getAllStudents = async (req, res) => {
  try {
    const { page, limit, search, course, classes, type, status } = req.query;

    //NOTE - add pagination
    const query =
      page && limit
        ? {
          offset: Number(page - 1) * limit,
          limit: Number(limit),
        }
        : {};

    //NOTE - filter based on name, phone, email
    const val = search
      ? {
        [Op.or]: [
          { name: { [Op.like]: "%" + search + "%" } },
          { phone: { [Op.like]: "%" + search + "%" } },
          { email: { [Op.like]: "%" + search + "%" } },
        ],
      }
      : {};

    //NOTE - filter based on classId and courseId
    const final = classes
      ? { classId: classes }
      : course
        ? { courseId: course }
        : {};

    //NOTE - filter by subscription type
    const typ = type ? { subscriptionType: type } : undefined;

    //NOTE - filter by status
    const userStatus = status ? { status: status } : undefined;

    //NOTE - If login by a teacher or mentor
    let typeIds;
    if (req.user)
      if (["teacher", "mentor"].includes(req.user?.role.toLowerCase())) {
        //NOTE - get Teacher subject details
        const teachersSubject = await TeacherSubjectMap.findAll({
          where: { teacherId: req.user.id },
          attributes: ["classId", "batchTypeId"],
        });

        //NOTE - push all user class Ids for
        const classesIds = teachersSubject.map((item) => item.classId);

        //NOTE - push all batch ids
        const batchIds = teachersSubject.map((item) => item.batchTypeId);

        //NOTE - params based on class or batch type
        const idParams = batchIds.every((id) => id === null)
          ? { classId: { [Sequelize.Op.in]: classesIds } }
          : { batchTypeId: { [Sequelize.Op.in]: batchIds } };

        //NOTE - find student data based on the batchType
        const students = await StudentDetails.findAll({
          where: {
            ...idParams,
          },
        });

        //NOTE - push all user type ids for student ids
        const type_id = students.map((item) => item.dataValues.id);

        //NOTE - send typeIds based on the batch type id
        typeIds = {
          typeId: {
            [Sequelize.Op.in]: type_id,
          },
        };
      }

    //NOTE - Get details from user table
    const { count, rows } = await UserDetails.findAndCountAll({
      ...query,
      where: { ...val, type: "Student", ...typeIds, ...typ, ...userStatus },
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "studentType",
        "profilePercentage",
        "typeId",
        "subscriptionType",
        "createdAt",
        "vedaId",
        "status",
      ],
      include: [
        {
          model: StudentDetails,
          attributes: ["dob", "gender", "avatar", "classId"],
          where: final,
          include: [
            { model: AllCourses, attributes: ["name"] },
            { model: Class, attributes: ["id", "name"] },
            { model: batchType, attributes: ["name"] },
          ],
        },
        {
          model: AdminUser,
          as: "creator",
          attributes: ["id", "name"],
          include: {
            model: RolePermission,
            attributes: ["role"],
          },
        },
        {
          model: AdminUser,
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

    //NOTE - Push final object
    const result = await Promise.all(
      rows.map(async (studentuser) => {
        const avatar = studentuser.student?.dataValues?.avatar
          ? await getSignedUrlCloudFront(
            studentuser.student?.dataValues?.avatar
          )
          : null;

        return {
          id: studentuser.id,
          name: studentuser.name,
          email: studentuser.email,
          phone: studentuser.phone,
          studentType: studentuser.studentType,
          avatar,
          status: studentuser.status ? "Active" : "Inactive",
          dob: studentuser.student?.dob,
          gender: studentuser.student?.gender,
          course: studentuser.student?.course?.name,
          classId: studentuser.student?.class?.id,
          class: studentuser.student?.class?.name,
          medium: studentuser.student.batchType.name,
          profilePercentage: studentuser.profilePercentage,
          subscriptionType: studentuser.subscriptionType,
          vedaId: studentuser.vedaId,
          createdByName: studentuser.creator ? studentuser.creator?.name : null,
          createdByRole: studentuser.creator
            ? studentuser.creator?.permission_role?.role
            : null,
          updateByName: studentuser.updater ? studentuser.updater?.name : null,
          updateByRole: studentuser.updater
            ? studentuser.updater?.permission_role.role
            : null,
          registationDate: studentuser.createdAt,
        };
      })
    );

    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      count: count,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get student by Id
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { batchTypeId } = req.body;
    let secondaryStudentdata = [];


    //NOTE - Get user details from user table
    const user_details = await UserDetails.findOne({
      where: { id: id, type: "Student" },
      include: [
        {
          model: StudentDetails,
          attributes: [
            "gender",
            "dob",
            "avatar",
            "referralCode",
            "recommendReferralCode",
            "address",
            "pincode",
            "schoolName",
          ],
          include: [
            { model: AllCourses, attributes: ["id", "name"] },
            { model: Boards, attributes: ["id", "name"] },
            { model: Class, attributes: ["id", "name", "telegramUrl"] },
            { model: batchType, attributes: ["id", "name"] },
            { model: BatchStartDate, attributes: ["id", "date"] },
            { model: StateDetails, attributes: ["id", "name"] },
            { model: CityDetails, attributes: ["id", "name"] },
            { model: WantsToBeDetails, attributes: ["id", "name"] },
          ],
        },
      ],
    });
    if (!user_details)
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });

    //NOTE - Find coin details
    const coinDetails = await Coins.findOne({
      where: { studentId: user_details.id },
    });

    //NOTE - Check Mapping data
    const parentUser = await UserDetails.findOne({
      where: { phone: user_details.phone, type: "Parent" },
      include: {
        model: ParentDetails,
        attributes: ["occupation"],
      },
    });

    //NOTE - push parent details
    const parentDetails = parentUser && {
      id: parentUser.id,
      name: parentUser.name,
      phone: parentUser.phone,
      occupation: parentUser.parent?.occupation,
    };

    //NOTE - Get Secondary Student Details from student map table
    const secondary_student_details = await SecondaryStudentDetails.findAll({
      where: { primaryId: user_details.id },
      attributes: ["secondaryId"],
    });

    if (secondary_student_details)
      //NOTE - Push Secondary  student data
      for (const ssm of secondary_student_details) {
        //NOTE - get student from user table
        const secondaryUsers = await UserDetails.findOne({
          where: {
            id: ssm.secondaryId,
            type: "Student",
            studentType: "Secondary",
          },
          include: {
            model: StudentDetails,
            include: { model: AllCourses, attributes: ["name"] },
          },
        });

        if (secondaryUsers) {
          //NOTE: Finalizing the response
          secondaryStudentdata.push({
            id: secondaryUsers.id,
            name: secondaryUsers.name,
            courseName: secondaryUsers.student?.course?.name,
            studentType: secondaryUsers.studentType,
          });
        }
      }

    //NOTE - checking user login status
    const userlogged = await loginUser.findOne({ where: { userId: user_details.id } });

    //NOTE - Set the time part of the current date to zero
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    let isPurchased;
    if (batchTypeId) {
      //NOTE - find course package purchased or not
      isPurchased = await studentCoursePackage.findOne({
        where: {
          batchTypeId: batchTypeId, userId: id,
          validity: {
            [Sequelize.Op.gt]: currentDate,
          },
        },
        attributes: ["id"],
        include: {
          model: coursePackage,
          where: {
            batchTypeId: batchTypeId,
            package_type: "Live"
          },
          attributes:["id"]
        }
      })
    }

    //NOTE: Finalizing the responsess
    const result = {
      id: user_details.id,
      name: user_details.name,
      zoomName:
        user_details?.name !== null
          ? `${user_details?.name.toLowerCase().replace(/ /g, "_")}(${user_details.vedaId
          })`
          : user_details.id,
      email: user_details.email,
      phone: user_details.phone,
      dob: user_details.student?.dob,
      coins: coinDetails && coinDetails.coins ? coinDetails.coins : 0,
      games: coinDetails && coinDetails.games ? coinDetails.games : 0,
      gender: user_details.student?.gender,
      profilePercentage: user_details.profilePercentage,
      referralCode: user_details.student?.referralCode,
      recommendReferralCode: user_details.student?.recommendReferralCode,
      avatar: user_details.student?.avatar
        ? await getSignedUrlCloudFront(user_details.student?.avatar)
        : null,
      address: user_details.student?.address,
      state: user_details.student?.state?.id,
      stateName: user_details.student?.state?.name,
      city: user_details.student?.city?.id,
      cityName: user_details.student?.city?.name,
      pincode: user_details.student?.pincode,
      schoolName: user_details.student?.schoolName,
      courseId: user_details.student?.course?.id,
      courseName: user_details.student?.course?.name,
      boardId: user_details.student?.board?.id,
      boardName: user_details.student?.board?.name,
      classId: user_details.student?.class?.id,
      className: user_details.student?.class?.name,
      telegramLink: user_details.student?.class?.telegramUrl,
      batchTypeId: user_details.student?.batchType?.id,
      batchTypeName: user_details.student?.batchType?.name,
      batchStartDateId: user_details.student?.batchDate?.id,
      batchStartDate: user_details.student?.batchDate?.date,
      wantsToBe: user_details.student?.wantToBe?.id,
      wantsToBeName: user_details.student?.wantToBe?.name,
      studentType: user_details.studentType,
      secondaryStudentDetails: secondaryStudentdata,
      parentDetails: parentDetails,
      subscriptionType: user_details.subscriptionType,
      vedaId: user_details.vedaId,
      liveClassAttendance: user_details.liveEventPercentage,
      isAppTourFinished: userlogged ? true : false,
      isPurchased: isPurchased ? true : false
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

//ANCHOR - Update student Details
const updateStudentByID = async (req, res) => {
  try {
    //NOTE - user id from params
    const userId = req.params.id;
    const {
      name,
      email,
      phone,
      dob,
      gender,
      address,
      state,
      city,
      pincode,
      fatherName,
      occupation,
      schoolName,
      wantsToBe,
    } = req.body;

    //NOTE - Get student Details from User table
    const user = await UserDetails.findOne({
      where: { id: userId },
    });

    //NOTE - Update user table
    const updateUserData = {};
    if (name) updateUserData.name = name;
    if (email) updateUserData.email = email;
    if (phone) updateUserData.phone = phone;

    if (Object.keys(updateUserData).length > 0) {
      await UserDetails.update(updateUserData, { where: { id: user.id } });
    }

    //NOTE - update student table
    const updateStudentData = {};
    if (dob) updateStudentData.dob = dob;
    if (gender) updateStudentData.gender = gender;
    if (address) updateStudentData.address = address;
    if (state) updateStudentData.stateId = state;
    if (city) updateStudentData.cityId = city;
    if (pincode) updateStudentData.pincode = pincode;
    if (schoolName) updateStudentData.schoolName = schoolName;
    if (wantsToBe) updateStudentData.wantsToBeId = wantsToBe;

    if (Object.keys(updateStudentData).length > 0) {
      await StudentDetails.update(updateStudentData, {
        where: { id: user.typeId },
      });
    }

    //NOTE - Check Student parent deatils
    const parentUser = await UserDetails.findOne({
      where: { phone: user.phone, type: "Parent" },
    });

    //NOTE - if no parent of user
    if (parentUser === null) {
      //NOTE - Get student Details from User table
      const primUser = await UserDetails.findOne({
        where: {
          phone: user.phone,
          type: "Student",
          [Op.or]: [{ studentType: "Primary" }, { studentType: "primary" }],
        },
      });

      //NOTE - create parent
      const parentData = await ParentDetails.create({
        dob: null,
        gender: null,
        occupation: occupation ? occupation : null,
      });
      //NOTE - create parent in user table
      const parentUser = await UserDetails.create({
        name: fatherName ? fatherName : null,
        phone: primUser.phone,
        mPin: primUser.mPin,
        type: "Parent",
        parentTypeId: parentData.id,
      });

      //NOTE - update the veda user id
      UserDetails.update(
        {
          vedaId: await generateVedaIdForParent(parentUser.id),
        },
        { where: { id: parentUser.id } }
      );

      //NOTE - create parent user map table
      await parentStudentmap.create({
        parentId: parentUser.id,
        studentId: primUser.id,
        relationship: "Father",
      });
    }

    //NOTE - update user parent
    if (parentUser) {
      if (fatherName) {
        await UserDetails.update(
          { name: fatherName },
          { where: { id: parentUser.id } }
        );
      }

      if (occupation) {
        await ParentDetails.update(
          { occupation },
          { where: { id: parentUser.parentTypeId } }
        );
      }
    }

    //NOTE - Calculate Profile percentage
    const percentage = await profilePercentage(user.id);

    //NOTE - update user profile percentage
    UserDetails.update(
      {
        profilePercentage: percentage,
      },
      { where: { id: user.id } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.STUDENT_UPDATED,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Get Secondary student details obased on the primary student
const getSecondaryStudentByID = async (req, res) => {
  try {
    const { id } = req.params;
    let data = [];

    //NOTE - Get Secondary Student Details from student map table
    const secondary_student_details = await SecondaryStudentDetails.findAll({
      where: { primaryId: id },
    });

    for (const ssm of secondary_student_details) {
      //NOTE - get student from user table
      const users = await UserDetails.findOne({
        where: {
          id: ssm.secondaryId,
          type: "Student",
          studentType: "Secondary" || "secondary",
        },
      });

      //NOTE - get student details from student table
      const studentData = await StudentDetails.findOne({
        where: { id: users.typeId },
        include: {
          model: AllCourses,
          attributes: ["id", "name"],
        },
      });

      //NOTE: Finalizing the response
      data.push({
        id: users.id,
        name: users.name,
        courseName: studentData.course.name,
        studentType: users.studentType,
        profilePercentage: users.profilePercentage,
      });
    }

    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - edit avatar in student profile
const uploadAvatar = async (req, res) => {
  try {
    //NOTE: get userId from token
    const userId = req.user.id;
    //NOTE - get avatar from req body
    const { avatar } = req.body;
    let payload = {};

    //NOTE - find the user details
    const user = await UserDetails.findOne({
      where: { id: userId },
      include: {
        model: StudentDetails,
        attributes: ["avatar"],
      },
    });
    if (!user)
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });

    //NOTE - upload avatar in s3
    if (avatar && avatar.includes("base64")) {
      const uploadImage = await uploadFileS3(
        avatar,
        msg.USER_FOLDER_CREATED,
        user.name
      );
      payload = { ...payload, avatar: uploadImage.Key };
    }

    //NOTE - update avatar in student table
    await StudentDetails.update(payload, {
      where: { id: user.typeId },
    });

    return res.status(200).send({
      status: 200,
      message: msg.AVATAR_UPDATED,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Use for add student on admin panel
const adminAddStudents = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      mPin,
      dob,
      gender,
      pincode,
      courseId,
      boardId,
      classId,
      batchTypeId,
      batchStartDateId,
      avatar,
      recommendReferralCode,
    } = req.body;

    //NOTE - getting id from  token
    const adminId = req.user.id;

    //NOTE - check if phone is unique or not
    const { phoneValue, emailValue } = await validateUser(phone, email);

    //NOTE - encrypt Mpin
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(mPin, salt);
    if (phoneValue === false && emailValue === false) {
      let payload = {
        dob: dob,
        gender: gender,
        pincode: pincode,
        courseId: courseId,
        boardId: boardId,
        classId: classId,
        batchTypeId: batchTypeId,
        batchStartDateId: batchStartDateId,
        referralCode: Math.random().toString(36).substring(2, 10).toUpperCase(), //TODO - Generate referralCode
        recommendReferralCode: recommendReferralCode || null,
      };

      if (avatar && avatar.includes("base64")) {
        const uploadImage = await uploadFileS3(avatar, msg.USER_FOLDER_CREATED);
        payload = { ...payload, avatar: uploadImage.key };
      } else {
        payload = { ...payload, avatar: await getDefaultImage(gender) };
      }

      const studentData = new StudentDetails(payload);
      const getStudent = await studentData.save();

      const user = new UserDetails({
        name: name,
        phone: phone,
        email: email,
        mPin: hashedPassword,
        studentType: "Primary",
        type: "Student",
        typeId: getStudent.id,
        createdById: adminId,
      });
      const getUser = await user.save();

      //NOTE - check profile percentage
      const percentage = await profilePercentage(getUser.id);

      //NOTE - update percentage
      UserDetails.update(
        {
          profilePercentage: percentage,
          vedaId: await generateVedaIdForStudent(getUser.id),
        },
        { where: { id: getUser.id } }
      );

      //NOTE - create parent for primary user only
      if (["Primary", "primary"].includes(getUser.studentType)) {
        const parentData = await ParentDetails.create({
          dob: null,
          gender: null,
          occupation: null,
        });

        //NOTE - create parent in user table
        const parentUser = await UserDetails.create({
          phone: getUser.phone,
          mPin: hashedPassword,
          type: "Parent",
          parentTypeId: parentData.id,
        });

        //NOTE - update the veda user id
        UserDetails.update(
          {
            vedaId: await generateVedaIdForParent(parentUser.id),
          },
          { where: { id: parentUser.id } }
        );

        //NOTE - create parent user map table
        await StudentParentMap.create({
          parentId: parentUser.id,
          studentId: getUser.id,
          relationship: "Father",
        });
      }

      if (recommendReferralCode) {
        //NOTE - find student with referralCode
        const student = await StudentDetails.findOne({
          where: { referralCode: recommendReferralCode },
        });

        if (student) {
          //NOTE - find student id based on type id of student
          const user = await UserDetails.findOne({
            where: { typeId: student.id },
          });

          //NOTE - check if the student have already coins or not
          const checkCoin = await Coins.findOne({
            where: { studentId: user.id },
          });

          if (checkCoin) {
            //NOTE - if student already exist update coins
            await Coins.update(
              { coins: checkCoin.coins + 100 },
              { where: { studentId: checkCoin.studentId } }
            );

            await CoinTransactionHistory.create({
              //NOTE - the student who's referal code is used
              studentId: checkCoin.studentId,
              referedToStudentId: getUser.id,
              coins: 100,
              games: 0,
              reason: "User signup with his/her referal code",
              status: "Credit",
            });

            //NOTE - if student not there create with 100 coins
            await Coins.create({
              studentId: getUser.id,
              coins: 100,
              games: 0,
            });

            await CoinTransactionHistory.create({
              //NOTE - the student who's referal code is used
              studentId: getUser.id,
              referedFromStudentId: checkCoin.studentId,
              coins: 100,
              games: 0,
              reason: "new Student signup with referal code",
              status: "Credit",
            });
          } else {
            //NOTE -
            await Coins.create({
              //NOTE - new user with coins
              studentId: getUser.id,
              coins: 100,
              games: 0,
            });
            await CoinTransactionHistory.create({
              //NOTE - the student who use other student referal code
              studentId: getUser.id,
              referedFromStudentId: checkCoin.studentId,
              coins: 100,
              games: 0,
              reason: "new Student signup with referal code",
              status: "Credit",
            });

            await Coins.create({
              //NOTE - existing  user with coins
              studentId: user.id,
              coins: 100,
              games: 0,
            });
            await CoinTransactionHistory.create({
              //NOTE - the student who's referal code is used
              studentId: checkCoin.studentId,
              referedToStudentId: getUser.id,
              coins: 100,
              games: 0,
              reason: "User signup with his/her referal code",
              status: "Credit",
            });
          }
        }
      }

      //NOTE - get all details using batch
      const batchDetail = await bathDetails(batchTypeId);

      //NOTE - lead capture
      await captureLead(
        config.LEADSQUARD_API_KEY,
        config.LEADSQUARD_CLIENT_SECRET,
        config.LEADSQUARD_HOST,
        name,
        batchDetail.course.name,
        batchDetail.board.name,
        batchDetail.class.name,
        phone
      );

      //NOTE - final response return
      return res.status(200).send({
        status: 200,
        message: msg.STUDENT_ADDED,
        data: getUser.id,
      });
    } else if (phoneValue === true) {
      return res.status(400).send({
        status: 400,
        message: msg.DUPLICATE_PHONE,
      });
    } else if (emailValue === true) {
      return res.status(400).send({
        status: 400,
        message: msg.DUPLICATE_EMAIL,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Admin Update student Details
const adminUpdateStudentDetails = async (req, res) => {
  try {
    const {
      id,
      courseId,
      boardId,
      classId,
      batchTypeId,
      batchStartDateId,
      name,
      dob,
      gender,
      address,
      state,
      city,
      pincode,
      wantsToBe,
      fatherName,
      occupation,
      schoolName,
      parentNumber,
      avatar,
      subscriptionType,
      validityDay,
      entryType,
    } = req.body;

    //NOTE - id by token
    const token = req.user.id;

    //NOTE - find admin details
    const adminUser = await AdminUser.findOne({
      where: { id: token },
      include: [
        {
          model: RolePermission,
          attributes: ["role"],
        },
      ],
    });

    //NOTE - Get student Details from User table
    const user = await UserDetails.findOne({
      where: { id: id },
      attributes: ["id", "phone", "typeId"],
    });

    //NOTE - Update values
    if (name || subscriptionType) {
      const updateData = {};
      if (name) updateData.name = name;
      if (subscriptionType) updateData.subscriptionType = subscriptionType;

      await UserDetails.update(updateData, { where: { id: user.id } });
    }

    //NOTE - payload for student
    let payload = {
      dob: dob,
      gender: gender,
      address: address,
      stateId: state,
      cityId: city,
      pincode: pincode,
      courseId: courseId,
      boardId: boardId,
      classId: classId,
      batchTypeId: batchTypeId,
      batchStartDateId: batchStartDateId,
      wantsToBeId: wantsToBe,
      schoolName: schoolName,
    };

    //NOTE - update student details
    const shouldUpdate =
      dob ||
      gender ||
      address ||
      state ||
      city ||
      pincode ||
      courseId ||
      boardId ||
      classId ||
      batchTypeId ||
      batchStartDateId ||
      wantsToBe ||
      schoolName ||
      avatar ||
      subscriptionType ||
      validityDay ||
      entryType;

    if (shouldUpdate) {
      if (["Free", "Premium"].includes(subscriptionType)) {
        let date = null;
        if (["Premium"].includes(subscriptionType)) {
          date = await convertDayIntoDate(validityDay);
        }
        //NOTE - payload for student plan deatils
        const studentPlanData = await studentPlanMap.findOne({
          where: { userId: id },
        });

        //NOTE - payload for studentPlanMap
        const planData = {
          subscriptionType: subscriptionType,
          validityDay: validityDay,
          entryType: entryType,
          validityDate: date,
          createdById: token,
          createdByType: adminUser?.permission_role?.role,
        };

        //NOTE -student plan not there , then create it
        if (!studentPlanData) {
          await studentPlanMap.create({ userId: id, ...planData });
        } else {
          //NOTE -student plan is there ,update it
          await studentPlanMap.update(planData, { where: { userId: id } });
        }
      }

      //NOTE - update if avatar
      if (avatar && avatar.includes("base64")) {
        const uploadImage = await uploadFileS3(avatar, msg.USER_FOLDER_CREATED);
        payload.avatar = uploadImage.key;
      }
      //NOTE - update if student details
      await StudentDetails.update(payload, { where: { id: user.typeId } });
    }

    //NOTE - Check Student parent mapping
    const parentData = await UserDetails.findOne({
      where: { phone: user.phone, type: "Parent" },
      attributes: ["id", "parentTypeId"],
    });

    if (parentData) {
      const updateData = {};

      //NOTE - if father name
      if (fatherName) {
        updateData.name = fatherName;
      }

      //NOTE - if father name and parentName
      if (fatherName && parentNumber) {
        updateData.name = fatherName;
        updateData.phone = parentNumber;
      }

      if (Object.keys(updateData).length > 0) {
        await UserDetails.update(updateData, {
          where: { id: parentData.id },
        });
      }

      //NOTE - if father occupation
      if (occupation) {
        await ParentDetails.update(
          { occupation: occupation },
          { where: { id: parentData.parentTypeId } }
        );
      }
    }

    //NOTE - Calculate Profile percentage
    const percentage = await profilePercentage(user.id);

    UserDetails.update(
      { profilePercentage: percentage, subscriptionType },
      { where: { id: user.id } }
    );
    return res.status(200).send({
      status: 200,
      message: msg.STUDENT_UPDATED,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - get all user details based on the phone number and  exclude the user id is coming
const getAllUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    //NOTE - get user details
    const user = await UserDetails.findOne({
      where: {
        id: id,
        type: "Student",
      },
    });

    //NOTE Check if the user exists
    if (!user)
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });

    const allUsers = await UserDetails.findAll({
      where: { phone: user.phone, type: "Student", id: { [Op.ne]: id } },
      include: [
        {
          model: StudentDetails,
          attributes: ["avatar"],
          include: [
            { model: AllCourses, attributes: ["name"] },
            { model: Boards, attributes: ["name"] },
            { model: Class, attributes: ["name"] },
          ],
        },
      ],
    });

    //NOTE - push final result
    const result = await Promise.all(
      allUsers.map(async (data) => {
        const imageUrl = data.student?.avatar
          ? await getSignedUrlCloudFront(data.student.avatar)
          : null;

        return {
          id: data.id,
          name: data.name,
          courseName: data.student?.course?.name,
          class: data.student?.class?.name,
          boardName: data.student?.board?.name,
          avatar: imageUrl,
          studentType: data.studentType,
          profilePercentage: data.profilePercentage,
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

//ANCHOR - Switch student account
const switchAccount = async (req, res) => {
  try {
    let { userId, deviceType, deviceToken } = req.body;

    //NOTE - get parent details
    const foundUser = await UserDetails.findOne({
      where: { id: userId },
    });

    //NOTE - generate token
    const token = jwt.sign(
      {
        id: foundUser.id,
        studentType: foundUser.studentType,
        role: foundUser.type,
        phone: foundUser.phone,
      },
      config.SECRET_KEY,
      { expiresIn: "10d" }
    );

    const checkToken = await TokenDetails.findOne({
      where: { phone: foundUser.phone, userId: foundUser.id },
    });

    if (checkToken) {
      //NOTE -update existing token
      await TokenDetails.update(
        {
          phone: foundUser.phone,
          userId: foundUser.id,
          type: ["Secondary", "secondary"].includes(foundUser.studentType)
            ? "Secondary"
            : null,
          token: token,
          expiry: await getTokenExpiryTime(),
        },
        { where: { id: checkToken.id } }
      );
    } else {
      //NOTE - push token details
      await TokenDetails.create({
        phone: foundUser.phone,
        userId: foundUser.id,
        type: ["Secondary", "secondary"].includes(foundUser.studentType)
          ? "Secondary"
          : null,
        token: token,
        expiry: await getTokenExpiryTime(),
      });
    }

    //NOTE - update device Token
    if (deviceType && deviceToken) {
      //NOTE - Check if device token  is there or not
      const checkDeveice = await DeviceToken.findOne({
        where: { userId: foundUser.id },
      });

      //NOTE -  if device is there update it
      if (checkDeveice) {
        if (["Web"].includes(deviceType)) {
          await DeviceToken.update(
            {
              deviceType: deviceType,
              webToken: deviceToken,
            },
            { where: { userId: checkDeveice.userId } }
          );
        } else if (["Android"].includes(deviceType)) {
          await DeviceToken.update(
            {
              deviceType: deviceType,
              andriodDeviceToken: deviceToken,
            },
            { where: { userId: checkDeveice.userId } }
          );
        } else if (["Ios"].includes(deviceType)) {
          await DeviceToken.update(
            {
              deviceType: deviceType,
              iosDeviceToken: deviceToken,
            },
            { where: { userId: checkDeveice.userId } }
          );
        }
      } else {
        //NOTE -  if device is not there, then create it
        if (["Web"].includes(deviceType)) {
          await DeviceToken.create({
            userId: foundUser.id,
            webToken: deviceToken,
            deviceType: deviceType,
          });
        } else if (["Android"].includes(deviceType)) {
          await DeviceToken.create({
            userId: foundUser.id,
            andriodDeviceToken: deviceToken,
            deviceType: deviceType,
          });
        } else if (["Ios"].includes(deviceType)) {
          await DeviceToken.create({
            userId: foundUser.id,
            iosDeviceToken: deviceToken,
            deviceType: deviceType,
          });
        }
      }
    }

    //NOTE - push final result
    const finalResult = {
      id: foundUser.id,
      accessToken: token,
      phone: foundUser.phone,
      loginStatus: true,
    };

    return res.status(200).send({
      status: 200,
      message: msg.USER_LOGIN_SUCCESS,
      data: finalResult,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Update student Details
const updateUserSubscriptionType = async (req, res) => {
  try {
    const { users, type, month } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    //NOTE - update user premium to free
    if (["Free"].includes(type)) {
      for (let ids of users) {
        //NOTE - user subscription type update in user table
        await UserDetails.update(
          {
            subscriptionType: "Free",
            updatedById: token,
          },
          { where: { id: ids } }
        );

        //NOTE - user subscription type update in user plane map table
        await studentPlanMap.update(
          {
            subscriptionType: "Free",
            month: null,
            validityDay: null,
            validityDate: null,
            entryType: "Manually",
          },
          { where: { userId: ids } }
        );
      }
    }

    //NOTE - checking validity day
    if (["Premium"].includes(type) && month < 1)
      return res.status(200).send({
        status: 200,
        message: msg.VALIDITY_DAY_LIMIT,
      });

    //NOTE - update user free to premium
    if (["Premium"].includes(type) && month >= 1) {
      for (let ids of users) {
        //NOTE - user subscription type update in user table
        await UserDetails.update(
          {
            subscriptionType: "Premium",
            updatedById: token,
          },
          { where: { id: ids } }
        );

        //NOTE - user subscription type update in user plane map table
        await studentPlanMap.update(
          {
            subscriptionType: "Premium",
            month: month,
            validityDay: Math.floor(month * 30), //TODO: Assuming each month has 30 days
            validityDate: new Date(
              Date.now() + Math.floor(month * 30) * 24 * 60 * 60 * 1000
            )
              .toISOString()
              .substring(0, 10), //TODO: calculate the date based on the todays date and month given by the admin
            entryType: "Manually",
          },
          { where: { userId: ids } }
        );
      }
    }

    return res.status(200).send({
      status: 200,
      message: msg.STUDENT_SUBSCRIPTIONTYPE_UPDATED,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - get student details for dashboard
const getStudentsForDashboard = async (req, res) => {
  try {
    //NOTE - If login by a teacher or mentor
    let typeIds;
    if (req.user)
      if (["teacher", "mentor"].includes(req.user?.role.toLowerCase())) {
        //NOTE - get Teacher subject details
        const staffDetails = await TeacherSubjectMap.findAll({
          where: { teacherId: req.user.id },
          attributes: ["classId", "batchTypeId"],
        });

        //NOTE - push all user class Ids for
        const classesIds = staffDetails.map((item) => item.classId);

        //NOTE - params based on class or batch type
        const idParams = { classId: { [Sequelize.Op.in]: classesIds } };

        //NOTE - find student data based on the batchType
        const students = await StudentDetails.findAll({
          where: {
            ...idParams,
          },
        });

        //NOTE - push all user type ids for student ids
        const type_id = students.map((item) => item.dataValues.id);

        //NOTE - send typeIds based on the batch type id
        typeIds = {
          typeId: {
            [Sequelize.Op.in]: type_id,
          },
        };
      }

    //NOTE - Get details from user table
    const users = await UserDetails.findAll({
      where: { type: "Student", ...typeIds },
      attributes: ["id", "name"],

      order: [["createdAt", "DESC"]],
    });

    //NOTE - Push final object
    const result = await Promise.all(
      users.map(async (data) => {
        return {
          id: data.id,
          name: data.name,
        };
      })
    );

    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

const inactiveUser = async (req, res) => {
  try {
    //NOTE: get userId from token
    const userId = req.user.id;

    //NOTE - check student details
    const userDetails = await UserDetails.findOne({
      where: { id: req.params.id, type: "Student" }, //NOTE - get student id from params
      attributes: [
        "id",
        "status",
        "typeId",
        "phone",
        "parentTypeId",
        "studentType",
      ],
    });

    //NOTE - if userDetails not found with the id
    if (!userDetails) {
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });
    }

    //NOTE - if user already inactive
    if (userDetails.status !== 1) {
      return res.status(400).send({ status: 400, message: msg.INACTIVE_USER });
    }
    //NOTE - if user is not primary user
    if (userDetails.studentType !== "Primary") {
      return res
        .status(400)
        .send({ status: 400, message: msg.CANT_INACTIVE_USER });
    }

    if (userDetails.status === 1 && userDetails.studentType === "Primary") {
      //NOTE - check Secondary details
      const secondaryStudentIds = await SecondaryStudentDetails.findAll({
        where: { primaryId: userDetails.id, status: 1 },
      });

      if (secondaryStudentIds.length > 0) {
        //NOTE - get Secondary user details from user and student table
        const secondaryUserIds = secondaryStudentIds.map(
          (secondary) => secondary.secondaryId
        );

        //NOTE - update Secondary user as inactive
        await UserDetails.update(
          { status: 0 },
          {
            where: {
              id: { [Sequelize.Op.in]: secondaryUserIds },
              type: "Student",
              studentType: "Secondary",
            },
          }
        );

        //NOTE - update Secondary status in student secondary map table
        await SecondaryStudentDetails.update(
          { status: 0 },
          {
            where: {
              primaryId: userDetails.id,
              secondaryId: { [Sequelize.Op.in]: secondaryUserIds },
            },
          }
        );

        const checkTokens = await TokenDetails.findAll({
          where: {
            phone: userDetails.phone,
            userId: { [Sequelize.Op.in]: secondaryUserIds },
          },
        });

        if (checkTokens.length > 0) {
          // NOTE - update existing tokens
          for (const token of checkTokens) {
            await TokenDetails.update(
              { expiry: new Date() },
              { where: { id: token.id } }
            );
          }
        }
      }

      //NOTE - check parent details
      const checkParent = await StudentParentMap.findOne({
        where: { studentId: userDetails.id, status: 1 },
      });

      if (checkParent) {
        const parentUserId = checkParent.parentId;

        //NOTE - update parent user as inactive
        await UserDetails.update(
          { status: 0 },
          {
            where: {
              id: parentUserId,
              type: "Parent",
            },
          }
        );

        //NOTE - update Parent status in parent student map table
        await StudentParentMap.update(
          { status: 0 },
          {
            where: {
              studentId: userDetails.id,
              parentId: parentUserId,
            },
          }
        );

        const checkToken = await TokenDetails.findAll({
          where: {
            phone: userDetails.phone,
            userId: parentUserId,
          },
        });

        if (checkToken.length > 0) {
          // NOTE - update existing tokens
          for (const token of checkToken) {
            await TokenDetails.update(
              { expiry: new Date() },
              { where: { id: token.id } }
            );
          }
        }
      }

      //NOTE - finally inactive the primary user
      await UserDetails.update(
        { status: 0 },
        {
          where: {
            id: userDetails.id,
            type: "Student",
            studentType: "Primary",
          },
        }
      );

      const checkToken = await TokenDetails.findAll({
        where: {
          phone: userDetails.phone,
          userId: userDetails.id,
        },
      });

      if (checkToken.length > 0) {
        // NOTE - update existing tokens
        for (const token of checkToken) {
          await TokenDetails.update(
            { expiry: new Date() },
            { where: { id: token.id } }
          );
        }
      }
    }

    return res.send({
      status: 200,
      message: msg.INACTIVE_SUCCESSFULLY,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

const activateUser = async (req, res) => {
  try {
    //NOTE: get userId from token
    const userId = req.user.id;

    console.log("req.params.id", req.params);

    //NOTE - check student details
    const userDetails = await UserDetails.findOne({
      where: { id: req.params.id, type: "Student" }, //NOTE - get student id from params
      attributes: ["id", "status", "studentType", "phone"],
    });

    //NOTE - if userDetails not found with the id
    if (!userDetails) {
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });
    }

    //NOTE - if user already active
    if (userDetails.status !== 0) {
      return res.status(400).send({ status: 400, message: msg.ACTIVE_USER });
    }
    //NOTE - if user is not primary user
    if (userDetails.studentType !== "Primary") {
      return res
        .status(400)
        .send({ status: 400, message: msg.CANT_ACTIVE_USER });
    }

    if (userDetails.status === 0 && userDetails.studentType === "Primary") {
      //NOTE - check Secondary details
      const secondaryStudentIds = await SecondaryStudentDetails.findAll({
        where: { primaryId: userDetails.id, status: 0 },
      });

      if (secondaryStudentIds.length > 0) {
        //NOTE - get Secondary user details from user and student table
        const secondaryUserIds = secondaryStudentIds.map(
          (secondary) => secondary.secondaryId
        );

        //NOTE - update Secondary user as active
        await UserDetails.update(
          { status: 1 },
          {
            where: {
              id: { [Sequelize.Op.in]: secondaryUserIds },
              type: "Student",
              studentType: "Secondary",
            },
          }
        );

        //NOTE - update Secondary status in student secondary map table
        await SecondaryStudentDetails.update(
          { status: 1 },
          {
            where: {
              primaryId: userDetails.id,
              secondaryId: { [Sequelize.Op.in]: secondaryUserIds },
            },
          }
        );
      }

      //NOTE - check parent details
      const checkParent = await StudentParentMap.findOne({
        where: { studentId: userDetails.id, status: 0 },
      });

      if (checkParent) {
        const parentUserId = checkParent.parentId;

        //NOTE - update parent user as active
        await UserDetails.update(
          { status: 1 },
          {
            where: {
              id: parentUserId,
              type: "Parent",
            },
          }
        );

        //NOTE - update Parent status in parent student map table
        await StudentParentMap.update(
          { status: 1 },
          {
            where: {
              studentId: userDetails.id,
              parentId: parentUserId,
            },
          }
        );
      }

      //NOTE - finally active the primary user
      await UserDetails.update(
        { status: 1 },
        {
          where: {
            id: userDetails.id,
            type: "Student",
            studentType: "Primary",
          },
        }
      );
    }

    return res.send({
      status: 200,
      message: msg.USER_ACTIVE_SUCCESSFULLY,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};


//ANCHOR - update first login user status for app tour
const updateAppTourStatus = async (req, res) => {
  try {
    const { appTourFinished } = req.body;
    const userId = req.user.id;
    //NOTE - checking user login status
    const userAppTour = await loginUser.findOne({ where: { userId: userId } });
    if (appTourFinished === true && !userAppTour) {
      if (!userAppTour) {
        await loginUser.create({ userId: userId })
      }
    }
    return res.send({
      status: 200,
      message: msg.FOUND_DATA,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  updateStudentByID, //TODO - use only for web and mobile
  getSecondaryStudentByID,
  uploadAvatar, //TODO - use only for web and mobile
  adminAddStudents, //TODO - use on admin panel only
  adminUpdateStudentDetails, //TODO -  use on admin panel only
  getAllUserDetails, //TODO - get all user details based on the phone number and id
  switchAccount, //TODO - use in mobile and web
  updateUserSubscriptionType, //TODO - change subscription type( use in admin panel)
  getStudentsForDashboard,
  inactiveUser, //TODO - Inactive a user (use in web and mobile)
  activateUser, //TODO - Activate a user (use in web and mobile)
  updateAppTourStatus
};
