var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Reading = mongoose.model('Reading', {
    oauthID: Number,
    name: String,
    displayName: String,
    readlist: [{tweet: String, article: String}]
});

module.exports = Reading;