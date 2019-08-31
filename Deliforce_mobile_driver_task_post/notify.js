const AWS = require('aws-sdk');
AWS.config.region = 'ap-south-1';
const lambda = new AWS.Lambda();

module.exports.call = function (payload) {
  const params = {
    FunctionName: 'sns_push_notifications', // the lambda function we are going to invoke
    InvocationType: 'Event',
    LogType: 'Tail',
    Payload: JSON.stringify(payload)
  };


  return new Promise((resolve, reject) => {
    lambda.invoke(params, function (err, data) {
      if (err) reject(err);
      else {
        console.log('Lambda said ' + data.Payload);
        return resolve('mail sent');
      }
    })
  })
};


