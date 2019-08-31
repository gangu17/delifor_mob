var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//action=[{code:1,exist:0/1,mandatory:0/1}]
//autoAllocation:{enable:true/false,method:1/2/3,expire:anyNumber,retry:anyNumber}

var settingSchema = new Schema({
  businessType: {type: Number},
  //category:{type:Number},
  isCurrent: {type: Boolean},
  autoAllocation: Schema.Types.Mixed,
  notifications: Schema.Types.Mixed,

  accountSettings: Schema.Types.Mixed,
  enableAutoAllocation: Schema.Types.Mixed,
  category: Schema.Types.Mixed,
  apiKey: {type: String},
  userId: {type: String},
  actionBlock: Schema.Types.Mixed,
  acknowledgementType: Schema.Types.Mixed

});

module.exports = mongoose.model('setting', settingSchema);
