const constant = require('./constant')();
const currentBucketName = constant.BUCKET;
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const s3 = new aws.S3({});
/*
aws.config.update({
  signatureVersion: 'v4',
  "accessKeyId": "AKIAICJBT2S532N2VUYQ",
  "secretAccessKey": "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"
});
*/

//console.log('constant',constant);
//console.log('currentBucketName',currentBucketName.BUCKET_NAME);
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: currentBucketName.MOBILE_BUCKET_NAME,
    //bucket:'deliforce-fileupload',
    /*    acl: 'public-read',*/

    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(csv)$/)) {
        return cb(new Error('Only csv files are allowed!'));
      }
      cb(null, true);
    },
    key: function (req, file, cb) {

      cb(null, Date.now() + file.originalname);
    }


  })
});



function removeFile(imageName) {
  return new Promise((resolve, reject) => {
    s3.deleteObject({
      Bucket: currentBucketName.BUCKET_NAME,
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
    upload :upload,
    removeFile : removeFile
};

