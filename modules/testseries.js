//Initialize Models
var mongoose = require("mongoose");
var User = require("../models/User");
var Profile = require("../models/Profile");
var TestSeries = require("../models/TestSeries");

exports.createTestSeries = async (body, decodedBody) => {
    let teacher_id = decodedBody.profile_id;
    let user_id = decodedBody.user_id;

    return new Promise((resolve, reject) => {
        User.findOne({ _id: mongoose.Types.ObjectId(user_id) })
            .then((user) => {
                if (user) {
                    Profile.findOne({
                        user_id: mongoose.Types.ObjectId(user_id),
                        _id: mongoose.Types.ObjectId(teacher_id),
                        is_active: { $ne: 3 },
                    })
                        .then(async (profile) => {
                            console.log("profile", profile);
                            if (profile && (profile.profile_type == "teacher" || profile.profile_type == "trainer")) {
                                if (body.tests && Object.keys(body.tests).length > 0) {
                                    var newTestSeries = new TestSeries({
                                        teacher_id: teacher_id,
                                        user_id: user_id,
                                        test_series_name: body.test_series_name,
                                        tests: body.tests,
                                    });
                                    newTestSeries
                                        .save()
                                        .then(async (test_series) => {
                                            var testseriescode = getRandomString(
                                                test_series._id,
                                                6
                                            );

                                            TestSeries.findOneAndUpdate(
                                                { _id: test_series._id },
                                                {
                                                    $set: {
                                                        test_series_code: testseriescode,
                                                    },
                                                },
                                                { new: true }
                                            )
                                                .then((ts) => {
                                                    resolve(ts.test_series_code);
                                                })
                                                .catch((err) => reject(err));
                                        })
                                        .catch((err) => reject(err));
                                } else {
                                    console.log("tests", body.tests);
                                    reject({ error: "Test series should have at least one test" });
                                }
                            } else {
                                reject({ error: "user profile doesn't exist" });
                            }
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    reject({ error: "user account doesn't exist" });
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

exports.updateTestSeries = async (body, decodedBody) => {
    let teacher_id = decodedBody.profile_id;
    let user_id = decodedBody.user_id;

    return new Promise((resolve, reject) => {
        User.findOne({ _id: mongoose.Types.ObjectId(user_id) })
            .then(async (user) => {
                if (user) {
                    Profile.findOne({
                        user_id: mongoose.Types.ObjectId(user_id),
                        _id: mongoose.Types.ObjectId(teacher_id),
                        is_active: { $ne: 3 },
                    })
                        .then(async (profile) => {
                            console.log("profile", profile);
                            if (profile && (profile.profile_type == "teacher" || profile.profile_type == "trainer")) {
                                TestSeries.findOneAndUpdate(
                                    {
                                        _id: mongoose.Types.ObjectId(body.test_series_id),
                                        isDeleted: false,
                                    },
                                    { $set: body },
                                    { new: true }
                                )
                                    .then((testseries) => {
                                        resolve(testseries);
                                    })
                                    .catch((err) => {
                                        reject(err);
                                    });
                            } else {
                                reject({ error: "user profile doesn't exist" });
                            }
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    reject({ error: "user account doesn't exist" });
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

exports.getTestSeriesList = (decodedBody, params) => {
    console.log("decodedBody", decodedBody);
    let teacher_id = decodedBody.profile_id;
    let user_id = decodedBody.user_id;
    let page_no = 0 || params.page_no;
    let per_page_limit = 10;
    page_limit = parseInt(page_no * per_page_limit);

    return new Promise((resolve, reject) => {
        User.findOne({ _id: mongoose.Types.ObjectId(user_id) }).then((user) => {
            if (user) {
                Profile.findOne({
                    user_id: user_id,
                    _id: teacher_id,
                    is_active: { $ne: 3 },
                }).then((profile) => {
                    if (profile) {
                        TestSeries.find({
                            user_id: user_id,
                            teacher_id: teacher_id,
                            isDeleted: false,
                        })
                            .sort({ createdAt: -1 })
                            .skip(page_limit)
                            .limit(per_page_limit)
                            .then((testseries) => {
                                resolve(testseries);
                            })
                            .catch((err) => reject(err));
                    } else {
                        reject({ error: "user profile doesn't exist" });
                    }
                });
            } else {
                reject({ error: "user account doesn't exist" });
            }
        });
    });
};

exports.detailsTestSeries = (decodedBody, params) => {
    let teacher_id = decodedBody.profile_id;
    let user_id = decodedBody.user_id;
    let test_series_id = params.test_series_id;

    return new Promise((resolve, reject) => {
        User.findOne({ _id: mongoose.Types.ObjectId(user_id) }).then((user) => {
            if (user) {
                Profile.findOne({
                    user_id: user_id,
                    _id: teacher_id,
                    is_active: { $ne: 3 },
                }).then((profile) => {
                    if (profile) {
                        TestSeries.findOne({ _id: test_series_id })
                            .then((testseries) => {
                                resolve(testseries);
                            })
                            .catch((err) => reject(err));
                    } else {
                        reject({ error: "user profile doesn't exist" });
                    }
                });
            } else {
                reject({ error: "user account doesn't exist" });
            }
        });
    });
};

exports.deleteTestSeries = (params, decodedBody) => {
    console.log("decodedBody", decodedBody);
    let teacher_id = decodedBody.profile_id;
    let user_id = decodedBody.user_id;
    let test_series_id = params.test_series_id;

    return new Promise((resolve, reject) => {
        User.findOne({ _id: mongoose.Types.ObjectId(user_id) }).then((user) => {
            if (user) {
                Profile.findOne({
                    user_id: user_id,
                    _id: teacher_id,
                    is_active: { $ne: 3 },
                }).then((profile) => {
                    if (profile) {
                        TestSeries.findOneAndUpdate(
                            { user_id: user_id, teacher_id: teacher_id, _id: test_series_id },
                            {
                                $set: {
                                    isDeleted: true,
                                },
                            },
                            { new: true }
                        )
                            .then((testseries) => {
                                resolve(testseries);
                            })
                            .catch((err) => reject(err));
                    } else {
                        reject({ error: "user profile doesn't exist" });
                    }
                });
            } else {
                reject({ error: "user account doesn't exist" });
            }
        });
    });
};

function getRandomString(str, requiredLength) {
    // console.log("str", str);
    var str1 = `${str}`;
    var result = "";
    for (var i = 0; i < requiredLength; i++) {
        result += str1.charAt(Math.floor(Math.random() * str1.length));
    }
    console.log("result", result);
    return result;
}
