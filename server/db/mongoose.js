var mongoose = require('mongoose');
var dburi = process.env.MONGODB_URI

mongoose.Promise = global.Promise;
mongoose.connect(dburi, { useNewUrlParser: true });

module.exports = {mongoose};