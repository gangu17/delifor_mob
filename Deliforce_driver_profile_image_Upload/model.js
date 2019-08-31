const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const userSchema = new Schema({
    image:String
});
const userModel = mongoose.model('users', userSchema);


module.exports = {user: userModel};
