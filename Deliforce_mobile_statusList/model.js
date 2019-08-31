let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let statusListSchema = new Schema({

});

module.exports = mongoose.model('statuslists', statusListSchema);
