var AWS = require("aws-sdk"),
  fs = require("fs");

exports.s3Uploader = (keys, file, Obj, uploadtype) => {
  return new Promise((resolve, reject) => {
    let s3bucket = new AWS.S3({
      accessKeyId: keys.accessKeyId,
      secretAccessKey: keys.secretAccessKey,
      Bucket: keys.bucket,
      region: keys.region,
      apiVersion: "2006-03-01",
    });

    var ResponseData = [];
    
    var audioResponse = [];
    var imageResponse = [];
    var videoResponse = [];

    file.map((item) => {
      console.log("prep uploading to s3", item);
      let key ="";
      if (uploadtype == "feedback") {

        key = (`uploads/${Obj.teacher_id != undefined ? Obj.teacher_id : Obj.teacher_homework && Obj.teacher_homework.teacher_id}/${Obj._id}/feedback/${item.originalname}`);

      }
      else if(uploadtype == "assignment"){
        key = `uploads/assignment/${Obj.teacher_id}/${Obj.assessment_id}/${item.originalname}` ;
      }
      else if(uploadtype == "annotation"){
        key = `uploads/annotation/${Obj._id}/${Obj.teacher_homework}/${item.originalname}` ;
      }
       else {
        key = (`uploads/${Obj.teacher_id != undefined ? Obj.teacher_id : Obj.teacher_homework && Obj.teacher_homework.teacher_id}/${Obj._id}/${item.originalname}`);
      }
      var params = {
        Bucket: keys.bucket,
        Key: key,
        Body: item.buffer,
        ACL: "public-read",
      };

      s3bucket.upload(params, function (err, data) {
        console.log("uploading to s3", data);

          if (err) reject(err);
  
          // ResponseData.push(data);
          if (/^image\/(jpe?g|png|gif)$/i.test(item.mimetype)) imageResponse.push(data)

          if (/^video\/(x-flv|mp4|x-mpegURL|MP2T|3gpp|quicktime|x-msvideo|x-ms-wmv)$/i.test(
              item.mimetype)) videoResponse.push(data)
  
          if (/^audio\/(basic|L24|mid|mpeg|mp3|mp4|x-aiff|x-mpegurl|ogg|m4a|vorbis|vnd.wav|vnd.rn-realaudio|webm)$/i.test(
              item.mimetype)) audioResponse.push(data)


          if ((imageResponse.length + audioResponse.length + videoResponse.length) == file.length) {
            resolve({
              error: false,
              Message: uploadtype=="assignment"?"assignment files uploaded successfully":"Homework files uploaded successfully",
              image: imageResponse,
              audio: audioResponse,
              video: videoResponse
            });
          }
        });
    })
  }).catch((err)=> {
    console.log("reject(err)",(err));
    reject(err)
  });
};
