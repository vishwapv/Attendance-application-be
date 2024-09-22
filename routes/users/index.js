//Initialize libraries
var express = require("express");

const rateLimit = require("express-rate-limit");

const verifyToken = require("../../verifyToken/index");

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 5 // limit each IP to  5 per windowMs
});

module.exports = function (passport) {
  //Router
  var router = express.Router();
  router.use('/switch/:mobile',verifyToken);
  router.use('/change/mobile',verifyToken);
  router.use('/change/mobile/verify',verifyToken);

  //Load Modules
  var UserController = require("../../modules/user");

  // Validations
  var validateRegisterInput = require("../../validation/register");
  var validateLoginInput = require("../../validation/login");


  // router.use("*/otp/*",limiter);
  
  // router.use("*/otp/*",limiter);

  // @route POST api/users/login
  // @desc Login user and return JWT token
  // @access Public
  router.put("/otp/verification", (req, res) => {
    //Do validations here

    UserController.verifyOtp(req.body)
      .then((result) => {
        console.log("Otp verification", result);

        return res.status(200).json({
          message: "OTP verified successfully",
          data: result,
        });
      })
      .catch((e) => {
        return res.status(400).json({ e });
      });
  });

  // @route POST api/users/login
  // @desc Login user and return JWT token
  // @access Public
  router.post("/otp/renewal", (req, res) => {
    //Do validations here

    UserController.resendOtp(req.body)
      .then((result) => {
        console.log("Otp resend", result);

        return res.status(200).json({
          message: "OTP resent successfully",
          data: result,
        });
      })
      .catch((e) => {
        return res.status(400).json({ e });
      });
  });


   // @route POST api/users/login
  // @desc Login user and return JWT token
  // @access Public
  router.post("/call/otp/renewal", (req, res) => {
    //Do validations here

    UserController.resendOtpCall(req.body)
      .then((result) => {
        console.log("Otp resend", result);

        return res.status(200).json({
          message: "OTP resent successfully",
          data: result,
        });
      })
      .catch((e) => {
        return res.status(400).json({ e });
      });
  });

  // @route PUT /users/legal
  // @access Public

  router.put("/legal", (req, res) => {
    //Do validations here

    UserController.acceptLegal(req.body)
      .then((result) => {
        console.log("Accept Legal", result);

        return res.status(200).json({
          message: "Update Accept Legal successfully",
          data: result,
        });
      })
      .catch((e) => {
        return res.status(400).json({ e });
      });
  });

  // @route POST api/users/login
  // @desc Login user and return JWT token
  // @access Public
  router.post("/", (req, res) => {
    console.log("Login request", req.body);

    UserController.login(req.body)
      .then((result) => {
        console.log("User Login result", result);

        return res.status(200).json({
          message: "Login successful",
          data: result,
        });
      })
      .catch((e) => {
        return res.status(400).json({ e });
      });
  });

  router.post("/logout", (req, res) => {
    var logout = req.logout();

    if (logout) {
      return res.json({
        status: 200,
      });
    } else {
      return res.json({
        status: 400,
      });
    }
  });

  router.delete("/deactivation", (req, res) => {
    console.log("Account deactivate request", req.body);

    UserController.deleteUser(req.body)
      .then((result) => {
        console.log("User Deactivate result", result);

        return res.status(200).json({
          message: "Account deactivation successful",
          data: result,
        });
      })
      .catch((e) => {
        return res.status(400).json({ e });
      });
  });


   // @route POST api/users/otp/fetch/:mobile
  // @desc Login user and return JWT token
  // @access Public
  router.get("/otp/fetch/:mobile", (req, res) => {
    //Do validations here

    UserController.fetchOtp(req.params)
      .then((result) => {
        console.log("Otp Fetch", result);

        return res.status(200).json({
          message: "OTP fetched successfully",
          data: result,
        });
      })
      .catch((e) => {
        return res.status(400).json({ e });
      });
  });

  // @route GET api/users/switch/:mobile
  // @desc Switch user and return JWT token
  // @access Public
  router.get("/switch/:mobile", (req, res) => {
    //Do validations here

    UserController.switchUser(req.params,req.decodedBody)
      .then((result) => {
        console.log("User Switch", result);

        return res.status(200).json({
          message: "User switched successfully",
          data: result,
        });
      })
      .catch((e) => {
        return res.status(400).json({ e });
      });
  });

  // @route GET api/users/change/:mobile
  // @desc Change mobile number
  // @access Public
  router.post("/change/mobile", (req, res) => {
    //Do validations here

    UserController.changeMobile(req.body,req.decodedBody)
      .then((result) => {
        console.log("Change mobile", result);

        return res.status(200).json({
          message: "OTP has been sent to new mobile number successfully",
          data: result,
        });
      })
      .catch((e) => {
        return res.status(400).json({ e });
      });
  });

  // @route GET api/users/change/:mobile
  // @desc Change mobile number
  // @access Public
  router.put("/change/mobile/verify", (req, res) => {
    //Do validations here

    UserController.changeMobileVerify(req.body,req.decodedBody)
      .then((result) => {
        console.log("Change mobile verify", result);

        return res.status(200).json({
          message: "Mobile number updated successfully",
          data: result,
        });
      })
      .catch((e) => {
        return res.status(400).json({ e });
      });
  });

  

  return router;
};
