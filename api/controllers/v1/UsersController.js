var bcrypt = require('bcryptjs');
var i18n = require("i18n");
const jwt = require('jsonwebtoken');
const { Validator } = require('node-input-validator');
const moment = require('moment');
var randomize = require('randomatic');
var requestIp = require('request-ip');
const constants = require('../../config/constants');
var Helper = require("../../helpers/helper");
var generator = require('generate-password');

// Controllers
var { AppController } = require('./AppController');

// Models
const UsersModel = require('../../models/UsersModel');
const OrganizationModel = require('../../models/OrganizationsModel');
const UserOrganizationModel = require("../../models/OrganizationUsersModel");
const OrganizationUsersModel = require('../../models/OrganizationUsersModel');

class UsersController extends AppController {

    constructor() {
        super()
    }

    async getUserListing(req, res) {
        try {

            var pagenumber = (req.query.pagenumber) ? (req.query.pagenumber) : (1);
            var limit = (req.query.limit) ? (req.query.limit) : (constants.LIMIT_PER_PAGE);

            var sorting
            if (req.body.sortCol && req.body.sortVal) {
                sorting = ` users.${sortCol} ${sortVal}`;
            } else {
                sorting = `users.created_at DESC`;
            }

            var getCelebrityData = await UsersModel
                .query()
                .select("users.*")
                .withGraphFetched("languages_user(langauge_name)")
                .modifiers({
                    langauge_name(builder) {
                        builder.select('name');
                    },
                })
                .leftJoin("organizationsuser", "organizationsuser.user_id", "users.id")
                .leftJoin("organizations", "organizations.id", "organizationsuser.organization_id")
                .where("users.role_id", "!=", 1)
                .andWhere("users.deleted_at", null)
                .andWhere(builder => {
                    if (req.body.query_search) {
                        builder.where("users.email", "LIKE", '%' + req.body.query_search + '%')
                            .orWhere("users.first_name", "LIKE", '%' + req.body.query_search + '%')
                            .orWhere("users.last_name", "LIKE", '%' + req.body.query_search + '%')
                            .orWhere("organizations.name", "LIKE", '%' + req.body.query_search + '%')
                    }
                })
                .andWhere(builder => {
                    if (req.body.status) {
                        builder.where("users.is_active", req.body.status)
                    }
                })
                .page(parseInt(pagenumber - 1), limit)
                .orderByRaw(sorting);

            return res
                .status(constants.SUCCESS_CODE)
                .json({
                    "status": constants.SUCCESS_CODE,
                    "message": i18n.__("Celebrity list success").message,
                    "data": getCelebrityData.results,
                    "total": getCelebrityData.total
                });

        } catch (error) {
            console.log("error", error);
            return Helper.jsonFormat(res, constants.SERVER_ERROR_CODE, i18n.__("SERVER_ERROR").message, []);
        }
    }

    async addUser(req, res) {
        try {

            var req_body = req.body;

            var getUserDataEmail = await UsersModel
                .query()
                .first()
                .select()
                .where("deleted_at", null)
                .andWhere("email", req_body.email)

            if (getUserDataEmail != undefined) {
                return Helper.jsonFormat(res, constants.BAD_REQUEST_CODE, i18n.__("Email already found"), []);
            }

            let time = moment().utc().add(process.env.TOKEN_DURATION, 'minutes').format();

            var organization_name = req_body.organization_name

            delete req_body.organization_name;

            var addUser = await UsersModel
                .query()
                .insertAndFetch({
                    ...req_body,
                    created_at: new Date(),
                    role_id: 2,
                    forgot_password_token_expiry_time: time,
                    forgot_password_token: randomize('Aa0', 6)
                })

            if (organization_name != null) {
                var getOrganizationDetails = await OrganizationModel
                    .query()
                    .select()
                    .where("name", "LIKE", '%' + organization_name + '%')

                console.log("getOrganizationDetails", getOrganizationDetails)

                if (getOrganizationDetails != undefined) {
                    var addOrganizationData = await UserOrganizationModel
                        .query()
                        .insertAndFetch({
                            "user_id": addUser.id,
                            "organization_id": getOrganizationDetails[0].id
                        })
                }
            }

            addUser.first_name = addUser.username;

            // Email
            var allData = {
                slug: 'welcome_email',
                user: addUser,
                token: "http://" + process.env.API_URL + addUser.forgot_password_token
            }

            await Helper.SendEmail(res, allData);

            return Helper.jsonFormat(res, constants.SUCCESS_CODE, i18n.__("User Added Success"), addUser);

        } catch (error) {
            console.log("error", error)
            return Helper.jsonFormat(res, constants.SERVER_ERROR_CODE, i18n.__("SERVER_ERROR"), []);
        }
    }

    async changeUserStatus(req, res) {
        try {

            var id = req.body.id;

            var userData = await UsersModel
                .query()
                .first()
                .select()
                .where("id", id);

            if (userData == undefined) {
                return res
                    .status(constants.SUCCESS_CODE)
                    .json({
                        "status": constants.SUCCESS_CODE,
                        "message": i18n.__("User not found")
                    })
            }

            var changeUserData = await userData
                .$query()
                .updateAndFetch({
                    "is_active": (userData.is_active == true) ? (false) : (true)
                });

            return res
                .status(constants.SUCCESS_CODE)
                .json({
                    "status": constants.SUCCESS_CODE,
                    "message": i18n.__("User update success"),
                    "data": changeUserData
                })

        } catch (error) {
            console.log("error", error);
            return Helper.jsonFormat(res, constants.SERVER_ERROR_CODE, i18n.__("SERVER_ERROR").message, []);
        }
    }

    async deleteUser(req, res) {
        try {

            var id = req.body.id;

            var userData = await UsersModel
                .query()
                .first()
                .select()
                .where("id", id);

            if (userData == undefined) {
                return res
                    .status(constants.SUCCESS_CODE)
                    .json({
                        "status": constants.SUCCESS_CODE,
                        "message": i18n.__("User not found")
                    })
            }

            var changeUserData = await userData
                .$query()
                .updateAndFetch({
                    "deleted_at": new Date()
                });

            return res
                .status(constants.SUCCESS_CODE)
                .json({
                    "status": constants.SUCCESS_CODE,
                    "message": i18n.__("User delete success"),
                    "data": changeUserData
                })

        } catch (error) {
            console.log("error", error);
            return Helper.jsonFormat(res, constants.SERVER_ERROR_CODE, i18n.__("SERVER_ERROR").message, []);
        }
    }

    async updateUserDetails(req, res) {
        try {

            var id = req.body.id;

            var userData = await UsersModel
                .query()
                .first()
                .select()
                .where("id", id);

            if (userData == undefined) {
                return res
                    .status(constants.SUCCESS_CODE)
                    .json({
                        "status": constants.SUCCESS_CODE,
                        "message": i18n.__("User not found")
                    })
            }

            if (req.body.organization_name) {
                var deleteNameDetails = await OrganizationUsersModel
                    .query()
                    .where("user_id", id)
                    .reallyDelete();

                var getOrganizationDetails = await OrganizationModel
                    .query()
                    .select()
                    .where("name", "LIKE", '%' + req.body.organization_name + '%')

                if (getOrganizationDetails != undefined) {
                    var addOrganizationData = await UserOrganizationModel
                        .query()
                        .insertAndFetch({
                            "user_id": id,
                            "organization_id": getOrganizationDetails[0].id
                        })
                }

                delete req.body.organization_name
            }

            var updateUserDetails = await userData
                .$query()
                .updateAndFetch({
                    ...req.body
                });

            return res
                .status(constants.SUCCESS_CODE)
                .json({
                    "status": constants.SUCCESS_CODE,
                    "message": i18n.__("User update success"),
                    "data": updateUserDetails
                })


        } catch (error) {
            console.log("error", error);
            return Helper.jsonFormat(res, constants.SERVER_ERROR_CODE, i18n.__("SERVER_ERROR").message, []);
        }
    }

}

module.exports = new UsersController()