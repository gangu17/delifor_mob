const result = require('./result');
const helper = require('./util');
const userModel = require('./model').user;
const taskModel = require('./model').task;
const constant = require('./constant')();
const tables = constant.TABLES;
const AWS = require('aws-sdk');
const settingsModel = require('./model').settings;
const smsGateWayModel = require('./model').smsGateWayModel;
const userSettingsModel = require('./model').userSettings;
const pricingEarningLogModel = require('./model').pricingEarningLog;
const templateModel = require('./model').template;
const smsLogModel = require('./model').smslog;
const mongoose = require('mongoose');
const moment = require('moment-timezone');


module.exports = {
    updateTask: (event, cb, principals, deviceToken) => {
        const clientId = principals;
        const data = helper.getBodyData(event); // when uploading live uncomment this.
        data.principals = principals;
        data.deviceToken = deviceToken;
        console.log('data', JSON.stringify(data));

        if (!data) {
            result.invalidInput(cb);
        } else {
            console.log('check task status');
            return userModel.aggregate([
                {$match: {cognitoSub: clientId}},
                {
                    $lookup: {
                        from: tables.USER,
                        localField: 'clientId',
                        foreignField: 'cognitoSub',
                        as: 'adminInfo'
                    }
                },
                {
                    $lookup:
                        {
                            from: tables.USERSETTINGS,
                            localField: 'clientId',
                            foreignField: 'clientId',
                            as: 'userSettings'
                        }
                },
                {$unwind: '$userSettings'},
                {$unwind: '$adminInfo'},
                {
                    $project: {
                        '_id': 0,
                        'adminCognitoSub': '$adminInfo.cognitoSub',
                        'smsPlan': '$adminInfo.smsPlan',
                        'isOTPVerificationEnable': '$userSettings.isOTPVerificationEnable',
                        'isEarningsModule': '$userSettings.isEarningsModule'
                    }
                }
            ]).then((settingsData) => {
                settingsData = settingsData[0];
                let resData = {};
                resData.isOTPVerificationEnable = settingsData.isOTPVerificationEnable;
                resData.isEarningsModule = settingsData.isEarningsModule;
                console.log('otpEnable', settingsData);
                if (data.reSendOtp && data.reSendOtp === true) {
                    console.log('reSendOtp', data.reSendOtp);
                    let generatedOtp = Math.floor(1000 + Math.random() * 9000);
                    return taskModel.findOne({_id: mongoose.Types.ObjectId(data._id)}).then((taskDetails) => {
                        taskDetails = (taskDetails) ? taskDetails.toObject() : taskDetails;
                        Promise.all([getOtpTemplate('OTP_VERIFICATION', taskDetails.name, generatedOtp), getSmsGateWayData(settingsData.adminCognitoSub)]
                        ).then((smsData) => {
                            return sendSMS(settingsData.smsPlan, smsData[0], smsData[1], taskDetails).then(() => {
                                return taskModel.findOneAndUpdate({_id: mongoose.Types.ObjectId(data._id)}, {$set: {otp: generatedOtp}}, {new: true}).then((updatedTaskData) => {
                                    updatedTaskData = (updatedTaskData) ? updatedTaskData.toObject() : updatedTaskData;
                                    return getResponseData(updatedTaskData).then((resFinalData) => {
                                        resFinalData = Object.assign({}, resData, resFinalData);
                                        resFinalData.statusCode = 101;
                                        resFinalData.message = 'OTP Resent successfully';
                                        console.log('resFinalData', JSON.stringify(resFinalData));
                                        result.sendSuccess(cb, resFinalData);
                                    }).catch((err) => {
                                        console.log(err);
                                        result.sendServerError(cb);
                                    });
                                });
                            })
                        })
                    })
                } else {
                    if (settingsData.isOTPVerificationEnable === true && data.taskStatus === 6) {
                        return taskModel.findOne({_id: mongoose.Types.ObjectId(data._id)}).then((taskDetails) => {
                            taskDetails = (taskDetails) ? taskDetails.toObject() : taskDetails;
                            if (taskDetails.otp !== undefined) {
                                if (data.otp === 0) {
                                    return getResponseData(taskDetails).then((resFinalData) => {
                                        resFinalData = Object.assign({}, resData, resFinalData);
                                        resFinalData.statusCode = 104; // this statusCode is to direct to otp screen
                                        resFinalData.message = 'OTP screen';
                                        console.log('resFinalData', JSON.stringify(resFinalData));
                                        result.sendSuccess(cb, resFinalData);
                                    }).catch((err) => {
                                        console.log(err);
                                        result.sendServerError(cb);
                                    });
                                } else {
                                    console.log('OTP verified successfully');
                                    return callMobileTaskUpdateLambda(data).then((data) => {
                                        if (data.StatusCode === 200) {
                                            let payloadBody = JSON.parse(data.Payload).body;
                                            let parsedTaskDetails = JSON.parse(payloadBody).taskDetails;
                                            let parsedDriverEarning = JSON.parse(payloadBody).driverEarning;
                                            return getResponseData(parsedTaskDetails, parsedDriverEarning).then((resFinalData) => {
                                                resFinalData = Object.assign({}, resData, resFinalData);
                                                resFinalData.statusCode = 103; // this statusCode is to direct earning module
                                                resFinalData.message = 'Direct Earnings screen';
                                                console.log('resFinalData', JSON.stringify(resFinalData));
                                                result.sendSuccess(cb, resFinalData);
                                            }).catch((err) => {
                                                console.log(err);
                                                result.sendServerError(cb);
                                            });
                                        } else {
                                            console.log(data.statusCode);
                                            result.sendServerError(cb);
                                        }
                                    });
                                }
                            } else {
                                console.log("otp does not exists");
                                let generatedOtp = Math.floor(1000 + Math.random() * 9000);
                                if (settingsData.smsPlan === 1) {
                                    console.log('please select a sms plan');
                                    result.selectSmsPlan(cb);
                                } else {
                                    Promise.all([getOtpTemplate('OTP_VERIFICATION', taskDetails.name, generatedOtp), getSmsGateWayData(settingsData.adminCognitoSub)]
                                    ).then((smsData) => {
                                        return sendSMS(settingsData.smsPlan, smsData[0], smsData[1], taskDetails).then(() => {
                                            return taskModel.findOneAndUpdate({_id: mongoose.Types.ObjectId(data._id)}, {$set: {otp: generatedOtp}}, {new: true}).then((updatedTaskData) => {
                                                updatedTaskData = (updatedTaskData) ? updatedTaskData.toObject() : updatedTaskData;
                                                console.log('updatedTaskData', JSON.stringify(updatedTaskData));
                                                return getResponseData(updatedTaskData).then((resFinalData) => {
                                                    resFinalData = Object.assign({}, resData, resFinalData);
                                                    resFinalData.statusCode = 104; // this statusCode is to direct OTP screen
                                                    resFinalData.message = 'OTP sent successfully';
                                                    console.log('resFinalData', JSON.stringify(resFinalData));
                                                    result.sendSuccess(cb, resFinalData);
                                                });
                                            });
                                        })
                                    }).catch((err) => {
                                        console.log(err);
                                        result.sendServerError(cb);
                                    });

                                }
                            }
                        }).catch((err) => {
                            console.log(err);
                            result.sendServerError(cb);
                        });
                    } else if (settingsData.isEarningsModule === true && data.taskStatus === 6) {
                        return callMobileTaskUpdateLambda(data).then((data) => {
                            if (data.StatusCode === 200) {
                                let payloadBody = JSON.parse(data.Payload).body;
                                console.log(JSON.stringify(payloadBody));
                                let parsedTaskDetails = JSON.parse(payloadBody).taskDetails;
                                let parsedDriverEarning = JSON.parse(payloadBody).driverEarning;
                                return getResponseData(parsedTaskDetails, parsedDriverEarning).then((resFinalData) => {
                                    resFinalData = Object.assign({}, resData, resFinalData);
                                    resFinalData.statusCode = 103; // Usual task Update
                                    resFinalData.message = 'direct earnings module';
                                    console.log('resFinalData', JSON.stringify(resFinalData));
                                    result.sendSuccess(cb, resFinalData);
                                }).catch((err) => {
                                    console.log(err);
                                    result.sendServerError(cb);
                                });
                            } else {
                                console.log('err from callee lambda', data);
                                result.sendServerError(cb);
                            }
                        });
                    } else {
                        return callMobileTaskUpdateLambda(data).then((data) => {
                            if (data.StatusCode === 200) {
                                let payloadBody = JSON.parse(data.Payload).body;
                                let parsedTaskDetails = JSON.parse(payloadBody).taskDetails;
                                return getResponseData(parsedTaskDetails).then((resFinalData) => {
                                    resFinalData = Object.assign({}, resData, resFinalData);
                                    resFinalData.statusCode = 100; // Usual task Update
                                    resFinalData.message = 'normal Task updated';
                                    console.log('resFinalData', JSON.stringify(resFinalData));
                                    result.sendSuccess(cb, resFinalData);
                                }).catch((err) => {
                                    console.log(err);
                                    result.sendServerError(cb);
                                });
                            } else {
                                console.log('err from callee lambda', data);
                                result.sendServerError(cb);
                            }
                        });
                    }
                }
            }).catch((error) => {
                console.log(error);
                result.sendServerError(cb);
            });
        }
    }
};

function callMobileTaskUpdateLambda(taskDetails) {
    console.log('taskDetails', JSON.stringify(taskDetails));

    let aws = require('aws-sdk');
    let lambda = new aws.Lambda({
        region: 'ap-south-1' //change to your region
    });

    let params = {
        FunctionName: 'Deliforce_mobile_task_update', // the lambda function we are going to invoke
        Payload: JSON.stringify(taskDetails)
    };
    return new Promise((resolve, reject) => {
        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err, err.stack)
            }
            else {
                console.log('invoked Lambda', JSON.stringify(data));

                return resolve(data);
            }
        });
    });
}

function getOtpTemplate(action, name, otp) {
    console.log('action', JSON.stringify(action));
    return templateModel.findOne({action: action}).then((tempData) => {
        tempData = (tempData) ? tempData.toObject() : tempData;
        console.log('tempData', JSON.stringify(tempData));
        let data = {
            CUSTOMER_NAME: name,
            O_T_P: otp
        };
        return getTemplate(tempData.sms, data);
    }).catch((err) => {
        console.log(err);
        result.sendServerError(cb);
    });
}

function getSmsGateWayData(adminCognitoSub) {
    return smsGateWayModel.findOne({'clientId': adminCognitoSub}).then((smsGateWayData) => {
        smsGateWayData = (smsGateWayData) ? smsGateWayData.toObject() : null;
        return Promise.resolve(smsGateWayData);
    })
}

function getTemplate(template, data) {

    let content = {};
    let regX = /USER_NAME|CUSTOMER_NAME|O_T_P|AgentPhone|TotalTimeTaken|TotalDistanceTravelled|EmailSupport|CustomerName|CustomerAddress|AgentName|EndTime|ExpectedTime|EndDate|OrderId|StartDate|StartTime|TrackingLink|RatingLink|CompanyName|CompletedTime|pickUp|taskId/gi;
    let emailContent = template.replace(/[\[\]']+/g, ''); // first remove the [] ;
    content = emailContent.replace(regX, function (matched) {
        return data[matched];
    });
    return content;
}

function sendSMS(smsPlan, smsTemp, smsGateWayData, data) {
    if (smsPlan !== 1) {
        console.log('smsTemp', smsTemp);
        return new Promise((resolve, reject) => {
            console.log('coming to sms');
            let gateWay;
            if (smsGateWayData === null) {
                gateWay = null;
            } else if (smsPlan === 2 && smsGateWayData) {
                gateWay = null;
            } else {
                gateWay = smsGateWayData.gateway;
            }

            switch (gateWay) {
                case 1:
                    resolve(callTwilio(data, smsGateWayData, smsTemp));
                    break;

                case 2:
                    resolve(callMsg91(data, smsGateWayData, smsTemp));
                    break;

                case 3:
                    resolve(callSparrow(data, smsGateWayData, smsTemp));
                    break;
                default:
                    resolve(callDefaultTwilio(data, smsGateWayData, smsTemp));
                    break;
            }
        });
    }
}


function callTwilio(data, smsGateWayData, sms) {
    const client = require('twilio')(smsGateWayData.accountSid, smsGateWayData.authToken);
    return new Promise((resolve, reject) => {
        client.messages.create({
            from: smsGateWayData.phone,
            to: data.phone.replace(' ', ''),
            body: sms
        }).then((message) => {
            console.log('message', message.sid);
            return resolve(message.sid);
        }).catch((err) => {
            return resolve(console.log('error sending message', err));
        })
    });

}

function callMsg91(data, smsGateWayData, sms) {

    const msg91 = require('msg91')(smsGateWayData.apiKey, smsGateWayData.senderId, smsGateWayData.routeNo);

    return new Promise((resolve, reject) => {
        const mobileNo = getmobileNo(data);
        console.log(mobileNo);

        msg91.send(mobileNo, sms, function (err, response) {
            if (err) {
                console.log('error');
                console.log(err);
                return resolve({'message': 'error in sending sms'})
            }
            else {
                console.log('success');
                console.log(response);
                return resolve({'message': 'sending sms is sucessful'});
            }
        });
    });
}

function callSparrow(data, smsGateWayData, smsData) {

    let authObject = {
        token: smsGateWayData.token,
        identity: smsGateWayData.identity
    };

    function sms(authObject) {
        return new Promise((resolve, reject) => {
            resolve(sparrowSMS.setAuth(authObject));
        });
    }

    return new Promise((resolve, reject) => {
        return resolve(sms(authObject).then(() => {
            let phone = data.phone.split(' ');
            sparrowSMS.sendSMS({
                text: smsData,
                recipients: phone[1]
            })
        }));
    });
}

function callDefaultTwilio(data, smsGateWayData, sms) {

    const accountSid = constant.TWILIO.ACCOUNT_SID;
    const authToken = constant.TWILIO.AUTH_TOKEN;
    const defaultPhone = constant.TWILIO.PHONE;

    const client = require('twilio')(accountSid, authToken);

    return new Promise((resolve, reject) => {
        client.messages.create({
            from: defaultPhone,
            to: data.phone.replace(' ', ''),
            body: sms
        }).then((message) => {
            console.log('message.sid', message.sid);
            return client.messages(message.sid)
                .fetch()
                .then((messageData) => {
                    console.log('messageData', JSON.stringify(messageData));
                    let smsLogData = {};
                    let promise = new Promise(resolve => {
                        smsLogData.messageSid = messageData.sid;
                        smsLogData.from = messageData.from;
                        smsLogData.to = messageData.to;
                        smsLogData.content = messageData.body;
                        smsLogData.contentSegments = messageData.numSegments;
                        smsLogData.price = Math.abs(messageData.price);
                        smsLogData.priceUnit = messageData.priceUnit;
                        smsLogData.clientId = data.clientId;
                        smsLogData.status = messageData.status;
                        smsLogData.dateSent = new Date(messageData.dateSent);
                        resolve(smsLogData);
                    });
                    return promise.then(smsLogData => {
                        return new smsLogModel(smsLogData).save().then((res) => {
                            console.log('smsLogData', smsLogData);
                            return resolve(res);
                        }).catch((err) => {
                            console.log('err', err);
                        })
                    });
                }).catch((err) => {
                    console.log('err storing smsLog', err);
                })
        }).catch((err) => {
            return resolve(console.log('error sending message', err));
        });
    });
}

function getmobileNo(data) {
    const phone = data.phone.substr(data.phone.indexOf('+') + 1);
    let finalPhone = phone.replace(' ', '');
    let countryCode = '0';

    let mobileNo = countryCode + finalPhone;
    console.log(mobileNo, 'mobileNo');
    return mobileNo;
}

function getResponseData(data, driverEarningData) {
    return new Promise((resolve, reject) => {
        console.log('taskDetails', JSON.stringify(data));
        let resData = {
            pickUpAddress: (data.startAddress) ? data.startAddress : '',
            deliveryAddress: (data.startAddress) ? data.address.formatted_address: '',
            distanceTravelled: (data.distance) ? data.distance : 0,
            travelTime: (data.timeTakenForTaskCompletion) ? data.timeTakenForTaskCompletion : 0,
            actualStartedTime: (data.actualStartedTime) ? moment(data.actualStartedTime).tz(data.timezone).format("DD MMM YYYY hh:mm A") : null,
            actualCompletedTime: (data.actualCompletedTime) ? moment(data.actualCompletedTime).tz(data.timezone).format("DD MMM YYYY hh:mm A") : null,
            otp: (data.otp) ? data.otp: '',
            amount: ''
        };
        if (driverEarningData) {
            console.log('driverEarningData', JSON.stringify(driverEarningData));
            resData.amount = driverEarningData.totalSum;
        }

        return resolve(resData);
        /*return pricingEarningLogModel.findOne({taskId: mongoose.Types.ObjectId(data._id)}, {'driverEarnings.totalSum': 1}).then((amount) => {
            amount = (amount != null) ? amount : 0;
            resData.amount = amount;
            return resolve(resData);
        });*/
    });
}