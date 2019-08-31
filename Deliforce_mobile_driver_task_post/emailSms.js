const AWS = require('aws-sdk');
AWS.config.region = 'ap-south-1';
const lambda = new AWS.Lambda();

module.exports.call = function (payload) {
  const params = {
    FunctionName: 'SmsAndEmailNotification', // the lambda function we are going to invoke
    InvocationType: 'Event',
    LogType: 'Tail',
    Payload: JSON.stringify(payload)
  };


  return new Promise((resolve, reject) => {
    lambda.invoke(params, function (err, data) {
      if (err) {
        console.log(err);
        return resolve()}
      else {
        console.log('email Lambda said ' + data.Payload);
        return resolve('mail sent');
      }
    })
  })
};


