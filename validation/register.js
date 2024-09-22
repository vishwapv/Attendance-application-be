var Validator = require("validator");
var _ = require("lodash");

module.exports = function validateRegisterInput(data) {
  console.log(data);

  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.user_type = !_.isEmpty(data.user_type) ? data.user_type : "";
  data.mobile = !_.isEmpty(data.mobile) ? data.mobile : null;
  data.password = !_.isEmpty(data.password) ? data.password : "";


  // User Type checks
  // if(Validator.isEmpty(data.user_type)){
  //   errors.user_type = "Select your user type";
  // }else if(!_.includes(["sp", "customer"],data.user_type)){
  //   errors.user_type = "Invalid user type";
  // }

  // Mobile Number checks
  if (Validator.isEmpty(data.mobile)) {
    errors.mobile = "Mobile number is required";
  } else if (!Validator.isMobilePhone(data.mobile) && !_.isNumber(data.mobile)) {
   
    errors.mobile = "Mobile number invalid";
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }


  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    errors,
    isValid: _.isEmpty(errors)
  };
};