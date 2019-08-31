const result = require('./result');
const userModel = require('./model').user;
const driverLocationLogModel = require('./model').driverLocationLog;
const helper = require('./util');
var AWS = require('aws-sdk');
AWS.config.region = 'ap-south-1';
const lambda = new AWS.Lambda();
const constant = require('./constant')();
const driverStatus = constant.DRIVER_STATUS;
const endPointConstant = constant.ENDPOINT_ARN;
var iotdata = new AWS.IotData({endpoint: endPointConstant.ENDPOINT_ARNKEY});

module.exports = {
    changeStatus: (event, cb, principals, deviceToken) => {
        const clientId = principals;
        const data = helper.getBodyData(event);
        // data={'status':2}
        console.log('data+++++++', data);
        console.log('clientId++++++++', clientId);
        if (!data) {
            result.invalidInput(cb);
        } else {
            return callMqttLambda(data).then(() => {
                return userModel.findOne({cognitoSub: clientId}).then((driverRes) => {
                    console.log(driverRes);
                    var driverDetails = (driverRes.toObject()) ? driverRes.toObject() : driverRes;
                    var finalQuery = formQuery(data, driverDetails, deviceToken);
                    return userModel.findOneAndUpdate({cognitoSub: clientId}, {$set: finalQuery}, {new: true}, function (err, res) {
                        if (err) {
                            result.sendSuccess(cb, {'message': 'driver status is not update'});
                        } else {
                            if (data.driverIdleLog) {
                                if (data.driverIdleLog.length) {
                                    return userModel.findOne({cognitoSub: clientId}).then((driverInfo) => {
                                        return driverIdleLogObjCreate(data, driverInfo).then((finalArray) => {
                                            console.log('finalArray', finalArray);
                                            return driverLocationLogModel.insertMany(finalArray).then(() => {
                                                console.log('Inserted driverLiveLog');
                                                console.log('update successful', res);
                                                result.sendSuccess(cb, {'message': 'driver Status updated suceessfull'});
                                            })
                                        })
                                    })
                                } else {
                                    console.log('update successful', res);
                                    result.sendSuccess(cb, {'message': 'driver Status updated suceessfull'});
                                }
                            } else {
                                console.log('update successful', res);
                                result.sendSuccess(cb, {'message': 'driver Status updated suceessfull'});
                            }
                        }
                    }).catch((error) => {
                        console.log('err', error);
                        handlerError(error, cb)
                    });

                }).catch((error) => {
                    console.log('err', error);
                    handlerError(error, cb)
                });

            })
        }
    }
};

function formQuery(data, driverDetails, deviceToken) {
    var finalDriverStatus;
    var query = {};
    let location = {type: 'Point', coordinates: [Number(data.location_lng), Number(data.location_lat)]};
    if (driverDetails.driverStatus === driverStatus.BLOCKED) {
        finalDriverStatus = driverStatus.BLOCKED
    } else {
        finalDriverStatus = data.status;
    }

    if (data.versionName) {
        query.appVersion = data.versionName;
    }

    if (deviceToken && driverDetails.deviceToken && driverDetails.deviceToken !== deviceToken) {
        query.driverStatus = driverDetails.driverStatus;

    } else {
        query.driverStatus = finalDriverStatus;
        query.batteryState = data.batteryState;


        if (data.formattedAddress) {
            query.currentAddress = data.formattedAddress;
        }

        if (data.location_lng && data.location_lat) {
            query.location = location;
        }

        if (data.isLogOut && data.isLogOut === true) {
            query.endpointArn = "";
            query.deviceToken = "";
        }
    }
    return query;
}

function callMqttLambda(data) {
    let params = {
        FunctionName: 'driverMqttLamda', // the lambda function we are going to invoke
        InvokeArgs: JSON.stringify({data: data})
    };
    return new Promise((resolve, reject) => {
        lambda.invokeAsync(params, function (err, data) {
            if (err) {
                return resolve(console.log(err));
            }
            else {
                return resolve(console.log(data));
            }
        })
    });
}

function driverIdleLogObjCreate(data, driverInfo) {
    return new Promise((resolve, reject) => {
        let newDate = new Date();
        let dateStamp = newDate.toLocaleDateString();
        let finalArray = [];
        let driverIdleLog = [];
        driverIdleLog = driverIdleLog.concat(data.driverIdleLog);
        let obj = {};
        obj.driverIdleLog = driverIdleLog;
        obj.clientId = driverInfo.clientId;
        obj.driverId = driverInfo.cognitoSub;
        obj.date = newDate;
        obj.dateStamp = dateStamp;
        finalArray.push(obj);
        resolve(finalArray);
    });
}
