const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constant = require('./constant')();
const tables = constant.TABLES;
const isIt = constant.isIt;
const role = constant.ROLE;

const driverLogSchema = new Schema({
    activeTime: {type: Number, required: true},
    activeDistance: {type: Number, required: true},
    idleTime: {type: Number, required: true},
    idleDistance: {type:Number, required: true},
    driverCognitoSub: {type:String,required:true},
    date: {type: Date},
    created_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model('driverlog', driverLogSchema);