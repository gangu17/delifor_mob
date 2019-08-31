const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tables = require('./constant')().TABLES;

const taskSchema = new Schema({});

const userSchema = new Schema({});
const earningsSchema = new Schema({});

const userModel = mongoose.model(tables.USER, userSchema);
const taskModel = mongoose.model(tables.TASK, taskSchema);
const earningsModel = mongoose.model(tables.PRICINGEARNINGLOG, earningsSchema);


module.exports = {task: taskModel, user: userModel, earnings: earningsModel};

