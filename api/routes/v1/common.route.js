var express = require('express');
var app = express();

var admin = require('./admin.route');

app.prefix('/admin', function (router) { // Any route
    router.use('/', admin);
});

module.exports = app;
