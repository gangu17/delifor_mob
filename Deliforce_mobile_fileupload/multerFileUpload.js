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
console.log('inside multer file');
//console.log('currentBucketName',currentBucketName.BUCKET_NAME);
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: currentBucketName.MOBILE_BUCKET_NAME,
    limits: {fileSize: 10 * 1024 * 1024},
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

module.exports = {
    upload :upload
};

