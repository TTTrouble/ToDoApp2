const mongoose = require('mongoose');
//prevent (node:5165) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead. Not sure where it is called.
mongoose.set('useCreateIndex', true);

const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var serverSecret = 'abc123';

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      // validator: (value) => {
      //   return validator.isEmail(value);
      // },
      message: 'This email is NOT valid'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

//override generateAuthToken when mongoose model converted to JSON value
UserSchema.methods.toJSON = function() {
  var user = this;
  //The user object has a lot of prototype methods that you can't see which is why you can call stuff like .save() on it. Calling toObject on it, gets rid of all those other methods leaving you with just a regular object.
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

//Creates INSTANCE methods with below syntax(not MODEL methods)
UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  // takes user _id and access and creates x-auth header
  var token = jwt.sign({ _id: user._id, access }, serverSecret).toString();

  user.tokens = user.tokens.concat([{ access, token }]);
  return user.save().then(() => {
    return token;
  });
};

//.statics created MODEL methods as opposed to INSTANCE methods
UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded; //stores decoded jwt values

  // if any errors happen in the try block it throws an error and triggers the catch block
  try {
    decoded = jwt.verify(token, serverSecret);
  }
  catch (e) {
    return Promise.reject('token could NOT be decoded...');
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.pre('save', function(next) {
  var user = this;
  //makes sure that the password has been modified before hashing it. Otherwise you risk rehashing a hashed password
  if (user.isModified('password')) {
    bcrypt.genSalt(10, function(err, salt) {
      if (!err) {
        bcrypt.hash(user.password, salt, function(err, hash) {
          if (!err) {
            user.password = hash;
            next();
          }
          else {
            console.log(err);
          }
        });
      }
      else {
        console.log(err);
      }
    });
  }
  else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = { User };
