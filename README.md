# node-decorator-lite

> Lightweight decorator-like framework for Express in plain JavaScript using metadata and middleware.

## ✨ Features

- Generic metadata decorators for methods
- Run decorator logic via middleware (`controllerHandler`)
- Create your own decorators like:
  - `@Log()`
  - `@Roles('admin')`
  - `@Throttle()`
- Works without TypeScript or transpilers

---

## 📦 Installation

```bash
npm install node-decorator-lite


🔧 Usage
1. Import it
js
Copy
Edit
const {
  createDecorator,
  createHandler,
} = require('node-decorator-lite');
2. Create decorators
js
Copy
Edit
const Log = () => createDecorator('log', true);
const Roles = (...roles) => createDecorator('roles', roles);
3. Define handler logic
js
Copy
Edit
const handler = createHandler({
  log: (_val, req) => {
    console.log(`[LOG] ${req.method} ${req.path}`);
  },
  roles: (allowed, req, res) => {
    const role = req.headers['x-role'];
    if (!allowed.includes(role)) {
      res.status(403).send('Forbidden');
      return false;
    }
  },
});
4. Create controller
js
Copy
Edit
class UserController {
  constructor() {
    Log()(this, 'getUser');
    Roles('admin')(this, 'getUser');
  }

  getUser(req, res) {
    res.send('Welcome user!');
  }
}
5. Use with Express
js
Copy
Edit
const express = require('express');
const app = express();
const userCtrl = new UserController();

app.get('/user', handler(userCtrl, 'getUser'));

app.listen(3000, () => console.log('Running on http://localhost:3000'));
✅ Output
bash
Copy
Edit
curl -H "x-role: admin" http://localhost:3000/user
# -> Welcome user!

curl -H "x-role: guest" http://localhost:3000/user
# -> Forbidden
🛠️ Build Your Own Decorators
js
Copy
Edit
const Throttle = (limit) => createDecorator('throttle', limit);

// Add in handler rules
createHandler({
  throttle: (limit, req, res) => {
    // Your logic here
  }
});