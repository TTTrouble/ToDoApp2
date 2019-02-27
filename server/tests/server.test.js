const expect = require('expect');
const request = require('supertest');
const ObjectID = require('mongodb').ObjectID;

const app = require('./../serverNew').app;
const Todo = require('./../models/Todo').Todo;
const { User } = require('./../models/User');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
   it('should create a new todo', (done) => {
      var text = 'Test todo text';

      request(app)
         .post('/todos')
         .send({ text })
         .expect(200)
         .expect((res) => {
            expect(res.body.text).toBe(text);
         })
         .end((err, res) => {
            if (err) {
               return done(err);
            }

            Todo.find({ text }).then((todos) => {
               expect(todos.length).toBe(1);
               expect(todos[0].text).toBe(text);
               done();
            }).catch((e) => done(e));
         });
   });

   it('should not create todo with invalid body data', (done) => {
      request(app)
         .post('/todos')
         .send({})
         .expect(400)
         .end((err, res) => {
            if (err) {
               return done(err);
            }

            Todo.find().then((todos) => {
               expect(todos.length).toBe(2);
               done();
            }).catch((e) => done(e));
         });
   });
});

describe('GET /todos', () => {
   it('should get all todos', (done) => {
      request(app)
         .get('/todos')
         .expect(200)
         .expect((res) => {
            expect(res.body.todos.length).toBe(2);
         })
         .end(done);
   });
});


describe('GET /todos/:id', () => {
   it('should return todo doc', (done) => {
      request(app)
         .get(`/todos/${todos[0]._id.toHexString()}`)
         .expect(200)
         .expect((res) => {
            expect(res.body.todo3.text).toBe(todos[0].text);
         })
         .end(done);
   });

   it('should return 404 if todo not found', (done) => {
      var unfound = new ObjectID();

      request(app)
         .get(`/todos/${unfound.toHexString()}`)
         .expect(404)
         .end(done);
   });

   it('should return 404 for non-object ids', (done) => {

      request(app)
         .get(`/todos/123`)
         .expect(404)
         .end(done);
   });
});

describe('DELETE /todos/:id', () => {
   it('should remove a todo', (done) => {
      var hexID = todos[0]._id.toHexString();

      request(app)
         .delete(`/todos/${hexID}`)
         .expect(200)
         .expect((res) => {
            expect(res.body._id).toBe(hexID);
         })
         .end((err, res) => {
            if (err) {
               return done(err);
            }
            Todo.findById(hexID).then((todo) => {
               expect(todo).toNotExist();
               done();
            }).catch(e => done(e));
         });
   });

   it('should return 404 if todo not found', (done) => {
      var unfound = new ObjectID();

      request(app)
         .delete(`/todos/${unfound.toHexString()}`)
         .expect(404)
         .end(done);
   });


   it('should return 404 if object id is invalid', (done) => {
      request(app)
         .delete(`/todos/123`)
         .expect(404)
         .end(done);
   });
});

describe('PATCH /todos/:id', () => {
   it('should update the todo', (done) => {
      // grab id of the first item
      var text = 'This should be the new text';

      request(app)
         .patch(`/todos/${todos[0]._id.toHexString()}`)
         .send({ text: text, completed: true })
         .expect(200)
         .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
         })
         .end(done);
   });
   //make patch request with id inside, use send to send some data and request body
   // update text, set completed true
   // 200
   // text is changed, completed is true, completedAT is a number .toBeA

   it('should clear completedAt when todo is not completed', (done) => {
      var text = 'This is the second new text?';

      request(app)
         .patch(`/todos/${todos[1]._id.toHexString()}`)
         .send({ text: text, completed: false })
         .expect(200)
         .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
         })
         .end(done);
      // grab id of the second item
      // update text, set completed to false
      // 200
      // text is changed(response body), completed is false, completedAt is null .toNotExist

   });
});

describe('GET /users/me', () => {
   it('should return user if authenticated', (done) => {
      request(app) //using supertest
         .get('/users/me')
         .set('x-auth', users[0].tokens[0].token)
         .expect(200)
         .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toString());
            expect(res.body.email).toBe(users[0].email);
         })
         .end(done); //think this combines .end from supertest and done from mocha
   });
   it('should return 401 if not authenticated', (done) => {
      request(app) //using supertest
         .get('/users/me')
         .expect(401)
         .expect((res) => {
            expect(res.body).toEqual({});
         })
         .end(done);
   });
});

describe('POST /register', () => {
   it('should create a user', (done) => {
      var email = 'example@example.com';
      var password = '123mbc';

      request(app)
         .post('/register')
         .send({ email, password })
         .expect(200)
         .expect((res) => {
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
         })
         .end(err => {
            if (err) {
               return done(err);
            }

            User.findOne({ email }).then((user) => {
               expect(user).toExist();
               expect(user.password).toNotBe(password);
               done();
            });
         });
   });

   it('should return validation errors if request invalid', (done) => {
      var email = 'dsamds';
      var password = 'dsad';
      request(app)
         .post('/register')
         .send({ email, password })
         .expect(400)
         .end(done);

   });

   it('should not create user if email in use', (done) => {
      var password = 'dsdsadasdsd';

      request(app)
         .post('/register')
         .send({ email: users[0].email, password })
         .expect(400)
         .end(done);
   });
});

describe('POST /users/login', () => {
   it('should login user and return auth token', (done) => {
      request(app)
         .post('/users/login')
         .send({
            email: users[1].email,
            password: users[1].password
         })
         .expect(200)
         .expect((res) => {
            expect(res.headers['x-auth']).toExist();
         })
         .end((err, res) => {
            if (err) {
               return done(err);
            }

            User.findById(users[1]._id).then((user) => {
               expect(user.tokens[0]).toInclude({
                  //tokens object has ATLEAST these properties
                  access: 'auth',
                  token: res.headers['x-auth']
               });
               done();
            }).catch(e => done(e));
         });
   });

   it('should reject invalid login', (done) => {
      request(app)
         .post('/users/login')
         .send({
            email: 'dsdas@gmail.com',
            password: 'asdasdasdsa'
         })
         .expect(400)
         .expect((res) => {
            expect(res.headers['x-auth']).toNotExist();
         })
         .end((err, res) => {
            if (err) {
               return done(err);
            }
            User.findById(users[1]._id).then((user) => {
               expect(user.tokens.length).toBe(0);
               done();
            }).catch(e => done(e));
         });
   });
});