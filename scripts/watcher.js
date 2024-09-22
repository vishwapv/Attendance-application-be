 var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect("mongodb://localhost:27017/edu-app")
     .then(function(client){
       let db = client.db('edu-app')

       let change_streams = db.collection('teacher_homeworks').watch()
          change_streams.on('change', function(change){
            console.log(JSON.stringify(change));
          });
      });
