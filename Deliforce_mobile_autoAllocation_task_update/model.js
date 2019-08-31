const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constant = require('./constant')();
const tables = constant.TABLES;
const isIt = constant.isIt;

const taskSchema = new Schema({
        driver: {type: Schema.Types.ObjectId, ref: 'user'},
        taskStatus: {type: Number, required: true},
        taskColor: {type: String}
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
    created_at: {type: Date, default: Date.now}
});

const userSchema = new Schema({});

const userModel = mongoose.model(tables.USER, userSchema);
const taskModel = mongoose.model(tables.TASK, taskSchema);
const taskLogModel = mongoose.model('tasklogs', taskLogSchema);


module.exports = {task: taskModel,user:userModel,taskLog: taskLogModel};
