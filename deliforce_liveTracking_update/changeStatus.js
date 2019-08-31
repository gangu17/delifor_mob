const result = require('./result');
const userModel = require('./model').user;
const driverLocationLogModel = require('./model').driverLocationLog;
const taskModel = require('./model').tasks;
const helper = require('./util');
var AWS = require('aws-sdk');
const lambda = new AWS.Lambda();
const mongoose = require('mongoose');

module.exports = {
    changeStatus: (event, cb, principals) => {
        const clientId = principals;
        const data = helper.getBodyData(event);
        // data={'status':2}
        console.log('data+++++++', data);
        console.log('clientId++++++++', clientId);
        if (!data) {
            result.invalidInput(cb);
        } else {
            return callMqttLambda(data).then(() => {
                let finalQuery = formQuery(data);
                return userModel.update({cognitoSub: clientId}, finalQuery)
                    .then((output) => {
                        console.log(JSON.stringify(output));
                        if (data.driverLiveLog) { // This if added becoz in IOS old version there is no driverLiveLog so checking for that if not there there was causing server error issue later after every IOS device is updated remove this if condition check directly for length if driverLiveLog
                            if (data.driverLiveLog.length) {
                                return userModel.findOne({cognitoSub: clientId}).then((driverInfo) => {
                                    return taskModel.find({
                                        driver: mongoose.Types.ObjectId(data.driverId),
                                        taskStatus: 4
                                    }, {_id: 1}).then((tasks) => {
                                        return driverLiveLogObjCreate(data, tasks, driverInfo).then((finalArray) => {
                                            console.log('finalArray', finalArray);
                                            return driverLocationLogModel.insertMany(finalArray).then(() => {
                                                console.log('Inserted driverLiveLog');
                                                if (output.nModified === 1) {
                                                    console.log('update successful');
                                                    result.sendSuccess(cb, {'message': 'driver Status updated suceessfull'});
                                                } else {
                                                    result.sendSuccess(cb, {'message': 'driver status is not update'});
                                                }
                                            }).catch((err) => {
                                                console.log(err);
                                                result.sendServerError(cb);
                                            });
                                        }).catch((err) => {
                                            console.log(err);
                                            result.sendServerError(cb);
                                        });
                                    }).catch((err) => {
                                        console.log(err);
                                        result.sendServerError(cb);
                                    });
                                }).catch((err) => {
                                    console.log(err);
                                    result.sendServerError(cb);
                                });
                            } else {
                                if (output.nModified === 1) {

                                    console.log('update successful');

                                    // return mqttInvoke.call({message:data.status,topic:'driver',driverDetails:driverDetails},adminDetails,managerDetails)
                                    //     .then(()=>{
                                    result.sendSuccess(cb, {'message': 'driver Status updated suceessfull'});
                                    //})

                                } else {
                                    result.sendSuccess(cb, {'message': 'driver status is not update'});
                                }
                            }
                        } else {
                            if (output.nModified === 1) {

                                console.log('update successful');

                                // return mqttInvoke.call({message:data.status,topic:'driver',driverDetails:driverDetails},adminDetails,managerDetails)
                                //     .then(()=>{
                                result.sendSuccess(cb, {'message': 'driver Status updated suceessfull'});
                                //})

                            } else {
                                result.sendSuccess(cb, {'message': 'driver status is not update'});
                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            })
        }

        function callMqttLambda(data) {
            let params = {
                FunctionName: 'liveTrackMqttLambda', // the lambda function we are going to invoke
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
    }
};

function driverLiveLogObjCreate(data, tasks, driverInfo) {
    return new Promise((resolve, reject) => {
        let newDate = new Date();
        let dateStamp = newDate.toLocaleDateString();
        let finalArray = [];
        let driverLiveLog = [];
        driverLiveLog = driverLiveLog.concat(data.driverLiveLog);
        tasks.forEach((element) => {
            let obj = {};
            obj.driverLiveLog = driverLiveLog;
            obj.clientId = driverInfo.clientId;
            obj.driverId = driverInfo.cognitoSub;
            obj.taskId = element._id;
            obj.date = newDate;
            obj.dateStamp = dateStamp;
            finalArray.push(obj);
        });
        resolve(finalArray);
    });
}

function formQuery(data) {
    let location = {type: 'Point', coordinates: [Number(data.location_lng), Number(data.location_lat)]};
    var query = {
        batteryState: data.batteryState
    };

    if (data.formattedAddress) {
        query.currentAddress = data.formattedAddress
    }

    if (data.location_lng && data.location_lat) {
        query.location = location;
    }

    return query;
}





