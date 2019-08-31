const result = require('./result');
const taskModel = require('./model').task;
const userModel = require('./model').user;
const taskLogModel = require('./model').taskLog;
const settingsModel = require('./model').settings;
const teamModel = require('./model').teams;
const webhookModel = require('./model').webhook;
const smsGateWayModel = require('./model').smsGateWayModel;
const driverLocationLogModel = require('./model').driverLocationLogModel;
const smsLogModel = require('./model').smsLogModel;
const helper = require('./util');
const mqttInvoke = require('./mqtt_invoke');
const mongoose = require('mongoose');
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();
const constant = require('./constant')();
const endPointConstant = constant.ENDPOINT_ARN;
const business = constant.BUSINESS_TYPE;
const taskConst = constant.TASK_STATUS;
const taskColor = constant.STATUS_COLORS;
const smsKey = constant.SMS_KEY;
const isIt = constant.isIt;
const sendGridKey = constant.SENDGRID;
const sgMail = require('@sendgrid/mail');
const driverLogModel = require('./model').driverLog;
console.log('sendGridKey.API_KEY', sendGridKey.API_KEY);
sgMail.setApiKey(sendGridKey.API_KEY);
const msg91 = require('msg91')(smsKey.API_KEY, smsKey.SENDER_ID, smsKey.ROUTE_NO);
const moment = require('moment-timezone');
const rp = require('request-promise');
const TinyURL = require('tinyurl');
var iotdata = new AWS.IotData({endpoint: endPointConstant.ENDPOINT_ARNKEY});
const sparrowSMS = require('sparrow-sms');
const preferencesModel = require('./model').preference;
const userSettingsModel = require('./model').userSettings;
const earningModel = require('./model').earning;
const earningLogModel = require('./model').earningLog;
const support = constant.SUPPORT.EMAIL;
const tables = constant.TABLES;
const templateModel = require('./model').template;
var _ = require('lodash');

module.exports = {
    updateTask: (event, cb, principals, deviceToken) => {
        const clientId = principals;
        const data = event; // when uploading live uncomment this.
        console.log('data', JSON.stringify(data));
        // data.taskStatus = 21;
        // data.fieldName = 'text';
        // data.fieldValue = 'somesampleValue';
        if (!data) {
            result.invalidInput(cb);
        } else if (data.taskStatus === 0) {
            result.sendSuccess(cb, {'message':'Task status is invalid'})
        } else if (data.taskStatus === 22) {  // for duplication of fields
            taskModel.findOne({_id: mongoose.Types.ObjectId(data._id)}).then((taskData) => {
                taskData = taskData.toObject();
                // var index = _.findIndex(customFieldsData.templates, {fieldName: data.fieldName,order:data.order-1});
                // var customFieldsParticularData = JSON.parse(JSON.stringify(customFieldsData.templates[index]));
                // console.log(customFieldsParticularData)
                // customFieldsParticularData.order = data.order;
                // customFieldsParticularData.fieldValue = '';
                // customFieldsData.templates.splice(index+1, 0, customFieldsParticularData);
                //  customFieldsData.templateId = 1;
                var taskCopy = JSON.parse(JSON.stringify(taskData));
                templateModel.findOne({templateId: taskCopy.templateId}).then((templateData) => {
                    templateData = (templateData) ? templateData.toObject() : templateData;
                    var tempLength = templateData.templates.length;
                    var customFieldsTemplatecopy = [];
                    for (let i = 0; i < tempLength; i++) {
                        customFieldsTemplatecopy.push(taskCopy.templates[i]);
                    }
                    for (let i = 0; i < customFieldsTemplatecopy.length; i++) {
                        if (customFieldsTemplatecopy[i].dataType !== 'checklist') {
                            customFieldsTemplatecopy[i].fieldValue = '';
                        }
                        if (customFieldsTemplatecopy[i].dataType === 'checklist') {
                            customFieldsTemplatecopy[i].selectedValues = [];
                        }

                    }

                    console.log(templateData);

                    //  var templatesCopy = JSON.parse(JSON.stringify(templateData)) ;

                    var final = taskData.templates.concat(customFieldsTemplatecopy);
                    console.log(final);
                    for (let i = 0; i < final.length; i++) {
                        final[i].order = i;
                    }
                    taskModel.update({_id: mongoose.Types.ObjectId(data._id)}, {templates: final}, {upsert: true}).then((cData) => {
                        result.sendSuccess(cb, {message: 'field Added'});
                    });

                })

            }).catch((err) => {
                console.log(err);
                result.sendServerError(cb);
            })
        } else if (data.taskStatus === 21) {
            console.log('check heree')// for customFields tasklog
            taskModel.findOne({_id: mongoose.Types.ObjectId(data._id)}).then((customFieldsData) => {
                customFieldsData = customFieldsData.toObject();
                var customFieldsDatacopy = JSON.parse(JSON.stringify(customFieldsData));
                console.log('one');
                console.log(customFieldsData + 'fieldsData heree');
                var index = _.findIndex(customFieldsData.templates, {fieldName: data.fieldName, order: data.order});
                var customCopy = customFieldsDatacopy.templates[index];
                customCopy.fieldValue = customFieldsDatacopy.templates[index].fieldValue;
                customFieldsData.templates[index].fieldValue = data.fieldValue;
                //  customFieldsData.templates[index].fieldValue = data.fieldValue;
                // if(customCopy.fieldValue === '') {
                //     customCopy.fieldValue = '-'
                // }


                if (data.selectedValues) {
                    customFieldsData.templates[index].selectedValues = data.selectedValues;
                }
                console.log('two')
                updateTaskForCustomFields(data._id, customFieldsData.templates, cb, clientId, data, customCopy);

            }).catch((err) => {
                console.log(err + 'error hereeee');
            })
        } else {
            return fetchDriverDetails(clientId).then((driverDeviceToken) => {
                var driverDevice = (driverDeviceToken.toObject()) ? driverDeviceToken.toObject() : driverDeviceToken;
                if (deviceToken && driverDevice.deviceToken && deviceToken !== driverDevice.deviceToken) {
                    result.duplicateLogin(cb);
                } else {
                    return fetchTaskDetails(data._id).then((taskDetails) => {
                        if (taskDetails.taskStatus === taskConst.DECLINED || taskDetails.taskStatus === taskConst.FAIL || taskDetails.taskStatus === taskConst.CANCELLED) {
                            driverTaskCount(data, driverDevice).then(() => {
                                result.sendAdminChangedStatus(cb);
                            });
                        } else {
                            return callMqttLambda(data).then(() => {
                                return getWebHookData(data).then((webhookData) => {
                                    checkTaskCompletionOrNot(data, clientId, webhookData, driverDevice).then((newData) => {
                                        //   console.log('new Data ', JSON.stringify(newData));
                                        //   console.log('taskId', JSON.stringify(newData._id));
                                        const _id = newData._id;
                                        delete newData._id;
                                        newData.taskColor = getTaskColor(newData.taskStatus);
                                        //   console.log('newDate0', newData);
                                        newData.actualCompletedTime = newData.completedTime;
                                        return taskModel.findOneAndUpdate({_id: mongoose.Types.ObjectId(_id)}, {$set: newData}, {
                                            new: true,
                                            upsert: true,
                                            setDefaultsOnInsert: true
                                        }, function (error, resp) {
                                            if (error) {
                                                //    console.log('not entering here!!!!!!!!!!!!!!!');
                                                //   console.log(error);
                                                result.sendServerError(cb);
                                            }
                                            else {
                                                Promise.all([sendPush(clientId, _id, cb, data), driverTaskCount(data, driverDevice)]).then((res) => {
                                                    console.log('after push', JSON.stringify(res));
                                                    callDriverMqttLambda(data, res).then((dd) => {
                                                        var finalRes = {
                                                            taskDetails: resp,
                                                            taskStatus: data.taskStatus,
                                                            driverStatus: res[1].driverStatus
                                                        };
                                                        if (newData.driverEarning) {
                                                            finalRes.driverEarning = newData.driverEarning
                                                        }
                                                        result.sendSuccess(cb, finalRes);
                                                    });
                                                });
                                            }
                                        });

                                    }).catch((error) => {
                                        console.log('error', error);
                                        result.sendServerError(cb);
                                    })
                                });
                            });
                        }
                    }).catch((error) => {
                        console.log(error);
                        result.sendServerError(cb);
                    })
                }
            }).catch((error) => {
                console.log(error);
                result.sendServerError(cb);
            })
        }
    }
};

function getWebHookData(data) {
    return userModel.findOne({cognitoSub: {$in: data.adminArray}, role: 1}).then((admin) => {
        admin = admin.toObject();
        return webhookModel.find({clientId: admin.cognitoSub}).then((webhookData) => {
            console.log(webhookData);
            return webhookData;
        })
    })
}

function getTaskColor(status) {
    if (status === taskConst.UNASSIGNED) {
        return taskColor.UNASSIGNED;
    } else if (status === taskConst.ASSIGNED) {
        return taskColor.ASSIGNED;
    } else if (status === taskConst.ACCEPTED) {
        return taskColor.ACCEPTED;
    } else if (status === taskConst.STARTED) {
        return taskColor.STARTED;
    } else if (status === taskConst.ARRIVED) {
        return taskColor.ARRIVED;
    } else if (status === taskConst.SUCCESS) {
        return taskColor.SUCCESS;
    } else if (status === taskConst.FAIL) {
        return taskColor.FAIL;
    } else if (status === taskConst.DECLINED) {
        return taskColor.DECLINED;
    } else if (status === taskConst.CANCELL) {
        return taskColor.CANCELL;
    } else if (status === taskConst.ACKNOWLEDGE) {
        return taskColor.ACKNOWLEDGE;
    } else {
        return null;
    }
}


function sendPush(clientId, _id, cb, data) {
    return Promise.all([findAdminAndManager(clientId), attachTaskDetails(_id), getSmsGateWayData(data)])
        .then((res) => {
            let adminDetails = res[0].admin;
            let smsGateWayData = res[2].smsGateWayData;
            let managerDetails = res[0].managers;
            let driverName = res[0].driverInfo.name;
            let company = res[0].company;
            let taskDetails = res[1];
            let updatedTaskStatus = data.taskStatus;
            let glympseTrackingURL;
            if(data.glympseTrackingURL) {
                glympseTrackingURL = data.glympseTrackingURL;
            }
            return invoke_sns_lambda(taskDetails, data.taskStatus, driverName, company, adminDetails, smsGateWayData, glympseTrackingURL)
                .then(() => {
                    return addTaskLogCollection(taskDetails, updatedTaskStatus, driverName, adminDetails).then((resLog) => {
                        return Promise.resolve(resLog);
                        //  return 'success';
                    })
                })

        }).catch((error) => {
            console.log(error);
            result.sendServerError(cb);
        })
}

function checkTaskCompletionOrNot(data, clientId, webhookData, driverDetails) {
    let method = 'POST';
    //4 means stated 6 means success
    if (data.taskStatus !== 6 && data.taskStatus !== 4 && data.taskStatus !== 9 && data.taskStatus !== 8) {
         console.log('Task is not success');
         console.log(data.taskStatus);
        return Promise.resolve(data);
    } else if (data.taskStatus === 8) {
        let url;
        let triggerName;
        console.log('webHookArr', JSON.stringify(webhookData));
        for (let i = 0; i < webhookData.length; i++) {
            webhookData[i] = webhookData[i].toObject();
            if (webhookData[i].trigger === data.taskStatus) {
                url = webhookData[i].url;
                triggerName = webhookData[i].triggerName;
            }
        }
        fetchTaskDetails(data._id).then((taskDetails) => {
            console.log('taskDetails', JSON.stringify(taskDetails));
            taskDetails = taskDetails.toObject();
            let options = {
                method: method,
                uri: url,
                body: {
                    taskStatus: data.taskStatus,
                    taskId: taskDetails.taskId,
                    triggerName: triggerName
                },
                json: true
            };
            rp(options)
                .then(() => {
                    console.log('body', JSON.stringify(options.body));
                })
                .catch((err) => {
                    console.log('err', JSON.stringify(err));
                });
        });
        return Promise.resolve(Object.assign({driver: null}, data));
    } else if (data.taskStatus === 4) {
        let url;
        let triggerName;
        console.log('webHookArr', JSON.stringify(webhookData));
        for (let i = 0; i < webhookData.length; i++) {
            webhookData[i] = webhookData[i].toObject();
            if (webhookData[i].trigger === data.taskStatus) {
                url = webhookData[i].url;
            }
        }
        fetchTaskDetails(data._id).then((taskDetails) => {
            console.log('taskDetails', JSON.stringify(taskDetails));
            taskDetails = taskDetails.toObject();
            let options = {
                method: method,
                uri: url,
                body: {
                    taskStatus: data.taskStatus,
                    taskId: taskDetails.taskId,
                    triggerName: triggerName
                },
                json: true
            };
            rp(options)
                .then(() => {
                    console.log('body', JSON.stringify(options.body));
                })
                .catch((err) => {
                    console.log('err', JSON.stringify(err));
                });
        });
        let loc;
        if (!data.startLat || !data.startLng) {
            loc = {type: "Point", coordinates: [0, 0]};
        } else {
            loc = {type: "Point", coordinates: [data.startLng, data.startLat]};
        }
        return Promise.resolve(Object.assign(data, {
            'actualStartedTime': data.startedTime,
            'startLocation': loc,
            'startAddress': data.formattedAddress
        }))
        /* return fetchTaskDetails(data).then((taskDetails)=>{
             let taskInfo = (taskDetails) ? taskDetails.toObject() : '';
             return userModel.update({_id: mongoose.Types.ObjectId(taskInfo.driver)}, {driverStatus: 2}).then((res) => {
                 //    console.log('driverUpdated Status', JSON.stringify(res))
                 return Promise.resolve(Object.assign(data, {'actualStartedTime': data.startedTime}))
             })
         });*/
    }
    //'CANCELLED': 9
    else if (data.taskStatus === 9) {
        let url;
        let triggerName;
        console.log('webHookArr', JSON.stringify(webhookData));
        for (let i = 0; i < webhookData.length; i++) {
            webhookData[i] = webhookData[i].toObject();
            if (webhookData[i].trigger === data.taskStatus) {
                url = webhookData[i].url;
            }
        }
        return fetchTaskDetails(data._id).then((taskDetails) => {
            console.log('taskDetails', JSON.stringify(taskDetails));
            let taskInfo = (taskDetails) ? taskDetails.toObject() : '';
            let options = {
                method: method,
                uri: url,
                body: {
                    taskStatus: data.taskStatus,
                    taskId: taskInfo.taskId,
                    triggerName: triggerName
                },
                json: true
            };
            rp(options)
                .then(() => {
                    console.log('body', JSON.stringify(options.body));
                })
                .catch((err) => {
                    console.log('err', JSON.stringify(err));
                });
            console.log(JSON.stringify(taskInfo) + '148');
            let actualStartedTime = (taskInfo.actualStartedTime) ? taskInfo.actualStartedTime : new Date();
            let diff = new Date().valueOf() - new Date(actualStartedTime.valueOf());
            let diffInMinuts = Math.ceil(diff / 1000 / 60);
            data.timeTakenForTaskCompletion = diffInMinuts;
            return handleSuceessAndFieldTask(clientId, taskInfo, diffInMinuts).then(() => {
                return Promise.resolve(Object.assign(data, {reason: data.reason}));
            })
        })


    } else {
        let url;
        let triggerName;
        console.log('webHookArr', JSON.stringify(webhookData));
        for (let i = 0; i < webhookData.length; i++) {
            webhookData[i] = webhookData[i].toObject();
            if (webhookData[i].trigger === data.taskStatus) {
                url = webhookData[i].url;
            }
        }
        console.log('Task is success');
        return fetchTaskDetails(data._id).then((taskDetails) => {
            console.log('taskDetails', JSON.stringify(taskDetails));
            let taskInfo = (taskDetails) ? taskDetails.toObject() : '';
            console.log('taskDetails', taskInfo.enabledRule);
            return getRules(taskInfo).then((rules) => {
                console.log(rules);
                let options = {
                    method: method,
                    uri: url,
                    body: {
                        taskStatus: data.taskStatus,
                        taskId: taskInfo.taskId,
                        triggerName: triggerName
                    },
                    json: true
                };
                rp(options)
                    .then(() => {
                        console.log('body', JSON.stringify(options.body));
                    })
                    .catch((err) => {
                        console.log('err', JSON.stringify(err));
                    });
                let delay = null;
                let completedTime = null;
                let delayInMinutes = 0;
                console.log('taskInfo', JSON.stringify(taskInfo) + '200');
                if (taskInfo && taskInfo.businessType === 1) {
                    console.log('taskInfoDate', taskInfo.date);
                    console.log('completedDate', data.completedTime);
                    delay = (new Date(taskInfo.date) <= new Date(data.completedTime)) ? 1 : 0;
                    // completedTime= (new Date(taskInfo.actualStartedTime))
                }
                else {
                    console.log('taskInfoDate', taskInfo.date);
                    console.log('completedDate', data.completedTime);
                    delay = (new Date(taskInfo.endDate) <= new Date(data.completedTime)) ? 1 : 0;
                }
                let actualStartedTime = (taskInfo.actualStartedTime) ? taskInfo.actualStartedTime : new Date();
                if (delay === 1) {
                    let needsCompleteTime = (taskInfo.businessType === 1) ? taskInfo.date : taskInfo.endDate;
                    let diff = new Date(data.completedTime.valueOf()) - new Date(needsCompleteTime.valueOf());
                    delayInMinutes = Math.ceil((diff / 1000) / 60);
                }

                let diff = new Date(data.completedTime.valueOf()) - new Date(actualStartedTime.valueOf());
                console.log(new Date(data.completedTime.valueOf()));
                console.log(new Date(actualStartedTime.valueOf()));
                let diffInMinuts = Math.ceil((diff / 1000) / 60);
                console.log('diffInMinuts', diffInMinuts);
                return handleSuceessAndFieldTask(clientId, taskInfo, diffInMinuts, data).then((res) => {
                    return pricingAndEarningCal(res, diffInMinuts, rules, taskInfo, driverDetails).then((earningRes) => {
                        console.log('earningRes', earningRes);
                        console.log('res', res);
                        console.log(typeof res);
                        console.log('data', JSON.stringify(data));
                        console.log('data.activeDist', JSON.stringify(data.activeDist));
                        return Promise.resolve(Object.assign(data, {
                            'delay': delay,
                            delayInMinutes: delayInMinutes,
                            'timeTakenForTaskCompletion': diffInMinuts,
                            distance: res,
                            driverEarning: (earningRes) ? earningRes.toObject().driverEarnings : null
                        }));
                    });
                });
            });
        })
    }
}


function pricingAndEarningCal(distance, duration, rules, taskInfo, driverDetails) {
    return new Promise((resolve, reject) => {
        if (rules) {
            var completedTimeString = mintuesTohours(duration);
            var finalData = {
                clientId: taskInfo.clientId,
                taskId: taskInfo._id,
                driverId: driverDetails._id,
                isDeleted: isIt.NO,
                taskDate: taskInfo.date,
                completedTimeString: completedTimeString
            };

            if (rules.taskRule) {
                var taskDuration = ((Number(rules.taskRule.baseDuration) - duration) < 0) ? Math.abs((Number(rules.taskRule.baseDuration) - duration) * Number(rules.taskRule.durationFare)) : 0;
                var taskDistance = ((Number(rules.taskRule.baseDistance) - distance) < 0) ? Math.abs((Number(rules.taskRule.baseDistance) - distance) * Number(rules.taskRule.distanceFare)) : 0;
                var taskTotalAmount = taskDuration + taskDistance + Number(rules.taskRule.baseFare);
                var taskDeduction = (Number(rules.taskRule.deduction) / 100);
                taskTotalAmount = taskTotalAmount - (taskTotalAmount * taskDeduction);

                finalData.taskPricing = {
                    baseFare: Number(rules.taskRule.baseFare),
                    baseDuration: taskDuration,
                    baseDistance: taskDistance.toFixed(2),
                    deduction: taskDeduction.toFixed(2),
                    totalSum: taskTotalAmount.toFixed(2)
                }
            }

            if (rules.driverRule) {
                var driverDuration = ((Number(rules.driverRule.baseDuration) - duration) < 0) ? Math.abs((Number(rules.driverRule.baseDuration) - duration) * Number(rules.driverRule.durationFare)) : 0;
                var driverDistance = ((Number(rules.driverRule.baseDistance) - distance) < 0) ? Math.abs((Number(rules.driverRule.baseDistance) - distance) * Number(rules.driverRule.distanceFare)) : 0;
                var driverTotalAmount = driverDuration + driverDistance + Number(rules.driverRule.baseFare);
                var driverDeduction = (Number(rules.driverRule.deduction) / 100);
                driverTotalAmount = driverTotalAmount - (driverTotalAmount * driverDeduction);

                finalData.driverEarnings = {
                    baseFare: Number(rules.driverRule.baseFare),
                    baseDuration: driverDuration,
                    baseDistance: driverDistance.toFixed(2),
                    deduction: driverDeduction.toFixed(2),
                    totalSum: driverTotalAmount.toFixed(2)
                }
            }
            resolve(new earningLogModel(finalData).save());
            console.log('finalData', finalData);
        } else {
            resolve();
        }
    });
}


function mintuesTohours(mins) {
    var num = mins;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + ' h ' + rminutes + ' min';

}

function getRules(taskInfo) {
    return new Promise((resolve, reject) => {
        if (taskInfo && taskInfo.enabledRule) {
            return earningModel.aggregate([
                {$match: {_id: {$in: taskInfo.enabledRule.map(rule => mongoose.Types.ObjectId(rule))}, isActive: true}}
            ]).then((rules) => {
                if (rules.length) {
                    var newtaskRuleArr;
                    var newDriverRuleArr;
                    var driverRule = rules.filter(rule => rule.isDriverEarning === true);
                    var taskRule = rules.filter(rule => rule.isDriverEarning === false);
                    if (taskRule.length > 1) {
                        newtaskRuleArr = taskRule.sort(function (rule1, rule2) {
// Turn your strings into dates, and then subtract them
// to get a value that is either negative, positive, or zero.
                            return new Date(rule2.created_at) - new Date(rule1.created_at);
                        });
                    } else {
                        newtaskRuleArr = taskRule;
                    }

                    if (driverRule.length > 1) {
                        newDriverRuleArr = driverRule.sort(function (rule1, rule2) {
// Turn your strings into dates, and then subtract them
// to get a value that is either negative, positive, or zero.
                            return new Date(rule2.created_at) - new Date(rule1.created_at);
                        });
                    } else {
                        newDriverRuleArr = driverRule;
                    }

                    var FinalRuleList = {};
                    (newtaskRuleArr) ? FinalRuleList.taskRule = newtaskRuleArr[0] : '';
                    (newDriverRuleArr) ? FinalRuleList.driverRule = newDriverRuleArr[0] : '';
                    resolve(FinalRuleList);
                } else {
                    resolve(null);
                }
            })
        } else {
            resolve(null);
        }
    });
}

function fetchTaskDetails(data) {
    return taskModel.findOne({'_id': mongoose.Types.ObjectId(data)});
}


function handleSuceessAndFieldTask(clientId, taskInfo, diffInMinuts, data) {
    return fetchDriverDetails(clientId).then((driverData) => {
        console.log(driverData + 'driverData');
        console.log('taskInfo', JSON.stringify(taskInfo));
        return fetchTeamDetails(driverData).then((teamData) => {
            console.log(JSON.stringify(teamData) + 'teamData');
            const TeamData = teamData.toObject();
            let customDate = new Date(taskInfo.date);
            dateStamp = customDate.toLocaleDateString();
            console.log('diffInMinuts', diffInMinuts);

            let driverLogObj = {
                assignTeam: TeamData._id,
                clientId: taskInfo.clientId,
                driverId: clientId,
                date: taskInfo.date,
                dateStamp: dateStamp,
                activeTime: diffInMinuts,//active Time
                activeDist: (taskInfo.distance) ? taskInfo.distance : 0
            };
            console.log(JSON.stringify(driverLogObj) + 'driverLogObj');
            return insertDataIntoDriverLog(driverLogObj, clientId, data).then((result) => {
                return result;
            }).catch((err) => {
                console.log(err);
            });

            /*  .then(() => {
                  return driverTaskCount(taskInfo.driver, taskInfo._id).then((res) => {
                      (res.length) ? currentDriverStatus = 2 : currentDriverStatus = 1;
                      return userModel.update({_id: mongoose.Types.ObjectId(taskInfo.driver)}, {driverStatus: currentDriverStatus}).then((change) => {

                      })
                  })
              })*/
        }).catch((err) => {
            console.log(err);
        })
    }).catch((err) => {
        console.log(err);
    })
}

function fetchDriverDetails(clientId) {
    return userModel.findOne({cognitoSub: clientId});
}

function fetchTeamDetails(teamData) {
    const resolvedTeamData = teamData.toObject();
    return teamModel.findOne({'_id': mongoose.Types.ObjectId(resolvedTeamData.assignTeam)})
}

function insertDataIntoDriverLog(data, clientId, mobData) {
    console.log('insertdata', JSON.stringify(data));
    console.log('insertclientId', JSON.stringify(clientId));
    return driverLogModel.findOne({driverId: data.driverId, dateStamp: data.dateStamp}).then((resultData) => {
        return getTotalActiveDist(resultData, clientId, mobData).then((totalActiveDistance) => {
            if (resultData) {
                console.log('resultData here0');
                console.log(resultData);
                if (resultData["activeTime"] === undefined) {
                    resultData.activeTime = 0;
                }
                if (resultData["activeDist"] === undefined) {
                    resultData.activeDist = 0;
                }
                let totalMinutes = resultData.activeTime + data.activeTime;
                let totalDistance = resultData.activeDist + totalActiveDistance;
                return driverLogModel.update({driverId: data.driverId, dateStamp: data.dateStamp}, {
                    $set: {
                        clientId: data.clientId,
                        date: data.date,
                        assignTeam: data.assignTeam,
                        activeTime: totalMinutes,
                        activeDist: totalDistance
                    }
                }).then(() => {
                    return totalActiveDistance;
                }).catch((err) => {
                    console.log('err', err);
                });
            }
            else {
                data.dateStamp = dateStamp;
                // data.activeTime = data.activeTime;
                Object.assign(data, {
                    clientId: data.clientId,
                    driverId: data.driverId,
                    activeTime: 0,
                    activeDist: (totalActiveDistance) ? totalActiveDistance : 0
                });
                const model = new driverLogModel(data);
                model.save();
                return totalActiveDistance;
            }
        }).catch((err) => {
            console.log('err', err);
        });
    }).catch((err) => {
        console.log(err);
    })
}

function getTotalActiveDist(resultData, clientId, mobData) {
    return driverLocationLogModel.aggregate([
        {
            $match: {
                $and: [
                    {taskId: mongoose.Types.ObjectId(mobData._id)},
                    {driverId: clientId}
                ]
            }
        },
        {
            $project: {
                driverLiveLog: 1
            }
        },
        {$unwind: "$driverLiveLog"},
        {
            $group: {
                _id: "driverLog",
                driverLiveLog: {$push: "$driverLiveLog"}
            }
        }
    ]).then((logs) => {
        let totalActivedistance = 0;
        console.log('logs', logs);
        let promise = new Promise((resolve) => {
            let unique = logs[0].driverLiveLog.reduce((res, itm) => {
                let result = res.find(item => JSON.stringify(item) == JSON.stringify(itm))
                if (!result) return res.concat(itm)
                return res
            }, []);
            resolve(unique);
        });

        return promise.then((unique) => {
            return new Promise((resolve) => {
                unique.forEach((log) => {
                    totalActivedistance += Number(log.live_distance_travelled);
                });
                return resolve(totalActivedistance / 1000);
            });
        });
    });
}

function driverTaskCount(data, driverDevice) {
    var currentDriverStatus;
    return taskModel.aggregate([{
        "$match": {
            "driver": mongoose.Types.ObjectId(data.driverId),
            $or: [
                {"taskStatus": 4},
                {"taskStatus": 5}
            ],
            "isDeleted": isIt.NO
        }
    }]).then((res) => {
        console.log('driverCount', JSON.stringify(res));
        (res.length) ? currentDriverStatus = 2 : currentDriverStatus = 1;
        var finalQuery = formQuery(data, currentDriverStatus, driverDevice);
        return userModel.findOneAndUpdate({_id: mongoose.Types.ObjectId(data.driverId)}, finalQuery, {new: true}).then((driverChange) => {
            console.log(driverChange);
            return Promise.resolve({
                driverStatus: currentDriverStatus,
                driverLocation: driverChange.toObject().location
            });
        }).catch((err) => {
            console.log(err);
        })
    }).catch((err) => {
        console.log(err);
    })
}


function formQuery(data, currentDriverStatus, driverDevice) {
    var query = {
        driverStatus: currentDriverStatus,
        currentAddress: (data.formattedAddress) ? data.formattedAddress : driverDevice.currentAddress,
        batteryState: data.batteryState
    };

    if (data.startLng && data.startLat) {
        query.location = {
            type: "Point",
            coordinates: [Number(data.startLng), Number(data.startLat)]
        }
    }

    return query;

}

function findAdminAndManager(clientId) {
    return userModel.findOne({cognitoSub: clientId})
        .then((driverDetails) => {
            let driverInfo = (driverDetails) ? driverDetails.toObject() : '';
            console.log(JSON.stringify(driverInfo) + '297');
            const admin = driverInfo.clientId;
            if (driverInfo) {
                return Promise.all([userModel.find({role: 2, teams: mongoose.Types.ObjectId(driverInfo.assignTeam)}, {
                    _id: 0,
                    cognitoSub: 1
                }), userModel.find({role: 1, cognitoSub: admin})])
                    .then((managers) => {
                        let adminInfo = (managers[1][0]) ? managers[1][0].toObject() : '';
                        let companyName = (adminInfo) ? adminInfo.companyName : '';
                        let mangersInfo = (managers[0][0]) ? managers[0][0].toObject() : '';
                        // console.log('adminInfo+++',adminInfo);
                        return Promise.resolve({
                            admin: adminInfo,
                            managers: mangersInfo,
                            driverInfo: driverInfo,
                            company: companyName
                        });
                    })
            }

        }).catch((err) => {
            console.log(err);
        })
}

function attachTaskDetails(taskId) {
    return taskModel.findOne({'_id': mongoose.Types.ObjectId(taskId)}).then((taskDetails) => {
        const taskInfo = (taskDetails) ? taskDetails.toObject() : {};
        return Promise.resolve(taskInfo);
    }).catch((err) => {
        console.log(err);
    })
}

function getSmsGateWayData(data) {
    return userModel.findOne({_id: mongoose.Types.ObjectId(data.driverId)}).then((driverInfo) => {
        let driver = driverInfo.toObject();
        return smsGateWayModel.findOne({'clientId': driver.clientId}).then((smsGateWayData) => {
            var smsGateWayData = (smsGateWayData) ? smsGateWayData.toObject() : null;
            return Promise.resolve({smsGateWayData: smsGateWayData});
        })
    })
}

function addTaskLogCollection(taskDetails, updatedTaskStatus, driverName, adminDetails) {
    let obj = {
        role: taskDetails.userRole,
        taskStatus: updatedTaskStatus,
        taskId: taskDetails._id,
        clientId: taskDetails.clientId,
        driverName: driverName,
        user: adminDetails.name,
        distanceTravelled: taskDetails.distance
    };
    if (updatedTaskStatus === taskConst.CANCELL || updatedTaskStatus === taskConst.DECLINED || updatedTaskStatus === taskConst.FAIL) {
        obj.reason = taskDetails.reason;
    }

    const newTaskLog = new taskLogModel(obj);
    return newTaskLog.save()
}

function invoke_sns_lambda(data, status, driver, companyName, adminDetails, smsGateWayData, glympseTrackingURL) {
    return getUserSettings(data.clientId).then((userSettingData) => {
        console.log('userSettingData', JSON.stringify(userSettingData));
        return trackingLink(data._id).then((trackingLink) => {
            console.log('trackingLink', trackingLink);
            return ratingLink(data._id).then((ratingLink) => {
                console.log('ratingLink', ratingLink);
                let payload = {};
                let d = new Date(data.date);
                let nStart = d.toString();
                let startArry = [];
                startArry = nStart.split(' ');
                startArry.length = 5;
                let startTime = startArry[4];
                startArry.length = 4;
                let Startdate = startArry.join(' ');
                let e = new Date(data.endDate);
                let nEnd = e.toString();
                let endArry = [];
                endArry = nEnd.split(' ');
                endArry.length = 5;
                let endTime = endArry[4];
                endArry.length = 4;
                let endDate = endArry.join(' ');


                payload = {
                    pickUp: getBussinessType(data),
                    CustomerName: data.name,
                    StartDate: Startdate,
                    StartTime: startTime,
                    EndDate: endDate,
                    EndTime: endTime,
                    AgentName: driver,
                    OrderId: data.orderId,
                    CustomerAddress: data.address.formatted_address,
                    CompanyName: companyName,
                    number: data.phone,
                    email: data.email,
                    clientId: data.clientId,
                    trigger: getTaskStatus(status),
                    businessType: data.businessType,
                    taskId: data.taskId,
                    TrackingLink: (userSettingData.isGlympseEnable && glympseTrackingURL) ? glympseTrackingURL : trackingLink,
                    RatingLink: (userSettingData.isGlympseEnable && glympseTrackingURL) ? glympseTrackingURL : ratingLink,
                    ExpectedTime: endTime,
                    AgentPhone: data.phone,
                    TotalTimeTaken: Math.floor(data.timeTakenForTaskCompletion / 60),
                    TotalDistanceTravelled: data.distance,
                    EmailSupport: adminDetails.email,
                    taskid: data.taskId,
                    smsGateWayData: smsGateWayData,
                    smsPlan: adminDetails.smsPlan,
                    CompletedTime: (data.timezone) ? (data.actualCompletedTime) ? moment(data.actualCompletedTime).tz(data.timezone).format("hh:mm:A") : moment(data.endDate).tz(data.timezone).format("hh:mm:A") : (data.actualCompletedTime) ? moment(data.actualCompletedTime).format("hh:mm:A") : moment(data.endDate).format("hh:mm:A"),
                    CompletedDate: (data.timezone) ? (data.actualCompletedTime) ? moment(data.actualCompletedTime).tz(data.timezone).format("MM-DD-YYYY") : moment(data.endDate).tz(data.timezone).format("MM-DD-YYYY") : (data.actualCompletedTime) ? moment(data.actualCompletedTime).format("MM-DD-YYYY") : moment(data.endDate).format("MM-DD-YYYY"),
                    //completed date
                     // ActualCompletedTime:(data.timezone) ? moment(data.actualCompletedTime).tz(data.timezone).format("hh:mm:A") : moment(data.actualCompletedTime).format("hh:mm:A"),
                    // ActualCompletedDate:(data.timezone) ? moment(data.actualCompletedTime).tz(data.timezone).format("DD-MM-YYYY"): moment(data.actualCompletedTime).format("DD-MM-YYYY")
                    //completed date
                };



                //  console.log('taskUpdate payload', payload);

                return getNotifications(payload).then((notification) => {
                    const notify = notification.notifications[payload.trigger];
                    let mailTemp = getTemplate(notify['mailTemp'], payload);
                    console.log('mailtemp',mailTemp);
                    if (!notify) {
                        return Promise.resolve({'message': 'template is not defined'});
                    } else {
                        if (notify['sms'] === true && notify['email'] === true) {
                            return Promise.all([sendSMS(notify['smsTemp'], data, payload), sendEmail(payload, mailTemp)])
                        } else if (notify['sms'] === true) {
                            return sendSMS(notify['smsTemp'], data, payload);
                        } else if (notify['email'] === true) {
                            return sendEmail(payload, mailTemp)
                        }
                    }
                }).catch((err) => {
                    return Promise.resolve({'msg': 'failed'})

                });
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });
    });
}

function getBussinessType(data) {
    if (data.isPickup) {
        return 'picked';
    } else {
        if (data['businessType'] === business.PICKUP) {
            return 'delivered';
        } else {
            return (data['businessType'] === business.APPOINTMENT) ? 'appoinment' : 'field-work-force'
        }
    }
}


function getTaskStatus(taskStatus) {
    const TaskStatus = taskConst;
    //  console.log('task status: ',TaskStatus);
    for (const key in TaskStatus) {
        if (TaskStatus.hasOwnProperty(key)) {
            if (TaskStatus[key] === taskStatus) {
                const lowKey = key.toLowerCase();
                String.prototype.capitalize = function () {
                    return this.charAt(0).toUpperCase() + this.slice(1);
                };
                return lowKey.capitalize();
            }
        }
    }
}

function sendEmail(data, emailTemp) {
    return new Promise((resolve, reject) => {
        if (data.email) {
            const param = getParams(data, emailTemp);
            param.then((param) => {
                sgMail.send(param, function (err, msg) {
                    if (err) {
                        console.log('mail errr', err);
                        return resolve({'msg': 'email err'})
                    }
                    else {
                        console.log('mail sent');
                        return resolve('mail sent');
                    }
                });
            });
        } else {
            return resolve('mail not send because of no email field');
        }
    }).catch((err) => {
        console.log('rammm', err)
    });

}

function sendSMS(template, taskData, data) {
    if (data.smsPlan !== 1) {
        return new Promise((resolve, reject) => {
            console.log('coming to sms');
            let gateWay;
            if (data.smsPlan === 3 && data.smsGateWayData) { // personal sms service
                gateWay = data.smsGateWayData.gateway;
            } else if (data.smsPlan === 2) { // Deliforce sms service
                gateWay = null;
            } else {
                return resolve();
            }

            switch (gateWay) {
                case 1:
                    resolve(callTwilio(template, taskData, data));
                    break;

                case 2:
                    resolve(callMsg91(template, taskData, data));
                    break;

                case 3:
                    resolve(callSparrow(template, taskData, data));
                    break;

                default:
                    resolve(callDefaultTwilio(template, taskData, data));
                    break;
            }
        });
    }
}

function getCustomerPayloads(taskData, data) {
    let customerOnePayload = JSON.parse(JSON.stringify(data));
    let customerTwoPayload = JSON.parse(JSON.stringify(data));
    let customerPayloads = [];
    if (taskData.primaryCustomerNotify) {
        customerPayloads.push(data);
    }
    if (taskData.customerOne && taskData.customerOne.name && taskData.customerOne.phone && taskData.customerOne.notify) {
        customerOnePayload.CustomerName = taskData.customerOne.name;
        customerOnePayload.number = taskData.customerOne.phone;
        customerPayloads.push(customerOnePayload);
    }
    if (taskData.customerTwo && taskData.customerTwo.name && taskData.customerTwo.phone && taskData.customerTwo.notify) {
        customerTwoPayload.CustomerName = taskData.customerTwo.name;
        customerTwoPayload.number = taskData.customerTwo.phone;
        customerPayloads.push(customerTwoPayload);
    }
    return Promise.resolve(customerPayloads);
}

function callTwilio(template, taskData, data) {
    console.log('presonal twilio sms service', JSON.stringify(data.smsGateWayData));
    const client = require('twilio')(data.smsGateWayData.accountSid, data.smsGateWayData.authToken);
    return getCustomerPayloads(taskData, data).then((payloads) => {
        const smsPromises = []
        payloads.forEach((payload) => {
            smsPromises.push(
                new Promise((resolve, reject) => {
                    client.messages.create({
                        from: data.smsGateWayData.phone,
                        to: payload.number.replace(' ', ''),
                        body: getTemplate(template, payload)
                    }).then((message) => {
                        console.log('messageSid', message.sid);
                        return resolve(message.sid);
                    }).catch((err) => {
                        return resolve(console.log('error sending message', err));
                    });
                })
            )
        });
        return Promise.all(smsPromises);
    });
}

function callMsg91(template, taskData, data) {
    console.log('personal msg91 sms service', JSON.stringify(data.smsGateWayData));
    const msg91 = require('msg91')(data.smsGateWayData.apiKey, data.smsGateWayData.senderId, data.smsGateWayData.routeNo);
    let smsPromises = [];
    return getCustomerPayloads(taskData, data).then((payloads) => {
        payloads.forEach((payload) => {
            smsPromises.push(
                new Promise((resolve, reject) => {
                    const mobileNo = getmobileNo(payload);
                    console.log(mobileNo);
                    let smsData = getTemplate(template, payload);

                    msg91.send(mobileNo, smsData, function (err, response) {
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
                })
            )
        });
        return Promise.all(smsPromises);
    });
}

function callSparrow(template, taskData, data) {
    console.log('personal sparrow sms service', JSON.stringify(data.smsGateWayData));

    let authObject = {
        token: data.smsGateWayData.token,
        identity: data.smsGateWayData.identity
    };

    function sms(authObject) {
        return new Promise((resolve, reject) => {
            resolve(sparrowSMS.setAuth(authObject));
        });
    }
    let smsPromises = [];
    return getCustomerPayloads(taskData, data).then((payloads) => {
        payloads.forEach((payload) => {
            new Promise((resolve, reject) => {
                return resolve(sms(authObject).then(() => {
                    let phone = payload.number.split(' ');
                    sparrowSMS.sendSMS({
                        text: getTemplate(template, payload),
                        recipients: phone[1]
                    })
                }))
            })
        });
        return Promise.all(smsPromises);
    })
}

function callDefaultTwilio(template, taskData, data) {
    console.log('deliforce sms service', JSON.stringify(data.smsGateWayData));
    const accountSid = constant.TWILIO.ACCOUNT_SID;
    const authToken = constant.TWILIO.AUTH_TOKEN;
    const defaultPhone = constant.TWILIO.PHONE;

    const client = require('twilio')(accountSid, authToken);
    let smsPromises = [];
    return getCustomerPayloads(taskData, data).then((payloads) => {
        console.log('payloads', JSON.stringify(payloads))
        payloads.forEach((payload) => {
            smsPromises.push(
                new Promise((resolve, reject) => {
                    client.messages.create({
                        from: defaultPhone,
                        to: payload.number.replace(' ', ''),
                        body: getTemplate(template, payload)
                    }).then((message) => {
                        console.log('message.sid', message.sid);
                        let smsLogData = {};
                        let promise = new Promise(resolve => {
                            smsLogData.messageSid = message.sid;
                            // smsLogData.content = messageData.body;
                            // smsLogData.contentSegments = messageData.numSegments;
                            // smsLogData.price = Math.abs(messageData.price);
                            // smsLogData.priceUnit = messageData.priceUnit;
                            smsLogData.clientId = data.clientId;
                            // smsLogData.status = messageData.status;
                            // smsLogData.dateSent = new Date(messageData.dateSent);
                            resolve(smsLogData);
                        });
                        return promise.then(smsLogData => {
                            return new smsLogModel(smsLogData).save().then((res) => {
                                console.log('smsLogData', smsLogData);
                                return resolve(res);
                            }).catch((err) => {
                                console.log('err', err);
                                return result.sendServerError(cb);
                            })
                        });
                        // return client.messages(message.sid)
                        //     .fetch()
                        //     .then((messageData) => {
                        //         console.log('messageData', JSON.stringify(messageData));
                        //         let smsLogData = {};
                        //         let promise = new Promise(resolve => {
                        //             smsLogData.messageSid = messageData.sid;
                        //             smsLogData.from = messageData.from;
                        //             smsLogData.to = messageData.to;
                        //             smsLogData.content = messageData.body;
                        //             smsLogData.contentSegments = messageData.numSegments;
                        //             smsLogData.price = Math.abs(messageData.price);
                        //             smsLogData.priceUnit = messageData.priceUnit;
                        //             smsLogData.clientId = data.clientId;
                        //             smsLogData.status = messageData.status;
                        //             smsLogData.dateSent = new Date(messageData.dateSent);
                        //             resolve(smsLogData);
                        //         });
                        //         return promise.then(smsLogData => {
                        //             return new smsLogModel(smsLogData).save().then((res) => {
                        //                 console.log('smsLogData', smsLogData);
                        //                 return resolve(res);
                        //             }).catch((err) => {
                        //                 console.log('err', err);
                        //                 return result.sendServerError(cb);
                        //             })
                        //         });
                        //     }).catch((err) => {
                        //         console.log('err storing smsLog', err);
                        //         return result.sendServerError(cb);
                        //     })
                    }).catch((err) => {
                        return resolve(console.log('error sending message', err));
                    });
                })
            )
        });
        return Promise.all(smsPromises);
    });
}


function getParams(data, emailTemp) {
    console.log('data.email', data.email);
    return new Promise((resolve, reject) => {
        return preferencesModel.aggregate([
            {$match: {clientId: data.clientId}},
            {
                $lookup:
                    {
                        from: tables.USERSETTINGS,
                        localField: 'clientId',
                        foreignField: 'clientId',
                        as: 'userSettings'
                    }
            }
        ]).then((emailDetails) => {
            //console.log('emaildetails',JSON.stringify(emailDetails));
            const params = {
                to: data.email,
                from: (emailDetails && emailDetails[0].userSettings[0].isSupportEmail && emailDetails[0].customizeSupportEmailTextAs) ? emailDetails[0].customizeSupportEmailTextAs : support,
                subject: 'Task Notification-' + data.taskId,
                html: emailTemp,
            };
            return resolve(params);
        });
    });
}

function getmobileNo(data) {
    const phone = data.number.substr(data.number.indexOf('+') + 1);
    let finalPhone = phone.replace(' ', '');
    let countryCode = '0';

    let mobileNo = countryCode + finalPhone;
    console.log(mobileNo, 'mobileNo');
    return mobileNo;
}


function getNotifications(data) {
    return settingsModel.findOne({clientId: data.clientId, isCurrent: true}, {notifications: 1})
}

function trackingLink(id) {
    let link = constant.LINK.TRACKING;
    let url = link + id;
    console.log('link', link);
    console.log('link', url);
    return new Promise((resolve, reject) => {
        // TinyURL.shorten(url, function (res) {
        //     return resolve(res);
        // })
        return resolve(url);
    })
}

function ratingLink(id) {
    let link = constant.LINK.RATING;
    let url = link + id;
    return new Promise((resolve, reject) => {
        // TinyURL.shorten(url, function (res) {
        //     return resolve(res);
        // })
        return resolve(url);
    })
}

function getUserSettings(clientId) {
    return userSettingsModel.findOne({clientId:clientId}).then((userSettingsData) => {
        return userSettingsData.toObject();
    });
}

function getTemplate(template, data) {

    let content = {};
    let regX = /USER_NAME|AgentPhone|TotalTimeTaken|TotalDistanceTravelled|EmailSupport|CustomerName|CustomerAddress|AgentName|EndTime|ExpectedTime|EndDate|OrderId|StartDate|StartTime|TrackingLink|RatingLink|CompanyName|CompletedTime|CompletedDate|ActualCompletedDate|ActualCompletedTime|pickUp|taskId/gi;
    let emailContent = template.replace(/[\[\]']+/g, ''); // first remove the [] ;
    content = emailContent.replace(regX, function (matched) {
        return data[matched];
    });
    return content;
}

function callMqttLambda(data) {
    let params = {
        FunctionName: 'taskMqttLambda', // the lambda function we are going to invoke
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


function updateTaskForCustomFields(_id, templates, cb, clientId, data, customCopy) {
    console.log('_id:::::::::::::::::::::::::::::::' + _id)
    taskModel.update({_id: mongoose.Types.ObjectId(_id)},
        {$set: {templates: templates}}).then((resultData, err) => {
        if (resultData) {
            AdminForCustomfields(clientId, _id).then((adminData) => {
                let taskDetails = adminData[1];
                let obj = {
                    role: taskDetails.userRole,
                    taskStatus: data.taskStatus,
                    taskId: taskDetails._id,
                    clientId: taskDetails.clientId,
                    driverName: adminData[0].driverInfo.name,
                    user: adminData[0].admin.name,
                    distanceTravelled: taskDetails.distance,
                    fieldName: data.fieldName,
                    fieldValue: data.fieldValue,
                    OldFieldValue: customCopy.fieldValue
                };
                if (data.selectedValues) {
                    obj.selectedValues = data.selectedValues;
                }
                var dt = data.dataType;
                if (dt === 'date' || dt === 'dateFuture' || dt === 'datePast' || dt === 'dateTime' || dt === 'dateTimeFuture' || dt === 'dateTimePast') {
                    obj.dataType = dt;
                }
                const newTaskLog = new taskLogModel(obj);
                newTaskLog.save().then(() => {
                    result.sendSuccess(cb, {message: 'task updated sucessfully'})
                })
            });
        }
        else {
            result.sendServerError(cb);
        }
    }).catch((err) => {
        console.log(err + 'kkkkkkkkrrrrr');
    })
}


function AdminForCustomfields(clientId, _id) {
    return Promise.all([findAdminAndManager(clientId), attachTaskDetails(_id)])
        .then((res) => {
            return Promise.resolve(res);
        }).catch((error) => {
            console.log(error);
            result.sendServerError(cb);
        })
}


function callDriverMqttLambda(data, res) {
    console.log('datainmqtt', JSON.stringify(data));
    console.log('resinmqtt', JSON.stringify(res));
    /*return userModel.findOne({_id: mongoose.Types.ObjectId(data.driverId)}).then((driver) => {
        console.log('driver', JSON.stringify(driver));
        driver = driver.toObject();*/
    data.status = res[1].driverStatus;
    data.location_lat = res[1].driverLocation.coordinates[1];
    data.location_lng = res[1].driverLocation.coordinates[0];
    //data.driverId = res[1].driverId;
    //data.adminArray = res[1].adminArray;
    console.log('akshay', JSON.stringify(data));
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
    //  });
}