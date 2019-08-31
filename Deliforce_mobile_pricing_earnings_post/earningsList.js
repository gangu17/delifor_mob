const mongoose = require('mongoose');
const result = require('./result');
const helper = require('./util');
const constant = require('./constant')();
const isIt = constant.isIt;
const tables = constant.TABLES;
const moment = require('moment-timezone');
const userModel = require('./model').user;
const earningsModel = require('./model').earnings;
const _ = require('lodash');


module.exports = {
    eaningsList: (event, cb, principals, deviceToken) => {
        const data = helper.getBodyData(event);
        console.log(JSON.stringify(data) + 'event');
        if (!data) {
            result.invalidInput(cb);
            return;
        } else {
            const clientId = principals;
            console.log(clientId);
            if (!clientId) {
                result.sendUnAuth(cb);
                return;
            }

            return userModel.aggregate([
                {$match: {cognitoSub: clientId}},
                {
                    $lookup: {
                        from: tables.USER,
                        localField: 'clientId',
                        foreignField: 'cognitoSub',
                        as: 'adminDetails'
                    }
                },
                {
                    $lookup: {
                        from: tables.USERSETTINGS,
                        localField: 'clientId',
                        foreignField: 'clientId',
                        as: 'userSettingsDetails'
                    }
                }
            ]).then((driverAdminDetails) => {
                driverDetails = driverAdminDetails[0];
                if (deviceToken && driverDetails.deviceToken && deviceToken !== driverDetails.deviceToken) {
                    result.duplicateLogin(cb);
                } else {
                    if (driverDetails.userSettingsDetails[0].isEarningsModule) {
                        return formQuery(data, driverDetails._id, cb, driverDetails.adminDetails[0]).then((query) => {
                            console.log('query', JSON.stringify(query));
                            return earningsModel.aggregate([
                                query,
                                {
                                    $lookup: {
                                        from: 'tasks',
                                        localField: 'taskId',
                                        foreignField: '_id',
                                        as: 'taskDetails'
                                    }
                                },
                                {$unwind: '$taskDetails'},
                                {
                                    $project: {
                                        yearMonthDay: {$dateToString: {format: "%Y-%m-%d", date: "$taskDate"}},
                                        'completedTimeString': '$completedTimeString',
                                        'taskDetails': "$taskDetails",
                                        'driverEarnings': "$driverEarnings"
                                    }
                                },
                                {
                                    $group:
                                        {
                                            _id: {"yearMonthDay": "$yearMonthDay"},
                                            individualCount: {$sum: '$driverEarnings.totalSum'},
                                            filteredDetails: {
                                                $push: {
                                                    "name": "$taskDetails.name",
                                                    "taskId": "$taskDetails.taskId",
                                                    "_id": "$taskDetails._id",
                                                    "taskStatus": "$taskDetails.taskStatus",
                                                    "date": {
                                                        "$dateToString": {
                                                            format: '%Y-%m-%dT%H:%M:%S.%LZ',
                                                            date: "$taskDetails.date",
                                                            timezone: "$taskDetails.timezone"
                                                        }
                                                    },
                                                    "completedTimeString": "$completedTimeString",
                                                    "individualAmount": "$driverEarnings.totalSum",
                                                    "bussinessTypeName": {
                                                        "$cond": {
                                                            "if": {"$eq": ["$taskDetails.businessType", 3]},
                                                            "then": 'Field Workforce',
                                                            "else": {
                                                                "$cond": {
                                                                    "if": {"$eq": ["$taskDetails.businessType", 2]},
                                                                    "then": 'Appointment',
                                                                    "else": {
                                                                        "$cond": {
                                                                            "if": {"$eq": ["$taskDetails.isPickup", true]},
                                                                            "then": 'Pickup',
                                                                            "else": 'Delivery'
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                        }
                                },
                                {
                                    "$group": {
                                        "_id": null,
                                        "dateRange": {
                                            "$push": {
                                                "date": "$_id.yearMonthDay",
                                                "count": "$individualCount",
                                                "taskDetails": "$filteredDetails"
                                            }
                                        },
                                        'totalCount': {$sum: '$individualCount'}
                                    }
                                }
                            ]).then((results) => {
                                if (!results.length) {
                                    result.sendSuccess(cb, {
                                        dateArr: [],
                                        taskDetails: [],
                                        totalCount: 0
                                    });

                                } else {
                                    console.log('results', JSON.stringify(results));
                                    var datesArry = getDates(data.startDate, data.endDate, driverDetails.adminDetails[0].timezone).map((date) => {
                                        return moment(date).format('YYYY-MM-DD');
                                    });

                                    let ourObject = [];
                                    let taskDetails = [];

                                    datesArry.forEach((date) => {
                                        const find = _.find(results[0].dateRange, {date: date});
                                        if (find) {
                                            ourObject.push({date: find.date, count: find.count});
                                            find.taskDetails.forEach((task) => {
                                                taskDetails.push(task);
                                            });
                                        } else {
                                            ourObject.push({date: date, count: 0});
                                        }
                                    });

                                    result.sendSuccess(cb, {
                                        dateArr: ourObject,
                                        taskDetails: taskDetails,
                                        totalCount: results[0].totalCount
                                    });
                                }
                            });
                        });
                    } else {
                        result.sendUnAuth(cb);
                    }
                }
            }).catch((error) => {

                console.log(error);
                result.sendServerError(cb)
            })
        }
    }
};

function formQuery(data, driverId, cb, adminDetails) {
    return new Promise((resolve, reject) => {
        var basicQuery = {
            $match: {
                $and: [{clientId: adminDetails.cognitoSub, driverId: driverId, isDeleted: isIt.NO}]
            }
        };
        if (data && data.startDate && data.endDate) {
            var s1 = moment.tz(data.startDate, 'YYYY-MM-DD', adminDetails.timezone);
            var e1 = moment.tz(data.endDate, 'YYYY-MM-DD', adminDetails.timezone);

            var startDate = s1.clone().startOf('day').utc();
            var dateMidnight = e1.clone().endOf('day').utc();

            let date = {
                $gte: new Date(startDate),
                $lte: new Date(dateMidnight)
            };

            basicQuery.$match.$and.push({'taskDate': date});
            resolve(basicQuery);
        } else {
            result.invalidInput(cb);
        }
    });
}


function getDates(startDate, endDates, timezone) {
    let dates = [];
    var currentDate = moment.tz(new Date(startDate), 'YYYY-MM-DD', timezone);
    var endDate = moment.tz(new Date(endDates), 'YYYY-MM-DD', timezone);
    addDays = function (days) {
        let date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return moment.tz(new Date(date), 'YYYY-MM-DD', timezone);
    };
    while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = addDays.call(currentDate, 1);
    }

    return dates;
}



