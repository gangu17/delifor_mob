const mongoose = require('mongoose');
const result = require('./result');
const helper = require('./util');
const constant = require('./constant')();
const taskModel = require('./model').task;
const userModel = require('./model').user;
var geolib= require('geolib')

module.exports = {
    fetchRoutes: (event, cb, principals) => {
        fetchDriverId(principals).then((driverDetails)=>{
          const driverData = driverDetails.toObject();
           // let driverLocation= {latitude:driverDetails.location.coordinates[0],longitude:driverDetails.location.coordinates[0]}
            let driverLocation= {latitude:driverData.location.coordinates[1],longitude:driverData.location.coordinates[0]}
            let driverId= driverData._id;
            fetchTasks(driverId).then((taskDetails)=>{
               // var fetchedTasks = taskDetails.toObject();
               changeTaskOrder(driverLocation,taskDetails,cb);
            });

        });
    }
};
//change the task order based on the
function changeTaskOrder(driverLocation,taskArry,cb){
    console.log('coming here');

    let finalArry=[];
    console.log(taskArry);
    if(taskArry.length){
        let latlanArry=[];
        latlanArry = taskArry.map((t)=> {
            t = t.toObject();
            return {longitude:t.address.geometry.location.lng,latitude:t.address.geometry.location.lat}
        });
       let orderArry= geolib.orderByDistance(driverLocation,latlanArry);
       for(let i=0;i<orderArry.length;i++){
           finalArry.push(taskArry[Number(orderArry[i].key)]);
       }
       result.sendSuccess(cb,{'taskList':finalArry});

    }else{
        result.sendSuccess(cb,{'taskList':finalArry});
    }
}
function fetchTasks(driverId) {
    //returning fetched tasks of that day for particular driver.
    var day=new Date();
    const startDate =day.setHours(0,0,0,0);
    const dateMidnight = day.setHours(23,59,59,999);
    let date = {
        $gt: new Date(startDate),
        $lt: new Date(dateMidnight)
    };
    return taskModel.find({driver:mongoose.Types.ObjectId(driverId),date:date})
}

function fetchDriverId(driverSub) {
    return userModel.findOne({cognitoSub:driverSub});
}

//,taskStatus:{$in:[2,4,6,10]}