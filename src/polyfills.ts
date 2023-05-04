(window as any).global = window;
(window as any).process = {
  env: { DEBUG: undefined },
  version: '',
  nextTick: require('timers').nextTick,
  setImmediate: require('timers').setImmediate
};
(window as any).Buffer = require('buffer').Buffer;
(window as any).require = require;