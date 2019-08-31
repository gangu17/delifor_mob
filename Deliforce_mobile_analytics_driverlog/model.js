const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constant = require('./constant')();
const tables = constant.TABLES;

//action=[{code:1,exist:0/1,mandatory:0/1}]
//autoAllocation:{enable:true/false,method:1/2/3,expire:anyNumber,retry:anyNumber}

var driverLogSchema = new Schema({

    driverId: {type: Schema.Types.ObjectId, ref: tables.DRIVER},
    date: {type: Date},
    idleTime: Number,//idel Time
    activeTime: Number,//active Time
    idleDist: Number,//idle distance
    activeDist: Number //active distance
});

let userSchema = new Schema({

})

const userModel = mongoose.model(tables.USER, userSchema);
const driverLogModel = mongoose.model(tables.DRIVERLOG, driverLogSchema);

module.exports = {driverLog: driverLogModel, user: userModel};
