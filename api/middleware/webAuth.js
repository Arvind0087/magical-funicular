const jwt = require("jsonwebtoken");
const msg = require("../constants/Messages");
const { Response } = require("../helpers/response.helper");
const { config } = require("../config/db.config");

const webVerifyToken = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return Response(res, 401, msg.TOKEN_REQUIRED);
    }

    const decoded = jwt.verify(token, config.SECRET_KEY, (err, data) => {
      if (err) return err;
      return data;
    });

    if (!decoded || decoded.phone === undefined) {
      return Response(res, 401, msg.TOKEN_INVALID);
    }

    req.user = decoded;

    return next();
  } catch (err) {
    return Response(res, 500, "Something Went Wrong", []);
  }
};

module.exports = { webVerifyToken };
