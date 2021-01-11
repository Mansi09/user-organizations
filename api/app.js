const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const i18n = require("i18n");
var mailer = require('express-mailer');
var cors = require('cors');
const app = express();
dotenv.config();
express.application.prefix = express.Router.prefix = function (path, configure) {
  var router = express.Router();
  this.use(path, router);
  configure(router);
  return router;
};

i18n.configure({
  locales: ['en'],
  directory: __dirname + '/locales',
  register: global
});
app.use(i18n.init);
app.use(cors())

app.use(bodyParser.json({
  limit: "2.7mb",
  extended: false
}));
app.use(express.urlencoded({
  limit: "2.7mb",
  extended: false
})); // x-www-form-urlencoded <form>

// Set views folder for emails
app.set('views', __dirname + '/views');
// Set template engin for view files
app.set('view engine', 'ejs');

mailer.extend(app, {
  from: process.env.MAIL_FROM_NAME,
  host: process.env.MAIL_HOST, // hostname
  secureConnection: true, // use SSL
  port: 465, // port forSMTP
  auth: {
    user: process.env.MAIL_USER_NAME,
    pass: process.env.MAIL_PASSWORD
  },
  transportMethod: process.env.MAIL_TRANSPORT_METHOD
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api', require('./routes'));

app.use((error, req, res, next) => {
  console.log("ERROR:");
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.set('port', process.env.PORT);
console.log(process.env.PORT);
app.listen(app.get('port'), function () {
  console.log(process.env.PROJECT_NAME + " Application is running on " + process.env.PORT + " port....");
});