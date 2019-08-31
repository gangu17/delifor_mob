const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constant = require('./constant')();
const tables = constant.TABLES;
const isIt = constant.isIt;


const taskSchema = new Schema({
    name: {type: String, required: true},//customer name
    phone: {type: String, required: true},//validation with countrycode
    email: {type: String},
    address: {type: Schema.Types.Mixed, required: true},
    date: {type: Date, required: true}, //start date
    endDate: {type: Date, required: true},
    description: {type: String},
    driver: {type: Schema.Types.ObjectId, ref: 'user'},
    team: {type: Schema.Types.ObjectId, ref: 'team'},
    transportType: {type: Number},
    orderId: {type: String},
    taskColor: {type: String},
    images: Schema.Types.Mixed,
    priority: {type: Number, default: 0},//drag and drop functionality
    completedDate: {type: Date},
    //from logic
    taskStatus: {type: Number, required: true}, //Task Status
    reason: {type: String},
    clientId: {type: String, required: true},
    isDeleted: {type: Number, default: isIt.NO},
    created_at: {type: Date, default: Date.now},
    businessType: {type: Number, required: true},
    settings: {type: Schema.Types.Mixed, required: true},
    delay: {type: Number, default: isIt.NO, required: true},
    actualStartedTime: {type: Date},
    actualCompletedTime: {type: Date},
    timeTakenForTaskCompletion: {type: Number},
    templates: {type: Schema.Types.Mixed},
    distance: {type: Number},
    delayInMinutes: {type: Number},
    startLocation: {
        type: {type: String},
        coordinates: []
    },
    otp: {type: Number}
});

const userSchema = new Schema({
    location: {
        type: {type: String},
        coordinates: []
    },
    driverStatus: {type: Number},
    currentAddress: {type: String},
    batteryState: {type: Number}
});

const settingSchmea = new Schema({
    businessType: {type: Number, required: true},
    isCurrent: {type: Boolean, required: true},
    autoAllocation: Schema.Types.Mixed,
    notifications: Schema.Types.Mixed,
    actionBlock: Schema.Types.Mixed,
    acknowledgementType: Schema.Types.Mixed,
    clientId: {type: String, required: true}
});

const pricingEarningLogSchema = new Schema({});

const userSettingsSchema = new Schema({});
const smsGateWaySchema = new Schema({});
const templateSchema = new Schema({});
const smsLogSchema = new Schema({
    messageSid: {type: String},
    from: {type: String},
    to: {type: String},
    content: {type: String},
    contentSegments: {type: Number},
    price: {type: mongoose.Decimal128},
    priceUnit: {type: String},
    dateSent: {type: Date},
    status: {type: String},
    clientId: {type: String},
});
const userModel = mongoose.model('users', userSchema);
const taskModel = mongoose.model(tables.TASK, taskSchema);
const settingModel = mongoose.model('settings', settingSchmea);
const userSettingsModel = mongoose.model(tables.USERSETTINGS,userSettingsSchema);
const smsGateWayModel = mongoose.model('smsgateways', smsGateWaySchema);
const templateModel = mongoose.model('templates', templateSchema);
const smsLogModel = mongoose.model('smslogs', smsLogSchema);
const pricingEarningLogModel = mongoose.model('pricingearningslogs',pricingEarningLogSchema);

module.exports = {

    task: taskModel,
    user: userModel,
    userSettings: userSettingsModel,
    template: templateModel,
    smslog: smsLogModel,
    smsGateWayModel: smsGateWayModel,
    settings: settingModel,
    pricingEarningLog: pricingEarningLogModel
}