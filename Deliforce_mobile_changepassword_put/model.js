const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constant = require('./constant')();
const tables = constant.TABLES;
const isIt = constant.isIt;




const userSchema = new Schema({
    password: {type: String}
});


const userModel = mongoose.model(tables.USER, userSchema);


module.exports = {userModel: userModel};
