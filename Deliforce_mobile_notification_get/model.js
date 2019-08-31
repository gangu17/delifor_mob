let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//action=[{code:1,exist:0/1,mandatory:0/1}]
//autoAllocation:{enable:true/false,method:1/2/3,expire:anyNumber,retry:anyNumber}

let notificationSchema = new Schema({});
let userSchema= new Schema({});


let notification = mongoose.model('notifications', notificationSchema);
let user =mongoose.model('users',userSchema);

module.exports= {'USER':user,'NOTIFICATION':notification};
