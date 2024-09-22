const { reject } = require("lodash");
var CreateUser = require("../models/Createuser")

exports.CreateUserModule = (body) => {
    console.log("recived to create the user in the database");
    return new Promise((resolve, reject) => {
        const { userName, dateOfBirth, address, aadharNumber, age, gender } = body;
        console.log("User Data:", {
            userName,
            dateOfBirth,
            address,
            aadharNumber,
            age,
            gender
        });

        CreateUser.findOne({ userName })
            .then(user => {
                console.log("user in the database ", user);

                if (user) {
                    reject("user is already created by this name")
                } else {
                    var newUserCreation = new CreateUser({


                        userName: userName,
                        dateOfBirth: dateOfBirth,
                        address: address,
                        aadharNumber: aadharNumber,
                        age: age,
                        gender: gender
                    })
                    console.log("newUserCreation :", newUserCreation);


                    newUserCreation.save()
                        .then((savedUser => {
                            return resolve({
                                userName: savedUser.userName,
                                dateOfBirth: savedUser.dateOfBirth,
                                address: savedUser.address,
                                aadharNumber: savedUser.aadharNumber,
                                age: savedUser.age,
                                gender: savedUser.aadharNumbergender
                            })
                        })).catch(err => reject(err))
                }
            }).catch(err => reject(err))
    })
}

exports.getLists = (decodedBody, params = {}, query) => {
    console.log("entered into the search ", params)
    console.log("query", query);

    let page_no = params.page_no || 0;
    console.log("page_no", page_no);

    let per_page_limit = 10;
    let page_limit = parseInt(page_no * per_page_limit);

    let userName = query.user_name
    console.log("username recived", userName);

    // let date = query.date;
    // console.log("date in query", query.date);



    let findFilter = {

    }
    console.log("findFilter", findFilter);

    if (userName && userName.trim() !== '') {
        findFilter.userName = { $regex: userName, $options: 'i' };
    }

    // if (date) {
    //     findFilter = { ...findFilter, ...{ date: date } }
    // }
    return new Promise((resolve, reject) => {
        CreateUser.find(findFilter)
            .sort({ userName: 1 })
            .skip(page_limit)
            .limit(per_page_limit)
            .then(users => {
                if (users) {
                    resolve(users)
                }
            }).catch(err => reject(err))
    })
}