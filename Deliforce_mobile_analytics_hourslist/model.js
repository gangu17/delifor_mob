const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tables = require('./constant')().TABLES;


const userSchema = new Schema({});

const taskSchema = new Schema({

});
const taskModel = mongoose.model(tables.TASK, taskSchema);
const userModel = mongoose.model(tables.USER, userSchema);


module.exports = {user:userModel,task:taskModel};
