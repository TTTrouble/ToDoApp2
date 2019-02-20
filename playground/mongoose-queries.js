
const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {user} = require('./../server/models/user');



// var id = '5c6d78ccbf740b12328739db';
// if(!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }


// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todos) => {
//     console.log('Todo', todos);
// });

// Todo.findById(id).then((todos) => {
//     console.log('Todo By ID', todos);
// }).catch((e) => console.log('Error with ID', e));

// user.findById('5c6b52409ceee81eb55b70a9').then((user) => {
//     if(!user) {
//         console.log('Unable to find user');
//     }

//     console.log(JSON.stringify(user, undefined, 2));
// }).catch(e => console.log(e));