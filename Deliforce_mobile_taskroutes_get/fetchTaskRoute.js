const mongoose = require('mongoose');
const result = require('./result');
const helper = require('./util');
const constant = require('./constant')();
const taskModel = require('./model').task;
const userModel = require('./model').user;
var geolib = require('geolib');
const moment = require('moment-timezone');
const _ = require('lodash');

module.exports = {
    fetchRoutes: (event, cb, principals, deviceToken) => {
        fetchDriverId(principals).then((driverDetails) => {
            const driverData = driverDetails.toObject();
            if (deviceToken && driverData.deviceToken && deviceToken !== driverData.deviceToken) {
                result.duplicateLogin(cb);
            } else {
                // let driverLocation= {latitude:driverDetails.location.coordinates[0],longitude:driverDetails.location.coordinates[0]}
                let driverLocation = {
                    latitude: driverData.location.coordinates[1],
                    longitude: driverData.location.coordinates[0]
                };
//console.log('driverLocation'+ JSON.stringify(driverLocation));

                fetchTasks(driverData).then((taskDetails) => {
                    // var fetchedTasks = taskDetails.toObject();
                    changeTaskOrder(driverLocation, taskDetails, cb);
                });

            }
        });
    }
};


// function sortDistance(arr) {
//
//     if(arr.length === 0) {
//         return  [];
//     }
//     var left =[];
//     var right= [];
//     var pivot = arr[0];
//
// }

function changeTaskOrder(driverLocation, taskArry, cb) {
    // console.log('coming here');
    let finalArry = [];
    // console.log(taskArry);
    if (taskArry.length) {
        //   console.log('taskArray lenght'+ taskArry.length)
        let latlanArry = [];
        latlanArry = taskArry.map((t) => {
            return {latitude: t.address.geometry.location.lat, longitude: t.address.geometry.location.lng}
        });

        let nearestFirstTask = fecthNearList(driverLocation, latlanArry);

        let finalArry = [];
        if (nearestFirstTask) {
            let index = Number(nearestFirstTask['key']);
            finalArry.push(taskArry[index])
            latlanArry.splice(index, 1);
            taskArry.splice(index, 1)
        }
        let length = taskArry.length;
        for (let i = 0; i < length; i++) {
            // console.log('length',latlanArry.length);
            if (latlanArry.length === 1) {
                //       console.log('lastElement');
                finalArry.push(taskArry[0]);
                break;
            }
            else {

                let recentElement = finalArry[finalArry.length - 1];
                let loc = {
                    latitude: recentElement.address.geometry.location.lat,
                    longitude: recentElement.address.geometry.location.lng
                }
                let TaskList = fecthNearList(loc, latlanArry);
                if (TaskList) {
                    let index = Number(TaskList['key']);
                    finalArry.push(taskArry[index])
                    latlanArry.splice(index, 1);
                    taskArry.splice(index, 1);
                }

            }


        }
        console.log(JSON.stringify(finalArry) + 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
        result.sendSuccess(cb, {'taskList': finalArry});


    } else {
        result.sendSuccess(cb, {'taskList': finalArry.slice(0,22)});
    }
}

/*
* source:{"latitude":12.9839634,"longitude":77.7500254}

* destArry:[{"latitude":12.9839634,"longitude":77.7500254},{"latitude":12.9839634,"longitude":77.7500254}]
* */
function fecthNearList(source, destArry) {
    // console.log('source',JSON.stringify(source));
    // console.log('dest',JSON.stringify(destArry));
    let orderList = geolib.orderByDistance(source, destArry);
    if (orderList.length) {
        return orderList[0];
    }

    return null;

}


//change the task order based on the
// function changeTaskOrder(driverLocation, taskArry, cb) {
//     console.log('coming here');
//     let finalArry = [];
//     console.log(taskArry);
//     if (taskArry.length) {
//         let latlanArry = [];
//         latlanArry = taskArry.map((t) => {
//             // t = t.toObject();
//             return {longitude: t.address.geometry.location.lng, latitude: t.address.geometry.location.lat}
//         });
//
//         let orderArry = geolib.orderByDistance(driverLocation, latlanArry);
//         for (let i = 0; i < orderArry.length; i++) {
//             finalArry.push(taskArry[Number(orderArry[i].key)]);
//         }
//         result.sendSuccess(cb, {'taskList': finalArry});
//        console.log(JSON.stringify(orderArry) +'order array here');
//
//     } else {
//         result.sendSuccess(cb, {'taskList': finalArry});
//     }
// }

function fetchTasks(driverData) {
    //returning fetched tasks of that day for particular driver.
    let driverId = driverData._id;
    return userModel.find({cognitoSub: driverData.clientId}).then((adminDetails) => {
        // var adminDetails = {};
        // adminDetails.timezone = "Asia/Calcutta";
        // var s1 = moment.tz(new Date(), 'YYYY-MM-DD', adminDetails.timezone)
        // // var e1 = moment.tz(data.filter.dateRange[1], 'YYYY-MM-DD', adminDetails.timezone)
        // //

        //    console.log(s1 + 's1');
        // //   console.log(e1 + 'e1');
        //    console.log('tzzzzzzzz', adminDetails.timezone);
        //
        //    var startDate = s1.clone().startOf('day').utc();
        //    var dateMidnight = s1.clone().endOf('day').utc();
        //
        //    let date = {
        //        $gte: new Date(startDate),
        //        $lte: new Date(dateMidnight)
        //    };

        // -1 day for testing
        //   var date123 = new Date();
        // var day = new Date(date123.getTime() - 24*60*60*1000);


        var day = new Date();
        const startDate = day.setHours(0, 0, 0, 0);
        const dateMidnight = day.setHours(23, 59, 59, 999);
        let date = {
            $gt: new Date(startDate),
            $lt: new Date(dateMidnight)
        };
        return taskModel.find({
            driver: mongoose.Types.ObjectId(driverId),
            date: date,
            taskStatus: {$in: [2, 3, 4, 10]}
        }, {settings: 0, driverImages: 0}).then((taskList) => {
            return newTaskList = taskList.map(function (taskData) {
                // console.log('each task', JSON.stringify(taskList));
                let t = taskData.toObject();
                let stDate = new Date(t.date);
                let tz = (adminDetails.timezone) ? adminDetails.timezone : 'Asia/Calcutta';
                // console.log('timezone', stDate);
                let m = moment.utc(stDate, "YYYY-MM-DD h:mm:ss A");
                t.date = m.tz(tz).format("YYYY-MM-DD h:mm:ss A");
                if (t.businessType === 2 || t.businessType === 3) {
                    let endDate = t.endDate;
                    let m1 = moment.utc(endDate, "YYYY-MM-DD h:mm:ss A");
                    t.endDate = m1.tz(tz).format("YYYY-MM-DD h:mm:ss A");
                }
                return t;
            });
        })
    })

}

function fetchDriverId(driverSub) {
    return userModel.findOne({cognitoSub: driverSub});
}

//,taskStatus:{$in:[2,4,6,10]}