const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tables = require('./constant')().TABLES;

//const mongoosePaginate = require('mongoose-paginate');

const taskSchema = new Schema({
    // driver: {type: Schema.Types.ObjectId, ref: tables.USER},
});
//taskSchema.plugin(mongoosePaginate);
const userSchema = new Schema({});
// const settingSchema = new Schema({});

const userModel = mongoose.model(tables.USER, userSchema);
const taskModel = mongoose.model(tables.TASK, taskSchema);
//const settingModel = mongoose.model(tables.SETTING, settingSchema);

module.exports = {task: taskModel, user: userModel};

