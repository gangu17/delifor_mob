const mongoose = require('mongoose');
const result = require('./result');
const helper = require('./util');
const constant = require('./constant')();
const isIt = constant.isIt;
const moment = require('moment-timezone');
const geolib = require('geolib');
var value = null;
var _ = require('lodash');

//const settingModel = require('./model').setting;
const taskModel = require('./model').task;
const userModel = require('./model').user;

module.exports = {
    fetchTasks: (event, cb, principals, deviceToken) => {
        console.log('fetch');
        const data = helper.getBodyData(event);
        console.log(JSON.stringify(data) + 'event');
        // console.log(JSON.stringify(data.data.filter));
        if (!data) {
            result.invalidInput(cb);
            return;
        }
        // const data = {filter:{statusFilter:[],dateRange:'',search:''}} ;
        //const clientId = '3628e1a2-d041-4cd6-85e3-dfb40a882839';
        const clientId = principals;
        console.log(clientId);
        if (!clientId) {
            result.sendUnAuth(cb);
            return;
        }
        userModel.findOne({ cognitoSub: clientId }).then((driverDetails) => {
            driverDetails = driverDetails.toObject();
            if (deviceToken && driverDetails.deviceToken && deviceToken !== driverDetails.deviceToken) {
                result.duplicateLogin(cb);
            } else {
                userModel.findOne({ cognitoSub: driverDetails.clientId }).then((adminDetails) => {
                    adminDetails = adminDetails.toObject();
                    if (driverDetails) {
                        if (data.filter && data.filter.sortByTIme === 1) {
                            value = 1
                        } else {
                            value = -1;
                        }
                        console.log(typeof driverDetails);
                        const driverDetail = (typeof driverDetails === "object") ? driverDetails : driverDetails.toObject();
                        const driverId = driverDetail._id;
                        console.log(driverId, '++++++++++++++++');
                        //const query = {driver: driverId, isDeleted: isIt.NO};


                        const query = formQuery(data, driverId, cb, adminDetails);
                        console.log(JSON.stringify(query) + 'printing herree');

                        if (data.filter) {
                            let newTaskList = {};
                            taskModel.find(query, {
                                _id: 1,
                                name: 1,
                                date: 1,
                                endDate: 1,
                                businessType: 1,
                                address: 1,
                                taskStatus: 1,
                                isPickup: 1,
                                taskColor: 1,
                                timezone: 1,
                                priority: 1,
                                orderId: 1,
                                templates: 1,
                                chooseCustomer: 1,
                                customerOne: 1,
                                customerTwo: 1,
                                glympseId:1,
                                glympseDriverId:1
                            }).sort({ 'date': value }).exec().then((tasks) => {
                                //  taskModel.find(query,{_id:1,name:1,date:1,endDate:1,businessType:1,address:1,taskStatus:1,isPickup:1}).then((tasks) => {

                                console.log('tasks here', JSON.stringify(tasks));
                                const taskList = tasks;

                                newTaskList = taskList.map(function (taskData) {

                                    //console.log('each task',JSON.stringify(t));
                                    let t = taskData.toObject();
                                    if (t.chooseCustomer === 2) {
                                        t.name = t.customerOne.name;
                                        t.phone = t.customerOne.phone;
                                    } else if (t.chooseCustomer === 3) {
                                        t.name = t.customerTwo.name;
                                        t.phone = t.customerTwo.phone;
                                    }
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
                                    (t.orderId) ? t.orderId = t.orderId : t.orderId = '';
                                    return t;
                                });


                                if (!newTaskList.length) {
                                    result.sendSuccess(cb, { 'taskList': [] });
                                }

                                if (data.filter && data.filter.sortByDistance === 1 && newTaskList.length) {
                                    console.log('coming here');
                                    console.log(newTaskList);
                                    userModel.findOne({ cognitoSub: clientId }).then((driverDetails) => {
                                        const driverData = driverDetails.toObject();
                                        console.log(driverData + 'driver data hereee');
                                        let driverLocation = {
                                            latitude: driverData.location.coordinates[1],
                                            longitude: driverData.location.coordinates[0]
                                        }
                                        let finalArry = [];
                                        if (newTaskList.length) {
                                            let latlanArry = [];
                                            latlanArry = newTaskList.map((t) => {
                                                return {
                                                    longitude: t.address.geometry.location.lng,
                                                    latitude: t.address.geometry.location.lat
                                                }
                                            });
                                            console.log(latlanArry);
                                            let orderArry = geolib.orderByDistance(driverLocation, latlanArry);
                                            console.log(orderArry);
                                            //  let newOrderArray = orderArry.reverse();
                                            for (let i = 0; i < orderArry.length; i++) {
                                                finalArry.push(newTaskList[Number(orderArry[i].key)]);
                                            }


                                            let successArray = [];
                                            let failedCancelledArray = [];

                                            _.find(finalArry, function (finalArryObj) {
                                                if (finalArryObj.taskStatus === 6) {
                                                    successArray.push(finalArryObj);
                                                }
                                            });// logic for putting completed task in bottom
                                            _.find(finalArry, function (finalArryObj) {
                                                if (finalArryObj.taskStatus === 7 || finalArryObj.taskStatus === 9) {
                                                    failedCancelledArray.push(finalArryObj);
                                                }
                                            });
                                            _.remove(finalArry, function (finalArryObj1) {
                                                return finalArryObj1.taskStatus === 6 || finalArryObj1.taskStatus === 7 || finalArryObj1.taskStatus === 9
                                            });
                                            var finalResultArray = finalArry.concat(successArray, failedCancelledArray);

                                            result.sendSuccess(cb, { 'taskList': finalResultArray });
                                        }
                                    }).catch((err) => {
                                        console.log(err);
                                    })

                                }
                                else {
                                    if (data.filter && data.filter.sortByDistance === 0 && data.filter.sortByTIme === 0) {
                                        console.log('coming here at 120')
                                        console.log('new tasklist', newTaskList);
                                        var taskListpriority = [];
                                        for (i = 0; i < newTaskList.length; i++) {

                                            if (newTaskList[i].priority >= 0) {
                                                taskListpriority.push(newTaskList[i]);
                                            }
                                            console.log(JSON.stringify(taskListpriority) + 'priorityArray');
                                        }
                                        console.log(JSON.stringify(taskListpriority) + 'priorityArray123');
                                        var finalPriorityArray = _.sortBy(taskListpriority, ['priority']);

                                        let successArray = [];
                                        let failedCancelledArray = [];
                                        _.find(finalPriorityArray, function (finalArryObj) {
                                            if (finalArryObj.taskStatus === 6) {
                                                successArray.push(finalArryObj);
                                            }
                                        });// logic for putting completed task in bottom
                                        _.find(finalPriorityArray, function (finalArryObj) {
                                            if (finalArryObj.taskStatus === 7 || finalArryObj.taskStatus === 9) {
                                                failedCancelledArray.push(finalArryObj);
                                            }
                                        });// logic for putting completed task in bottom
                                        _.remove(finalPriorityArray, function (finalArryObj1) {
                                            return finalArryObj1.taskStatus === 6 || finalArryObj1.taskStatus === 7 || finalArryObj1.taskStatus === 9
                                        });
                                        finalPriorityArray.reverse();
                                        console.log('finalPriority', finalPriorityArray);
                                        console.log('finalPriority1', successArray);
                                        let finalResultArray = finalPriorityArray.concat(successArray, failedCancelledArray);
                                        result.sendSuccess(cb, JSON.stringify({ taskList: finalResultArray }));


                                    }
                                    else {

                                        let successArray = [];
                                        let failedCancelledArray = [];
                                        _.find(newTaskList, function (finalArryObj) {
                                            if (finalArryObj.taskStatus === 6) {
                                                successArray.push(finalArryObj);
                                            }
                                        });// logic for putting completed task in bottom
                                        _.find(newTaskList, function (finalArryObj) {
                                            if (finalArryObj.taskStatus === 7 || finalArryObj.taskStatus === 9) {
                                                failedCancelledArray.push(finalArryObj);
                                            }
                                        });// logic for putting completed task in bottom
                                        _.remove(newTaskList, function (finalArryObj1) {
                                            return finalArryObj1.taskStatus === 6 || finalArryObj1.taskStatus === 7 || finalArryObj1.taskStatus === 9
                                        });
                                        console.log('finalPriority1', successArray);
                                        let finalResultArray = newTaskList.concat(successArray, failedCancelledArray);
                                        result.sendSuccess(cb, JSON.stringify({ taskList: finalResultArray }));

                                    }
                                }
                            }).catch((err) => {
                                console.log(err)
                            });
                        }
                        else {
                            console.log('elseeeeeeeeeee');
                            result.invalidInput(cb)
                        }
                    }
                    else {
                        console.log('elseeeeeeeeeee');
                        result.sendUnAuth(cb)
                    }
                })

            }


        }).catch((error) => {
            console.log(error);
            result.sendServerError(cb)
        })

        // result.sendServerError(cb));
        // }
    }
};

function formQuery(data, clientId, cb, adminDetails) {
    const query = { driver: clientId, isDeleted: isIt.NO, taskStatus: { $ne: 8 }, isMobileListing: true };
    // todo


    //  query.$match.$and.push({name: {$regex: `.*${data.filter.search}.*`, '$options': 'i'}});

    //query.$or.push({name: {$regex: `.*${data.filter.search}.*`, '$options': 'i'}});

    if (data.filter && data.filter.search) {
        var or_clauses = [];
        var and_clauses = [];
        query['$or'] = or_clauses;
        or_clauses.push({ name: { $regex: `.*${data.filter.search}.*`, '$options': 'i' } });
        or_clauses.push({ taskId: { $regex: `.*${data.filter.search}.*` } });
        or_clauses.push({ orderId: { $regex: `.*${data.filter.search}.*` } });
        or_clauses.push({ "address.formatted_address": { $regex: `.*${data.filter.search}.*`, '$options': 'i' } });
        or_clauses.push({ phone: { $regex: `.*${data.filter.search}.*` } });

        //   query.$or.push({name: {$regex: `.*${data.filter.search}.*`, '$options': 'i'}});
        // query.$or.push({taskId: {$regex: `.*${data.filter.search}.*`}});
        // query.name = {$regex: `.*${data.filter.search}.*`, '$options': 'i'};
        // query.orderId = {$regex: `.*${data.filter.search}.*`};
        // query.taskId = {$regex: `.*${data.filter.search}.*`};
        // query.address = {$regex: `.*${data.filter.search}.*`};
        // query.phone = {$regex: `.*${data.filter.search}.*`};
    }
    if (data.filter && data.filter.dateRange.length) {
        //  var isoDate = new Date('yourdatehere').toISOString();
        //    let ss1= new Date(dateRange[0]);
        //   let ee1 =new Date(dateRange[1]);
        // let ss1= new Date(data.filter.dateRange[0]);
        // let ee1 =new Date(data.filter.dateRange[1]);
        // adminDetails.timezone = 'America/Mexico_City';
        var s1 = moment.tz(data.filter.dateRange[0], 'YYYY-MM-DD', adminDetails.timezone)
        var e1 = moment.tz(data.filter.dateRange[1], 'YYYY-MM-DD', adminDetails.timezone)


        console.log(s1 + 's1');
        console.log(e1 + 'e1');
        console.log('tzzzzzzzz', adminDetails.timezone);

        var startDate = s1.clone().startOf('day').utc();
        var dateMidnight = e1.clone().endOf('day').utc();

        let date = {
            $gte: new Date(startDate),
            $lte: new Date(dateMidnight)
        };

        console.log('date search ');
        query.date = date;
        console.log(JSON.stringify(date) + 'dddddddddddddddddddd');
    }

    if (data.filter && data.filter.statusFilter.length) {
        var statusArray = data.filter.statusFilter.map((status) => {
            return parseInt(status, 10);
        });
        query.taskStatus = { $in: statusArray };
    }
    return query;
}

// function fetchTask(data) {
//     console.log(data._id);
//     return taskModel.findOne({$and: [{_id : mongoose.Types.ObjectId(data._id)},
//         {taskStatus:{$in:[constant.TASK_STATUS.INPROGRESS,constant.TASK_STATUS.STARTED,constant.TASK_STATUS.ASSIGNED,constant.TASK_STATUS.ACCEPTED]}}]});
// }


