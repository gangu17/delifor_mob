const mongoose = require('mongoose');
const result = require('./result');
const helper = require('./util');
const constant = require('./constant')();
const model = require('./model');
const preferencesModel = require('./model').preference;
const tables = constant.TABLES;
const taskConst = constant.TASK_STATUS;
const driverConst = constant.DRIVER_STATUS;
const taskColor = constant.STATUS_COLORS;
const customerModel = model.customerModel;
const tasklogModel = model.tasklogModel;
const settingModel = model.settingModel;
const smsLogModel = model.smsLogModel;
const userModel = model.userModel;
const userPlansModel = require('./model').userPlansModel;
const moment = require('moment-timezone');
const business = constant.BUSINESS_TYPE;
const smsKey = constant.SMS_KEY;
const sendGridKey = constant.SENDGRID;
const googleMapKey = constant.GOOGLEMAP;
const smsGateWayModel = model.smsGateWayModel;
const _ = require('lodash');
var securePin = require("secure-pin");
const geocoder = require('geocoder');
const apiKey = {key: googleMapKey.GOOGLEMAP_APIKEY};
const support = constant.SUPPORT.EMAIL;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendGridKey.API_KEY);
const sparrowSMS = require('sparrow-sms');
var cb;

module.exports = {

    saveTask: (event, cb, principals, plans) => {
        cb = cb;
        const data = helper.getBodyData(event);
        console.log(data);
        if (!data) {
            result.invalidInput(cb);
        } else {
            if (!validateTaskDate(data, cb)) {
                return;
            }
            const clientId = principals;
            console.log('clientId', clientId);
            checkDriver(data, clientId)
                .then((user) => {
                    console.log('user++', JSON.stringify(user));
                    if (data.recurringObj && data.recurringObj.isRecur === true) {
                        getDailyRange(data).then((dateRange) => {
                            data.isRecur = data.recurringObj.isRecur;
                            data.dateRange = dateRange;
                            data.dateRangeView = dateRange;
                            createTask(data, clientId, cb, principals, user, plans);
                        })
                    } else {
                        createTask(data, clientId, cb, principals, user, plans);
                    }
                }).catch((err) => {
                console.log('err++++ ', err);
                if (err.message == 'invalid driver') {
                    result.invalidDriver(cb);
                } else if (err.message == 'blocked driver') {
                    result.blockedDriver(cb);
                } else {
                    result.sendServerError(cb)
                }
            });
        }
    }
};

function validateTaskDate(data, cb) {
    const business = constant.BUSINESS_TYPE;

    if (checkCurrentDate(data.date)) {

        if (data.businessType === business.PICKUP) {
            return true;
        } else if (data.businessType === business.APPOINTMENT || data.businessType === business.FIELD) {
            return compareStartEnd(data.date, data.endDate);
        } else {
            result.businessMissing(cb);
            return false;
        }
    }

    function compareStartEnd(start, end) {
        const momentStart = moment(start);
        const momentEnd = moment(end);

        if (momentEnd.isAfter(momentStart)) {
            return true
        } else {
            result.endLesserThanStart(cb);
        }
    }


    function checkCurrentDate(date) {
        const momentDate = moment(date);
        const momentCurrent = moment().subtract(10, 'minute');

        if (!momentDate.isValid()) {
            result.invalidDate(cb);
        } else {
            if (momentDate.isSameOrAfter(momentCurrent)) {
                return true
            } else {
                result.lesserThanCurrentDate(cb);
            }
        }
    }

}


function createCustomerAndTaskLog(taskData, cb, clientId, principals, userData, plans) {
    //console.log('task++', JSON.stringify(taskData));
    console.log('taskLog');
    const promises = [
        createCustomer(taskData, clientId),
        // push_notification(taskData, userData.endpointArn, 1),
        invoke_sns_lambda(taskData, clientId, userData.adminCognitoSub),
        createTasklog(taskData, userData, clientId, constant.ROLE.DRIVER),
        increaseUserPlansTaskCount(userData.adminCognitoSub, cb, plans)
    ];
    return Promise.all(promises)

}


function checkDriver(data, clientId) {
    return new Promise((resolve, reject) => {
        return userModel.findOne({_id: mongoose.Types.ObjectId(data.driver)}).then((driverInfo) => {
            driverInfo = driverInfo.toObject();
            return userModel.findOne({cognitoSub: driverInfo.clientId}).then((adminInfo) => {
                adminInfo = adminInfo.toObject();
                const result = {adminName: '', driverName: '', endpointArn: ''};
                result.adminName = (adminInfo) ? adminInfo.name : '';
                result.adminCognitoSub = (adminInfo) ? adminInfo.cognitoSub : '';
                result.driverName = (driverInfo.cognitoSub === clientId) ? (driverInfo.driverStatus == driverConst.BLOCKED) ? reject({message: 'blocked driver'}) : driverInfo.name : '';
                result.endpointArn = (driverInfo) ? driverInfo.endpointArn : '';
                if (result.driverName) resolve(result);
                else reject({message: 'invalid driver'});
            }).catch((err) => reject(err));
        }).catch((err) => {
            console.log(err);
            result.sendServerError(cb);
        })
    });
}

function createTask(data, clientId, cb, principals, userData, plans) {
    var taskStatus = (data.driver) ? taskConst.ASSIGNED : taskConst.UNASSIGNED;
    data.taskStatus = taskStatus;
    return getTaskColor(data.taskStatus).then((colors) => {
        const taskModel = model.task.getTaskModel(data['businessType']);
        if (!taskModel) {
            return Promise.reject('model not found for businessType');
        }
        let loc = {type: "Point", coordinates: [0, 0]};
        data.userRole = constant.ROLE.DRIVER
        data.user = clientId;
        data.clientId = userData.adminCognitoSub;
        data.taskId = securePin.generatePinSync(8);
        data.taskColor = colors;
        data.startLocation = loc;
        data.recurTaskStatus = taskStatus;
        attachSettings(userData.adminCognitoSub)
            .then((settingData) => {
                data.settings = (settingData) ? settingData.toObject() : {};
                console.log('settings+++++', data.settings, settingData);
                console.log('taskData0', JSON.stringify(data));
                if (data.driverImageOption) {
                    data.settings.actionBlock.image = data.driverImageOption;
                }
                data.driverImages = [];
                data.driverSignature = '';
                console.log(data.address);
                if (data.address) {
                    getAddress(data.address).then((addressRes) => {
                        console.log(JSON.stringify(addressRes));
                        data.address = addressRes;
                        return new taskModel(data).save().then((task) => {
                            return createCustomerAndTaskLog(task, cb, clientId, principals, userData, plans)
                                .then((res) => {
                                    result.sendSuccess(cb, task);
                                })
                        }).catch((err) => handleError(err, cb));
                    });
                    // if (!data.driver && (data.manual === false)) {
                    //     let radius = 0;
                    //     let flag = 1;
                    //     if (data.settings.autoAllocation.nearest.current === true) {
                    //         radius = data.settings.autoAllocation.nearest.radius;
                    //         flag = 5;
                    //     } else if (data.settings.autoAllocation.sendToAll.current === true) {
                    //         radius = data.settings.autoAllocation.sendToAll.radius;
                    //         flag = 4;
                    //     } else if (data.settings.autoAllocation.oneByOne.current === true) {
                    //         radius = data.settings.autoAllocation.oneByOne.radius;
                    //         flag = 4;
                    //     }
                    //     console.log('radius', radius);
                    //     return getNearByDrivers(radius, Number(data.address.geometry.location.lat), Number(data.address.geometry.location.lng), clientId)
                    //         .then((nearDriverData) => {
                    //             console.log('nearDriverData', nearDriverData);
                    //             return new taskModel(data).save().then((task) => {
                    //                 callBackRoundJobLambda(nearDriverData, task._id, task.settings.autoAllocation, flag);
                    //                 return createCustomerAndTaskLog(task, cb, clientId, principals, userData, plans)
                    //                     .then((res) => {
                    //                         result.sendSuccess(cb, task);
                    //                     })
                    //             }).catch((err) => handleError(err, cb));
                    //         })
                    //
                    // } else {
                    //     return new taskModel(data).save().then((task) => {
                    //         return createCustomerAndTaskLog(task, cb, clientId, principals, userData, plans)
                    //             .then((res) => {
                    //                 result.sendSuccess(cb, task);
                    //             })
                    //     }).catch((err) => handleError(err, cb));
                    // }
                    // }
                    // },apiKey);
                } else {
                    result.addressRequired(cb)
                }
            }).catch((error) => {
            console.log(error);
            result.sendServerError(cb)
        })
    }).catch((err) => console.log(err));
}

function getTaskColor(status) {

    return new Promise((resolve, reject) => {
        var tempColor;
        Object.entries(taskConst).forEach(function (colorIndex) {
            console.log(colorIndex[1] === status);
            if (colorIndex[1] === status) {
                tempColor = taskColor[colorIndex[0]];
            }
        });
        return resolve((tempColor) ? tempColor : null);
    });
}


// function callBackRoundJobLambda(driverArry, taskId, autoAllocation, flag) {
//     console.log('driverArry', JSON.stringify(driverArry));
//     console.log('taskId', taskId);
//     console.log('autoAll', autoAllocation);
//     if (driverArry.length) {
//         console.log('backgroundJob');
//         let driverData = driverArry.map((driver) => {
//
//             driver = driver.toObject();
//             console.log('d.endpointArn', driver.endpointArn);
//             return {'endArn': driver.endpointArn, 'driverId': driver._id}
//         });
//
//
//         let aws = require('aws-sdk');
//         let lambda = new aws.Lambda({
//             region: 'ap-south-1' //change to your region
//         });
//
//         let params = {
//             FunctionName: 'backGroundjob', // the lambda function we are going to invoke
//             InvokeArgs: JSON.stringify({
//                 driverData: driverData,
//                 taskId: taskId,
//                 autoAllocation: autoAllocation,
//                 flag: flag
//             }),
//
//         };
//
//
//         lambda.invokeAsync(params, function (err, data) {
//             if (err) {
//                 console.log(err, err.stack)
//             }
//             else {
//                 console.log(data)
//             }
//             ;
//         });
//
//
//     } else {
//         return;
//     }
//
// }

function attachSettings(clientId) {
    return settingModel.findOne({clientId: clientId, isCurrent: true}).then((data) => {
        return data;
    })
}

// function getNearByDrivers(radius, lat, lng, clientId, cb) {
//     let cords = [lng, lat];
//     console.log(cords, clientId, "auto assign function");
//     let radiusInMeter = radius * 1000;
//     console.log(radiusInMeter, "radiusInMeter");
//     return userModel.find({
//         location:
//             {
//                 $nearSphere:
//                     {
//                         $geometry:
//                             {
//                                 type: 'Point',
//                                 coordinates: cords
//                             },
//                         $minDistance: 0.0001, // minimum distance
//                         $maxDistance: radiusInMeter
//                     }
//             },
//         driverStatus: 1,
//         isDeleted: 0,
//         clientId: clientId,
//         endpointArn: {$exists: true}
//     })
// }

function increaseUserPlansTaskCount(clientId, cb, plans) {
    const finalCount = plans.taskCount + 1;
    return userPlansModel.update({clientId: clientId}, {taskCount: finalCount}).then((res) => {
        console.log(res);
        return Promise.resolve();
    }).catch((err) => {
        result.sendServerError(cb);
    })
}

function handleError(error, cb) {
    console.log(error);
    const err = error.errors;
    if (!err) {
        result.sendServerError(cb);
    } else {
        if (err.email) {
            result.invalidEmail(cb);
        }
        else if (err.name) {
            result.invalidName(cb);
        }
        else if (err.phone) {
            result.invalidPhone(cb);
        }
        else if (err.address) {
            result.invalidAddress(cb);
        }
        else {
            console.log(err);
            result.invalidInput(cb);
        }
    }
}

function createTasklog(data, ud, clientId, role) {
    const models = [];
    const taskLogStatus = constant.TASK_LOG_STATUS;
    const model = {
        user: ud.adminName,
        taskStatus: taskLogStatus.CREATED,
        taskId: data._id,
        clientId: clientId,
        role: role
    };


    models.push(model);
    if (ud.driverName) {
        const model = {
            user: ud.adminName,
            taskStatus: taskLogStatus.ASSIGNED,
            taskId: data._id,
            driverName: ud.driverName,
            clientId: clientId,
            role: role
        };
        models.push(model);
    }
    return tasklogModel.insertMany(models);
}


// function push_notification(taskDetails, endpointArn, flag) {
//     let payload = {
//         'taskDetails': taskDetails,
//         'endArn': endpointArn,
//         'flage': flag
//     };
//     return notification.call(payload);
// }


function invoke_sns_lambda(data, clientId, adminCognitoSub) {
    return getCompanyDriver(data, adminCognitoSub).then((result) => {
        const adminDetails = (result[0]) ? result[0].toObject() : null;
        const driverDetails = (result[1]) ? result[1].toObject() : null;
        const smsGateWayData = (result[2]) ? result[2].toObject() : null;
        const payload = {
            pickUp: getBussinessType(data),
            clientId: data.clientId,
            buisnessType: data.buisnessType,
            trigger: "Received",
            number: data.phone,
            email: data.email,
            taskId: data.taskId,
            CustomerName: data.name,
            StartDate: moment(data.date).format("DD-MM-YYYY"),
            StartTime: moment(data.date).tz(data.timezone).format("hh:mm:A"),
            EndDate: moment(data.endDate).format("DD-MM-YYYY"),
            EndTime: moment(data.endDate).tz(data.timezone).format("hh:mm:A"),
            AgentName: (driverDetails) ? driverDetails.name : '',
            OrderId: data.orderId,
            CustomerAddress: data.address.formatted_address,
            CompanyName: (adminDetails && adminDetails.companyName) ? adminDetails.companyName : '',
            smsGateWayData: smsGateWayData,
            adminCognitoSub: adminDetails.cognitoSub,
            //lastRequestId: contextId
        };
        console.log('invoke_sns', JSON.stringify(payload));
        // return emailSms.call(payload);
        //send(payload);
        return getNotifications(payload).then((notification) => {
            // console.log('After getting Notification : ',JSON.stringify(notification.notifications));
            console.log('After getting Notification : ', JSON.stringify(notification.notifications[payload.trigger]));
            const notify = notification.notifications[payload.trigger];
            //console.log('Notitfy : ' ,notify);
            if (notify['sms'] === true && notify['email'] === true) {
                smsTemp = getTemplate(notify['smsTemp'], payload);
                mailTemp = getTemplate(notify['mailTemp'], payload);
                console.log('Mail Temp : ', mailTemp);
                if (smsTemp && mailTemp) {
                    return Promise.all([sendSMS(payload, smsTemp, clientId), sendEmail(payload, mailTemp)])

                }

            } else if (notify['sms'] === true) {
                smsTemp = getTemplate(notify['smsTemp'], payload);
                return sendSMS(payload, smsTemp, clientId);


            } else if (notify['email'] === true) {
                mailTemp = getTemplate(notify['mailTemp'], payload);
                //console.log('Mail Temp 1: ' ,mailTemp);
                return sendEmail(payload, mailTemp)

            }
        }).catch((err) => {
            console.log('err++++ ', err);
            return Promise.resolve({'msg': 'failed'})

        });
    })
};

//non-blockingIo  consol.log,assing,for()
//BlockingIo dbcalls 3rd calls
function getBussinessType(data) {
    if (data.isPickup) {
        return 'pick-up';
    } else {
        if (data['businessType'] === business.PICKUP) {
            return 'delivery';
        } else {
            return (data['businessType'] === business.APPOINTMENT) ? 'appoinment' : 'field-work-force'
        }
    }
}

function getCompanyDriver(data, adminCognitoSub) {
    let promisArry = [userModel.findOne({'cognitoSub': adminCognitoSub})];
    if (data.driver) {
        promisArry.push(userModel.findOne({cognitoSub: data.clientId}))
    }
    promisArry.push(smsGateWayModel.findOne({'clientId': adminCognitoSub}));
    return Promise.all(promisArry)
}

function createCustomer(data, clientId) {
    const customer = {};
    customer.clientId = clientId;
    customer.name = data.name;
    customer.email = data.email;
    customer.phone = data.phone;
    customer.address = data.address;
    customer.color = data.color;
    customer.customerId = securePin.generatePinSync(8);

    console.log(customer, 'testing+++++++++++++');

    // checking if customer is exist or not if exist means we will update the customer details
    //if customer is not exist means we inserted new customer
    return customerModel.findOne({phone: data.phone})
        .then((cus) => {
            if (!_.isEmpty(cus)) {
                cus = cus.toObject();
                return customerModel.update({_id: mongoose.Types.ObjectId(cus._id)}, customer);
            } else {
                const newCustomer = new customerModel(customer);
                return newCustomer.save()
            }
        })

}

function sendEmail(data, emailTemp) {
    return new Promise((resolve, reject) => {
        console.log('mailTemp;;;;;;;;', emailTemp);
        console.log('sending email here and then to inbox');
        // return getParams()
        return getParams(data, emailTemp).then((param) => {
            console.log('Parameter : ' + JSON.stringify(param));
            sgMail.send(param, function (err, msg) {
                console.log(err, msg);
                if (err) {
                    return resolve({'msg': 'email err'})
                }
                else {
                    console.log("===EMAIL SENT===");
                    return resolve('mail sent');
                }
            });
        });
    });
}

function sendSMS(data, smsTemp, clientId) {
    return new Promise((resolve, reject) => {
        let gateWay;
        if (data.smsGateWayData === null) {
            gateWay = null;
        } else if (data.smsPlan === 2 && data.smsGateWayData) {
            gateWay = null;
        } else {
            gateWay = data.smsGateWayData.gateway;
        }
        switch (gateWay) {
            case 1:
                resolve(callTwilio(data, smsTemp));
                break;

            case 2:
                resolve(callMsg91(data, smsTemp));
                break;

            case 3:
                resolve(callSparrow(data, smsTemp));
                break;

            default:
                resolve(callDefaultTwilio(data, smsTemp, clientId));
                break;
        }
    });
}

function callTwilio(data, sms) {
    const client = require('twilio')(data.smsGateWayData.accountSid, data.smsGateWayData.authToken);
    return new Promise((resolve, reject) => {
        client.messages.create({
            from: data.smsGateWayData.phone,
            to: data.number.replace(' ', ''),
            body: sms
        }).then((message) => {
            console.log(message.sid)
            return resolve(message.sid);
        }).catch((err) => {
            return resolve(console.log('error sending message', err));
        });
    });
}

function callMsg91(data, sms) {

    const msg91 = require('msg91')(data.smsGateWayData.apiKey, data.smsGateWayData.senderId, data.smsGateWayData.routeNo);

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

function callSparrow(data, smsData) {

    let authObject = {
        token: data.smsGateWayData.token,
        identity: data.smsGateWayData.identity
    };

    function sms(authObject) {
        return new Promise((resolve, reject) => {
            resolve(sparrowSMS.setAuth(authObject));
        });
    }

    return new Promise((resolve, reject) => {
        return resolve(sms(authObject).then(() => {
            let phone = data.number.split(' ');
            sparrowSMS.sendSMS({
                text: smsData,
                recipients: phone[1]
            })
        }));
    });
}

function callDefaultTwilio(data, sms, clientId) {

    const accountSid = constant.TWILIO.ACCOUNT_SID;
    const authToken = constant.TWILIO.AUTH_TOKEN;
    const defaultPhone = constant.TWILIO.PHONE;

    const client = require('twilio')(accountSid, authToken);

    return new Promise((resolve, reject) => {
        client.messages.create({
            from: defaultPhone,
            to: data.number.replace(' ', ''),
            body: sms
        }).then((message) => {
            return client.messages(message.sid)
                .fetch()
                .then((messageData) => {
                    let smsLogData = {};
                    let promise = new Promise(resolve => {
                        smsLogData.messageSid = messageData.sid;
                        smsLogData.from = messageData.from;
                        smsLogData.to = messageData.to;
                        smsLogData.content = messageData.body;
                        smsLogData.contentSegments = messageData.numSegments;
                        smsLogData.price = Math.abs(messageData.price);
                        smsLogData.priceUnit = messageData.priceUnit;
                        smsLogData.clientId = clientId;
                        smsLogData.status = messageData.status;
                        smsLogData.dateSent = new Date(messageData.dateSent);
                        resolve(smsLogData);
                    });
                    return promise.then(smsLogData => {
                        return new smsLogModel(smsLogData).save().then((res) => {
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

function getParams(data, emailTemp) {
    return new Promise((resolve, reject) => {
        return preferencesModel.aggregate([
            {$match: {clientId: data.adminCognitoSub}},
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


function getmobileNo(event) {
    console.log('getmobileNoevent', JSON.stringify(event));
    const phone = event.number.substr(event.number.indexOf('+') + 1);
    let finalPhone = phone.replace(' ', '');
    let countryCode = '0';
    let mobileNo = countryCode + finalPhone;
    console.log(mobileNo, 'mobileNo');
    return mobileNo;
}


function getNotifications(data) {
    console.log('getNotificationsData', JSON.stringify(data));
    return settingModel.findOne({clientId: data.adminCognitoSub, isCurrent: true}, {notifications: 1})
}


function getTemplate(template, data) {

    let content = {};
    let regX = /USER_NAME|CustomerName|CustomerAddress|AgentName|EndTime|EndDate|OrderId|StartDate|StartTime|TrackingLink|CompanyName|CompletedTime|pickUp|taskId/gi;
    let emailContent = template.replace(/[\[\]']+/g, ''); // first remove the [] ;
    content = emailContent.replace(regX, function (matched) {
        return data[matched];
    });
    return content;
}


function getDailyRange(taskDetails) {

    return new Promise((resolve, reject) => {

        const Moment = require('moment');
        const MomentRange = require('moment-range');
        const moment = MomentRange.extendMoment(Moment);
        //const start = new Date('2019-04-25T05:49:59Z');
        // const end = new Date('2019-04-29T05:49:59Z');
        const start = new Date(taskDetails.date);

        if (taskDetails.recurringObj.recurEndsOn && taskDetails.recurringObj.recurEndsOn !== null) {
            var end = new Date(taskDetails.recurringObj.recurEndsOn);
        }
        if (taskDetails.recurringObj.recurEndsAfter && taskDetails.recurringObj.recurEndsAfter !== null) {
            var result = new Date(taskDetails.date);
            result.setDate(result.getDate() + taskDetails.recurringObj.recurEndsAfter);
            var end = result.toISOString();
            console.log('end date' + end);
        }
        const range = moment.range(moment(start), moment(end));
        var type = taskDetails.recurringObj.isRecurType;
        if (type === 1) {
            console.log('coming here')// daily
            resolve(diffType('day', range));
        }
        else if (type === 2) {   // weekly
            var a = moment(taskDetails.date);
            if (taskDetails.recurringObj.recurEndsOn && taskDetails.recurringObj.recurEndsOn !== null) {
                var recurEndsOn = taskDetails.recurringObj.recurEndsOn
                var b = moment(recurEndsOn);
            }
            else {
                var occurences = taskDetails.recurringObj.recurEndsAfter * 7;  // occurence week
                var b = moment(a).add('days', occurences);

            }
            console.log(b);
            //
            var difference = b.diff(a, 'days');
            console.log(difference + 'difference here');
            var findRangeArray = [];
            var isRecurDaysOn = taskDetails.recurringObj.isRecurDaysOn;
            for (var i = 0; i < isRecurDaysOn.length; i++) {
                if (isRecurDaysOn[i].checked === true) {
                    findRangeArray.push(isRecurDaysOn[i].number);
                }
            }
            var total = [];
            var temp = [];
            for (var i = 0; i < findRangeArray.length; i++) {
                total = total.concat(weeklyReturn(findRangeArray[i], a, difference));
            }
            resolve(total);
        }
        else if (type === 3) {   // monthly
            resolve(diffType('month', range));
        }
        else {                                    // yearly
            resolve(diffType('year', range));
        }
    }).catch((err) => {
        console.log(err + 'consoling error here');
    })
}

function diffType(type, range) {
    let arr = Array.from(range.by(type));
    let dateRange = arr.map(m => m.toISOString())
    return dateRange;
}


function weeklyReturn(day, a, difference) {
    let start = a;
    let end = moment().add(difference - 1, 'd');

    console.log(end.toISOString() + 'end');
    var arr = [];
// Get "next" monday
    let tmp = start.clone().day(day);
    console.log(tmp.toISOString() + 'tmp');
    if (tmp.isAfter(start, 'd')) {
        arr.push(tmp.toISOString());
    }
    while (tmp.isBefore(end)) {
        tmp.add(7, 'days');
        arr.push(tmp.toISOString());
    }
    var lastItem = arr.pop();
    console.log(lastItem);
    if (moment(lastItem).isAfter(end)) {
        return arr
    }
    else {
        arr.push(lastItem);
        return arr;
    }
}


function getAddress(address, cb) {
    return new Promise((resolve, reject) => {
        if (address.formatted_address) {
            return resolve(address);
        } else {
            geocoder.geocode(address, (err, address) => {
                console.log(JSON.stringify(address));
                if (err || !address.results.length) {
                    return result.invalidAddress(cb);
                } else {
                    return resolve({
                        'formatted_address': address.results[0].formatted_address,
                        'geometry': address.results[0].geometry
                    });
                }
            }, apiKey);
        }
    });
}