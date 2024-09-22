var jwt = require("jsonwebtoken");
const keys = require("../config/keys");

var Registration = require("../models/Registration")

exports.RegistrationModule = (body) => {
    console.log("recived registration user");
    return new Promise((resolve, reject) => {
        const { userName, password } = body
        Registration.findOne({ userName }).then((user) => {
            if (user) {
                reject("user allready exist ")

            } else {
                var newUser = new Registration({
                    userName: userName,
                    password: password,
                })

                newUser.save().then((user) => {
                    var payload = {
                        userName: user.userName,
                    };
                    // resolve({
                    //     userName: user.userName,
                    //     password: user.password,
                    // })
                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        { expiresIn: '30d' },
                        (err, token) => {
                            if (err) {
                                return reject(err); // Handle token signing errors
                            }
                            return resolve({
                                userName: user.userName,
                                password: user.password,
                                token: token
                            });
                        }
                    );
                }).catch(err => reject(err))
            }
        })

    })
}

exports.LoginModel = (body) => {
    return new Promise((resolve, reject) => {
        const { userName, password } = body;

        if (!userName || !password) {
            reject("provide all the field")
        }
        Registration.findOne({ userName })
            .then(user => {
                if (user.password !== password) {

                    reject("Wrong password")
                } else {

                    var payload = {
                        userName: user.userName,
                    }
                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        { expiresIn: '6h' },
                        (err, token) => {
                            if (err) {
                                return reject(err); // Handle token signing errors
                            }
                            return resolve({
                                userName: user.userName,
                                password: user.password,
                                token: token
                            });
                        }

                    )
                }
            })
            .catch(err => reject(err))

    })
}