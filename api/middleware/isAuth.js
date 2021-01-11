const jwt = require('jsonwebtoken');
var i18n = require("i18n");
const constants = require('../config/constants.js');
const Helper = require('../helpers/helper');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return Helper.jsonFormat(res, constants.BAD_REQUEST_CODE, i18n.__("UNAUTHORIZED_ACCESS"), []);
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, constants.JWT_SECRET);

    if (decodedToken.exp >= Date.now()) {
      return res.status(constants.FORBIDDEN_CODE).json({ "status": constants.FORBIDDEN_CODE, "message": i18n.__("TOKEN_EXPIRED") });
    }

  } catch (err) {
    if (err.expiredAt) {
      return res.status(constants.FORBIDDEN_CODE).json({ "status": constants.FORBIDDEN_CODE, "message": i18n.__("TOKEN_EXPIRED") });
    }
    return Helper.jsonFormat(res, constants.BAD_REQUEST_CODE, i18n.__("UNAUTHORIZED_ACCESS"), []);
  }
  if (!decodedToken) {
    return Helper.jsonFormat(res, constants.BAD_REQUEST_CODE, i18n.__("UNAUTHORIZED_ACCESS"), []);
  }
  req.userId = decodedToken.userId;
  next();
};
