var express = require('express');
var bodyParser = require('body-parser');
var ObjectID = require('mongodb').ObjectID;
var _ = require('lodash');


var mongoose = require('./db/mongoose').mongoose;
var user = require('./models/user').user;
var Todo = require('./models/todo').Todo;

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

app.get('/todos/:id', (req,res) => {

    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then((todo3) => {
        if(!todo3) {
            return res.status(404).send();
        }
        res.send({todo3});
    }).catch((e) => {
        res.status(400).send();
    });
});


app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndDelete(id).then( (todo2) => {
        if(!todo2) {
            return res.status(404).send();
        }
        res.status(200).send(todo2);
    }).catch(e => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;

    //reason why he loaded lodash. Pick takes an object and array of properties you want to pull off to make user editable
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch(e=>res.status(400).send());
});



app.listen(process.env.PORT, () => {
    console.log(`Started on port ${process.env.PORT}`);
});

module.exports = {app};