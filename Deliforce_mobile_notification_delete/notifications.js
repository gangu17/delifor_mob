const result = require('./result');
const notifications = require('./model').NOTIFICATION;
const userModel= require('./model').USER;

const mongoose= require('mongoose');


module.exports = {
    fetchNotifications:(event, cb, principals) => {

        console.log('event',JSON.stringify(event));
        fetchDriverId(principals).then((driverInfo)=>{
            driverInfo=driverInfo.toObject();
            return notifications.remove({driver: mongoose.Types.ObjectId(driverInfo._id)},
                function (err, data) {
                    console.log(data);
                    if (err) {
                        result.sendServerError(cb);
                    } else {

                        result.sendSuccess(cb,JSON.stringify({httpStatusCode:200,'message':'notifications are deleted successfully'}));

                    }
                });
        }).catch((err)=>{
            console.log('err',err);
            result.sendServerError(cb);
        });
    }
};


function fetchDriverId(cognitoSub){
    return userModel.findOne({cognitoSub:cognitoSub});
}





