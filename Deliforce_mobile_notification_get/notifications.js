const result = require('./result');
const notifications = require('./model').NOTIFICATION;
const userModel= require('./model').USER;
const helper = require('./util');
const constant = require('./constant')();
const isIt = constant.isIt;
const mongoose= require('mongoose');
const moment = require('moment-timezone');


module.exports = {
    fetchNotifications:(event, cb, principals) => {
        const clientId = principals;
        console.log('event',JSON.stringify(event));
        fetchDriverId(principals).then((driverInfo)=>{
            driverInfo=driverInfo.toObject();
            return notifications.find({driver: mongoose.Types.ObjectId(driverInfo._id)},
                function (err, data) {
                    console.log(data);
                    if (err) {
                        result.sendServerError(cb);
                    } else {
                      var newTaskList = data.map(function (taskData) {
                            //console.log('each task',JSON.stringify(t));
                            let t = taskData.toObject();
                            let stDate = new Date(t.date);
                            let tz = (t.timezone) ? t.timezone : 'Asia/Calcutta';
                            console.log('timezone', stDate);
                            let m = moment.utc(stDate, "YYYY-MM-DD h:mm:ss A");
                            t.date = m.tz(tz).format("YYYY-MM-DD h:mm:ss A");
                            if (t.businessType === 2 || t.businessType === 3) {
                                let endDate = t.endDate;
                                let m1 = moment.utc(endDate, "YYYY-MM-DD h:mm:ss A");
                                t.endDate = m1.tz(tz).format("YYYY-MM-DD h:mm:ss A");
                            }
                            return t;
                        });
                        result.sendSuccess(cb,{"notifications":newTaskList});

                    }
                });
        }).catch((err)=>{
            console.log('err',err);
            result.sendServerError(cb)
        })
    }
};



function fetchDriverId(cognitoSub){
    return userModel.findOne({cognitoSub:cognitoSub})
}