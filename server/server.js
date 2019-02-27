require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');
const jwt = require('jsonwebtoken');


const mongoose = require('./db/mongoose').mongoose;
const User = require('./models/User').User;
const Todo = require('./models/Todo').Todo;
const authenticate = require('./middleware/authenticate').authenticate;

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
   var todo = new Todo({
      text: req.body.text
   });

   todo.save().then(doc => {
      res.send(doc);
   }, e => {
      res.status(400).send(e);
   });
});

app.get('/todos', (req, res) => {
   Todo.find().then((todos) => {
      res.send({ todos });
   }, (e) => {
      res.status(400).send(e);
   });
});

app.get('/todos/:id', (req, res) => {

   var id = req.params.id;
   if (!ObjectID.isValid(id)) {
      return res.status(404).send();
   }

   Todo.findById(id).then((todo3) => {
      if (!todo3) {
         return res.status(404).send();
      }
      res.send({ todo3 });
   }).catch((e) => {
      res.status(400).send();
   });
});


app.delete('/todos/:id', (req, res) => {
   var id = req.params.id;
   if (!ObjectID.isValid(id)) {
      return res.status(404).send();
   }

   Todo.findByIdAndDelete(id).then((todo2) => {
      if (!todo2) {
         return res.status(404).send();
      }
      res.status(200).send(todo2);
   }).catch(e => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
   var id = req.params.id;

   //reason why he loaded lodash. Pick takes an object and array of properties you want to pull off to make user editable
   var body = _.pick(req.body, ['text', 'completed']);

   if (!ObjectID.isValid(id)) {
      return res.status(404).send();
   }

   if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
   }
   else {
      body.completed = false;
      body.completedAt = null;
   }

   Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
      if (!todo) {
         return res.status(404).send();
      }

      res.send({ todo });
   }).catch(e => res.status(400).send());
});

app.post('/register', (req, res) => {
   var body = _.pick(req.body, ['email', 'password']);
   var user = new User(body);

   user.save().then(() => {
      return user.generateAuthToken();
   }).then((token) => {
      res.header('x-auth', token).send(user);
   }).catch(e => {
      res.status(400).send(e);
   });
});

// PRIVATE-ize routes!
app.get('/users/me', authenticate, (req, res) => {
   //authenticate middleware assigns req.user and req.token to their instantiated values after finding the proper document by token
   //custom JSON running which limits contents to _id and email
   res.send(req.user);
});


app.listen(process.env.PORT, () => {
   console.log(`Started on port ${process.env.PORT}`);
});

module.exports = { app };