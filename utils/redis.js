const mongoose = require('mongoose');
const util = require('util');
// Redis Config
var config = require("../config/keys");
var client = require('../db/redisconn').geredisConn(config);


client.hget = util.promisify(client.hget);

// create reference for mongoose .exec 
const exec = mongoose.Query.prototype.exec;

// Define cache function on Moongoose prototype
mongoose.Query.prototype.cache = function(options = { expire: config.defaultRedisCacheTTL || 10 }) { //Default TTL set to 60 seconds
  this.useCache = true;
  this.expire = options.expire;
  this.hashKey = JSON.stringify(options.key || this.mongooseCollection.name);
console.log("this.hashkey",this.hashKey);
  return this;
}

// override exec function to first check cache for data
mongoose.Query.prototype.exec = async function() {
  if (!this.useCache) { //If useCache method not called serve directly from mongo
    return await exec.apply(this, arguments);
  }

  //Generate redis key here
  const key = JSON.stringify({
    ...this.getQuery(),
    collection: this.mongooseCollection.name
  });

  // get cached value from redis
  const cacheValue = await client.hget(this.hashKey, key);

  // if cache value is not found, fetch data from mongodb and cache it
  if (!cacheValue) {
    const result = await exec.apply(this, arguments);
    // console.log("got result", this.hashKey, key, result)
    client.hset(this.hashKey, key, JSON.stringify(result));
    client.expire(this.hashKey, this.expire);

    console.log('Return data from MongoDB');
    return result;
  }

  // return found cachedValue
  const doc = JSON.parse(cacheValue);
  console.log('Return data from Redis');
  return Array.isArray(doc)
    ? doc.map(d => new this.model(d))
    : new this.model(doc);
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
}