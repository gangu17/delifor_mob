const constant 		= require('./constant')();
const snsKeys = constant.SNS_KEY;
const topicArn = snsKeys.TOPICARN;
const driverModel   = require('./model').driver;
const userSettingsModel   = require('./model').userSettings;
const helper        = require('./util');
const result        = require('./result');
const AWS = require('aws-sdk');

AWS.config.update({
    "region":"ap-south-1"
});
const lambda = new AWS.Lambda();
const deviceTokenFile= require('./deviceToken');

// these below lines are commented because its only used when testing in local.
/*const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId : 'AKIAISQIBQWLUUIIJSAA',
  secretAccessKey : '9FeNrvMYkdDuI/MA3ZuASFn/--'
});

AWS.config.region = 'ap-south-1';*/


module.exports = {

    /*
    Function:subcribe token
    Input:call back , driver details
    output: Subcription

    */
    subscribeToken:(cb,driverData, deviceType, iosEndArn) =>
    {
        // Initialization of aws simple notification service
        const sns = new AWS.SNS();
        var platformArn;
        (deviceType === 1) ?  platformArn = (iosEndArn) ? iosEndArn : snsKeys.IOSPLATFORMARN :  platformArn = snsKeys.ANDOIRDPLATFORMARN;

        /*
        Function : create platform end point.
        Input    : Device Token , imp : (Its an impure function--> platform app arn taken from constant.js)
        Output   : Platform end point
        */

        const createSNSEndpoint = (deviceToken) => {
            console.log('deviceToken');
            const params = {
              //  PlatformApplicationArn: 'arn:aws:sns:ap-south-1:221980681332:app/GCM/andriodDeliforce',
                PlatformApplicationArn: platformArn,
                Token: deviceToken
            };

            return sns.createPlatformEndpoint(params).promise();
        };


        /*
        Function : Subscribing to a topic.
        Input    : Endpoint Arn (***this was recieved from the previous function***)
        Output   : Platform end point
        */

        const subscribeDeviceToTopic = (endpointArn) => {
            const params = {
                Protocol: 'application',
              //  TopicArn: 'arn:aws:sns:ap-south-1:221980681332:deliforceAndriodArn',
                TopicArn: topicArn,
                Endpoint: endpointArn
            };
            return sns.subscribe(params).promise();
        };



        /*
        Function : Registering device .
        Input    : token ( This function is binding two other functions).
        Output   : Subscription success or failure.
        */

        const registerDeviceWithAWS = (deviceToken) => {
            return createSNSEndpoint(deviceToken).then((result) => {
                console.log('result');
                const endpointArn = result.EndpointArn;
                saveEndpoint(endpointArn);
                return subscribeDeviceToTopic(endpointArn);
            });
        };


// This should be coming from mobile device(firebase or cloud base)
        let deviceToken = driverData.deviceToken;


        registerDeviceWithAWS(deviceToken).then((data)=>{
            console.log('devicefile',JSON.stringify(deviceTokenFile));
            console.log('driverData',driverData);
            fetchAdminAndManagersList(driverData,driverModel)
                .then((admAndManagersList)=>{
                   var mqttData = {
                        "formattedAddress": driverData.currentAddress,
                        "adminArray": admAndManagersList.newList,
                        "batteryState": driverData.batteryState,
                        "location_lng": driverData.location.coordinates[0],
                        "location_lat": driverData.location.coordinates[1],
                        "status": driverData.driverStatus,
                        "driverId": driverData._id,
                        "topic": "driver"

                    };

                    callMqttLambda(mqttData).then(()=>{
                        console.log('The end');
                     //   driverData = driverData ? driverData.toObject() : driverData;
                        var response = {'adminList':admAndManagersList.newList,'isGlympseEnable':admAndManagersList.isGlympseEnable,'driverId':driverData._id,'language':driverData.toObject().settings.language};
                        if(driverData.toObject().glympseUserName && driverData.toObject().glympsePassword) {
                            var driverGlympseLoginCredentials = {
                                username: driverData.toObject().glympseUserName,
                                password:driverData.toObject().glympsePassword
                            };
                            Object.assign(response,{user:driverGlympseLoginCredentials})
                        }
                        result.sendSuccess(cb,response);
                    });
                })
                .catch((err)=>{console.log(err);result.sendServerError(cb)});

        });


        function saveEndpoint(endpointArn){
            driverData.endpointArn = endpointArn ;
            driverData.save();
        }
    }


};


function callMqttLambda(data){
    console.log(data);
    let params = {
        FunctionName: 'driverMqttLamda', // the lambda function we are going to invoke
        InvokeArgs: JSON.stringify({data:data})
    };
    return new Promise((resolve,reject)=>{
        lambda.invokeAsync(params, function (err, data) {
            if (err) {
                return resolve(console.log(err));
            }
            else {
                console.log('success')
                return resolve(console.log(data));
            }
        })
    });
}



function fetchAdminAndManagersList(driverData,driverModel){
    console.log('needed function');
    let adminId= driverData.clientId;
    let teamId= driverData.assignTeam;
    return userSettingsModel.findOne({clientId:adminId}).then((userSettingsData)=> {
       userSettingsData = userSettingsData ? userSettingsData.toObject() : userSettingsData;
           var isGlympse = userSettingsData.isGlympseEnable;
        return driverModel.find({teams: teamId, isDeleted: 0})
            .then((managersList) => {
                if (managersList.length) {
                    let
                        newList = [];
                    newList = managersList.map((manager) => {
                        return manager.cognitoSub;
                    });
                    console.log('adminId', adminId);
                    newList.push(adminId);
                    console.log(newList);
                    return Promise.resolve({newList:newList, isGlympseEnable:isGlympse});
                }
                else {
                    let newList = [];
                    newList.push(adminId);
                    return Promise.resolve({newList:newList, isGlympseEnable:isGlympse});
                }
            })
    }).catch((err)=> {
        console.log('err' + err);
    })
}
