const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constant = require('./constant')();
const tables = constant.TABLES;
const isIt = constant.isIt;
const role = constant.ROLE;
const driverS = constant.DRIVER_STATUS;

const userSchema = new Schema({
    name: {type: String, required: true},
    lastName: {type: String},
    email: {type: String, required: true},//cognito validation
    phone: {type: String, required: true},//cognito validation(+91 32323)
    password: {type: String, required: true},//cognito min 8 char ,alpha(upper,lower) numeric, special characterassignTeam: {type :Schema.Types.ObjectId , ref:'team' , required:true},
    assignTeam: {type: Schema.Types.ObjectId, ref: 'team', required: true},
    location: {
        type: { type: String },
        coordinates: []
    },
    notes: {type: String},
    image: {type: String},
    transportType: {type: Number},
    transportDesc: {type: String},
    licencePlate: {type: String},
    kolor: {type: String},
    currentLocation: Schema.Types.Mixed,
    //from logic
    userRole: {type: Number, required: true},
    user: {type: String, required: true},
    role: {type: Number, required: true, default: 3},//Role constant -3
    clientId: {type: String, required: true}, //cognito sub of admin
    driverStatus: {type: Number, default: driverS.FIRST_LOGIN}, // DRIVERSTATUS
    isDeleted: {type: Number, default: isIt.NO},
    cognitoSub: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
    currentAddress:{type:String},
    batteryState:{type:Number},
    deviceName:{type:String},
    appVersion:{type:String}
});

const driverLocationLogSchema = new Schema({
    driverLiveLog: Schema.Types.Mixed,
    clientId: {type: String},
    driverId: {type: String},
    taskId: {type: Schema.Types.ObjectId},
    date: {type: Date},
    dateStamp: {type: String}
});

const taskSchema = new Schema({

});

const userModel=mongoose.model('users',userSchema);
const driverLocationLogModel = mongoose.model('driverlocationlogs', driverLocationLogSchema);
const taskModel = mongoose.model('tasks', taskSchema);

module.exports = {user:userModel, driverLocationLog: driverLocationLogModel, tasks: taskModel};
