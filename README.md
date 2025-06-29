# node-decorator-lite

> Lightweight decorator-like framework for Express in plain JavaScript using metadata and middleware. Add `@Log`, `@Roles`, or any custom decorators without TypeScript or transpilers.

---

## 🚀 Features

- Zero-dependency
- Supports metadata-based decorators like:
  - `@Log()`
  - `@Roles('admin')`
  - `@Throttle(10)`
- Works in plain JavaScript (no TypeScript)
- Plug-and-play with Express route handlers
- Easily extensible for any use case

---

## 📦 Installation

```bash
npm install node-decorator-lite


🔧 Basic Usage
const express = require('express');
const {
  createDecorator,
  createHandler,
} = require('node-decorator-lite');

const app = express();

// Define decorators
const Log = () => createDecorator('log', true);
const Roles = (...roles) => createDecorator('roles', roles);

// Setup middleware logic
const handler = createHandler({
  log: (_value, req) => {
    console.log(`[LOG] ${req.method} ${req.url}`);
  },
  roles: (allowed, req, res) => {
    const userRole = req.headers['x-role'];
    if (!allowed.includes(userRole)) {
      res.status(403).send('Forbidden');
      return false; // stop execution
    }
  },
});

// Example controller
class UserController {
  constructor() {
    Log()(this, 'getUser');
    Roles('admin', 'manager')(this, 'getUser');
  }

  getUser(req, res) {
    res.send(`Hello, ${req.headers['x-role']}`);
  }
}

const userCtrl = new UserController();
app.get('/user', handler(userCtrl, 'getUser'));

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

📁 Full Example
A complete working app is available in the example/ folder.

Run it locally with:
node example/app.js

Test using:
curl -H "x-role: admin" http://localhost:3000/user
curl -H "x-role: guest" http://localhost:3000/user


