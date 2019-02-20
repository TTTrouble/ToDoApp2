const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {user} = require('./../server/models/user');

// Todo.deleteMany({}).then(result => {
//     console.log(result);
// })

//Todo.findOneAndRemove()
//Todo.findByIdAndRemove()

Todo.findByIdAndDelete('5c6ddcf27938fe31dd27d0b4').then(todo => {
    console.log(todo);
})