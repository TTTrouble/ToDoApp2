var express = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { User } = require('./models/users');
var { Todo } = require('./models/todo');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    console.log(req.body);

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
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});


app.listen(process.env.PORT, () => {
    console.log(`Started on port ${process.env.PORT}`);
});

module.exports = {app};