const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { validateAdminuser } = require("./service");
const { getTokenExpiryTime } = require("../users/service");
const { getSignedUrlCloudFront } = require("../../helpers/cloudFront");
const uploadFileS3 = require("../../helpers/uploadFileS3");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { encrypt } = require("../../helpers/cyptojs");
const { config } = require("../../config/db.config");
const Admin = db.admin;
const Teacher = db.teachers;
const Subject = db.subject;
const TeacherSubjectMap = db.teacher_subject_map;
const RolePermission = db.permissionRole;
const Class = db.class;
const BatchTypes = db.batchTypes;
const TokenDetails = db.mobile_token_map;

//ANCHOR - Create new Admin
const signupAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      department,
      dob,
      gender,
      classId,
      avatar,
      teacherInfo,
      intro_video
    } = req.body;

    //NOTE - decoding token
    const token = req.user.id;

    const { emailValue, phoneValue } = await validateAdminuser(email, phone);

    const checkRoles = await RolePermission.findOne({
      where: { id: department },
    });

    if (!checkRoles)
      return res.status(400).send({
        status: 400,
        message: msg.INVALID_ROLE,
      });

    if (emailValue === false && phoneValue === false) {
      if (
        ["teacher", "mentor", "Teacher", "Mentor"].includes(checkRoles.role)
      ) {
        const teacher_user = new Teacher({
          dob: dob,
        });
        const getTeacher = await teacher_user.save();

        //NOTE - HASH PASSWORD
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(password, salt);


        let payload = {
          name: name,
          email: email,
          password: hashedPassword,
          phone: phone,
          typeId: getTeacher.id,
          gender: gender,
          dob: dob,
          department,
          teacherInfo: teacherInfo,
          intro_video: intro_video,
          createdById: token,
        };

        //NOTE - If test method is upload update question File
        if (avatar && avatar.includes("base64")) {
          const uploadAvatar = await uploadFileS3(
            avatar,
            msg.ADMIN_FOLDER_CREATED
          );
          payload = { ...payload, avatar: uploadAvatar.key };
        }

        const admin_user = new Admin(payload);
        const getAdmin = await admin_user.save();

        //NOTE : add multiple class
        if (
          ["teacher", "mentor", "Teacher", "Mentor"].includes(checkRoles.role)
        ) {
          for (let classes of classId) {
            const getClass = await Class.findOne({
              where: { id: classes },
            });
            const push_subject_map = new TeacherSubjectMap({
              teacherId: getAdmin.id,
              courseId: getClass.courseId,
              boardId: getClass.boardId,
              classId: getClass.id,
            });
            await push_subject_map.save();
          }
        }

        return res.status(200).send({
          status: 200,
          message: msg.TEACHER_USER_ADDED,
          data: getAdmin,
        });
      } else {
        //NOTE - HASH PASSWORD
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(password, salt);

        let payload = {
          name: name,
          email: email,
          password: hashedPassword,
          phone: phone,
          gender: gender,
          dob: dob,
          department,
          createdById: token,
        };

        //NOTE - If test method is upload update question File
        if (avatar && avatar.includes("base64")) {
          const uploadAvatar = await uploadFileS3(
            avatar,
            msg.ADMIN_FOLDER_CREATED
          );
          payload = { ...payload, avatar: uploadAvatar.key };
        }

        const admin = new Admin(payload);

        const getAdmin = await admin.save();
        return res.status(200).send({
          status: 200,
          message: ["superAdmin"].includes(department)
            ? msg.ADMIN_USER_ADDED
            : msg.MANAGER_USER_ADDED,
          data: getAdmin,
        });
      }
    } else {
      return res.status(409).send({
        status: 409,
        message: msg.DUPLICATE_EMAIL_OR_PHONE,
      });
    }
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - Admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // NOTE - find admin
    const adminUser = await Admin.findOne({
      where: { email: email },
      include: [
        {
          model: RolePermission,
          attributes: ["role"],
        },
      ],
    });

    if (!adminUser) {
      return res.status(400).send({ status: 400, message: msg.USER_NOT_FOUND });
    } else if (adminUser !== null) {
      const isMatch = await bcrypt.compare(password, adminUser.password);

      if (!isMatch) {
        return res
          .status(400)
          .send({ status: 400, message: msg.INVALID_LOGIN_CREDENTIAL });
      } else {
        const token = jwt.sign(
          {
            id: adminUser.id,
            role: adminUser?.permission_role?.role,
            phone: adminUser.phone,
          },
          config.SECRET_KEY,
          {
            expiresIn: "10d",
          }
        );

        //NOTE - check if token exist or not
        const checkToken = await TokenDetails.findOne({
          where: {
            phone: adminUser.phone,
            userId: adminUser.id,
          },
        });

        if (checkToken) {
          //NOTE -update existing token
          await TokenDetails.update(
            {
              phone: adminUser.phone,
              userId: adminUser.id,
              type: adminUser?.permission_role?.role,
              token: token,
              expiry: await getTokenExpiryTime(),
            },
            { where: { id: checkToken.id } }
          );
        } else {
          //NOTE - push token details
          await TokenDetails.create({
            phone: adminUser.phone,
            userId: adminUser.id,
            type: adminUser?.permission_role?.role,
            token: token,
            expiry: await getTokenExpiryTime(),
          });
        }

        const encryptInfo = encrypt({
          folder: {
            shorts: msg.SHORTS_FOLDER_CREATED,
            subject: msg.SUBJECT_FOLDER_CREATED,
            videoManager: msg.SYLLABUS_CONTENT_VIDEO_URL,
            gallary: msg.UPLOAD_URL,
          },
          bucket: config.S3_BUCKET_NAME,
          region: config.S3_REGION,
          access: config.AWS_ACCESS_KEY,
          secret: config.AWS_SECRET_KEY,
        });

        return res.status(200).send({
          status: 200,
          message: msg.USER_LOGIN_SUCCESS,
          data: {
            id: adminUser.id,
            name: adminUser.name,
            email: adminUser.email,
            vedaId: adminUser.vedaId,
            userType: adminUser?.permission_role?.role,
            avatar: await getSignedUrlCloudFront(adminUser.avatar),
            token: token,
            credentials: encryptInfo,
            checkToken,
          },
        });
      }
    }
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//NOTE: update Password
const updateAdminPassword = async (req, res) => {
  try {
    const { password, token } = req.body;
    //NOTE: decode token to get id
    const decoded = jwt.verify(token, config.SECRET_KEY);

    //NOTE: get admin details
    const getAdmin = await Admin.findOne({
      where: { id: decoded.id },
    });
    if (!getAdmin) {
      return res.status(400).send({ status: 400, message: msg.ID_NOT_FOUND });
    }

    //NOTE - HASH PASSWORD

    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);

    await Admin.update(
      { password: hashedPassword },
      { where: { id: decoded.id } }
    );
    return res.status(200).send({
      status: 200,
      message: msg.PASSWORD_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  signupAdmin,
  loginAdmin,
  updateAdminPassword,
};
