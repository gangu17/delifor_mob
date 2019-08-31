const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constant = require('./constant')();
const tables = constant.TABLES;
const isIt = constant.isIt;
const validator = require('./validator');
const role = constant.ROLE;
const securePin = require("secure-pin");
const roleEnum = [role.ADMIN, role.DRIVER, role.MANAGER];


//pickup & delivery or same schema
const taskPickupSchema = new Schema({
    name: {type: String},//customer name
    phone: {type: String, required: true, validate: validator.phoneValidateEmpty},//validation with countrycode
    email: {type: String, validate: validator.emailValidator},
    address: {type: Schema.Types.Mixed, required: true},
    date: {type: Date, required: true}, //pickup before data (or) delivery before
    description: {type: String},
    driver: {type: Schema.Types.ObjectId, ref: 'user'},
    team: {type: Schema.Types.ObjectId, ref: 'team'},
    isPickup: {type: Boolean, default: true},
    orderId: {type: String},
    images: Schema.Types.Mixed,
    priority: {type: Number, default: 0},//drag and drop functionality
    completedDate: {type: Date},
    color: {type: String},
    taskColor: {type: String},
    driverImages: {type: Schema.Types.Mixed},
    driverSignature: String,
    templates: {type: Schema.Types.Mixed},
    dateRange: {type: Schema.Types.Mixed},
    dateRangeView: {type: Schema.Types.Mixed},
    isRecur:{type: Boolean, default:false},
    recurringObj: {type: Schema.Types.Mixed},
    isMobileListing:{type: Boolean ,default:true},
    recurTaskStatus: {type: Number}, //Task Status
    //from logic
    templateName: {type: String},
    taskId: {type: String, required: true},
    userRole: {type: Number, required: true},
    user: {type: String, required: true},
    taskStatus: {type: Number, required: true}, //Task Status
    clientId: {type: String, required: true},
    isDeleted: {type: Number, default: isIt.NO},
    created_at: {type: Date, default: Date.now},
    businessType: {type: Number, required: true},
    settings: {type: Schema.Types.Mixed, required: true},
    delay: {type: Number, default: isIt.NO, required: true},
    timezone: String,
    driverImages: {type: Schema.Types.Mixed, default: []},
    driverSignature: {type: String, default: ''},
    startLocation: {
        type: {type: String},
        coordinates: []
    },
    pinCode: {type: Number}
});

/*
function generateRandam() {
  return Math.floor(Math.random() * 9000) + 1000;
}
*/


const taskAppointmentSchema = new Schema({
    name: {type: String},//customer name
    phone: {type: String, required: true, validate: validator.phoneValidateEmpty},//validation with countrycode
    email: {type: String, validate: validator.emailValidator},
    address: {type: Schema.Types.Mixed, required: true},
    date: {type: Date, required: true}, //startDate
    endDate: {type: Date, required: true},
    description: {type: String},
    driver: {type: Schema.Types.ObjectId, ref: 'user'},
    team: {type: Schema.Types.ObjectId, ref: 'team'},
    orderId: {type: String},
    images: Schema.Types.Mixed,
    priority: {type: Number, default: 0},//drag and drop functionality
    completedDate: {type: Date},
    color: {type: String},
    taskColor: {type: String},
    driverImages: {type: Schema.Types.Mixed},
    driverSignature: String,
    dateRange: {type: Schema.Types.Mixed},
    dateRangeView: {type: Schema.Types.Mixed},
    isRecur:{type: Boolean, default:false},
    recurringObj: {type: Schema.Types.Mixed},
    isMobileListing:{type: Boolean ,default:true},
    recurTaskStatus: {type: Number}, //Task Status
    //from logic
    taskId: {type: String, required: true},
    userRole: {type: Number, required: true},
    user: {type: String, required: true},
    taskStatus: {type: Number, required: true}, //Task Status
    clientId: {type: String, required: true},
    isDeleted: {type: Number, default: isIt.NO},
    created_at: {type: Date, default: Date.now},
    businessType: {type: Number, required: true},
    settings: {type: Schema.Types.Mixed, required: true},
    delay: {type: Number, default: isIt.NO, required: true},
    timezone: String,
    driverImages: {type: Schema.Types.Mixed, default: []},
    driverSignature: {type: String, default: ''},
    templateName: {type: String},
    templates: {type: Schema.Types.Mixed},
    startLocation: {
        type: {type: String},
        coordinates: []
    },
    pinCode: {type: Number}
});


const taskWorkForceSchema = new Schema({
    name: {type: String},//customer name
    phone: {type: String, required: true, validate: validator.phoneValidateEmpty},//validation with countrycode
    email: {type: String, validate: validator.emailValidator},
    address: {type: Schema.Types.Mixed, required: true},
    date: {type: Date, required: true}, //start date
    endDate: {type: Date, required: true},
    description: {type: String},
    driver: {type: Schema.Types.ObjectId, ref: 'user'},
    team: {type: Schema.Types.ObjectId, ref: 'team'},
    orderId: {type: String},
    images: Schema.Types.Mixed,
    priority: {type: Number, default: 0},//drag and drop functionality
    completedDate: {type: Date},
    color: {type: String},
    taskColor: {type: String},
    driverImages: {type: Schema.Types.Mixed},
    driverSignature: String,
    dateRange: {type: Schema.Types.Mixed},
    dateRangeView: {type: Schema.Types.Mixed},
    isRecur:{type: Boolean, default:false},
    recurringObj: {type: Schema.Types.Mixed},
    isMobileListing:{type: Boolean ,default:true},
    recurTaskStatus: {type: Number}, //Task Status
    //from logic
    taskId: {type: String, required: true},
    userRole: {type: Number, required: true},
    user: {type: String, required: true},
    taskStatus: {type: Number, required: true}, //Task Status
    clientId: {type: String, required: true},
    isDeleted: {type: Number, default: isIt.NO},
    created_at: {type: Date, default: Date.now},
    businessType: {type: Number, required: true},
    settings: {type: Schema.Types.Mixed, required: true},
    delay: {type: Number, default: isIt.NO, required: true},
    timezone: String,
    driverImages: {type: Schema.Types.Mixed, default: []},
    driverSignature: {type: String, default: ''},
    templateName: {type: String},
    templates: {type: Schema.Types.Mixed},
    startLocation: {
        type: {type: String},
        coordinates: []
    },
    pinCode: {type: Number}
});


const taskLogSchema = new Schema({
    user: {type: String},
    role: {type: Number, required: true, enum: roleEnum},
    taskStatus: {type: String, required: true},//task log status
    driverName: {type: String},
    taskId: {type: String, required: true},
    /*isCreate: {type: Number, default: isIt.NO},*/
    //from logic
    clientId: {type: String, required: true},
    isDeleted: {type: Number, default: isIt.NO},
    created_at: {type: Date, default: Date.now},
    timezone: String
});


// Setting
const settingSchema = new Schema({
    businessType: {type: Number, required: true},
    isCurrent: {type: Boolean, required: true},
    autoAllocation: Schema.Types.Mixed,
    notifications: Schema.Types.Mixed,
    actionBlock: Schema.Types.Mixed,
    acknowledgementType: Schema.Types.Mixed,
    clientId: {type: String, required: true}
});

const customerSchema = new Schema({
    name: {type: String},
    phone: {type: String, required: true, validate: validator.phoneValidateEmpty},
    email: {type: String, validate: validator.emailValidator},
    address: {type: Schema.Types.Mixed, required: true},
    color: {type: String},
    customerId: {type: String, required: true, default: securePin.generatePinSync(8)},
    //from logic
    clientId: {type: String, required: true},
    isDeleted: {type: Number, default: isIt.NO},
    created_at: {type: Date, default: Date.now}
});

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


const userSchema = new Schema({});

const smsGateWaySchema = new Schema({});

const preferenceSchema = new Schema({
    userId: String,
    customizeAgentTextAs: Schema.Types.Mixed,
    customizeManagerTextAs: Schema.Types.Mixed,
    customizeOrderTextAs: Schema.Types.Mixed,
    customizeEmailTextAs: Schema.Types.Mixed,
    dashboardLanguage: Schema.Types.Mixed,
    customerTrackingLanguage: Schema.Types.Mixed,
    distance: Schema.Types.Mixed,
    timeZone: Schema.Types.Mixed,
    cognitoSub: {type: String, required: true},
    clientId: {type: String, required: true},
});


const userPlansSchema = new Schema({
    clientId: {type: String},
    taskCount: {type: Number},
    companyName: {type: String},
    planType: {type: Number},// free-1 pack-1==2 pack-3
    agentLimit: {type: Number}, //
    taskLimit: {type: Number},
    price: {type: Number},
    // period:{type:Number},// 1-month 3-month 6-month
    startDate: {type: Date, default: Date.now()},
    endDate: {type: Date},
    credites: {type: Number, default: 0},
    // cardDetails:Schema.Types.Mixed, //cardNumber,expiry (mm/yy),cvv(3 digits),isCurrent:boolean, card holder name
    currency: {type: String},
    discount: {type: String, default: 0},
    coupenNumber: {type: String}
    // hasPaid: {type: Number, default: 1}
});

const userSettingsSchema = new Schema({});
// for random generation of number
/*
function generateRandam() {
  return Math.floor(Math.random() * 9000) + 1000;
}
*/


const customerModel = mongoose.model(tables.CUSTOMER, customerSchema);
const settingModel = mongoose.model(tables.SETTING, settingSchema);
const tasklogModel = mongoose.model(tables.TASK_LOG, taskLogSchema);
const userModel = mongoose.model(tables.USER, userSchema);
const userPlansModel = mongoose.model('userplans', userPlansSchema);
const smsGateWayModel = mongoose.model('smsgateways', smsGateWaySchema);
const preferencesModel = mongoose.model(tables.PREFERENCE, preferenceSchema);
const smsLogModel = mongoose.model('smsLogs', smsLogSchema);
const userSettingsModel = mongoose.model(tables.USERSETTINGS,userSettingsSchema);


const taskModels = {};

function getModel(businessType) {
    let taskModel;
    delete  mongoose.connection.models[tables.TASK];
    const business = constant.BUSINESS_TYPE;
    if (businessType === business.PICKUP) {
        taskModel = mongoose.model(tables.TASK, taskPickupSchema);
    } else if (businessType === business.APPOINTMENT) {
        taskModel = mongoose.model(tables.TASK, taskAppointmentSchema);
    } else if (businessType === business.FIELD) {
        taskModel = mongoose.model(tables.TASK, taskWorkForceSchema);
    } else {
        taskModel = null;
    }
    return taskModel;
}

module.exports = {
    task: {getTaskModel: getModel},
    customerModel: customerModel,
    settingModel: settingModel,
    tasklogModel: tasklogModel,
    userModel: userModel,
    userPlansModel: userPlansModel,
    smsGateWayModel: smsGateWayModel,
    preference: preferencesModel,
    smsLogModel: smsLogModel,
    userSettings: userSettingsModel
};
