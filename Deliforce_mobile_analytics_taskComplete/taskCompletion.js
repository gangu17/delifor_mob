const result = require('./result');
const taskModel = require('./model').Task;
const helper = require('./util');
const mongoose = require('mongoose');
const userSchema = require('./model').User;
const delayTask = require('./delayStatus');

const _ = require('lodash');
const moment = require('moment-timezone');


module.exports = {

    taskComplete: (event, cb, principals, deviceToken) => {
        var startDate1;
        //const data = helper.getBodyData(event);
        let query = {$match: {}};
        getDriverUniqueId(principals).then((driverInfo) => {
            driverInfo = (driverInfo) ? driverInfo.toObject() : null;
            if (deviceToken && driverInfo.deviceToken && deviceToken !== driverInfo.deviceToken) {
                result.duplicateLogin(cb);
            } else {
                userSchema.findOne({cognitoSub: driverInfo.clientId}).then((adminInfo) => {
                    let startDate;
                    let endDate = new Date();
                    let date = new Date();
                    const data = helper.getBodyData(event);
                    console.log(JSON.stringify(event));
                    console.log(JSON.stringify(data));
                    if (data && data.filter === 1) {
                        startDate = new Date();
                        startDate1 = startDate;
                    } else if (data && data.filter === 2) {

                        startDate = new Date(date.setDate(date.getDate() - 6));
                        startDate1 = startDate;
                        console.log('startDate', startDate);
                    } else if (data && data.filter === 3) {

                        startDate = new Date(date.setDate(date.getDate() - 30));
                        startDate1 = startDate;
                    } else {
                        startDate = new Date(date.setDate(date.getDate() - 365));
                        startDate1 = startDate;
                    }

                    adminInfo = adminInfo.toObject();

                    var s1 = moment.tz(new Date(startDate), 'YYYY-MM-DD', adminInfo.timezone);
                    var e1 = moment.tz(new Date(endDate), 'YYYY-MM-DD', adminInfo.timezone);

                    startDate = s1.clone().startOf('day').utc();
                    endDate = e1.clone().endOf('day').utc();

                    let dateFilter = {
                        $gt: new Date(startDate),
                        $lt: new Date(endDate)
                    };

                    console.log(dateFilter);
                    query.$match.date = dateFilter;
                    console.log(JSON.stringify(query));
                    let timezone = adminInfo.timezone;
                    return Promise.all([
                        delayTask.delayCount(driverInfo._id, dateFilter),
                        taskModel.aggregate([
                            {$match: {driver: mongoose.Types.ObjectId(driverInfo._id), taskStatus: 6}},
                            {
                                $lookup: {
                                    from: 'users',
                                    localField: 'driver',
                                    foreignField: '_id',
                                    as: 'driverDetails'
                                }
                            },
                            query,

                            {
                                $project: {
                                    yearMonthDay: {
                                        $dateToString: {
                                            format: "%Y-%m-%d",
                                            date: "$date",
                                            timezone: timezone
                                        }
                                    },
                                    //'driver': "$driverDetails",
                                    'taskStatus': '$taskStatus',
                                    'delay': '$delay'
                                }
                            },

                            {
                                "$group": {
                                    "_id": '$yearMonthDay',
                                    "delayTaskPerDay": {$sum: "$delay"},
                                    "successCount": {"$sum": 1}
                                }
                            },
                            {$sort: {'_id': -1}},


                        ]), totalSuccessCount(driverInfo._id, dateFilter)]).then((resultData) => {
                        console.log(JSON.stringify(resultData));
                        let datesArry = getDates(new Date(startDate1), new Date(endDate)).map((date) => {
                            return this.newData = date.toISOString().slice(0, 10);
                        });
                        let ourObject = [];
                        const mock = {"successCount": 0, "delayTaskPerDay": 0};
                        datesArry.forEach((v) => {
                            ourObject.push(Object.assign({_id: v}, mock));
                        });

                        console.log('datesArry', JSON.stringify('datesArry'));
                        console.log('ourObject', JSON.stringify(ourObject));

                        let mergedList = _.unionBy(resultData[1], ourObject, '_id');
                        console.log(mergedList);
                        console.log(resultData[1]);
                        mergedList = _.orderBy(mergedList, ['_id'], ['asc']);
                        totalTaskCount = (resultData[2] && resultData[2].length) ? resultData[2].length : 0
                        result.sendSuccess(cb, Object.assign({}, {'taskCompleationList': mergedList}, resultData[0], {totalSuccessCount: totalTaskCount}))
                    });
                })
            }
        }).catch((error) => {
            console.log(error);
            result.sendServerError(cb);
        });
    }
};


function getDates(startDate, endDate) {

    let dates = [];
    this.currentDate = new Date(startDate);
    endDate = new Date(endDate);
    let addDays = function (days) {
        let date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };
    while (this.currentDate <= endDate) {
        console.log(this.currentDate);
        dates.push(this.currentDate);
        this.currentDate = addDays.call(this.currentDate, 1);
    }
    //console.log(dates);
    return dates;


}

function getDriverUniqueId(cognitoSub) {
    return userSchema.findOne({'cognitoSub': cognitoSub});
}

function totalSuccessCount(driverId, dateFilter) {
    return taskModel.find({driver: mongoose.Types.ObjectId(driverId), date: dateFilter, taskStatus: 6})
}