// let users = require('./users/index');
// let profile = require('./profile/index');
// let homework = require('./homework/index');
// let bug = require('./bug/index');
// let school = require('./school/index');
// let assignment = require('./assignment/index');
// let classes = require('./classes/index');
// let coin = require('./coin/index');
// let testseries = require('./testseries/index');
// let common = require('./common/index');
let registration = require('./registration/index')
let createUser = require("./createUser")
let attendance = require("./attandance")

exports.addAPI = function (mount, app, passport, cache) {
  // app.use(mount + '/users', users(passport, cache));
  // app.use(mount + '/profile', profile(passport, cache));
  // app.use(mount + '/homework', homework(passport, cache));
  // app.use(mount + '/bug', bug(passport, cache));
  // app.use(mount + '/school', school(passport, cache));
  // app.use(mount + '/assignment', assignment(passport, cache));
  // app.use(mount + '/classes', classes(passport, cache));
  // app.use(mount + '/coins', coin(passport, cache));
  // app.use(mount + '/testseries', testseries(passport, cache));
  app.use(mount + '/user', registration());
  app.use(mount + '/student', createUser());
  app.use(mount + '/atten', attendance());
  // app.use(mount + '', common(passport, cache));
};