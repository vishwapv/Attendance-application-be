var base64 = require("node-base64-image");

exports.encode = (imageUrl) => {
  
  return new Promise((resolve, reject) => {
    console.log("imageUrl", imageUrl);
    const options = {
      string: true
    };

    base64.encode(imageUrl, options).then((response)=>{
      resolve(response);

    }).catch((err)=> reject(err));
  }).catch((err) => {
    console.log("reject(err)", err);
    reject(err);
  });
};

// img2base64(
//   "https://www.dictionary.com/e/wp-content/uploads/2019/04/1000x700-country-music-v1.jpg"
// );
