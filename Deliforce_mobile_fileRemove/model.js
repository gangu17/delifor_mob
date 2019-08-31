var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var constant = require('./constant')();
var isIt = constant.isIt;

const taskSchema = new Schema({
   '_id':mongoose.Schema.Types.ObjectId,
    driverImages:[],
    driverSignature:[]
});
const taskLogSchema = new Schema({
    user: {type: String},
    role: {type: Number, required: true},
    taskStatus: {type: String, required: true},//task log status
    driverName: {type: String},
    taskId: {type: String, required: true},
    reason: {type: String},
    imageArry:[],
    /*isCreate: {type: Number, default: isIt.NO},*/
    //from logic
    clientId: {type: String, required: true},
    isDeleted: {type: Number, default: isIt.NO},
    created_at: {type: Date, default: Date.now}
});

const taskmodel = mongoose.model('tasks', taskSchema);
const taskLogModel = mongoose.model('tasklogs',taskLogSchema);

module.exports = {'taskModel':taskmodel,'tasklogModel':taskLogModel}
