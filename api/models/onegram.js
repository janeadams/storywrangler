var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

require('dotenv').config();

var coll = process.env.COLLECTION;

var OnegramSchema   = new Schema({
    name: String
},
    {
    collection: coll
    
});

module.exports = mongoose.model('Onegram', OnegramSchema);
