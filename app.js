// Initialize variables
// var mongoose = require('mongoose');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var multer = require('multer');
var passport = require('passport');
var responseTime = require('response-time');
var compression = require('compression')
// DB Config
var db = require("./config/keys");
var conn = require('./db/conn').getmongoConn(db.mongoURI);
var User = require("./models/User");
var config = "";

//basic auth
var basicAuth = require('express-basic-auth')



// Express Cache

// var cache = require('express-redis-cache')({
//     host: db.redisHost, //Redis Host
//     port: db.redisPort //Redis Port
//   });


//Router
// const users = require("./routes/api/users");
var router = require("./routes/index");

// Passport config
require("./config/passport")(passport, config, conn, User);

var app = express();
// Passport middleware
app.use(passport.initialize());
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

//app.use(compression());


//Basic auth

app.use('*/users/otp/fetch', basicAuth({
  challenge: true,
  users: {
    'edrahicaptain': 'edrahi@123#',
  }
}))




//Cors
//app.use(cors());
app.use(cors());
//app.options('*', cors());

app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // next();
  res.header("Access-Control-Allow-Origin", "*");
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  next();
});

app.use(responseTime());

// Routes
app.get("/", function (req, res) {
  res.json({ message: "Success!" });
});

router.addAPI("/api/v0", app, passport);

// app.use("/api/users", users);



const port = process.env.PORT || 4001;

var server = app.listen(port, () => console.log(`Server up and running on port ${port} !`));
server.timeout = 999999;
