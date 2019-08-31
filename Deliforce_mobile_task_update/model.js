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
    startAddress: {type: String},
    customerOne: {type: Schema.Types.Mixed},
    customerTwo: {type: Schema.Types.Mixed},
    chooseCustomer: {type: Number},
    primaryCustomerNotify: {type: Boolean},
    arrivedTime: {type: Date}
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

const rejectionSchema = new Schema({
    taskId: {type: Number, required: true},
    taskStatus: {type: Number, required: true},
    driver: {type: mongoose.Schema.Types.ObjectId},
    created_at: {type: Date, default: Date.now},
});

const taskLogSchema = new Schema({
    user: {type: String},
    role: {type: Number, required: true},
    taskStatus: {type: String, required: true},//task log status
    driverName: {type: String},
    taskId: {type: String, required: true},
    reason: {type: String},
    distanceTravelled: {type: Number},
    clientId: {type: String, required: true},
    isDeleted: {type: Number, default: isIt.NO},
    created_at: {type: Date, default: Date.now},
    fieldValue: {type: String},
    fieldName: {type: String},
    OldFieldValue: {type: String},
    selectedValues: Schema.Types.Mixed,
    dataType: {type: String}
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


var driverLogSchema = new Schema({
    clientId: {type: String},
    assignTeam: {type: String},
    driverId: {type: String},
    date: {type: Date},
    dateStamp: {type: String},
    idleTime: Number,//idel Time
    idleDist: Number,//idle distance
    activeTime: Number,//active Time
    activeDist: Number //active distance
});

const driverLocationLogSchema = new Schema({});

const userSettingsSchema = new Schema({});

var teamSchema = new Schema({});
const smsGateWaySchema = new Schema({});

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

let webhookSchema = new Schema({});

const preferencesSchema = new Schema({});

const pricingEaringSchema = new Schema({});

const pricingEaringLogSchema = new Schema({
    clientId: {type: String},
    taskId: Schema.ObjectId,
    taskDate: {type: Date},
    completedTimeString: {type: String},
    driverId: Schema.ObjectId,
    isDeleted: {type: Number},
    driverEarnings: Schema.Types.Mixed,
    taskPricing: Schema.Types.Mixed
});

let templateSchema = new Schema({});

const userModel = mongoose.model('users', userSchema);
const taskModel = mongoose.model(tables.TASK, taskSchema);
const taskLogModel = mongoose.model('tasklogs', taskLogSchema);
const settingModel = mongoose.model('settings', settingSchmea);
const rejectionModel = mongoose.model('rejectedTask', rejectionSchema);
const driverLogModel = mongoose.model('driverlogs', driverLogSchema);
const teamModel = mongoose.model('teams', teamSchema);
const webhookModel = mongoose.model('webhooks', webhookSchema);
const smsGateWayModel = mongoose.model('smsgateways', smsGateWaySchema);
const driverLocationLogModel = mongoose.model('driverlocationlogs', driverLocationLogSchema);
const preferencesModel = mongoose.model(tables.PREFERENCE, preferencesSchema);
const userSettingsModel = mongoose.model(tables.USERSETTINGS, userSettingsSchema);
const earningModel = mongoose.model('pricingearnings', pricingEaringSchema);
const earningLogModel = mongoose.model('pricingearningslogs', pricingEaringLogSchema);
const smsLogModel = mongoose.model('smsLogs', smsLogSchema);
const templateModel = mongoose.model('customtemplates', templateSchema);


module.exports = {
    task: taskModel,
    user: userModel,
    taskLog: taskLogModel,
    settings: settingModel,
    rejection: rejectionModel,
    driverLog: driverLogModel,
    teams: teamModel,
    webhook: webhookModel,
    smsGateWayModel: smsGateWayModel,
    driverLocationLogModel: driverLocationLogModel,
    smsLogModel: smsLogModel,
    preference: preferencesModel,
    userSettings: userSettingsModel,
    earning: earningModel,
    earningLog: earningLogModel,
    template: templateModel
};
