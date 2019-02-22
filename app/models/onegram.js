var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var OnegramSchema   = new Schema({
    name: String
},
    {
    collection: 'tweets'
    
});

module.exports = mongoose.model('Onegram', OnegramSchema);
