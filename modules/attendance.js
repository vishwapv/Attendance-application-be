const { log } = require("util");
var Attendance = require("../models/Attendance");
const { DataExchange } = require("aws-sdk");

exports.AttendanceModule = (body) => {
    console.log("Received id of the user for attendance");
    return new Promise((resolve, reject) => {
        const { users, date } = body;
        console.log("user_id :", users);
        console.log("date", date);


        const [year, month, day] = date.split('/');
        const attendanceDate = new Date(Date.UTC(year, month - 1, day)); // month is 0-indexed in JS Dates
        console.log("attendanceDate", attendanceDate);

        if (isNaN(attendanceDate.getTime())) {
            return reject(new Error("Invalid Date format provided"));
        }

        if (!Array.isArray(users) || users.length === 0) {
            return reject("Please provide a valid array of user IDs");
        } else {
            console.log("i got the array", users);

        }

        const attendancePromises = users.map(user => {
            const { user_id, status } = user;
            return new Promise((resolve, reject) => {
                Attendance.findOne({ user_id: user_id, date: attendanceDate })
                    .then(existingRecord => {
                        console.log("existingRecord", existingRecord);

                        if (existingRecord) {
                            reject(`Attendance already taken for user with ID ${user_id} on this date`);
                        } else {
                            const attendanceRecord = new Attendance({
                                user_id: user_id,
                                status: status,
                                date: attendanceDate
                            })

                            attendanceRecord.save()
                                .then(savedRecord => {
                                    console.log("savedRecord", savedRecord);

                                    return Attendance.findById(savedRecord._id)
                                        .populate({
                                            path: 'user_id',
                                            select: 'userName dateOfBirth address aadharNumber age gender'
                                        })
                                        .then(populatedRecord => {
                                            resolve(populatedRecord)
                                        }).catch(err => reject(err))
                                }).catch(err => {
                                    reject(err);
                                });
                        }
                    }).catch(err => {
                        reject(err);
                    });
            })
        })
        Promise.all(attendancePromises)
            .then(savedRecords => {
                resolve(savedRecords)
            }).catch(err => {
                reject(err)
            })





    });
};

exports.fetchAttendance = (decodedBody, params, query) => {
    console.log("decodedBody", decodedBody);
    console.log("params", params);
    console.log("query", query);
    let page_no = 0 || params.page_no;
    let per_page_limit = 10;
    page_limit = parseInt(page_no * per_page_limit);
    console.log("page_limit :", page_limit)

    let date = query.date
    console.log("date", date);



    let findFilter = {}
    console.log("findFilter in", findFilter);


    if (date) {
        console.log("log inside the if condition for date:", date);

        // Split the provided date and create an exact date object
        const [year, month, day] = date.split('/');
        const exactDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0)); // Convert to UTC

        // Use exactDate directly for filtering
        findFilter = {
            ...findFilter, ...{ date: { $eq: exactDate } } // Use $eq for exact match
        };

        console.log("Exact date filter:", findFilter);
    }

    // if (userName) {
    //     console.log("userName in filter", userName);
    //     findFilter = { ...findFilter, ...{ userName: { $regex: userName, $options: 'i' } } }

    // }


    // return new Promise((resolve, reject) => {
    //     Attendance.find(findFilter)
    //         .then(data => {
    //             // console.log("data :", data);


    //             return Attendance.find(data.user_id)
    //                 .populate({
    //                     path: 'user_id',
    //                     select: 'userName dateOfBirth address aadharNumber age gender'
    //                 })
    //                 // .sort({ userName: 1 })
    //                 .skip(page_limit)
    //                 .limit(per_page_limit)
    //                 .then(populatedRecod => {
    //                     resolve(populatedRecod)
    //                 }).catch(err => {
    //                     reject(err)
    //                 })
    //         }).catch(err => reject({
    //             error: err,
    //             message: "unable to find data"
    //         }))
    // })
    return new Promise((resolve, reject) => {
        Attendance.find(findFilter)
            .skip(page_limit)
            .limit(per_page_limit)
            .populate({
                path: 'user_id',
                select: 'userName dateOfBirth address aadharNumber age gender'
            })
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject({
                    error: err,
                    message: "Unable to fetch attendance data"
                });
            });
    });



}
