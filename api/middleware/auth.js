const db = require("../models/index");
const jwt = require("jsonwebtoken");
const msg = require("../constants/Messages");
const { config } = require("../config/db.config");
const TokenDetails = db.mobile_token_map;

const verifyToken = async (req, res, next) => {
  try {
    //NOTE: Get the current date and time
    const now = new Date();

    //NOTE - get token
    const token = req.header("Authorization");

    //NOTE -  token not there
    if (!token)
      return res.status(401).send({
        status: 401,
        message: msg.TOKEN_REQUIRED,
      });

    let decoded;
    try {
      decoded = jwt.verify(token, config.SECRET_KEY);
    } catch (err) {
      return res.status(401).send({
        status: 401,
        message: msg.TOKEN_INVALID,
      });
    }

    //NOTE: Set the `parentId` condition dynamically
    const parentIdCondition = decoded.parentId || null;

    //NOTE: Check token
    const checkToken = await TokenDetails.findOne({
      where: {
        phone: decoded.phone,
        userId: decoded.id,
        parentId: parentIdCondition,
      },
    });

    if (
      !checkToken ||
      ["Primary", "Secondary", null].includes(checkToken.type)
    ) {
      if (
        !decoded ||
        decoded.id === undefined ||
        token !== checkToken.token ||
        now >= checkToken.expiry
      ) {
        return res.status(401).send({
          status: 401,
          message: msg.TOKEN_INVALID,
        });
      }
    }

    req.user = decoded;

    return next();
  } catch (error) {
    return res.status(500).send({ status: 500, message: error.message });
  }
};

module.exports = { verifyToken };
