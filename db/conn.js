var mongoose = require('mongoose');
// require('../utils/redis');

module.exports.getmongoConn = (config) => {
    // Connect to MongoDB
   return mongoose
        .connect(
            config,
            { useNewUrlParser: true, useUnifiedTopology: true }
        )
        .then((res) => {
            return res;
        })
        .catch(err => {
            return err;
        });
};


