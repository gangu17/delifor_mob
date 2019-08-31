var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var constant = require('./constant')();
var isIt = constant.isIt;

var barocdeSchema = new Schema({
  barcode: {type:String ,required:true},
  taskId: {type: Schema.Types.ObjectId,required:true},
   driverCognitoSub:{type:String,required:true},// for who written the notes (cognitoSub of driver)
    isDeleted:{type:Number,required:true,default: isIt.NO},
    created_at:{ type: Date, default: Date.now}
});

const taskLogSchema = new Schema({
    user: {type: String},
    role: {type: Number, required: true},
    taskStatus: {type: String, required: true ,default: 15},//task log status
    driverName: {type: String},
    taskId: {type: String, required: true},
    /*isCreate: {type: Number, default: isIt.NO},*/
    //from logic
    clientId: {type: String, required: true},
     barcode:{type: String, required:true},
    isDeleted: {type: Number, default: isIt.NO},
    created_at: {type: Date, default: Date.now}
});

const userSchema = new Schema({})
const taskSchema = new Schema({})

const taskmodel = mongoose.model('tasks',taskSchema);
const taskLogModel = mongoose.model('tasklogs', taskLogSchema);
const barcodeModel = mongoose.model('barcodes', barocdeSchema);
const userModel = mongoose.model('users',userSchema);
module.exports = {tasklog: taskLogModel, barcode:barcodeModel , user:userModel , tasks:taskmodel};

