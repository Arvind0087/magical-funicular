const jwt = require("jsonwebtoken");
const db = require("../../../models/index");
const msg = require("../../../constants/Messages");
const {
  generateOTP,
  sendOtp,
  verifyParentOtp,
  getTokenExpiryTime,
} = require("./service");
const { config } = require("../../../config/db.config");
const bcrypt = require("bcryptjs");
const ParentUser = db.users;
const TokenDetails = db.mobile_token_map;
const UserDetails = db.users;

//ANCHOR - Generate OTP
const parentgenerateOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone)
      return res.status(400).send({ status: 400, message: msg.REQUIRED_PHONE });

    //NOTE - find parent deatils
    const user = await ParentUser.findOne({
      where: { phone: phone, type: "Parent", status: 1 },
    });

    if (!user)
      return res.status(400).send({ status: 400, message: msg.INVALID_USER });

    const getOtp = await generateOTP(user);

    await sendOtp(user.phone, getOtp);
    return res.status(200).send({
      status: 200,
      message: msg.USER_OTP_SUCCESS,
      data: getOtp,
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - Verify OTP
const parentVerifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    //NOTE - find parent deatils
    const user = await ParentUser.findOne({
      where: { phone, type: "Parent", status: 1 },
    });

    if (!user)
      return res.status(400).send({ status: 400, message: msg.INVALID_USER });

    const status = await verifyParentOtp(user, otp);

    if (status === true) {
      const token = jwt.sign(
        { id: user.id, role: user.type, phone: user.phone },
        config.SECRET_KEY,
        {
          expiresIn: "10d",
        }
      );

      //NOTE - check if token exist or not
      const checkToken = await TokenDetails.findOne({
        where: { phone: user.phone, userId: user.id },
      });

      if (checkToken) {
        //NOTE -update existing token
        await TokenDetails.update(
          {
            userId: user.id,
            phone: user.phone,
            type: "Parent",
            token: token,
            expiry: await getTokenExpiryTime(),
          },
          { where: { id: checkToken.id } }
        );
      } else {
        //NOTE - push token details
        await TokenDetails.create({
          userId: user.id,
          phone: user.phone,
          type: "Parent",
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
    } else {
      return res.status(400).send({
        status: 400,
        message: msg.OTP_NOT_VERIFIED,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

//ANCHOR - parent Login with mpin
const parentLoginWithMpin = async (req, res) => {
  try {
    const { phone, mPin } = req.body;
    const foundUser = await UserDetails.findOne({
      where: { phone: phone, studentType: "Primary", status: 1 },
    });
    if (!foundUser)
      return res
        .status(400)
        .send({ status: 400, message: msg.USER_NOT_REGISTERED });

    //NOTE - matching mpin
    const isMatch = await bcrypt.compare(String(mPin), foundUser.mPin);

    //NOTE - if mpin matching
    if (isMatch) {
      //NOTE - checking user parent details
      const UserParent = await UserDetails.findOne({
        where: { phone: foundUser.phone, type: "Parent", status: 1 },
      });
      if (!UserParent) {
        return res
          .status(400)
          .send({ status: 400, message: msg.PARENT_NOT_REGISTERED_CONTACT });
      }
      const token = jwt.sign(
        { id: UserParent.id, role: UserParent.type, phone: UserParent.phone },
        config.SECRET_KEY,
        { expiresIn: "10d" }
      );

      //NOTE - check if token exist or not
      const checkToken = await TokenDetails.findOne({
        where: { phone: UserParent.phone, userId: UserParent.id },
      });

      if (checkToken) {
        //NOTE -update existing token
        await TokenDetails.update(
          {
            userId: UserParent.id,
            phone: UserParent.phone,
            type: "Parent",
            token: token,
            expiry: await getTokenExpiryTime(),
          },
          { where: { id: checkToken.id } }
        );
      } else {
        //NOTE - push token details
        await TokenDetails.create({
          userId: UserParent.id,
          phone: UserParent.phone,
          type: "Parent",
          token: token,
          expiry: await getTokenExpiryTime(),
        });
      }

      //NOTE - final return
      let final = {
        Id: foundUser.id,
        accessToken: token,
        phone: foundUser.phone,
        loginStatus: true,
        parentId: UserParent.id,
      };

      return res.status(200).send({
        status: 200,
        message: msg.USER_LOGIN_SUCCESS,
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
  parentgenerateOtp,
  parentVerifyOtp,
  parentLoginWithMpin,
};
