var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var driverSettingSchema = new Schema({
    settings:{
        transportType: {type: Number},
        ringtone:{type:Number,default:1},
        vibration:{type:Number,default:1}, // types of vibration 1 for long 2 for system
        repeat:{type:Boolean,default:false},
        language:{type:Number,default:1},
        navigation:{type:Number,default:1},
        mapStyle:{type:Number,default:1},
        showTraffic:{type:Boolean,default:false},
        powerSavingModel:{type:Boolean,default:false},
        navigationHelper:{type:Boolean,default:false},
    }
});

module.exports = mongoose.model('users', driverSettingSchema);
