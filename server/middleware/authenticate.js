var User = require('./../models/User').User;


//Runs on private routes, finds the JWT token that matches a particular user to be used as a header for x-auth
var authenticate = (req, res, next) => {
   var token = req.header('x-auth');

   User.findByToken(token).then((user) => {
      if (!user) {
         return Promise.reject();
      }
      req.user = user;
      res.token = token;
      next();
   }).catch(e => {
      res.status(401).send();
   });
};

module.exports = {authenticate};