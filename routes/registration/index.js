var express = require("express");

module.exports = function (passport) {
    var router = express.Router();

    var registationController = require("../../modules/registration")

    router.post("/registration", (req, res) => {
        registationController.RegistrationModule(req.body)
            .then(result => {
                console.log("user registerd", result);
                return res.status(200).json({
                    message: "user registerd successfully",
                    data: result,
                })

            })
            .catch(e => {
                return res.status(400).json({ e })
            })
    })

    router.post("/login", (req, res) => {
        registationController.LoginModel(req.body)
            .then(result => {
                console.log("user login", result);
                return res.status(200).json({
                    message: "user logedin successfully",
                    data: result,
                })
            })
    })

    return router;

}