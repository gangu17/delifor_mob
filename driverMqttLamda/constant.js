const AWS = require('aws-sdk');
AWS.config.update({correctClockSkew: true});
/*AWS.config.update({
    "accessKeyId": "AKIAJ2636I4HJO2LP6AA",
    "secretAccessKey": "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",
    region: "ap-south-1"
});*/
let constants;
module.exports = (function () {
  if (constants) {
    console.log('constant from cache');
    return constants;
  } else {
    return new Promise((resolve, reject) => {
      const s3 = new AWS.S3(); // Pass in opts to S3 if necessary

        /*const getParams = {
          Bucket: 'lambda-constant', // your bucket name,
          Key: 'constant.json' // path to the object you're looking for
        };*/
        const getParams = {
            Bucket: process.env.bucketName, // your bucket name,
            Key: process.env.constantFileName // path to the object you're looking for
        };

      s3.getObject(getParams, function (err, data) {
        // Handle any error and exit
        if (err) {
          reject(err);
        } else {
          constants = JSON.parse(data.Body.toString('utf-8'));// Use the encoding necessary
          //console.log(constants);
          resolve(constants);
        }

      });
    });
  }
});

//{"fromTrigger":1}
