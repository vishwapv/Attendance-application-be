var Geohash = require("ngeohash");

var lat = process.argv[1];
let lng = process.argv[2];

let geoHash = Geohash.encode(lat, lng, 7);

console.log("geohash",geoHash);


console.log("geodecode", Geohash.decode("tdr4"));
