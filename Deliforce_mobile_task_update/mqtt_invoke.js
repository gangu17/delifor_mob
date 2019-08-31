var AWS = require('aws-sdk');
AWS.config.region = 'ap-south-1';
var lambda = new AWS.Lambda();
const taskModel= require('./model').task;

module.exports.call = function (payload,admin,managers) {

    console.log('managers Data=----===',managers);

    payloadOfAdmin=Object.assign({},payload,{clientId:admin});
    console.log(payloadOfAdmin);
    let promiseArry=[sendNotifications(payloadOfAdmin)];
    if(managers.length){
        for(let i=0;i<managers.length;i++){
            console.log('managerSub',managers[i].cognitoSub);
            promiseArry.push(sendNotifications(Object.assign({},payload,{clientId:managers[i].cognitoSub})))
        }
    }

    return Promise.all(promiseArry);
};



function sendNotifications(payload) {
    var params = {
        FunctionName: 'testingawsiot', // the lambda function we are going to invoke
        InvocationType: 'Event',
        LogType: 'Tail',
        Payload: JSON.stringify(payload),

    };
    console.log('payload clie=======',payload.clientId);
    return new Promise((resolve,reject)=>{

        lambda.invoke(params, function (err, data) {
            console.log('invoking lamdba');
            if (err) {
                console.log(err);
                resolve();
            } else {
                console.log('Lambda said ' + data.Payload);
                resolve()
            }
        })
    });
    //console.log('payload+++++++',payload);
    //let payload= {'message':'ramachandra reddy',clientId:'017db723-1a62-4520-a544-a7eebc0b8b30'};

}