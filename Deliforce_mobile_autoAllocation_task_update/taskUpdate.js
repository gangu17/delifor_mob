const mongoose = require('mongoose');
const result = require('./result');
const helper = require('./util');
const constant = require('./constant')();
const taskConst = constant.TASK_STATUS;
const taskColor = constant.STATUS_COLORS;
const isIt = constant.isIt;
const moment = require('moment-timezone');
const _ = require('lodash');
const taskModel = require('./model').task;
const userModel = require('./model').user;
const taskLogModel = require('./model').taskLog;
var AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

module.exports = {
    taskUpdate: (event, cb, principals) => {
        const data = helper.getBodyData(event); //after testing uncomment the code
        //const data = event;
        const clientId = principals;
        console.log('data', data);
        console.log('clientId++++++++', clientId);
        if (!data && !clientId) {
            if (!clientId) {
                result.sendUnAuth(cb);
                return;
            }
            else {
                result.invalidInput(cb);
                return;
            }
        } else {
            console.log('data', JSON.stringify(data));
            return callMqttLambda(data).then(() => {
                return taskModel.findOne({_id: mongoose.Types.ObjectId(data._id)}).then((taskData) => {
                    console.log('taskData', taskData);
                    if (taskData.taskStatus === 1 || taskData.taskStatus === 8) {
                        console.log('entering here!!');
                        userModel.findOne({cognitoSub: clientId}).then((res) => {
                            let color = getTaskColor(data.taskStatus);
                            let updateData = {};
                            if(data.taskStatus === 8){
                                updateData.taskStatus = data.taskStatus;
                                updateData.taskColor = color;
                            }else{
                                updateData.driver = res._id;
                                updateData.taskStatus = data.taskStatus;
                                updateData.taskColor = color;
                            }
                            taskModel.update({_id: taskData._id}, {
                                $set: updateData
                            }).then((resp) => {
                                return taskModel.findOne({_id: mongoose.Types.ObjectId(data._id)}).then((taskDetails) => {
                                    userModel.findOne({cognitoSub: principals}).then((driverDetails) => {
                                        addTaskLogCollection(taskDetails, data.taskStatus, driverDetails,data.reason).then((resLog) => {
                                            let message;
                                            console.log('data', JSON.stringify(data));
                                            if (data.taskStatus === "8") {
                                                message = 'Task is Declined';
                                            } else {
                                                message = 'Task is Assigned';
                                            }
                                            console.log('resp');
                                            result.sendSuccess(cb, {message: message});
                                        })
                                    })

                                });
                            }).catch((error) => {
                                console.log(err);
                                result.sendServerError(cb)
                            });
                        })
                        // result.sendSuccess(cb, JSON.stringify({'taskData':t}));
                    } else {
                        result.sendSuccessAuto(cb, {message: 'This task is already assigned to another driver'})
                    }
                }).catch((err) => {
                    console.log(err);
                })
            });
        }

    }
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

function getTaskColor(status) {
    if (status === taskConst.UNASSIGNED) {
        return taskColor.UNASSIGNED;
    } else if (status === taskConst.ASSIGNED) {
        return taskColor.ASSIGNED;
    } else if (status === taskConst.ACCEPTED) {
        return taskColor.ACCEPTED;
    } else if (status === taskConst.STARTED) {
        return taskColor.STARTED;
    } else if (status === taskConst.INPROGRESS) {
        return taskColor.INPROGRESS;
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

function addTaskLogCollection(taskDetails, updatedTaskStatus, driverDetails, reason) {
    taskDetails = taskDetails.toObject();
    driverDetails = driverDetails.toObject();
    let obj = {
        role: taskDetails.userRole,
        taskStatus: updatedTaskStatus,
        taskId: taskDetails._id,
        clientId: taskDetails.clientId,
        driverName: driverDetails.name
    };
    if (updatedTaskStatus === taskConst.CANCELL || updatedTaskStatus === taskConst.DECLINED || updatedTaskStatus === taskConst.FAIL) {
        obj.reason = reason;
    }
    const newTaskLog = new taskLogModel(obj);
    return newTaskLog.save()
}