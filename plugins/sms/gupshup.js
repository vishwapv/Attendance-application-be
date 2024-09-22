// var request = require('request');
var axios = require('axios');
const creds = require('../../credentials/gupshup.json')

exports.gupshup_send = function (to, message, res) {
    return new Promise(function (resolve, reject) {
        const testMessage = encodeURIComponent(message.trim())
        // document.write(testMessage.replace(/ /g, '%20'));
        var options = {
            method: 'GET',
            url: 'http://enterprise.smsgupshup.com/GatewayAPI/rest',
            qs: {
                method: 'sendMessage',
                send_to: to,
                userid: creds.UserId,
                password: creds.Password,
                v: '1.1',
                msg_type: 'TEXT',
                auth_schema: 'PLAIN',
                msg: testMessage
            },
            headers: {}
        };

        const api = options.url + '?method=' + options.qs.method + '&send_to=' + options.qs.send_to + '&msg=' + options.qs.msg + '&msg_type=' + options.qs.msg_type + '&userid=' + options.qs.userid + '&auth_schema=' + options.qs.auth_schema + '&password=' + options.qs.password + '&v=1.1&format=text';
        console.log("api", api);


        axios.get(api)
            .then((result) => {
                // console.log("sms result", result);

                resolve(result)
            })
            .catch((err) => reject(err));

    });
};

// gupshup_send('7991184895', '9047 is your OTP for QZap. Please enter the OTP to verify your mobile number in QZap.')