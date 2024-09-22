// var db = require("../config/keys");
// var conn = require('../db/conn').getmongoConn(db.mongoURI);

// var QueueCount = require('../models/QueueCount');


// exports.getNextSequenceVal = (seq_type) => {

//     var SeqExists = QueueCount.count({ seq_type: seq_type }).then((res));




//     console.log("SeqExists", SeqExists);

//     // if (SeqExists > 0) {

//     //     var sequenceDoc = QueueCount.findOneAndUpdate({ seq_type: seq_type }, { $inc: { seq_val: 1 } }, { new: true }).then((result) => {

//     //         // console.log("result", result);

//     //         return result;
//     //     });


//     // } else {
//     //     var newQueueCount = new QueueCount({
//     //         seq_val: 0,
//     //         seq_type: seq_type
//     //     });

//     //     newQueueCount
//     //         .save()
//     //         .then(queue => console.log("New queue counter saved", queue))
//     //         .catch(err => console.log("New queue counter error while saving", err));

//     // }


//     // console.log("sequenceDoc.seq_val", sequenceDoc);


// }


// this.getNextSequenceVal("queue_counter");