const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const constant = require('./constant')();
const isIt = constant.isIt;
const driverStatus = constant.DRIVER_STATUS;
const tables = constant.TABLES;
const role = constant.ROLE;


const driverSchema = new Schema({
    name: {type: String, required: true},
    lastName: {type: String},
    email: {type: String},//cognito validation
    phone: {type: String, required: true},//cognito validation(+91 32323)
    password: {type: String, required: true},
    assignTeam: {type: Schema.Types.ObjectId, ref: tables.TEAM, required: true},
    notes: String,
    image: {type: String},
    transportType: {type: Number},
    transportDesc: {type: String},
    licencePlate: {type: String},
    deviceToken: {type: String},
    endpointArn : {type: String},
    kolor: {type: String},
    location: {
        type: { type: String },
        coordinates: []
    },
    role: {type: Number, required: true ,default :role.DRIVER},
    clientId: {type: String, required: true},
    currentLocation: Schema.Types.Mixed,
    driverStatus: {type: Number, default: driverStatus.IDLE},
    isDeleted: {type: Number, default: isIt.NO},
    cognitoSub: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
    teams:Schema.Types.Mixed,
    currentAddress:{type:String},
    batteryState:{type:Number},
    deviceName:{type:String},
    appVersion:{type:String}
},{ strite:false });

driverSchema.index({location: '2dsphere'});

const userSettingsSchema = ({

});

 var driverModel = mongoose.model(tables.DRIVER, driverSchema);
 var userSettingsModel = mongoose.model('userSettings', userSettingsSchema);

module.exports = {driver:driverModel,userSettings:userSettingsModel}












