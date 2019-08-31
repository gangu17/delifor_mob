const mongoose = require('mongoose');
const result = require('./result');
const helper = require('./util');
const constant = require('./constant')();
const isIt = constant.isIt;
const tables = constant.TABLES;
const userModel = require('./model').user;
const earningsModel = require('./model').earnings;


module.exports = {
    eaningsList: (event, cb, principals, deviceToken) => {
        console.log('fetch');
        const data = helper.getQueryData(event);
        console.log(JSON.stringify(data) + 'event');
        // console.log(JSON.stringify(data.data.filter));
        if (!data) {
            result.invalidInput(cb);
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
                        return formQuery(data, driverDetails._id, driverDetails.adminDetails[0], cb).then((query) => {
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
                                        'earningsDetails': '$driverEarnings',
                                        'completedTimeString': '$completedTimeString',
                                        'taskId': '$taskDetails.taskId',
                                        'taskStatus': '$taskDetails.taskStatus',
                                        'date': {
                                            "$dateToString": {
                                                format: '%Y-%m-%dT%H:%M:%S.%LZ',
                                                date: "$taskDetails.date",
                                                timezone: "$taskDetails.timezone"
                                            }
                                        },
                                        'bussinessTypeName': {
                                            '$cond': {
                                                'if': {'$eq': ['$taskDetails.businessType', 3]},
                                                'then': 'Field Workforce',
                                                'else': {
                                                    '$cond': {
                                                        'if': {'$eq': ['$taskDetails.businessType', 2]},
                                                        'then': 'Appointment',
                                                        'else': {
                                                            '$cond': {
                                                                'if': {'$eq': ['$taskDetails.isPickup', true]},
                                                                'then': 'Pickup',
                                                                'else': 'Delivery'
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                    }
                                }
                            ]).then((results) => {
                                console.log(results);
                                result.sendSuccess(cb, {taskDetails: results});
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

function formQuery(taskId, driverId, adminDetails, cb) {
    return new Promise((resolve, reject) => {
        var basicQuery = {
            $match: {
                $and: [{
                    clientId: adminDetails.cognitoSub,
                    driverId: driverId,
                    isDeleted: isIt.NO,
                    taskId: mongoose.Types.ObjectId(taskId)
                }]
            }
        };

        resolve(basicQuery);
    });
}



