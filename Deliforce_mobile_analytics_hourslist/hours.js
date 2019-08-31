const result = require('./result');
const helper = require('./util');
const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment-timezone');

const taskModel = require('./model').task;
const userModel = require('./model').user;
module.exports = {
    ontime: (event, cb, principals, deviceToken) => {
        return userModel.aggregate([
            {
                $match: {
                    cognitoSub: principals
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'clientId',
                    foreignField: 'cognitoSub',
                    as: 'adminDetails'
                }
            }

        ]).then((info) => {
            console.log('info', JSON.stringify(info));
            if (deviceToken && info[0].deviceToken && deviceToken !== info[0].deviceToken) {
                result.duplicateLogin(cb);
            } else {
                const data = helper.getBodyData(event);
                if (!data) {
                    result.invalidInput(cb);
                } else {
                    let query = {$match: {$and: []}};
                    let startDate;
                    let endDate = new Date();
                    let date = new Date();

                    query.$match.$and.push({
                        'driverDetails._id': mongoose.Types.ObjectId(info[0]._id),
                        taskStatus: 6
                    });
                    if (data && data.filter === 1) {
                        startDate = new Date(date.setDate(date.getDate() - 6));
                    } else if (data && data.filter === 2) {
                        startDate = new Date(date.setDate(date.getDate() - 30));
                    } else if (data && data.filter === 3) {
                        startDate = new Date(date.setDate(date.getDate() - 365));
                    } else {
                        startDate = new Date();
                    }
                    console.log('tz', JSON.stringify(info[0].adminDetails[0].timezone));

                    var s1 = moment.tz(new Date(startDate), 'YYYY-MM-DD', info[0].adminDetails[0].timezone);
                    var e1 = moment.tz(new Date(endDate), 'YYYY-MM-DD', info[0].adminDetails[0].timezone);

                    startDate = s1.clone().startOf('day').utc();
                    endDate = e1.clone().endOf('day').utc();

                    let dateFilter = {
                        $gt: new Date(startDate),
                        $lt: new Date(endDate)
                    };
                    console.log('dataFilter', JSON.stringify(dateFilter));
                    query.$match.$and.push({date: dateFilter});
                    console.log(JSON.stringify(query));

                    return taskModel.aggregate([
                        {
                            $lookup:
                                {
                                    from: 'users',
                                    localField: 'driver',
                                    foreignField: '_id',
                                    as: 'driverDetails'
                                }
                        },
                        {$unwind: "$driverDetails"},
                        query,
                        {
                            $group: {
                                _id: '$driverDetails._id',
                                totalMinutes: {$sum: '$timeTakenForTaskCompletion'},
                                totalDistance: {$sum: '$distance'},
                                totalTasks: {$sum: 1},

                            }
                        }
                    ]).then((output) => {
                        console.log('output', JSON.stringify(output));
                        let finalData = (output.length) ? output[0] : {};
                        if (!_.isEmpty(finalData)) {
                            finalData.avgTimeForTask = (finalData.totalMinutes / finalData.totalTasks).toFixed(2) + ' Mins';
                            finalData.avgDistanceForTask = (finalData.totalDistance / finalData.totalTasks).toFixed(2) + ' KM';
                            console.log(JSON.stringify(finalData));
                        }
                        else {
                            finalData = {
                                totalMinutes: 0,
                                totalDistance: 0,
                                totalTasks: 0,
                                avgTimeForTask: 0,
                                avgDistanceForTask: 0
                            };
                        }
                        result.sendSuccess(cb, finalData);
                    }).catch((err) => {
                        console.log(err);
                        result.sendServerError(cb);
                    });
                }
            }
        }).catch((err) => {
            console.log(err);
            result.sendServerError(cb);
        })
    }
};