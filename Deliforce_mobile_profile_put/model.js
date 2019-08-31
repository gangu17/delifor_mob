const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constant = require('./constant')();
const tables = constant.TABLES;

const driverSchema = new Schema({
    name: {type: String, required: true},
    lastName: {type: String},
    //email: {type: String, required: true},
    phone: {type: String, required: true},
    email: {type: String},
    image: {type: String}
//  cognitoSub: {type: String, required: true},
});


module.exports = mongoose.model(tables.DRIVER, driverSchema);













