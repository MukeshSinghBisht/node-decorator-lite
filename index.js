// index.js
const metadataStore = new Map();

function defineMetadata(key, value, target, methodName) {
  const targetKey = `${target.constructor.name}.${methodName}`;
  metadataStore.set(`${key}:${targetKey}`, value);
}

function getMetadata(key, target, methodName) {
  const targetKey = `${target.constructor.name}.${methodName}`;
  return metadataStore.get(`${key}:${targetKey}`);
}

function createDecorator(key, value) {
  return function (target, methodName) {
    defineMetadata(key, value, target, methodName);
  };
}

function createHandler(rules = {}) {
  return function controllerHandler(controller, methodName) {
    return function (req, res, next) {
      const method = controller[methodName].bind(controller);

      for (const [key, handlerFn] of Object.entries(rules)) {
        const meta = getMetadata(key, controller, methodName);
        if (meta !== undefined) {
          const result = handlerFn(meta, req, res);
          if (result === false) return; // Halt if handler decides to
        }
      }

      return method(req, res, next);
    };
  };
}

module.exports = {
  defineMetadata,
  getMetadata,
  createDecorator,
  createHandler,
};
