const db = require("../../../models/index");
const msg = require("../../../constants/Messages");
const { getTokenExpiryTime } = require("../../users/service");
const { getSignedUrlCloudFront } = require("../../../helpers/cloudFront");
const jwt = require("jsonwebtoken");
const { config } = require("../../../config/db.config");
const UserDetails = db.users;
const StudentDetails = db.student;
const AllCourses = db.courses;
const Boards = db.boards;
const Class = db.class;
const TokenDetails = db.mobile_token_map;
const OTP = db.otp;

//ANCHOR - get all user details based on the phone number
const getAllParentUsers = async (req, res) => {
  try {
    //NOTE - parentId from token
    const token = req.user.id || req.user.parentId;

    if (!token)
      return res
        .status(400)
        .send({ status: 400, message: msg.PARENT_NOT_REGISTERED });

    //NOTE - get user details
    const user = await UserDetails.findOne({
      where: { id: token, type: "Parent", status: 1 },
    });

    if (!user)
      return res
        .status(400)
        .send({ status: 400, message: msg.INVALID_LOGIN_CREDENTIAL });

    //NOTE - get all student details
    const allUsers = await UserDetails.findAll({
      where: {
        phone: user.phone,
        type: "Student",
      },
      attributes: ["id", "name", "studentType", "subscriptionType"],
      include: {
        model: StudentDetails,
        attributes: ["avatar"],
        include: [
          { model: AllCourses, attributes: ["id", "name"] },
          { model: Boards, attributes: ["name"] },
          { model: Class, attributes: ["name"] },
        ],
      },
    });

    //NOTE - push final data
    const result = await Promise.all(
      allUsers.map(async (data) => {
        const avatar = data.student.dataValues.avatar
          ? await getSignedUrlCloudFront(data.student.dataValues.avatar)
          : null;

        return {
          id: data.id,
          name: data.name,
          courseName: data.student.course.name,
          class: data.student.class.name,
          boardName: data.student.board.name,
          avatar,
          studentType: data.studentType,
          subscriptionType: data?.subscriptionType,
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

//ANCHOR - User Login with user id
const loginWithParentUserId = async (req, res) => {
  try {
    let { userId } = req.body;

    //NOTE - find user details
    const foundUser = await UserDetails.findOne({
      where: { id: userId, type: "Student", status: 1 },
    });
    if (!foundUser)
      return res.status(400).send({
        status: 400,
        message: msg.INVALID_LOGIN_CREDENTIAL,
      });

    //NOTE - checking user parent details
    const UserParent = await UserDetails.findOne({
      where: { phone: foundUser.phone, type: "Parent", status: 1 },
    });

    if (!UserParent)
      return res.status(400).send({
        status: 400,
        message: msg.INVALID_LOGIN_CREDENTIAL,
      });

    

    if (foundUser) {
      //NOTE Checking Db for OTP
      const foundlinkedOtp = await OTP.findOne({
        where: {
          phone: foundUser.phone,
          type: null,
        },
      });

      await OTP.update(
        { verified: 1, userId: foundUser.id },
        { where: { id: foundlinkedOtp.id } }
      );

      //NOTE - generate token
      const token = jwt.sign(
        {
          id: foundUser.id,
          studentType: foundUser.studentType,
          role: foundUser.type,
          phone: foundUser.phone,
          parentId: UserParent.id,
        },
        config.SECRET_KEY,
        { expiresIn: "10d" }
      );

      //NOTE - check if token exists or not
      const [tokenDetails, created] = await TokenDetails.findOrCreate({
        where: {
          phone: foundUser.phone,
          userId: foundUser.id,
          parentId: UserParent.id,
        },
        defaults: {
          type: ["Secondary", "secondary"].includes(foundUser.studentType)
            ? "Secondary"
            : null,
          token: token,
          expiry: await getTokenExpiryTime(),
        },
      });

      if (!created) {
        //NOTE - update existing token
        await TokenDetails.update(
          {
            type: ["Secondary", "secondary"].includes(foundUser.studentType)
              ? "Secondary"
              : null,
            token: token,
            expiry: await getTokenExpiryTime(),
          },
          { where: { id: tokenDetails.id } }
        );
      }

      //NOTE - user and parent details
      const final = {
        userId: foundUser.id,
        parentId: UserParent.id,
        loginStatus: true,
        accessToken: token,
      };

      //NOTE - final return
      return res.status(200).send({
        status: 200,
        message: msg.PARENT_LOGIN_SUCCESS,
        data: final,
      });
    } else {
      return res.status(400).send({
        status: 400,
        message: msg.INVALID_LOGIN_CREDENTIAL,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

module.exports = {
  getAllParentUsers,
  loginWithParentUserId,
};
