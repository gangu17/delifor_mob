const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constant = require('./constant')();
const tables = constant.TABLES;
const isIt = constant.isIt;
const role = constant.ROLE;

console.log(constant + 'tables++++++++++++++++++++');
//pickup & delivery or same schema
const taskSchema = new Schema({
  _id: {type: Schema.Types.ObjectId},
  driverImages: [],
    driverSignature:String
});

const taskLogSchema = new Schema({
    user: {type: String},
    role: {type: Number, required: true},
    taskStatus: {type: String, required: true},//task log status
    driverName: {type: String},
    taskId: {type: String, required: true},
    imageArry:[],
    /*isCreate: {type: Number, default: isIt.NO},*/
    //from logic
    clientId: {type: String, required: true},
    isDeleted: {type: Number, default: isIt.NO},
    created_at: {type: Date, default: Date.now}
});

const userSchema = new Schema({});
const userModel = mongoose.model(tables.USER, userSchema);
const taskModel = mongoose.model(tables.TASK, taskSchema)
const tasklogModel= mongoose.model('tasklogs',taskLogSchema);

module.exports = {task: taskModel, user: userModel,tasklog:tasklogModel};
