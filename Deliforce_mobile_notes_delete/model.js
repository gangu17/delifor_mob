var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var constant = require('./constant')();
var isIt = constant.isIt;

var notesSchema = new Schema({
    notes: {type:String ,required:true},
    taskId: {type: Schema.Types.ObjectId,required:true},
    driverCognitoSub:{type:String,required:true},// for who written the notes (cognitoSub of driver)
    isDeleted:{type:Number,required:true,default: isIt.NO},
    created_at:{ type: Date, default: Date.now}
});

const taskLogSchema = new Schema({
    user: {type: String},
    role: {type: Number, required: true},
    taskStatus: {type: String, required: true ,default: 17},//task log status for notes deleted
    driverName: {type: String},
    taskId: {type: String, required: true},
    notes:{type:String,required:true},
    /*isCreate: {type: Number, default: isIt.NO},*/
    //from logic
    clientId: {type: String, required: true},
    isDeleted: {type: Number, default: isIt.NO},
    created_at: {type: Date, default: Date.now}
});

const userSchema = new Schema({})
const taskSchema = new Schema({})

const taskmodel = mongoose.model('tasks',taskSchema);
const taskLogModel = mongoose.model('tasklogs', taskLogSchema);
const notesModel = mongoose.model('notes', notesSchema);
const userModel = mongoose.model('users',userSchema);
module.exports = {tasklog: taskLogModel, notes:notesModel , user:userModel , tasks:taskmodel};


