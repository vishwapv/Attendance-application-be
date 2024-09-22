const User = require("../models/User");
const keys = require("../config/keys");
var jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers && req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(403).send({ error: true, message: "No token provided." });

  jwt.verify(token, keys.secretOrKey, function (err, decoded) {
    if (err || !decoded)
      return res
        .status(400)
        .send({
          error: true,
          message: "Failed to authenticate token.Token Expired!",
        });

    let user_id = decoded.id || decoded.user_id;
    // console.log("decoded",decoded);

    User.findById(user_id, function (err, user) {
      if (err)
        return res
          .status(500)
          .send({
            error: true,
            message: "There was a problem finding the user.",
          });
      if (!user)
        return res.status(400).send({ error: true, message: "No user found." });
      if (decoded && decoded.user_id) {
        req.decodedBody = decoded;
      } else {
        decoded.user_id = decoded.id;
        req.decodedBody = decoded;
      }
      return next();
      // res.status(200).send(user);
    });
  });
};
