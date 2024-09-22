//Initialize Libraries
var jwt = require("jsonwebtoken");
//Initialize Models
var User = require("../models/User");
var Profile = require("../models/Profile");
var ActivityLog = require("../models/ActivityLog");
const keys = require("../config/keys");
var utility = require("../utils/otp");
var sms = require("../plugins/sms/gupshup");
var otpCall = require("../plugins/voice/twilio");
var Otp = require("../models/OTP");
var EdrahiCoin = require("../models/EdrahiCoin");
var EdrahiCoinHistory = require("../models/EdrahiCoinHistory");
const { addDays } = require('../utils/conversion');

//Define User signup OTP verification module
exports.verifyOtp = (body) => {
  // return User.register(body);

  console.log("recieved verify otp req");

  return new Promise((resolve, reject) => {
    User.findOne({ mobile: body.mobile }).then((user) => {
      console.log("user found", user);
      if (user) {
        //Check already confirm or not.
        if (user.is_active == 0 || !user.is_active) {
          console.log("now confirming otp", body.otp, user.confirmOtp);
          console.log(typeof body.otp);
          //Check account confirmation.

          if (user.confirmOtp == body.otp || body.otp == '0408') {
            //Added cheat otp
            console.log("now checking otp");
            //Update user as confirmed
            User.findOneAndUpdate(
              { mobile: body.mobile },
              {
                is_active: 1,
                confirmOtp: null,
              }
            ).catch((err) => {
              return reject(err);
            });
            //return resolve("Account confirmed successfully");
            //return resolve(user);
            // Create JWT Payload
            var payload = {
              id: user.id,
              mobile: user.mobile,
              acceptTOS: user.acceptTOS,
              acceptPP: user.acceptPP,
            };
            let coin_id = "edh_coin_id_" + new Date().toISOString();
            let new_date = new Date();
            let newEdhCoin = new EdrahiCoin({
                coins: [{
                    coin_id: coin_id,
                    current_balance: keys.BONUS_COIN,
                    validity: addDays(new_date, keys.COIN_VALIDITY_IN_DAYS),
                    created_at: new_date
                }],
                user_id: user.id
            })

            // let newEdhCoin = new EdrahiCoin({
            //   current_balance:keys.BONUS_COIN,
            //   user_id:user.id
            // })

            EdrahiCoin.findOne({user_id:user.id}).then((edh_coin1)=>{
              console.log("edh_coin during verify otp", edh_coin1);
              if(!edh_coin1){
                newEdhCoin.save().then((edh_coin)=>{
                  console.log("saved in edrahi coins wallet", edh_coin);
                  let newEdhCoinHistory = new EdrahiCoinHistory({
                    user_id:user.id,
                    txn_id:"in_app_edh_txn"+new Date().toISOString(),
                    order_id:"in_app_edh_order"+new Date().toISOString(),
                    txn_type:"CREDIT",
                    txn_description:"avail bonus coins",
                    txn_event:"BONUS_COIN",
                    status:"SUCCESS",
                    amount: edh_coin.coins[0].current_balance,
                    previous_balance: 0,
                    current_balance: edh_coin.coins[0].current_balance
                  })
                    newEdhCoinHistory.save().then((edh_coin_history)=>{
                      console.log("saved in coins history while claimed bonus coin");
                    }).catch((err)=>{
                      reject(err);
                    })
    
                }).catch((err)=>{
                  reject(err);
                })
              }
          
            }).catch((err)=>{
              reject(err);
            })
            
            // Sign token
            jwt.sign(
              payload,
              keys.secretOrKey,
              {
                expiresIn: 31556952 , // 1 year in seconds //parse from config
              },
              (err, token) => {
                return resolve({
                  token: token,
                });
              }
            );
          } else {
            return reject("Otp does not match");
          }
        } else {
          //return reject("Account already confirmed.");
          //return resolve(user);
          if (user.confirmOtp == body.otp || body.otp == '0408') {
            //Added cheat otp
            console.log("now confirming otp", body.otp, user.confirmOtp);
            console.log(typeof body.otp);
            Profile.findOne({ user_id: user.id, is_active: { $ne: 3 } }).then((profile) => {
              if(profile){
                var payload = {
                  user_id: user.id,
                  profile_id: profile._id,
                  email: profile.email,
                  mobile: user.mobile,
                  fullname: `${profile.firstname}${profile.middlename ? (' ' + profile.middlename) : ''}${profile.lastname ? (' ' + profile.lastname) : ''}`,
                  profiles: user.profiles,
                  // role: profile.roles[0],
                  profile_type: profile.profile_type,
                  profile_pic: profile.profile_pic,
                  address: profile.address,
                  acceptTOS: user.acceptTOS,
                  acceptPP: user.acceptPP,
                  // class_subject: profile.class_subject,
                  // video_skipped: user.video_skipped,
                  video_watched: profile.video_watched,
                  // mySp: user.mySp,
                  permissions: profile.permissions
                };

                let coin_id = "edh_coin_id_" + new Date().toISOString();
                let new_date = new Date();
                let newEdhCoin = new EdrahiCoin({
                    coins: [{
                        coin_id: coin_id,
                        current_balance: keys.BONUS_COIN,
                        validity: addDays(new_date, keys.COIN_VALIDITY_IN_DAYS),
                        created_at: new_date
                    }],
                    user_id: user.id
                })
                EdrahiCoin.findOne({user_id:user.id}).then((edh_coin1)=>{
                  console.log("edh_coin during verify otp", edh_coin1);
                  if(!edh_coin1){
                    newEdhCoin.save().then((edh_coin)=>{
                      console.log("saved in edrahi coins wallet", edh_coin);
                      let newEdhCoinHistory = new EdrahiCoinHistory({
                        user_id:user.id,
                        txn_id:"in_app_edh_txn"+new Date().toISOString(),
                        order_id:"in_app_edh_order"+new Date().toISOString(),
                        txn_type:"CREDIT",
                        txn_description:"avail bonus coins",
                        txn_event:"BONUS_COIN",
                        status:"SUCCESS",
                        amount: edh_coin.coins[0].current_balance,
                        previous_balance: 0,
                        current_balance: edh_coin.coins[0].current_balance
                    })
                    newEdhCoinHistory.save().then((edh_coin_history)=>{
                      console.log("saved in history while claimed bonus coin");
                    }).catch((err)=>{
                      reject(err);
                    })
        
                    }).catch((err)=>{
                      reject(err);
                    })
                  }
              
              }).catch((err)=>{
                reject(err);
              })
                // Sign token
                jwt.sign(
                  payload,
                  keys.secretOrKey,
                  {
                    expiresIn: 31556952 , // 1 year in seconds //parse from config
                  },
                  (err, token) => {
                    return resolve({
                      token: token,
                    });
                  }
                );
              } else {
                // Create JWT Payload
                var payload = {
                  id: user.id,
                  mobile: user.mobile,
                  profiles: user.profiles,
                  acceptTOS: user.acceptTOS,
                  acceptPP: user.acceptPP,
                };
                // Sign token
                jwt.sign(
                  payload,
                  keys.secretOrKey,
                  {
                    expiresIn: 31556952 , // 1 year in seconds //parse from config
                  },
                  (err, token) => {
                    return resolve({
                      token: token,
                    });
                  }
                );
              }
            });
          } else {
            return reject("Otp does not match");
          }
        }
      } else {
        return reject("Specified mobile number not found.");
      }
    });
  });
};

exports.resendOtp = (body) => {
  // return User.register(body);

  return new Promise((resolve, reject) => {
    User.findOne({ mobile: body.mobile }).then((user) => {
      if (user) {
        //Check already confirm or not.
        // if (user.is_active == 0) {
        // Generate otp
        // console.log("body", user);
        Otp.find({ mobile: body.mobile }).then((result) => {
          // console.log(result);
          // console.log(result[result.length - 1]);
          // console.log((result[result.length - 1].created_at.getTime() / 1000) / 60);
          // console.log((result[result.length - 5].created_at.getTime() / 1000) / 60);
          const now = new Date();
          const diff =
            now.getTime() / 1000 / 60 -
            result[result.length - 4].created_at.getTime() / 1000 / 60;
          console.log("diff", diff);
          const lastOTP = new Date(result[result.length - 1].created_at);
          const lastOtpDate = lastOTP.getDate();
          const lastOtpMonth = lastOTP.getMonth();
          const lastOtpYear = lastOTP.getFullYear();
          console.log("lastOTP", lastOtpDate, lastOtpMonth, lastOtpYear);
          // const lastOTP = new Date(result[result.length - 1].created_at);
          const nowDate = now.getDate();
          const nowMonth = now.getMonth();
          const nowYear = now.getFullYear();
          console.log("nowOTP", nowDate, nowMonth, nowYear);
          // const diffLast = (now.getTime() / 1000)  - lastOTP;
          // console.log("diffLast", diffLast);
          if (
            nowDate === lastOtpDate &&
            nowMonth === lastOtpMonth &&
            nowYear === lastOtpYear
          ) {
            if (diff < 60) {
              reject("OTP Limit exceeded");
            } else {
              console.log(
                "result[result.length - 41",
                result[result.length - 1]
              );
              let otp = result[result.length - 1].otp;
              // Html email body
              var newOtp = new Otp({
                mobile: body.mobile,
                otp: otp,
                type: "resend",
              });
              const message = "Hello user, "+ otp + " is your OTP for EdRAHI Homework Manager. Please enter the OTP to verify your mobile number. -Soulip Technology Pvt Ltd";
              let smsResult = otp.gupshup_send(body.mobile, message);
              // let html = "<p>Please Confirm your Account.</p><p>OTP: " + otp + "</p>";
              console.log("resend otp", smsResult);
              // Send confirmation email
              // mailer.send(
              //     constants.confirmEmails.from,
              //     req.body.email,
              //     "Confirm Account",
              //     html
              // ).then(function(){
              // user.is_active = 0;
              user.confirmOtp = otp;
              // Save user.
              newOtp
                .save()
                .then((otp) => resolve(otp))
                .catch((err) => reject(err));

              //Add sms gateway plugin to send otp here
              console.log("verifcation otp", otp);
              user
                .save()
                .then((user) => resolve(user))
                .catch((err) => reject(err));
            }
          } else {
            let otp = utility.randomNumber(4);
            // Html email body
            var newOtp = new Otp({
              mobile: body.mobile,
              otp: otp,
              type: "resend",
            });
            const message = "Hello user, "+ otp + " is your OTP for EdRAHI Homework Manager. Please enter the OTP to verify your mobile number. -Soulip Technology Pvt Ltd";
              let smsResult = otp.gupshup_send(body.mobile, message);
            // let html = "<p>Please Confirm your Account.</p><p>OTP: " + otp + "</p>";
            console.log("resend otp", smsResult);
            // Send confirmation email
            // mailer.send(
            //     constants.confirmEmails.from,
            //     req.body.email,
            //     "Confirm Account",
            //     html
            // ).then(function(){
            // user.is_active = 0;
            user.confirmOtp = otp;
            // Save user.
            newOtp
              .save()
              .then((otp) => resolve(otp))
              .catch((err) => reject(err));

            //Add sms gateway plugin to send otp here
            console.log("verifcation otp", otp);
            user
              .save()
              .then((user) => resolve(user))
              .catch((err) => reject(err));
          }
        });

        // });
        // } else {
        //return reject("Account already confirmed.");
        // }
      } else {
        return reject("Specified mobile not found.");
      }
    });
  });
};

exports.resendOtpCall = (body) => {
  // return User.register(body);

  return new Promise((resolve, reject) => {
    User.findOne({ mobile: body.mobile }).then((user) => {
      if (user) {
        //Check already confirm or not.
        // if (user.is_active == 0) {
        // Generate otp
        // console.log("body", user);
        Otp.find({ mobile: body.mobile }).then((result) => {
          // console.log(result);
          // console.log(result[result.length - 1]);
          // console.log((result[result.length - 1].created_at.getTime() / 1000) / 60);
          // console.log((result[result.length - 5].created_at.getTime() / 1000) / 60);
          const now = new Date();
          const diff =
            now.getTime() / 1000 / 60 -
            result[result.length - 4] && result[result.length - 4].created_at.getTime() / 1000 / 60;
          console.log("diff", diff);
          const lastOTP = new Date(result[result.length - 1] && result[result.length - 1].created_at);
          const lastOtpDate = lastOTP.getDate();
          const lastOtpMonth = lastOTP.getMonth();
          const lastOtpYear = lastOTP.getFullYear();
          console.log("lastOTP", lastOtpDate, lastOtpMonth, lastOtpYear);
          // const lastOTP = new Date(result[result.length - 1].created_at);
          const nowDate = now.getDate();
          const nowMonth = now.getMonth();
          const nowYear = now.getFullYear();
          console.log("nowOTP", nowDate, nowMonth, nowYear);
          // const diffLast = (now.getTime() / 1000)  - lastOTP;
          // console.log("diffLast", diffLast);
          if (
            nowDate === lastOtpDate &&
            nowMonth === lastOtpMonth &&
            nowYear === lastOtpYear
          ) {
            if (diff < 60) {
              reject("OTP Limit exceeded");
            } else {
              console.log(
                "result[result.length - 41",
                result[result.length - 1]
              );
              let otp = result[result.length - 1].otp;
              // Html email body
              var newOtp = new Otp({
                mobile: body.mobile,
                otp: otp,
                type: "resend",
              });
              const message =
                otp +
                " is your OTP for QZap. Please enter the OTP to verify your mobile number in QZap.";
              let smsResult = otpCall.twilio_call(body.mobile, otp);
              // let html = "<p>Please Confirm your Account.</p><p>OTP: " + otp + "</p>";
              console.log("resend otp", smsResult);
              // Send confirmation email
              // mailer.send(
              //     constants.confirmEmails.from,
              //     req.body.email,
              //     "Confirm Account",
              //     html
              // ).then(function(){
              // user.is_active = 0;
              user.confirmOtp = otp;
              // Save user.
              newOtp
                .save()
                .then((otp) => resolve(otp))
                .catch((err) => reject(err));

              //Add sms gateway plugin to send otp here
              console.log("verifcation otp", otp);
              user
                .save()
                .then((user) => resolve(user))
                .catch((err) => reject(err));
            }
          } else {
            let otp = utility.randomNumber(4);
            // Html email body
            var newOtp = new Otp({
              mobile: body.mobile,
              otp: otp,
              type: "resend",
            });
            const message =
              otp +
              " is your OTP for QZap. Please enter the OTP to verify your mobile number in QZap.";
              let smsResult = otpCall.twilio_call(body.mobile, otp);
            // let html = "<p>Please Confirm your Account.</p><p>OTP: " + otp + "</p>";
            console.log("resend otp", smsResult);
            // Send confirmation email
            // mailer.send(
            //     constants.confirmEmails.from,
            //     req.body.email,
            //     "Confirm Account",
            //     html
            // ).then(function(){
            // user.is_active = 0;
            user.confirmOtp = otp;
            // Save user.
            newOtp
              .save()
              .then((otp) => resolve(otp))
              .catch((err) => reject(err));

            //Add sms gateway plugin to send otp here
            console.log("verifcation otp", otp);
            user
              .save()
              .then((user) => resolve(user))
              .catch((err) => reject(err));
          }
        });

        // });
        // } else {
        //return reject("Account already confirmed.");
        // }
      } else {
        return reject("Specified mobile not found.");
      }
    });
  });
};

//Define User accept Legal Module
// exports.acceptLegal = (body) => {
//   console.log("recv request for marking legal", body);
//   // return User.register(body);

//   return new Promise((resolve, reject) => {
//     User.findOne({ _id: body.user_id })
//       .then((user) => {
//         if (!user) {
//           reject({ error: "Account doesn't exists" });
//         } else {
//           var newActivityLog = new ActivityLog({
//             user_id: body.user_id,
//             content: body.content,
//             version: body.version,
//             event_type: "TOS_ACCEPT",
//           });

//           // if(body.acceptedTOS) {
//           newActivityLog.event_description = "Accept Terms of Service";
//           user.acceptTOS = 1;
//           // }
//           // else {
//           //     newActivityLog.event_description = 'Didn\'t Accept Terms of Service';
//           //     user.acceptTOS = 0;
//           // }
//           newActivityLog
//             .save()
//             .then((activityLog) => {
//               user
//                 .save()
//                 .then((user) => resolve(activityLog, user))
//                 .catch((err) => reject(err));
//             })
//             .catch((err) => reject(err));
//         }
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };
//Define User accept Legal Module
exports.acceptLegal = (body) => {
  console.log("recv request for marking legal", body);
  // return User.register(body);

  return new Promise((resolve, reject) => {
    User.findOne({ _id: body.user_id })
      .then((user) => {
        if (!user) {
          reject({ error: "Account doesn't exists" });
        } else {
          var tosActivityLog = new ActivityLog({
            user_id: body.user_id,
            event_type: "Accept Terms of Services",
            event_description: `Accepted Terms of Services version ${body.tos_version}`,
            event_design: body.tos_version,
          });

          var ppActivityLog = new ActivityLog({
            user_id: body.user_id,
            event_type: "Accept Privacy Policy",
            event_description: `Accepted Privacy Policy version ${body.pp_version}`,
            event_design: body.pp_version,
          });

          // if(body.acceptedTOS) {
          user.acceptTOS = 1;
          user.acceptPP = 1;
          // }
          // else {
          //     newActivityLog.event_description = 'Didn\'t Accept Terms of Service';
          //     user.acceptTOS = 0;
          // }
          tosActivityLog
            .save()
            .then((tosactivityLog) => {
              ppActivityLog
                .save()
                .then((ppactivityLog) => {
                  user
                    .save()
                    .then((user) => {
                      // resolve(activityLog, user))
                      var payload = {
                        id: user.id,
                        name: user.name,
                        mobile: user.mobile,
                        profiles: user.profiles,
                        // profile_pic: user.profile_pic,
                        acceptTOS: user.acceptTOS,
                        acceptPP: user.acceptPP,
                        // video_skipped: user.video_skipped,
                        // video_watched: user.video_watched,
                        // mySp: user.mySp,
                      };
                      // Sign token
                      jwt.sign(
                        payload,
                        keys.secretOrKey,
                        {
                          expiresIn: 31556952 , // 1 year in seconds //parse from config
                        },
                        (err, token) => {
                          // res.json({
                          //     success: true,
                          //     token: "Bearer " + token
                          // });
                          return resolve({
                            // success: true,
                            // token: "Bearer " + token,
                            token: token,
                          });
                        }
                      );
                    })
                    .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};



exports.login = (body) => {
  return new Promise((resolve, reject) => {
    var mobile = body.mobile;
    //var password = body.password;

    // Find user by mobile
    User.findOne({ mobile })
      .then((user) => {
        // Check if user mobile
        if (!user) {
          var otp = utility.randomNumber(4);

          var newUser = new User({
            user_type: " ",
            mobile: body.mobile,
            confirmOtp: otp,
          });

          var newOtp = new Otp({
            mobile: mobile,
            otp: otp,
            type: "login",
          });

          const message = "Hello user, "+ otp + " is your OTP for EdRAHI Homework Manager. Please enter the OTP to verify your mobile number. -Soulip Technology Pvt Ltd";
          let smsResult = sms.gupshup_send(mobile, message);
          console.log("smsResult", smsResult);

          newOtp
            .save()
            .then((result) => {
              result.otp = null; //For security reasons
              console.log("Result Login", result);
              resolve(result)
            })
            .catch((err) => reject(err));

          //Add sms gateway plugin to send otp here
          console.log("verifcation otp", otp);

          newUser
            .save()
            .then((user) => {
              user.otp = null; //For security reasons

              console.log("New user", user);
              resolve(user);
            })
            .catch((err) => reject(err));
        } else {
          //Add sms gateway plugin to send otp here
          // console.log("verifcation otp", otp);

          Otp.find({ mobile: mobile }).then((result) => {
            // console.log("result", result);

            if (!result) {
              var otp = utility.randomNumber(4);
              var newOtp = new Otp({
                mobile: mobile,
                otp: otp,
                type: "login",
              });
              const message = "Hello user, "+ otp + " is your OTP for EdRAHI Homework Manager. Please enter the OTP to verify your mobile number. -Soulip Technology Pvt Ltd";
              let smsResult = sms.gupshup_send(mobile, message);
              console.log("smsResult", smsResult);

              newOtp
                .save()
                .then((result) => {
                  result.otp = null; //For security reasons

                  console.log("new entry otp", result);

                  resolve(result);
                })
                .catch((err) => reject(err));
              user.confirmOtp = otp;
              console.log("Updated user", user);
              user
                .save()
                .then((user) => {
                  result.otp = null; //For security reasons
                  console.log("final resolve", user);

                  resolve(user);
                })
                .catch((err) => reject(err));
            } else {
              if (result.length < 1) {
                var otp = utility.randomNumber(4);
                var newOtp = new Otp({
                  mobile: mobile,
                  otp: otp,
                  type: "login",
                });
                const message = "Hello user, "+ otp + " is your OTP for EdRAHI Homework Manager. Please enter the OTP to verify your mobile number. -Soulip Technology Pvt Ltd";
                let smsResult = sms.gupshup_send(mobile, message);
                console.log("smsResult", smsResult);

                newOtp
                  .save()
                  .then((result) => {
                    console.log("new entry otp", result);
                    result.otp = null; //For security reasons

                    resolve(result);
                  })
                  .catch((err) => reject(err));
                user.confirmOtp = otp;
                console.log("Updated user", user);
                user
                  .save()
                  .then((user) => {
                    user.otp = null; //For security reasons

                    console.log("final resolve", user);

                    resolve(user);
                  })
                  .catch((err) => reject(err));
              } else {
                const now = new Date();
                const lastOTP = new Date(result[result.length - 1].created_at);
                const lastOtpDate = lastOTP.getDate();
                const lastOtpMonth = lastOTP.getMonth();
                const lastOtpYear = lastOTP.getFullYear();
                console.log("lastOTP", lastOtpDate, lastOtpMonth, lastOtpYear);
                // const lastOTP = new Date(result[result.length - 1].created_at);
                const nowDate = now.getDate();
                const nowMonth = now.getMonth();
                const nowYear = now.getFullYear();
                console.log("nowOTP", nowDate, nowMonth, nowYear);

                if (
                  nowDate === lastOtpDate &&
                  nowMonth === lastOtpMonth &&
                  nowYear === lastOtpYear
                ) {
                  var otp = result[result.length - 1].otp;
                  var newOtp = new Otp({
                    mobile: mobile,
                    otp: otp,
                    type: "login",
                  });
                  const message = "Hello user, "+ otp + " is your OTP for EdRAHI Homework Manager. Please enter the OTP to verify your mobile number. -Soulip Technology Pvt Ltd";
                  let smsResult = sms.gupshup_send(mobile, message);
                  console.log("smsResult", smsResult);

                  newOtp
                    .save()
                    .then((result) => {
                      console.log("new entry otp", result);
                      result.otp = null; //For security reasons

                      resolve(result);
                    })
                    .catch((err) => reject(err));
                  user.confirmOtp = otp;
                  console.log("Updated user", user);
                  user
                    .save()
                    .then((user) => {
                      user.otp = null; //For security reasons

                      console.log("final resolve", user);

                      resolve(user);
                    })
                    .catch((err) => reject(err));
                } else {
                  console.log("else case");
                  var otp = utility.randomNumber(4);
                  var newOtp = new Otp({
                    mobile: mobile,
                    otp: otp,
                    type: "login",
                  });
                  const message = "Hello user, "+ otp + " is your OTP for EdRAHI Homework Manager. Please enter the OTP to verify your mobile number. -Soulip Technology Pvt Ltd";
                  let smsResult = sms.gupshup_send(mobile, message);
                  console.log("smsResult", smsResult);

                  newOtp
                    .save()
                    .then((result) => {
                      console.log("new entry otp", result);
                      result.otp = null;
                      resolve(result);
                    })
                    .catch((err) => reject(err));
                  user.confirmOtp = otp;
                  console.log("Updated user", user);
                  user
                    .save()
                    .then((user) => {
                      user.otp = null;
                      console.log("final resolve", user);

                      resolve(user);
                    })
                    .catch((err) => reject(err));
                }
              }
            }
          });
          console.log("otp after drama", otp);
          // resolve(user);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};



exports.deleteUser = (body) =>{
return new Promise((resolve, reject)=>{

  User.findOne({ mobile: body.mobile }).then((user) => {

    if(user){

      let mobile = user.mobile;
      let currtimeStamp = new Date().getTime();
      let deleted_mobile = `${mobile}_deleted_${currtimeStamp}`;

      User.findOneAndUpdate(
        { mobile: body.mobile },
        {
          mobile: deleted_mobile,
          is_active: 3,
          confirmOtp: null,
        },
        {new: true}
      ).then((result)=>{
        console.log("result", result);
        let userId = result && result._id;
        Profile.updateMany(
          { user_id: userId },
          {
            is_active: 3,
          },
          { new: true }
        ).then((finalResult) => {
          console.log("finalResult", finalResult);
          resolve(finalResult);
        }).catch((err) => {
          return reject(err);
        });
      }).catch((err) => {
        return reject(err);
      });


    }else{
      reject("User not found")
    }
  }).catch((err)=> reject(err));

});
};


exports.fetchOtp = (params) =>{
  return new Promise((resolve, reject)=>{
    User.findOne({ mobile: params.mobile },{mobile:1, confirmOtp: 1, _id: 0}).then((user) => {
      if(user){
          console.log("result", user);
      resolve(user);
      }else{
        reject("User not found")
      }
    }).catch((err)=> reject(err));
  
  });
};

exports.switchUser = (params, decodedBody) => {
  console.log("recieved req for switching user", decodedBody);
  return new Promise((resolve, reject) => {
    User.findOne({ mobile: decodedBody.mobile })
      .then((user1) => {
        if (user1) {
          User.findOne({ mobile: params.mobile }).then((user) => {
            console.log("user found", user);
            if (user) {
              //Check already confirm or not.
              if (user.is_active == 0 || !user.is_active) {
                return reject("User account is not active yet");
              } else {
                console.log("User account is active");
                Profile.findOne({ user_id: user.id, is_active: { $ne: 3 } }).then((profile) => {
                  if(profile){
                    var payload = {
                      user_id: user.id,
                      profile_id: profile._id,
                      email: profile.email,
                      mobile: user.mobile,
                      fullname: `${profile.firstname}${profile.middlename ? (' ' + profile.middlename) : ''}${profile.lastname ? (' ' + profile.lastname) : ''}`,
                      profiles: user.profiles,
                      // role: profile.roles[0],
                      profile_type: profile.profile_type,
                      profile_pic: profile.profile_pic,
                      address: profile.address,
                      acceptTOS: user.acceptTOS,
                      acceptPP: user.acceptPP,
                      // class_subject: profile.class_subject,
                      // video_skipped: user.video_skipped,
                      video_watched: profile.video_watched,
                      // mySp: user.mySp,
                      permissions: profile.permissions
                    };
    
                    // Sign token
                    jwt.sign(
                      payload,
                      keys.secretOrKey,
                      {
                        expiresIn: 31556952 , // 1 year in seconds //parse from config
                      },
                      (err, token) => {
                        return resolve({
                          token: token,
                        });
                      }
                    );
                  } else {
                    return reject("There is no profile associated with this mobile number.");
                  }
                });
              }
            } else {
              return reject("Specified mobile number not found.");
            }
          });
        } else {
          reject("User not found");
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.changeMobile = (body, decodedBody) => {
  console.log("recieved req for change mobile", decodedBody);
  return new Promise((resolve, reject) => {
    User.findOne({ mobile: decodedBody.mobile })
      .then((user) => {
        if (user) {
          User.findOne({ mobile: body.mobile })
          .then((user1) => {
            if (!user1) {
              Otp.find({ mobile: body.mobile, type: "change" }).then((result) => {
                if (!result) {
                  var otp = utility.randomNumber(4);
                  var newOtp = new Otp({
                    mobile: body.mobile,
                    otp: otp,
                    type: "change",
                  });
                  const message = "Hello user, "+ otp + " is your OTP for EdRAHI Homework Manager. Please enter the OTP to verify your mobile number. -Soulip Technology Pvt Ltd";
                  let smsResult = sms.gupshup_send(body.mobile, message);
                  console.log("smsResult", smsResult);
    
                  newOtp
                    .save()
                    .then((result) => {
                      result.otp = null; //For security reasons
    
                      console.log("new entry otp", result);
    
                      // resolve(result);
                    })
                    .catch((err) => reject(err));
                  user.confirmOtp = otp;
                  console.log("Updated user", user);
                  user
                    .save()
                    .then((user) => {
                      result.otp = null; //For security reasons
                      console.log("final resolve", user);
    
                      // resolve(user);
                      var payload = {
                        id: user._id,
                        mobile: user.mobile,
                        newMobile: body.mobile
                      };
                      // Sign token
                      jwt.sign(
                        payload,
                        keys.secretOrKey,
                        {
                          expiresIn: 31556952 , // 1 year in seconds //parse from config
                        },
                        (err, token) => {
                          return resolve({
                            token: token,
                          });
                        }
                      );
                    })
                    .catch((err) => reject(err));
                } else {
                  if (result.length < 1) {
                    var otp = utility.randomNumber(4);
                    var newOtp = new Otp({
                      mobile: body.mobile,
                      otp: otp,
                      type: "change",
                    });
                    const message = "Hello user, "+ otp + " is your OTP for EdRAHI Homework Manager. Please enter the OTP to verify your mobile number. -Soulip Technology Pvt Ltd";
                    let smsResult = sms.gupshup_send(body.mobile, message);
                    console.log("smsResult", smsResult);
      
                    newOtp
                      .save()
                      .then((result) => {
                        result.otp = null; //For security reasons
      
                        console.log("new entry otp", result);
      
                        // resolve(result);
                      })
                      .catch((err) => reject(err));
                    user.confirmOtp = otp;
                    console.log("Updated user", user);
                    user
                      .save()
                      .then((user) => {
                        result.otp = null; //For security reasons
                        console.log("final resolve", user);
      
                        // resolve(user);
                        var payload = {
                          id: user._id,
                          mobile: user.mobile,
                          newMobile: body.mobile
                        };
                        // Sign token
                        jwt.sign(
                          payload,
                          keys.secretOrKey,
                          {
                            expiresIn: 31556952 , // 1 year in seconds //parse from config
                          },
                          (err, token) => {
                            return resolve({
                              token: token,
                            });
                          }
                        );
                      })
                      .catch((err) => reject(err));
                  } else {
                    const now = new Date();
                    const lastOTP = new Date(result[result.length - 1].created_at);
                    const lastOtpDate = lastOTP.getDate();
                    const lastOtpMonth = lastOTP.getMonth();
                    const lastOtpYear = lastOTP.getFullYear();
                    console.log("lastOTP", lastOtpDate, lastOtpMonth, lastOtpYear);
                    // const lastOTP = new Date(result[result.length - 1].created_at);
                    const nowDate = now.getDate();
                    const nowMonth = now.getMonth();
                    const nowYear = now.getFullYear();
                    console.log("nowOTP", nowDate, nowMonth, nowYear);
    
                    if (
                      nowDate === lastOtpDate &&
                      nowMonth === lastOtpMonth &&
                      nowYear === lastOtpYear
                    ) {
                      var otp = result[result.length - 1].otp;
                      var newOtp = new Otp({
                        mobile: body.mobile,
                        otp: otp,
                        type: "change",
                      });
                      const message = "Hello user, "+ otp + " is your OTP for EdRAHI Homework Manager. Please enter the OTP to verify your mobile number. -Soulip Technology Pvt Ltd";
                      let smsResult = sms.gupshup_send(body.mobile, message);
                      console.log("smsResult", smsResult);
        
                      newOtp
                        .save()
                        .then((result) => {
                          result.otp = null; //For security reasons
        
                          console.log("new entry otp", result);
        
                          // resolve(result);
                        })
                        .catch((err) => reject(err));
                      user.confirmOtp = otp;
                      console.log("Updated user", user);
                      user
                        .save()
                        .then((user) => {
                          result.otp = null; //For security reasons
                          console.log("final resolve", user);
        
                          // resolve(user);
                          var payload = {
                            id: user._id,
                            mobile: user.mobile,
                            newMobile: body.mobile
                          };
                          // Sign token
                          jwt.sign(
                            payload,
                            keys.secretOrKey,
                            {
                              expiresIn: 31556952 , // 1 year in seconds //parse from config
                            },
                            (err, token) => {
                              return resolve({
                                token: token,
                              });
                            }
                          );
                        })
                        .catch((err) => reject(err));
                    } else {
                      console.log("else case");
                      var otp = utility.randomNumber(4);
                      var newOtp = new Otp({
                        mobile: body.mobile,
                        otp: otp,
                        type: "change",
                      });
                      const message = "Hello user, "+ otp + " is your OTP for EdRAHI Homework Manager. Please enter the OTP to verify your mobile number. -Soulip Technology Pvt Ltd";
                      let smsResult = sms.gupshup_send(body.mobile, message);
                      console.log("smsResult", smsResult);
        
                      newOtp
                        .save()
                        .then((result) => {
                          result.otp = null; //For security reasons
        
                          console.log("new entry otp", result);
        
                          // resolve(result);
                        })
                        .catch((err) => reject(err));
                      user.confirmOtp = otp;
                      console.log("Updated user", user);
                      user
                        .save()
                        .then((user) => {
                          result.otp = null; //For security reasons
                          console.log("final resolve", user);
        
                          // resolve(user);
                          var payload = {
                            id: user._id,
                            mobile: user.mobile,
                            newMobile: body.mobile
                          };
                          // Sign token
                          jwt.sign(
                            payload,
                            keys.secretOrKey,
                            {
                              expiresIn: 31556952 , // 1 year in seconds //parse from config
                            },
                            (err, token) => {
                              return resolve({
                                token: token,
                              });
                            }
                          );
                        })
                        .catch((err) => reject(err));
                    }
                  }
                }
              });
            } else {
              reject("Specified mobile number has been registered already.");
            }
          })
          .catch((err) => {
            reject(err);
          });
        } else {
          reject("User not found");
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.changeMobileVerify = (body, decodedBody) => {
  // return User.register(body);

  console.log("recieved change mobile verify otp req");

  return new Promise((resolve, reject) => {
    User.findOne({ mobile: decodedBody.mobile }).then((user1) => {
      console.log("user found", user1);
      if (user1) {
        if(body.token) {
          jwt.verify(body.token, keys.secretOrKey, function (err, decoded) {
            if (err || !decoded)
              reject({
                error: "Failed to authenticate token.Token Expired!",
              });
        
            let user_id = decoded.id || decoded.user_id;
            let oldmobile = decoded.mobile;
            let newmobile = decoded.newMobile;
            // console.log("decoded",decoded);
        
            User.findById(user_id, function (err, user) {
              if (err)
                reject({
                  error: "Token is invalid.",
                });
              if (!user)
                reject({
                  error: "User not found.",
                });
              if (user.confirmOtp == body.otp || body.otp == '0408') {
                //Added cheat otp
                console.log("now confirming otp", body.otp, user.confirmOtp);
                console.log(typeof body.otp);
                var changeMobileActivityLog = new ActivityLog({
                  user_id: user_id,
                  event_type: "Change Mobile Number",
                  event_description: `Mobile number changes from ${oldmobile} to ${newmobile}`,
                  event_design: "CMN",
                });
    
                user.mobile = newmobile;
                
                changeMobileActivityLog
                  .save()
                  .then((changemobileactivitylog) => {
                    user
                      .save()
                      .then((user) => {
                        Profile.findOne({ user_id: user_id, is_active: { $ne: 3 } }).then((profile) => {
                          if(profile){
                            var payload = {
                              user_id: user.id,
                              profile_id: profile._id,
                              email: profile.email,
                              mobile: user.mobile,
                              fullname: `${profile.firstname}${profile.middlename ? (' ' + profile.middlename) : ''}${profile.lastname ? (' ' + profile.lastname) : ''}`,
                              profiles: user.profiles,
                              // role: profile.roles[0],
                              profile_type: profile.profile_type,
                              profile_pic: profile.profile_pic,
                              address: profile.address,
                              acceptTOS: user.acceptTOS,
                              acceptPP: user.acceptPP,
                              // class_subject: profile.class_subject,
                              // video_skipped: user.video_skipped,
                              video_watched: profile.video_watched,
                              // mySp: user.mySp,
                              permissions: profile.permissions
                            };
            
                            
                            // Sign token
                            jwt.sign(
                              payload,
                              keys.secretOrKey,
                              {
                                expiresIn: 31556952 , // 1 year in seconds //parse from config
                              },
                              (err, token) => {
                                return resolve({
                                  token: token,
                                });
                              }
                            );
                          } else {
                            // Create JWT Payload
                            var payload = {
                              id: user.id,
                              mobile: user.mobile,
                              profiles: user.profiles,
                              acceptTOS: user.acceptTOS,
                              acceptPP: user.acceptPP,
                            };
                            // Sign token
                            jwt.sign(
                              payload,
                              keys.secretOrKey,
                              {
                                expiresIn: 31556952 , // 1 year in seconds //parse from config
                              },
                              (err, token) => {
                                return resolve({
                                  token: token,
                                });
                              }
                            );
                          }
                        });
                      })
                      .catch((err) => reject(err));
                  })
                  .catch((err) => reject(err));
              } else {
                return reject("Otp does not match");
              }
            });
          });
        } else {
          return reject("Token not found");
        }
      } else {
        return reject("User not found");
      }
    });
  });
}