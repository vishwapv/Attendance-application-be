//Initialize libraries
var express = require("express");
const verifyToken = require("../../verifyToken/index");

module.exports = function () {
    var router = express.Router();
    router.use("*", verifyToken);
    var TestSeriesController = require("../../modules/testseries");

    /**
     **@route POST testseries/creation
     **@desc Create Test Series
     **@access Public
     **/

    router.post("/creation", (req, res) => {
        TestSeriesController.createTestSeries(req.body, req.decodedBody)
            .then((result) => {
                console.log("add test series res", result);
                return res.status(200).json({
                    message: "Test Series successfully added",
                    data: result,
                });
            })
            .catch((e) => {
                console.log(e);
                return res.status(400).json({ e }); //Return Error
            });
    });

    /**
     **@route PUT testseries/creation
     **@desc Create Test Series
     **@access Public
     **/

    router.put("/updation", (req, res) => {
        TestSeriesController.updateTestSeries(req.body, req.decodedBody)
            .then((result) => {
                console.log("update test series res", result);
                return res.status(200).json({
                    message: "Assignment successfully updated",
                    data: result,
                });
            })
            .catch((e) => {
                console.log(e);
                return res.status(400).json({ e }); //Return Error
            });
    });

    /**
     **@route GET testseries/list
     **@desc Get Test Series List
     **@access Public
     **/

    router.get("/list/:page_no", (req, res) => {
        TestSeriesController.getTestSeriesList(req.decodedBody, req.params)
            .then((result) => {
                return res.status(200).json({
                    message: "Test Series List successfully fetched",
                    data: result,
                });
            })
            .catch((e) => {
                console.log(e);
                return res.status(400).json({ e }); //Return Error
            });
    });


    /**
     **@route GET testseries/details
     **@desc Get Test Series Details
     **@access Public
     **/

    router.get("/details/:test_series_id", (req, res) => {
        TestSeriesController.detailsTestSeries(req.decodedBody, req.params)
            .then((result) => {

                return res.status(200).json({
                    message: "Assignment details fetched successfully",
                    data: result,
                });
            })
            .catch((e) => {
                console.log(e);
                return res.status(400).json({ e }); //Return Error
            });
    });

    /**
     **@route DELETE testseries/deletion
     **@desc Delete Test Series
     **@access Public
     **/

    router.delete("/deletion/:test_series_id", (req, res) => {
        TestSeriesController.deleteTestSeries(req.params, req.decodedBody)
            .then((result) => {
                console.log("delete testseries res", result);
                return res.status(200).json({
                    message: "Test Series successfully deleted",
                    data: result,
                });
            })
            .catch((e) => {
                console.log(e);
                return res.status(400).json({ e }); //Return Error
            });
    });

    return router;
};