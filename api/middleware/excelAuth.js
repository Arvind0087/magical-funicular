const db = require("../models/index");
const jwt = require("jsonwebtoken");
const msg = require("../constants/Messages");
const { config } = require("../config/db.config");
const TokenDetails = db.mobile_token_map;

const excelVerifyToken = async (req, res, next) => {
  try {
    const token = req.query;

    //NOTE: Get the current date and time
    let now = new Date();

    //NOTE - If tokne is not there
    if (!token)
      return res.status(401).send({
        status: 401,
        message: msg.TOKEN_REQUIRED,
      });

    //NOTE - Decode token
    const decoded = jwt.verify(token.token, config.SECRET_KEY, (err, data) => {
      if (err) {
        return res.status(401).send({
          status: 401,
          message: msg.TOKEN_INVALID,
        });
      }
      return data;
    });

    //NOTE - check token expiry time
    const checkToken = await TokenDetails.findOne({
      where: { phone: decoded.phone, userId: decoded.id },
    });

    
    if (!checkToken)
      return res.status(401).send({
        status: 401,
        message: msg.TOKEN_INVALID,
      });

    if (["Primary", "Secondary", null].includes(checkToken.type))
      if (
        !decoded ||
        decoded.id === undefined ||
        token !== checkToken.token ||
        now.getTime() > checkToken.expiry.getTime()
      )
        return res.status(401).send({
          status: 401,
          message: msg.TOKEN_INVALID,
        });

    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

module.exports = { excelVerifyToken };
