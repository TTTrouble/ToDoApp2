var env = process.env.NODE_ENV || 'development' ;

if( env === 'development') {
    process.env.PORT = 8080;
    process.env.MONGODB_URI = "mongodb+srv://vmanne:caller@hirvalya-imlut.mongodb.net/test?retryWrites=true";
} else if (env === 'test') {
    process.env.PORT = 8080;
    process.env.MONGODB_URI = "mongodb+srv://vmanne:caller@testdb-kj85h.mongodb.net/test?retryWrites=true";
}