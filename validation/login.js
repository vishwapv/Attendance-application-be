const Validator = require("validator");
var _ = require("lodash");

module.exports = function validateLoginInput(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  // data.email = !_.isEmpty(data.email) ? data.email : "";
  data.mobile = !_.isEmpty(data.mobile) ? data.mobile : null;
  //data.password = !_.isEmpty(data.password) ? data.password : "";

  // // Email checks
  // if (Validator.isEmpty(data.email)) {
  //   errors.email = "Email field is required";
  // } else if (!Validator.isEmail(data.email)) {
  //   errors.email = "Email is invalid";
  // }

   // Mobile Number checks
   if (Validator.isEmpty(data.mobile)) {
    errors.mobile = "Mobile number is required";
  } else if (!Validator.isMobilePhone(data.mobile) && !_.isNumber(data.mobile)) {
   
    errors.mobile = "Mobile number invalid";
  }


  // Password checks
  // if (Validator.isEmpty(data.password)) {
  //   errors.password = "Password field is required";
  // }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};