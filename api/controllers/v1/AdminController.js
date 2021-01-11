var bcrypt = require('bcryptjs');
var i18n = require("i18n");
const jwt = require('jsonwebtoken');
const { Validator } = require('node-input-validator');
const moment = require('moment');
var randomize = require('randomatic');
var requestIp = require('request-ip');
const constants = require('../../config/constants');
var Helper = require("../../helpers/helper");

// Controllers
var { AppController } = require('./AppController');

// Models
var AdminsModel = require('../../models/UsersModel');
var EmailtemplateModel = require("../../models/EmailtemplateModel");

class AuthContoller extends AppController {

  constructor() {
    super();
  }

  /**
  * Login
  * Used for Admin login in System
  *
  * @param {*} req It's contains email password
  * @param {*} res Login Success Message
  *
  * @returns object It's contains status_code, message and data including user data and jwt token
  */

  async login(req, res) {
    try {
      var req_body = req.body;
      console.log(req_body);
      let validator = new Validator(req_body, {
        email: 'required|email',
        password: 'required',
      });

      let matched = await validator.check();

      if (!matched) {
        for (var key in validator.errors) {
          return Helper.jsonFormat(res, constants.BAD_REQUEST_CODE, validator.errors[key].message, []);
        }
      }

      let getAdmindata = await AdminsModel
        .query()
        .select("email", "password", "id")
        .findOne({ email: req_body.email });

      if (getAdmindata != undefined && await bcrypt.compare(req_body.password, getAdmindata.password)) {
        var new_data = {
          user_id: getAdmindata.id,
          ip_address: requestIp.getClientIp(req)
        };

        let token = jwt.sign(
          { email: getAdmindata.email, userId: getAdmindata.id.toString() },
          constants.JWT_SECRET,
          { expiresIn: '1h' }
        );


        var data = {
          token: token,
          getAdmindata
        }
        return Helper.jsonFormat(res, constants.SUCCESS_CODE, i18n.__("ACCOUNT"), data);
      }
      return Helper.jsonFormat(res, constants.BAD_REQUEST_CODE, i18n.__("INVALID_CREDENTIALS"), []);
    } catch (err) {
      console.log(err);
      return Helper.jsonFormat(res, constants.SERVER_ERROR_CODE, i18n.__("SERVER_ERROR"), []);
    }
  }

  /**
  * Forgot Password
  * Used for Admin Forgot Password in QuiverX
  *
  * @param {*} req It's contains email
  * @param {*} res Admin forgot password success
  *
  * @returns object It's contains status_code and message
  */
  async adminForgotPassword(req, res) {
    try {
      var req_body = req.body;
      let validator = new Validator(req_body, {
        email: 'required|email'
      });

      let matched = await validator.check();
      if (!matched) {
        for (var key in validator.errors) {
          return Helper.jsonFormat(res, constants.BAD_REQUEST_CODE, validator.errors[key].message, []);
        }
      }

      let getUserExist = await AdminsModel
        .query()
        .findOne({ 'email': req_body.email });

      if (!getUserExist) {
        return Helper.jsonFormat(res, constants.SERVER_ERROR_CODE, i18n.__("ACCOUNT_NOT_FOUND"), []);
      }

      let time = moment().utc().add(process.env.TOKEN_DURATION, 'minutes').format();
      var updateData = {
        forgot_password_token_expiry_time: time,
        forgot_password_token: randomize('Aa0', 10)
      };

      var userResult = await getUserExist
        .$query()
        .patch(updateData);
      console.log("getUserExist", getUserExist);

      if (userResult) {
        var get_user = getUserExist;
        var emailData = await EmailtemplateModel
          .query()
          .first()
          .where('slug', "forgot_password");

        let emailContent = emailData
          .all_content["en"]
          .content
          .replace("%usernam%", (get_user.email));

        emailContent = emailContent.replace('%product_name%', process.env.PROJECT_NAME);
        emailContent = emailContent.replace('%reset_link%', process.env.SITE_URL + "/api/v1/auth/reset_password/" + updateData.forgot_password_token);
        emailContent = emailContent.replace('%product_name%', process.env.PROJECT_NAME);

        get_user.first_name = get_user.email;

        // Email
        var allData = {
          slug: 'forgot_password',
          user: get_user,
          token: process.env.API_URL + "reset-password/" + updateData.forgot_password_token
        }
        await Helper.SendEmail(res, allData);
        // Ends

        return Helper.jsonFormat(res, constants.SUCCESS_CODE, i18n.__("FORGOT_PASSWORD"), get_user);
      } else {
        return Helper.jsonFormat(res, constants.SERVER_ERROR_CODE, i18n.__("SERVER_ERROR"), []);
      }

    } catch (error) {
      console.log("error", error);
      return Helper.jsonFormat(res, constants.SERVER_ERROR_CODE, i18n.__("SERVER_ERROR"), []);
    }
  }


}

module.exports = new AuthContoller();
