const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constant = require('./constant')();
const tables = constant.TABLES;

//action=[{code:1,exist:0/1,mandatory:0/1}]
//autoAllocation:{enable:true/false,method:1/2/3,expire:anyNumber,retry:anyNumber}

const userSchema= new Schema({
    cognitoSub:{type:String},
    batteryState: {type: Number}
});

var driverLogSchema = new Schema({
    clientId: {type: String}, //
    driverId: {type: String, required: true},
    dateStamp: {type:String},
    date:{type:Date},
    idleTime: Number,//idel Time
    idleDist: {type:Number},//idle distance
    activeTime: Number,//active Time
    activeDist:{type:Number}, //active distance
    timeStamp:String
});

userModel=mongoose.model('users',userSchema);

DriverLogModel = mongoose.model('driverlogs', driverLogSchema);
module.exports = {DRIVERLOG: DriverLogModel,USER: userModel}