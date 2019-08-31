const mongoose = require('mongoose');
const result = require('./result');
const helper = require('./util');
const constant = require('./constant')();
const isIt = constant.isIt;
const moment = require('moment-timezone');
const _ = require('lodash');
const taskModel = require('./model').task;
const userModel = require('./model').user;
const templateModel = require('./model').template;


module.exports = {
    fetchTasks: (event, cb, principals, deviceToken) => {
        console.log('fetch');
        const data = helper.getBodyData(event);
        if (!data) {
            result.invalidInput(cb);
            return;
        }
        const clientId = principals;
        console.log(clientId);
        if (!clientId) {
            result.sendUnAuth(cb);
            return;
        }
        userModel.findOne({cognitoSub: clientId}).then((driverDetails) => {
            driverDetails = driverDetails.toObject();

            if (deviceToken && driverDetails.deviceToken && deviceToken !== driverDetails.deviceToken) {
                result.duplicateLogin(cb);
            } else {
                userModel.findOne({cognitoSub: driverDetails.clientId}).then((adminDetails) => {
                    adminDetails = adminDetails.toObject();

                    taskModel.aggregate([{$match: {_id: mongoose.Types.ObjectId(data._id)}},
                        {
                            $lookup: {
                                from: "notes",
                                "let": {"taskId": "$_id"},
                                "pipeline": [
                                    {
                                        "$match": {
                                            "$expr": {$eq: ["$$taskId", "$taskId"]},
                                            "isDeleted": 0
                                        }
                                    },
                                ],
                                as: "notes"
                            }
                        },
                        {
                            $lookup: {
                                from: "barcodes",
                                localField: "_id",
                                foreignField: "taskId",
                                as: "barcodes"
                            },
                        }


                    ]).then((taskData) => {
                        console.log(taskData);
                        if (taskData.length) {
                            let t = taskData[0];
                            if (t.chooseCustomer === 2) {
                                t.name = t.customerOne.name;
                                t.phone = t.customerOne.phone;
                            } else if (t.chooseCustomer === 3) {
                                t.name = t.customerTwo.name;
                                t.phone = t.customerTwo.phone;
                            }
                            t.taskImagesCount = (adminDetails.taskImagesCount) ? adminDetails.taskImagesCount : 5
                            t.description = (t.description) ? t.description : '';
                            let stDate = new Date(t.date);
                            let tz = (adminDetails.timezone) ? adminDetails.timezone : 'Asia/Calcutta';
                            console.log('timezone', stDate);
                            let m = moment.utc(stDate, "YYYY-MM-DD h:mm:ss A");
                            t.date = m.tz(tz).format("YYYY-MM-DD h:mm:ss A");
                            if (t.businessType === 2 || t.businessType === 3) {
                                let endDate = t.endDate;
                                let m1 = moment.utc(endDate, "YYYY-MM-DD h:mm:ss A");
                                t.endDate = m1.tz(tz).format("YYYY-MM-DD h:mm:ss A");
                            }

                            if (t.templates && t.templates.length) {
                                templateModel.findOne({templateId: t.templateId}).then((templateData) => {
                                    templateData = (templateData) ? templateData.toObject() : templateData;
                                    console.log(templateData);
                                    t['templateLength'] = templateData.templates.length;
                                  //   console.log('==============================')
                                  //   console.log(t);
                                  //   console.log(t.templateLength);
                                  //   console.log('==============================')
                                var removed = _.filter(t.templates, item => item.dataType !== 'checkbox');
                                // var some = removed.filter(obj => obj.dataType == 'date' || obj.dataType == 'dateFuture' || obj.dataType == 'datePast' || obj.dataType == 'dateTime' || obj.dataType == 'dateTimeFuture' || obj.dataType == 'dateTimePast');
                                for (var i = 0; i < removed.length; i++) {
                                    console.log('test here');
                                    // removed[i].dataType === 'dateTime'  || removed[i].dataType ==='dateTimeFuture' || removed[i].dataType === 'dateTimePast' &&
                                    if (!removed[i].fieldValue) {
                                        console.log('test here');
                                        removed[i].fieldValue = '';
                                    }
                                }
                                var checkCount = _.filter(t.templates, {dataType: 'checkbox'})
                                if (checkCount.length) {
                                    for (var i = 0; i < checkCount.length; i++) {
                                        if (!checkCount[i].fieldValue) {
                                            checkCount[i].fieldValue = 'false'
                                        }
                                        if (checkCount[i].fieldValue === true) {
                                            checkCount[i].fieldValue = 'true'
                                        }
                                        if (checkCount[i].fieldValue === false) {
                                            checkCount[i].fieldValue = 'false'
                                        }
                                    }
                                }
                                t.templates = removed.concat(checkCount);
                                t.templates.sort(function (a, b) {
                                    return a.order - b.order;
                                });
                                    result.sendSuccess(cb, JSON.stringify({'taskData': t}));
                            });

                            } else {


                                console.log(t.templates);

                                console.log('new tasklist', JSON.stringify(t));

                                result.sendSuccess(cb, JSON.stringify({'taskData': t}));
                            }
                        } else {
                            result.sendSuccess(cb, {'status': 201, 'message': 'task not exist in the db'})
                        }

                    }).catch((err) => {
                        console.log(err)
                    })
                })

            }
        });

    }
};

