var express = require('express');
var isAuth = require('../../middleware/isAuth');
var router = express.Router();

var AdminController = require('../../controllers/v1/AdminController');
var UsersController = require("../../controllers/v1/UsersController");

router.post('/login', AdminController.login);
router.post("/add-user", isAuth, UsersController.addUser);
router.post("/get-user-listing", isAuth, UsersController.getUserListing);
router.post("/update-user-status", isAuth, UsersController.changeUserStatus)
router.delete("/delete-user", isAuth, UsersController.deleteUser);
router.put("/update-user-details", isAuth, UsersController.updateUserDetails)

module.exports = router;