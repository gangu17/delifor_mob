let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//action=[{code:1,exist:0/1,mandatory:0/1}]
//autoAllocation:{enable:true/false,method:1/2/3,expire:anyNumber,retry:anyNumber}
const notificationSchema= new Schema({
    driver: {type: mongoose.Schema.Types.ObjectId},
    name: {type: String, required: true},//customer name
    phone: {type: String, required: true,},//validation with countrycode
    email: {type: String, },
    address: {type: Schema.Types.Mixed, required: true},
    date: {type: Date, required: true}, //pickup before data (or) delivery before
    description: {type: String},
    driver: {type: Schema.Types.ObjectId, ref: 'user'},
    team: {type: Schema.Types.ObjectId, ref: 'team'},
    transportType: {type: Number},
    orderId: {type: String},
    images: Schema.Types.Mixed,
    priority: {type: Number, default: 0},//drag and drop functionality
    completedDate: {type: Date},
    endDate: {type: Date, required: true},
    //from logic
    taskId: {type: String, required: true},
    userRole: {type: Number, required: true},
    user: {type: String, required: true},
    taskStatus: {type: Number, required: true}, //Task Status
    clientId: {type: String, required: true},
    isDeleted: {type: Number},
    created_at: {type: Date, default: Date.now},
    businessType: {type: Number, required: true},
    settings: {type: Schema.Types.Mixed, required: true},
    delay: {type: Number, required: true}

})

let userSchema= new Schema({});


let notification = mongoose.model('notifications', notificationSchema);
let user =mongoose.model('users',userSchema);

module.exports= {'USER':user,'NOTIFICATION':notification};
