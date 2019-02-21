var mongoose = require('mongoose');
var dburi = process.env.MONGODB_URI || "mongodb+srv://vmanne:caller@testdb-kj85h.mongodb.net/test?retryWrites=true";

mongoose.Promise = global.Promise;
mongoose.connect(dburi, { useNewUrlParser: true });

module.exports = {mongoose};