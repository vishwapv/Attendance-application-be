var redis = require('redis');

module.exports.geredisConn = (config) => {
    // Create a redis client
    let redisPort = config.redisPort;
    let redisHost = config.redisHost;

    console.log(redisPort, redisHost);

        return redis.createClient({
            redisPort,
            redisHost
        });
};


