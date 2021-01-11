const jwt = require('jsonwebtoken');
const constants = require('../config/constants');
var jsonFormat = async (res, status, message, data, extra = "") => {
    var output = {
        "status": status,
        "message": message,
        "data": data
    };
    if (extra != "") {
        output.extra = extra;
    }
    res.status(status);
    return res.json(output);
}

// To Generate Random Alphanumberic String
var randomString = (length) => {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

var jwtsignHelper = async (email, id) => {
    let token = jwt.sign(
        { email: email, userId: id.toString() },
        constants.JWT_SECRET,
        { expiresIn: '1h' }
    );
    console.log(token);
    return token;
}

var SendEmail = async (res, requestedData) => {

    var EmailTemplateModel = require("../models/EmailtemplateModel")

    var emailTemplateData = await EmailTemplateModel
        .query()
        .first()
        .select()
        .where("slug", requestedData.slug);

    let language_content = emailTemplateData.all_content["en"].content;
    let language_subject = emailTemplateData.all_content["en"].subject;

    var object = {};

    if (requestedData.user.email != undefined && requestedData.user.email != null) {
        object.recipientName = requestedData.user.email;
    }

    if (requestedData.token && requestedData.token != null) {
        object.token = requestedData.token;
    }

    language_content = await module.exports.formatEmail(language_content, object);

    try {
        await res.mailer
            .send("emails/general_mail.ejs", {
                to: requestedData.user.email,
                subject: language_subject,
                content: (language_content),
                PROJECT_NAME: process.env.PROJECT_NAME,
                SITE_URL: process.env.SITE_URL,
                homelink: process.env.SITE_URL
            }, function (err) {
                console.log(err);
                if (err) {
                    return 0;
                } else {
                    return 1;
                }
            });
    } catch (err) {
        console.log("EMail err:", err);
        return 0;
    }
}

// Format Email
var formatEmail = async (emailContent, data) => {
    let rex = /{{([^}]+)}}/g;
    let key;
    // console.log("data", JSON.stringify(data));
    if ("object" in data) {
        data = data.object;
    }
    var tempEmailContent = emailContent;
    while (key = rex.exec(emailContent)) {
        var temp_var = '';
        if (Array.isArray(data[key[1]])) {
            temp_var = ''
            data[key[1]].forEach(function (each, index) {
                temp_var += JSON.stringify(each) + '<br>'
            })
        } else {
            temp_var = data[key[1]];
        }
        // tempEmailContent = tempEmailContent.replace(key[0], data[key[1]] ? data[key[1]] : '');
        tempEmailContent = tempEmailContent.replace(key[0], data[key[1]] ? temp_var : '');
    }
    // console.log("tempEmailContent", tempEmailContent)
    return tempEmailContent;
}




var FileUpload = (files, storepath) => {
    return new Promise(async (resolve, reject) => {
        var path = require('path');
        var fs = require('fs');
        let image = files;
        let extention = path.extname(image.name)
        let timestamp = new Date().getTime().toString();
        let newImageName = (timestamp + extention);


        if (!fs.existsSync("public/" + storepath)) {
            await fs.mkdirSync("public/" + storepath);
        }
        var newFile = storepath + newImageName;
        await image.mv("public/" + newFile, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(newFile);
            }
        });
    });
}



module.exports = {
    jsonFormat,
    randomString,
    SendEmail,
    FileUpload,
    formatEmail,
    jwtsignHelper
}

