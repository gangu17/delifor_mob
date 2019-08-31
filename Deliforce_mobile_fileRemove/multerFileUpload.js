const constant = require('./constant')();
const currentBucketName = constant.BUCKET;
const aws = require('aws-sdk');
const s3 = new aws.S3({});

console.log('constant', constant);
console.log('constant', currentBucketName);
console.log('constant', currentBucketName.BUCKET_NAME);

function removeFile(imageName) {
  return new Promise((resolve, reject) => {
    s3.deleteObject({
      Bucket: currentBucketName.MOBILE_BUCKET_NAME,
      Key: imageName
    }, function (err, data) {
      if (err) {
        console.log(err);
        resolve();
      }
      else {
        console.log('file removed successfull', data);
        resolve();
      }
    })
  })
}

module.exports = {
  removeFile : removeFile
};

