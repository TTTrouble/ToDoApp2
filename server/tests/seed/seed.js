const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/Todo');
const {User} = require('./../../models/User');
const jwt = require('jsonwebtoken');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const serverSecret = 'abc123';

const users = [{
   //passes x-auth token
   _id: userOneID,
   email: 'vijaymanne@example.com',
   password: 'userOnePass',
   tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneID, access: 'auth'}, serverSecret).toString()
   }]
}, {
   //does not pass x-auth token
   _id: userTwoID,
   email: 'vignanmanne@example.com',
   password: 'userTwoPass'
}];

const todos = [{
   _id: new ObjectID(),
   text: 'First test todo'
}, {
   _id: new ObjectID(),
   text: 'Second test todo',
   completed: true,
   completedAt: 333
}];

const populateUsers = (done) => {
   User.remove({}).then( () => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);

      // Promise.all([userOne, userTwo]).then( () => {
      //    //do something
      // });
   }).then(() => done());
};

const populateTodos = (done) => {
   Todo.deleteMany({}).then(() => {
      return Todo.insertMany(todos);
   }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};