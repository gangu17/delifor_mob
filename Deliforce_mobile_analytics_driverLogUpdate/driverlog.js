const result = require('./result');
const DriverLog = require('./model').DRIVERLOG;
const userModel = require('./model').USER;
const helper = require('./util');
const moment = require('moment');
const mongoose = require('mongoose');

module.exports = {
    driverLog: (event, cb, principals, deviceToken) => {
        const driverId = principals;
        const data = helper.getBodyData(event);
        let clientId;
        userModel.findOne({cognitoSub: driverId}).then((user) => {
            console.log('user', JSON.stringify(user));
            user = user.toObject();
            if (deviceToken && user.deviceToken && deviceToken !== user.deviceToken) {
                result.duplicateLogin(cb);
            } else {
                clientId = user.clientId;
                console.log('clientId', clientId);
                console.log('data', data);
                console.log("driverId", driverId);
                userModel.update({cognitoSub: driverId}, {batteryState: data.batteryState}, {upsert: true}).then(() => {

                }).catch((err) => {
                    console.log(err + 'err here');
                });
                //const data = {date:'2018-10-11T09:59:18.000Z', idleTime: 30};
                //  const driverId = '680df625-7784-4566-b9f5-e73b45e3a604'
                var newDate = new Date(data.date);
                var dateStamp = newDate.toLocaleDateString();
                var timeStamp = newDate.toLocaleTimeString();
                DriverLog.findOne({driverId: driverId, dateStamp: dateStamp}).then((resultData) => {
                    if (resultData) {
                        console.log('resultData', JSON.stringify(resultData));
                        // var m = resultData.dateStamp +'T'+ resultData.timeStamp;
                        // var a = new Date(m);
                        // var oldDate = moment(a);//now
                        // var newDate = moment(data.date);
                        //   var idleTime = newDate.diff(oldDate, 'idleTime'); // 44700
                        if (!resultData.idleTime) {
                            resultData.idleTime = 0;
                        }
                        if (!resultData.idleDist) {
                            resultData.idleDist = 0;
                        }
                        console.log('resultData.idleTime', resultData.idleTime);
                        console.log('data.idleTime', data.idleTime);
                        console.log('resultData.idleDist', resultData.idleDist);
                        console.log('data.idleDist', data.idleDist);

                        var totalMinutes = resultData.idleTime + data.idleTime;
                        let totalIdleDist = resultData.idleDist + data.idleDist;
                        //    console.log(idleTime + 'hey idleTime here');
                        // DriverLog.update({clientId: clientId}, {date:data.date,dateStamp:dateStamp,timeStamp:timeStamp,idleTime:idleTime+resultData.idleTime}).then((resp) => {
                        //     result.sendSuccess(cb, {message: 'driver log  updated successfully'});
                        // })
                        console.log('clientId', clientId);

                        console.log('totalMinutes', totalMinutes);
                        return DriverLog.update({driverId: driverId, dateStamp: dateStamp}, {
                            clientId: clientId,
                            date: data.date,
                            idleTime: totalMinutes,
                            idleDist: totalIdleDist
                        }).then((resp) => {
                            console.log('resp', resp);
                            resp.idleTime = totalMinutes;
                            totalMinutes = null;
                            result.sendSuccess(cb, resp);
                        })
                    }
                    else {
                        console.log('!resultdata');
                        data.dateStamp = dateStamp;
                        // data.timeStamp = timeStamp;
                        Object.assign(data, {
                            clientId: clientId,
                            driverId: driverId,
                            idleTime: data.idleTime,
                            idleDist: data.idleDist
                        });
                        const model = new DriverLog(data);
                        model.save((err, data) => {
                            if (err) {
                                console.log(err);
                                result.sendServerError(cb);
                            } else {
                                result.sendSuccess(cb, data);
                            }
                        })
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }

        });
    }
}
// data = {date:new Date()}
//   Object.assign(data,{clientId:clientId})
//   const model = new DriverLog(data);
//   model.save(function (err, data) {
//       console.log(err, data);
//       if (err) {
//           console.log('error+++++',JSON.stringify(err))
//           result.sendServerError(cb);
//       } else {
//           result.sendSuccess(cb ,data);
//       }
//   });




