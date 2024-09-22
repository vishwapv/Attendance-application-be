var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/";
var i = 0;
var mongoose = require("mongoose");

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("edu-app");

dbo.collection("student_homeworks").find().forEach(
    function (elem) {
        var newId = mongoose.Types.ObjectId(elem.teacher_homework[0]._id);
        console.log("NewId", newId);

         dbo.collection("student_homeworks").updateMany(
            {
                _id: elem._id
            },
            {
                $set: {
                    teacher_homework: newId
                }
            }
        );

        i++;

        console.log("updated", i);

    }
);


});
