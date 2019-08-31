var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var constant = require('./constant')();


var notesSchema = new Schema({
});

module.exports = mongoose.model('note', notesSchema);
