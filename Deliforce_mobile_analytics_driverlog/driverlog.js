const result = require('./result');
const driverLogModel = require('./model').driverLog;
const userModel = require('./model').user;
const helper = require('./util');
const constant = require('./constant')();
const taskS = constant.TASK_STATUS;
const empty = require('is-empty');
const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment-timezone');


module.exports = {
    ontime: (event, cb, principals, deviceToken) => {
        var startDate1;
        let timezone;
        const data = helper.getBodyData(event);
        if (!data) {
            result.invalidInput(cb);
        }
        let query = {$match: {$and: [{driverId: principals}]}};
        return userModel.findOne({cognitoSub: principals, isDeleted: 0}).then((driverDetails) => {
            driverDetails = driverDetails.toObject();
            if (deviceToken && driverDetails.deviceToken && deviceToken !== driverDetails.deviceToken) {
                result.duplicateLogin(cb);
            } else {
                return userModel.findOne({cognitoSub: driverDetails.clientId}).then((adminDetails) => {

                    let startDate;
                    let endDate = new Date();
                    let date = new Date();
                    if (data.dateFilter === 1) {
                        startDate = new Date();
                        startDate1 = startDate;
                    } else if (data.dateFilter === 2) {
                        startDate = new Date(date.setDate(date.getDate() - 6));
                        startDate1 = startDate;
                    } else if (data.dateFilter === 3) {
                        console.log('coming here');
                        startDate = new Date(date.setDate(date.getDate() - 30));
                        startDate1 = startDate;
                        console.log(startDate1 + 'ffffffffffffffffffffffffff');
                    } else {
                        startDate = new Date(date.setDate(date.getDate() - 365));
                        startDate1 = startDate;
                    }
                    adminDetails = adminDetails.toObject()

                    var s1 = moment.tz(new Date(startDate), 'YYYY-MM-DD', adminDetails.timezone);
                    var e1 = moment.tz(new Date(endDate), 'YYYY-MM-DD', adminDetails.timezone);

                    startDate = s1.clone().startOf('day').utc();
                    endDate = e1.clone().endOf('day').utc();

                    let dateRange = {
                        $gt: new Date(startDate),
                        $lt: new Date(endDate)
                    };
                    console.log(dateRange);
                    query.$match.$and.push({date: dateRange});
                    timezone = adminDetails.timezone;
                })

            }
        }).then(() => {

            console.log(JSON.stringify(query));

            driverLogModel.aggregate(
                [
                    query,
                    {
                        $project: {
                            yearMonthDay: {$dateToString: {format: "%Y-%m-%d", date: "$date", timezone: timezone}},
                            'idleTime': '$idleTime',
                            'activeTime': '$activeTime'
                        }
                    }, {
                    $group:
                        {
                            _id: "$yearMonthDay",
                            'idleTime': {$sum: "$idleTime"},
                            'activeTime': {$sum: "$activeTime"},
                        }
                }
                ]
            ).then((resultData) => {
                console.log('resultData', resultData);
                console.log(startDate1);
                // console.log('date',data.filter.dateFilter[0],data.filter.dateFilter[1]);
                var datesArry = getDates(new Date(startDate1), new Date()).map((date) => {
                    return this.newData = date.toISOString().slice(0, 10);
                });

                let ourObject = [];
                const mock = {
                    idleTime: 0,
                    activeTime: 0

                };
                let totalAciveTime = 0;
                let totalIdleTime = 0;
                datesArry.forEach((v) => {
                    ourObject.push(Object.assign({_id: v}, mock));
                });

                console.log('ourobject', ourObject);

                var mergedList = _.map(ourObject, function (item) {
                    console.log('item', item);
                    const find = _.find(resultData, {_id: item._id});
                    console.log('find', item._id);
                    if (find) {
                        return find;

                    } else {
                        return item;
                    }
                });
                console.log('mergerdList', JSON.stringify(mergedList));
                totalAciveTime = _.sumBy(mergedList, 'activeTime');
                totalIdleTime = _.sumBy(mergedList, 'idleTime');
                //  mergedList.toArray();
                //  mergedList.push({totalAciveTime:totalAciveTime});
                // mergedList.push({totalIdleTime:totalIdleTime});

                var res = {json_data: mergedList};

                var finalRes = Object.assign(res, {totalAciveTime: totalAciveTime, totalIdleTime: totalIdleTime});
                console.log('hello', JSON.stringify(mergedList));
                result.sendSuccess(cb, finalRes);
            }).catch((error) => {
                //  console.log(error);
                result.sendServerError(cb)
            });
        })
    }
};


function getDates(startDate, endDate) {
    let dates = [];
    this.currentDate = startDate;
    let addDays = function (days) {
        let date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };
    while (this.currentDate <= endDate) {
        dates.push(this.currentDate);
        this.currentDate = addDays.call(this.currentDate, 1);
    }
    return dates;
// Usage
}
