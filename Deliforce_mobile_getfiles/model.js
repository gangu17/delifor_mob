var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var constant = require('./constant')();
var isIt = constant.isIt;


const taskSchema = new Schema({
   '_id':mongoose.Schema.Types.ObjectId,
    driverImages:[],
    driverSignature:[]
});
module.exports = mongoose.model('tasks', taskSchema);
