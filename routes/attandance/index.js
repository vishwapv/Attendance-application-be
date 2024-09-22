var express = require("express");

module.exports = function (passport) {
    var router = express.Router();
    var AttandanceController = require("../../modules/attendance")


    router.post("/attendance", (req, res) => {
        AttandanceController.AttendanceModule(req.body)
            .then(result => {
                console.log("Attendance registered ", result);
                return res.status(200).json({
                    message: "Attendance registered successfully",
                    data: result,
                })

            })
            .catch(e => {
                return res.status(400).json({ e })
            })
    })


    router.get("/list/:page_no", (req, res) => {
        AttandanceController.fetchAttendance(req.body, req.params, req.query)
            .then(result => {
                // console.log("Attendance list fetched :", result);
                return res.status(200).json({
                    message: "Attendance list fetched successfully",
                    data: result
                })

            }).catch(e => {
                return res.status(400).json({ e })
            })
    })


    return router;

}