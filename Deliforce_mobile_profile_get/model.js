const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const constant = require('./constant')();
const isIt = constant.isIt;
const tables = constant.TABLES;


const driverSchema = new Schema({
});

const taskSchema = new Schema({
});

const statusListSchema = new Schema({

});

const settingSchema = new Schema({
    
});

const siteSettingsSchema = new Schema({
    androidVer: {type: String},
    androidVerUpdate: {type: Boolean},
    iOSVer: {type: String},
    iOSVerUpdate: {type: Boolean}
});

const driverModel = mongoose.model(tables.USER, driverSchema);
const taskModel = mongoose.model(tables.TASK, taskSchema);
const siteSettingsModel = mongoose.model(tables.SITESETTING, siteSettingsSchema);
const statusListModel = mongoose.model(tables.STATUSLIST, statusListSchema);
const settingModel = mongoose.model(tables.SETTING, settingSchema);


module.exports = {task: taskModel,driver:driverModel, siteSettings: siteSettingsModel, statusList: statusListModel, settings: settingModel};















