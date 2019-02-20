var mongoose = require('mongoose');
var dburi = "mongodb+srv://vmanne:caller@testdb-kj85h.mongodb.net/test?retryWrites=true";

mongoose.Promise = global.Promise;
mongoose.connect(dburi, { useNewUrlParser: true });

module.exports = {mongoose};