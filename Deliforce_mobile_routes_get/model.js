const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tables = require('./constant')().TABLES;

const taskSchema = new Schema({

});

const taskModel = mongoose.model(tables.TASK, taskSchema);

const userSchema = new Schema({

});

const userModel = mongoose.model('users', userSchema);

module.exports = {task: taskModel , user:userModel};
