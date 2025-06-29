const express = require('express');
const {
  createDecorator,
  createHandler,
} = require('../index'); // or 'node-decorator-lite' after publishing

const app = express();

// Define decorators
const Log = () => createDecorator('log', true);
const Roles = (...roles) => createDecorator('roles', roles);

// Handler logic
const handler = createHandler({
  log: (_val, req) => {
    console.log(`[LOG] ${req.method} ${req.url}`);
  },
  roles: (allowed, req, res) => {
    const role = req.headers['x-role'];
    if (!allowed.includes(role)) {
      res.status(403).send('Forbidden');
      return false;
    }
  },
});

// Controller
class UserController {
  constructor() {
    Log()(this, 'getUser');
    Roles('admin', 'manager')(this, 'getUser');
  }

  getUser(req, res) {
    res.send(`Hello, ${req.headers['x-role']}`);
  }
}

const userController = new UserController();

app.get('/user', handler(userController, 'getUser'));

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
