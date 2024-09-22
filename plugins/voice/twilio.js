// var request = require('request');
const creds = require("../../credentials/twilio.json");

exports.twilio_call = function (to, otp, res) {
  return new Promise(function (resolve, reject) {
    const VoiceResponse = require("twilio").twiml.VoiceResponse;
    const accountSid = creds && creds.accountSID;
    const authToken = creds && creds.authToken;
    const client = require("twilio")(accountSid, authToken);
    const response = new VoiceResponse();
    let otp_to_send = otp.split('').join('-');
    response.say(`Your EdRAHI Homework Manager OTP is: ${otp_to_send}`);

    client.calls
      .create({
        twiml: response.toString(),
        to: `+91${to}`,
        from: creds.twilioPhone
      })
      .then((call) => {
        console.log(call.sid);
        resolve(call);
      })
      .catch((err) => reject(err));
  });
};

// this.twilio_call('+919692229866', '9047')
