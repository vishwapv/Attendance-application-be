var express = require("express");

module.exports = function (passport) {
    var router = express.Router();

    var CreateUserController = require("../../modules/createusers")


    router.post("/create", (req, res) => {
        CreateUserController.CreateUserModule(req.body)
            .then(result => {
                console.log("User Created ", result);
                return res.status(200).json({
                    message: "User Created",
                    data: result,
                })

            })
            .catch(e => {
                return res.status(400).json({ e })
            })
    })
    router.get("/list/:page_no", (req, res) => {
        CreateUserController.getLists(req.body, req.params, req.query)
            .then(result => {
                console.log("User found ", result);
                return res.status(200).json({
                    message: "User found",
                    data: result,
                })

            })
            .catch(e => {
                return res.status(400).json({ e })
            })
    })


    return router;

}