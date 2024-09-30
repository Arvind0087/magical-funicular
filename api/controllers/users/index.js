const moment = require("moment");
const bcrypt = require("bcryptjs");
const { Sequelize } = require("sequelize");
const jwt = require("jsonwebtoken");
const db = require("../../models/index");
const msg = require("../../constants/Messages");
const { config } = require("../../config/db.config");
const { userDetails } = require("../../helpers/userdetails");
const { bathDetails } = require("../../helpers/batchValidator");
const {
  generateOTP,
  verifyOTP,
  validateUser,
  getTokenExpiryTime,
  sendOtpToPhone,
  getDefaultImage,
  generateVedaIdForStudent,
  generateVedaIdForParent,
  captureLead,
  retriveLeads,
  createActivity,
  studentData,
} = require("./service");
const UserDetails = db.users;
const StudentDetails = db.student;
const ParentDetails = db.parent;
const parentStudentmap = db.parent_student_map;
const Admin = db.admin;
const StudentMap = db.student_secondary_map;
const OTP = db.otp;
const batchType = db.batchTypes;
const Boards = db.boards;
const Course = db.courses;
const Class = db.class;
const TokenDetails = db.mobile_token_map;
const RolePermission = db.permissionRole;
const Coins = db.coins;
const CoinTransactionHistory = db.coin_transaction;
const DeviceToken = db.user_device_token;
const studentPlanMap = db.student_plan_map;
const apiKey = config.LEADSQUARD_API_KEY;
const clientSecret = config.LEADSQUARD_CLIENT_SECRET;
const host = config.LEADSQUARD_HOST;
const loginUser = db.login_user;

//ANCHOR - Generate OTP
const generateOtp = async (req, res) => {
  try {
    const { phone, email, type } = req.body; //TODO - Type should use only for admin
    if (!phone && !email) {
      return res
        .status(400)
        .send({ status: 400, message: msg.REQUIRED_EMAIL_OR_PHONE });
    }

    if (type && email) {
      const adminUser = await Admin.findOne({ where: { email } });
      if (!adminUser) {
        return res
          .status(400)
          .send({ status: 400, message: msg.USER_NOT_REGISTERED });
      }
    }

    if (type && phone) {
      const adminUser = await Admin.findOne({ where: { phone } });
      if (!adminUser) {
        return res
          .status(400)
          .send({ status: 400, message: msg.USER_NOT_REGISTERED });
      }
    }

    const { otp, status } = await generateOTP(phone, email, type);

    if (!status) {
      return res
        .status(200)
        .send({ status: 200, message: msg.INACTIVE_USER_OTP });
    }

    await sendOtpToPhone(phone, otp);
    return res
      .status(200)
      .send({ status: 200, message: msg.USER_OTP_SUCCESS, data: otp });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Verify OTP
const verifyMobileOtp = async (req, res) => {
  try {
    const { deviceType, deviceToken } = req.body;

    const [foundUser, status] = await verifyOTP(req.body);

    if (req.body.type) {
      let finalAdmin;
      if ((req.body.phone || req.body.email) && status === true && foundUser) {
        if (req.body.phone && status === true && foundUser) {
          finalAdmin = await Admin.findOne({
            where: { phone: req.body.phone },
            include: {
              model: RolePermission,
              attributes: ["id", "role"],
            },
          });
        } else if (req.body.email && status === true && foundUser) {
          finalAdmin = await Admin.findOne({
            where: { email: req.body.email },
            include: {
              model: RolePermission,
              attributes: ["id", "role"],
            },
          });
        }

        const token = jwt.sign(
          {
            id: finalAdmin.id,
            role: finalAdmin?.permission_role?.role,
            phone: finalAdmin.phone,
          },
          config.SECRET_KEY,
          { expiresIn: "10d" }
        );
        //NOTE - check if token exist or not
        const checkToken = await TokenDetails.findOne({
          where: {
            phone: finalAdmin.phone,
            userId: finalAdmin.id,
            parentId: null,
          },
        });

        if (checkToken) {
          //NOTE -update existing token
          await TokenDetails.update(
            {
              userId: finalAdmin.id,
              phone: finalAdmin.phone,
              type: finalAdmin?.permission_role?.role,
              token: token,
              expiry: await getTokenExpiryTime(),
            },
            { where: { id: checkToken.id } }
          );
        } else {
          //NOTE - push token details
          await TokenDetails.create({
            userId: finalAdmin.id,
            phone: finalAdmin.phone,
            type: finalAdmin?.permission_role?.role,
            token: token,
            expiry: await getTokenExpiryTime(),
          });
        }

        return res.status(200).send({
          status: 200,
          message: msg.OTP_VERIFIED,
          loginStatus: status,
          accessToken: token,
        });
      } else if (status === true && (foundUser || foundUser === null)) {
        return res.status(200).send({
          status: 200,
          message: msg.OTP_VERIFIED,
        });
      } else if (status === false && foundUser) {
        return res.status(409).send({
          status: 409,
          message: msg.OTP_NOT_VERIFIED,
        });
      }
    } else {
      if (status === true && foundUser.length > 1) {
        const allUsers = await UserDetails.findAll({
          where: { phone: req.body.phone, type: "Student", status: 1 },
          attributes: ["id", "name", "studentType"],
          include: {
            model: StudentDetails,
            attributes: ["boardId", "classId"],
            include: [
              { model: Boards, attributes: ["name"] },
              { model: Class, attributes: ["name"] },
            ],
          },
        });

        //NOTE - push result
        const result = allUsers.map((data) => ({
          id: data.id,
          name: data.name,
          studentType: data.studentType,
          board: data.student?.board?.name,
          class: data.student?.class?.name,
        }));

        return res.status(200).send({
          status: 200,
          message: msg.OTP_VERIFIED,
          loginStatus: status,
          data: result,
        });
      } else if (status === true && foundUser === 1) {
        const users = await UserDetails.findOne({
          where: { phone: req.body.phone, status: 1 },
        });
        const token = jwt.sign(
          { id: users.id, role: users.type, phone: users.phone },
          config.SECRET_KEY,
          { expiresIn: "10d" }
        );

        //NOTE - check if token exist or not
        const checkToken = await TokenDetails.findOne({
          where: { phone: users.phone, userId: users.id, parentId: null },
        });

        if (checkToken) {
          //NOTE -update existing token
          await TokenDetails.update(
            {
              userId: users.id,
              phone: users.phone,
              type: ["Secondary", "secondary"].includes(users.studentType)
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
            userId: users.id,
            phone: users.phone,
            type: ["Secondary", "secondary"].includes(users.studentType)
              ? "Secondary"
              : null,
            token: token,
            expiry: await getTokenExpiryTime(),
          });
        }

        //NOTE - push device type and device token
        if (deviceType && deviceToken) {
          //NOTE - Check if device token  is there or not
          const checkDeveice = await DeviceToken.findOne({
            where: { userId: users.id },
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
                userId: users.id,
                webToken: deviceToken,
                deviceType: deviceType,
              });
            } else if (["Android"].includes(deviceType)) {
              await DeviceToken.create({
                userId: users.id,
                andriodDeviceToken: deviceToken,
                deviceType: deviceType,
              });
            } else if (["Ios"].includes(deviceType)) {
              await DeviceToken.create({
                userId: users.id,
                iosDeviceToken: deviceToken,
                deviceType: deviceType,
              });
            }
          }
        }

        return res.status(200).send({
          status: 200,
          message: msg.OTP_VERIFIED,
          loginStatus: status,
          userId: users.id,
          accessToken: token,
        });
      } else if (status === true && foundUser === 0) {
        const token = jwt.sign({ phone: req.body.phone }, config.SECRET_KEY);

        //NOTE - check if token exist or not
        const checkToken = await TokenDetails.findOne({
          where: { phone: req.body.phone },
        });

        if (checkToken) {
          //NOTE -update existing token
          await TokenDetails.update(
            {
              phone: req.body.phone,
              userId: null,
              type: null,
              token: token,
              expiry: await getTokenExpiryTime(),
            },
            { where: { phone: req.body.phone } }
          );
        } else {
          //NOTE - push token details
          await TokenDetails.create({
            phone: req.body.phone,
            userId: null,
            type: null,
            token: token,
            expiry: await getTokenExpiryTime(),
          });
        }

        return res.status(200).send({
          status: 200,
          message: msg.OTP_VERIFIED,
          loginStatus: false,
          accessToken: token,
        });
      } else {
        return res.status(400).send({
          status: 400,
          message: msg.OTP_NOT_VERIFIED,
        });
      }
    }
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - User sign up
const usersSignUp = async (req, res) => {
  try {
    const {
      primaryId,
      name,
      email,
      phone,
      mPin,
      type,
      dob,
      gender,
      pincode,
      courseId,
      boardId,
      classId,
      batchTypeId,
      batchStartDateId,
      studentType,
      recommendReferralCode,
      deviceType,
      deviceToken,
    } = req.body;

    //NOTE - Calculate the difference between the parsed date and today's date in years
    const diffInYears = moment().diff(moment(dob), "years");
    //NOTE - Check if the difference is less than 9 years
    if (diffInYears < 9) {
      return res.json({ status: 400, message: msg.DOB_GREATER_THEN_VALUE });
    }
    //NOTE - check if phone is unique or not
    const { phoneValue, userCount } = await validateUser(phone, studentType);
    //NOTE - encrypt Mpin
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(mPin, salt);

    if (phoneValue === false && userCount === false) {
      if (["Student", "student"].includes(type)) {
        const studentData = new StudentDetails({
          dob: dob,
          gender: gender,
          pincode: pincode,
          courseId: courseId,
          boardId: boardId,
          classId: classId,
          batchTypeId: batchTypeId,
          batchStartDateId: batchStartDateId,
          referralCode: Math.random()
            .toString(36)
            .substring(2, 10)
            .toUpperCase(), //TODO - Generate referralCode
          recommendReferralCode: recommendReferralCode || null,
          avatar: await getDefaultImage(gender),
        });
        const getStudent = await studentData.save();

        const user = new UserDetails({
          name: name,
          email: email,
          phone: phone,
          mPin: hashedPassword,
          studentType: studentType,
          type: type,
          typeId: getStudent.id,
          profilePercentage: 50,
        });
        const getUser = await user.save();

        //NOTE - update the veda user id
        UserDetails.update(
          {
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
          await parentStudentmap.create({
            parentId: parentUser.id,
            studentId: getUser.id,
            relationship: "Father",
          });
        }

        //NOTE - user plan of subscription
        await studentPlanMap.create({
          userId: getUser.id,
          subscriptionType: "Free",
          entryType: "Manually",
        });

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
                //NOTE - the student who use other student referal code
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

        if (["Secondary", "secondary"].includes(studentType)) {
          //NOTE - create the relation between primary student and Secondary student
          const Studentmap = new StudentMap({
            primaryId: primaryId,
            secondaryId: getUser.id,
          });
          await Studentmap.save();
        }

        //NOTE - generate token
        const token = jwt.sign(
          { id: getUser.id, role: getUser.type, phone: getUser.phone },
          config.SECRET_KEY,
          { expiresIn: "10d" }
        );

        if (["Primary", "primary"].includes(studentType)) {
          const check_token = await TokenDetails.findOne({
            where: { phone: getUser.phone, userId: null, type: null },
          });

          //NOTE - push generated token
          await TokenDetails.update(
            {
              phone: getUser.phone,
              userId: getUser.id,
              type: null,
              token: token,
              expiry: await getTokenExpiryTime(),
            },
            { where: { id: check_token.id } }
          );
        } else {
          //NOTE - push generated token
          await TokenDetails.create({
            phone: getUser.phone,
            userId: getUser.id,
            type: null,
            token: token,
            expiry: await getTokenExpiryTime(),
          });
        }

        //NOTE - Push device type and device token
        if (deviceType && deviceToken) {
          //NOTE - Check if device token  is there or not
          const checkDeveice = await DeviceToken.findOne({
            where: { userId: getUser.id },
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
                userId: getUser.id,
                webToken: deviceToken,
                deviceType: deviceType,
              });
            } else if (["Android"].includes(deviceType)) {
              await DeviceToken.create({
                userId: getUser.id,
                andriodDeviceToken: deviceToken,
                deviceType: deviceType,
              });
            } else if (["Ios"].includes(deviceType)) {
              await DeviceToken.create({
                userId: getUser.id,
                iosDeviceToken: deviceToken,
                deviceType: deviceType,
              });
            }
          }
        }

        //NOTE - get all details using batch
        const batchDetail = await bathDetails(batchTypeId);

        //NOTE - lead sourse
        let source = deviceType === "Web" ? "WebApp" : "App Download";

        //NOTE - lead capture
        await captureLead(
          apiKey,
          clientSecret,
          host,
          name,
          batchDetail.course.name,
          batchDetail.board.name,
          batchDetail.class.name,
          phone,
          source
        );

        //NOTE - final push
        return res.status(200).send({
          status: 200,
          message: msg.USER_CREATED_SUCCESS_WITH_OTP,
          accessToken: token,
          data: getUser.id,
          loginStatus: true,
        });
      }
    } else if (phoneValue === true) {
      return res.status(400).send({
        //NOTE - If try to sign up primary user and , phone number already exist
        status: 400,
        message: msg.DUPLICATE_PHONE,
      });
    } else if (userCount === true) {
      //NOTE - If try to sign up secondary user, and with the same number there is already 5 account
      return res.status(400).send({
        status: 400,
        message: msg.USER_EXCEED,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR -User Login with mpin
const userLoginWithMpin = async (req, res) => {
  try {
    const { phone, mPin, deviceType, deviceToken } = req.body;
    const foundUser = await UserDetails.findOne({
      where: { phone: phone, type: "Student", status: 1 },
    });
    if (!foundUser)
      return res
        .status(400)
        .send({ status: 400, message: msg.USER_NOT_REGISTERED });
    const isMatch = await bcrypt.compare(mPin, foundUser.mPin);

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

    if (isMatch) {
      const token = jwt.sign(
        { id: foundUser.id, role: foundUser.type, phone: foundUser.phone },
        config.SECRET_KEY,
        { expiresIn: "10d" }
      );

      const checkToken = await TokenDetails.findOne({
        where: { phone: foundUser.phone, userId: foundUser.id, parentId: null },
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

      
      //NOTE - final response
      let final = {
        Id: foundUser.id,
        accessToken: token,
        phone: foundUser.phone,
        loginStatus: true,
      };

      //NOTE - leadsquard post activity
      let retriveData;
      retriveData = await retriveLeads(apiKey, clientSecret, host, phone);

      //NOTE - get user details and post activity
      const userDetail = await userDetails(foundUser.id);

      if (retriveData.length < 1) {
        //NOTE - lead capture
        await captureLead(
          apiKey,
          clientSecret,
          host,
          userDetail.name,
          userDetail.student.course.name,
          userDetail.student.board.name,
          userDetail.student.class.name,
          userDetail.phone
        );
      }

      //NOTE - if lead capture for user
      if (retriveData.length < 1) {
        retriveData = await retriveLeads(apiKey, clientSecret, host, phone);
      }

      //NOTE - create activity for user
      await createActivity(
        apiKey,
        clientSecret,
        host,
        phone,
        retriveData[0].ProspectID,
        userDetail.name,
        userDetail.student.class.name,
        userDetail.student.course.name,
        userDetail.student.board.name
      );

      //NOTE - final response return
      return res.status(200).send({
        status: 200,
        message: msg.USER_LOGIN_SUCCESS,
        data: final,
      });
    } else {
      //NOTE - if login credential is wrong or invalid
      return res.status(400).send({
        status: 400,
        message: msg.INVALID_LOGIN_CREDENTIAL,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - User Login with user id
const loginWithUsersId = async (req, res) => {
  try {
    let { userId, studentType, deviceType, deviceToken } = req.body;
    const foundUser = await UserDetails.findOne({
      where: { id: userId, studentType: studentType, status: 1 },
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
        },
        config.SECRET_KEY,
        { expiresIn: "10d" }
      );

      //NOTE - check if token exist or not
      const checkToken = await TokenDetails.findOne({
        where: { phone: foundUser.phone, userId: foundUser.id, parentId: null },
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
      //NOTE - leadsquard post activity
      let retriveData;
      retriveData = await retriveLeads(
        apiKey,
        clientSecret,
        host,
        foundUser.phone
      );

      //NOTE - get user details and post activity
      const userDetail = await userDetails(foundUser.id);

      if (retriveData.length < 1) {
        //NOTE - lead capture
        await captureLead(
          apiKey,
          clientSecret,
          host,
          userDetail.name,
          userDetail.student.course.name,
          userDetail.student.board.name,
          userDetail.student.class.name,
          userDetail.phone
        );
      }

      //NOTE - if lead capture for user
      if (retriveData.length < 1) {
        retriveData = await retriveLeads(
          apiKey,
          clientSecret,
          host,
          foundUser.phone
        );
      }

      //NOTE - create activity for user
      await createActivity(
        apiKey,
        clientSecret,
        host,
        foundUser.phone,
        retriveData[0].ProspectID,
        userDetail.name,
        userDetail.student.class.name,
        userDetail.student.course.name,
        userDetail.student.board.name
      );

      //NOTE - return final response
      return res.status(200).send({
        status: 200,
        message: msg.USER_LOGIN_SUCCESS,
        loginStatus: true,
        accessToken: token,
        data: foundUser.id,
      });
    } else {
      //NOTE - if user invalid credential
      return res.status(400).send({
        status: 400,
        message: msg.INVALID_LOGIN_CREDENTIAL,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR -update mPin
const updateUserMPin = async (req, res) => {
  try {
    const { mPin, token } = req.body;

    const decoded = jwt.verify(token, config.SECRET_KEY);
    const getUserDetails = await UserDetails.findOne({
      where: { id: decoded.id },
    });
    if (!getUserDetails)
      return res.status(400).send({ status: 400, message: msg.ID_NOT_FOUND });

    //NOTE - HASH PASSWORD
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(mPin, salt);

    await UserDetails.update(
      { mPin: hashedPassword },
      { where: { id: decoded.id } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.MPIN_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - Delete Student By Id
//TODO - Use only for Testing
const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    //NOTE - Find User details
    const user = await UserDetails.findOne({
      where: { id: userId },
    });

    //NOTE - Find secondary User details if , deleted student is a primary student
    const secondaryUser = await UserDetails.findAll({
      where: { phone: user.phone, studentType: "Secondary" },
    });

    if (!user)
      return res.status(400).send({ status: 400, message: msg.NOT_FOUND });

    if (["Student", "student"].includes(user.type)) {
      //NOTE - destroy student parent mapping
      await StudentParentMap.destroy({
        where: {
          studentId: user.id,
        },
      });

      //NOTE - destroy student details from student table
      await StudentDetails.destroy({
        where: {
          id: user.typeId,
        },
      });

      //NOTE - destroy student details from User table
      await UserDetails.destroy({
        where: {
          id: user.id,
        },
      });
      if (secondaryUser) {
        for (const data of secondaryUser) {
          //NOTE - destroy student details from student table
          await StudentDetails.destroy({
            where: {
              id: data.typeId,
            },
          });

          //NOTE - destroy student details from User table
          await UserDetails.destroy({
            where: {
              id: data.id,
            },
          });

          //NOTE - destroy student details from student secondar map table
          await StudentMap.destroy({
            where: {
              primaryId: user.id,
              secondaryId: data.id,
            },
          });
        }
      }
    } else if (["Parent", "parent"].includes(user.type)) {
      //NOTE - destroy student parent mapping
      await StudentParentMap.destroy({
        where: {
          parentId: user.id,
        },
      });

      //NOTE - destroy parent details from parent table
      await ParentDetails.destroy({
        where: {
          id: user.typeId,
        },
      });

      //NOTE - destroy parent details from User table
      await UserDetails.destroy({
        where: {
          id: user.id,
        },
      });
    }

    return res.status(200).send({ status: 200, message: msg.USER_DELETED });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//NOTE get batchType by all ids
const getStudentByBatchTypeId = async (req, res) => {
  try {
    const { courseId, boardId, classId, batchTypeId } = req.body;
    let students = [];

    //NOTE - get student details
    const getStudentDetails = await StudentDetails.findAll({
      where: { courseId, boardId, classId, batchTypeId },
      include: [
        { model: Course, attributes: ["name"] },
        { model: Boards, attributes: ["name"] },
        { model: Class, attributes: ["name"] },
        { model: batchType, attributes: ["name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    const studentIds = getStudentDetails.map((data) => data.id);

    //NOTE - get user details
    const getUserDetails = await UserDetails.findAll({
      where: {
        typeId: { [Sequelize.Op.in]: studentIds },
      },
    });

    //NOTE - get user details
    const userDetailsMap = getUserDetails.reduce((map, userDetails) => {
      map[userDetails.typeId] = userDetails;
      return map;
    }, {});

    //NOTE - final push
    for (let data of getStudentDetails) {
      const userDetails = userDetailsMap[data.id];
      if (userDetails !== undefined && userDetails) {
        students.push({
          id: userDetails.id,
          name: userDetails.name,
          avatar: data?.avatar,
          dob: data?.dob,
          gender: data?.gender,
          phone: userDetails.phone,
          courseId: data.courseId,
          course: data.course.name,
          boardId: data.boardId,
          board: data.board.name,
          classId: data.classId,
          class: data.class.name,
          batchTypeId: data.batchTypeId,
          batchType: data.batchType.name,
        });
      }
    }

    //NOTE - return response
    return res.status(200).send({
      status: 200,
      message: msg.FOUND_DATA,
      data: students,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

//ANCHOR - User generate token for add secondary user
const generateToken = async (req, res) => {
  try {
    let { userId } = req.body;

    const foundUser = await UserDetails.findOne({
      where: { id: userId, status: 1 },
    });
    if (!foundUser) {
      return res.status(400).send({ status: 400, message: msg.INVALID_USER });
    }

    const token = jwt.sign({ phone: foundUser.phone }, config.SECRET_KEY);

    const checkPhone = await TokenDetails.findOne({
      where: { phone: foundUser.phone, userId: foundUser.id },
    });

    if (checkPhone === null) {
      await TokenDetails.create({
        phone: foundUser.phone,
        userId: foundUser.id,
        type: "secondary",
        token: token,
      });
    } else {
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
        { where: { phone: foundUser.phone, type: "secondary" || "Secondary" } }
      );
    }

    return res.status(200).send({
      message: msg.FOUND_DATA,
      status: true,
      accessToken: token,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - update mPin by user id
const updateUserMPinById = async (req, res) => {
  try {
    const { mPin, id } = req.body;

    //NOTE - id from token
    const token = req.user.id;

    //NOTE - FIND USER
    const getUserDetails = await UserDetails.findOne({
      where: { id: id, status: 1 },
    });
    if (!getUserDetails)
      return res.status(400).send({ status: 400, message: msg.ID_NOT_FOUND });

    //NOTE - HASH PASSWORD
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(mPin, salt);

    //NOTE - FINAL UPDATE USER mPIN
    await UserDetails.update(
      { mPin: hashedPassword, updatedById: token },
      { where: { id: id } }
    );

    return res.status(200).send({
      status: 200,
      message: msg.MPIN_UPDATED,
    });
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

module.exports = {
  generateOtp,
  verifyMobileOtp,
  usersSignUp,
  userLoginWithMpin,
  loginWithUsersId,
  updateUserMPin,
  generateToken,
  deleteUserById,
  getStudentByBatchTypeId,
  updateUserMPinById,
};
