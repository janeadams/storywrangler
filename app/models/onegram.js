var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var OnegramSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Onegram', OnegramSchema);
