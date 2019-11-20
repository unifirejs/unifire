const compute = (state, prop) => {
  const val = state[prop];
  return isFunc(val)
    ? val(state)
    : val;
}

const runWatch = (watch, key, next, prev, state) => {
  const watcher = watch[key];
  if (watcher) watcher({ next, prev, state });
}

const isFunc = (val) => typeof val === 'function';

const merge = (a, b) => Object.assign(a, b);

const deref = (obj) => merge({}, obj);

const diff = (a, b) => Object.keys(a).filter(key => a[key] !== b[key]);

// const getDeps = (getter) => {
//   const deps = new Set();
//   const proxy = new Proxy({}, {
//     get: (_, key) => deps.add(key)
//   });
//   getter(proxy);
//   return Array.from(deps);
// };

/* export default */ function Unifire (modules) {
  const watch = {};
  const actions = {};
  const subs = [];
  this.state = new Proxy({}, {
    get: (state, prop) => compute(state, prop),
    set (state, prop, next) {
      if (!isFunc(state[prop])) state[prop] = next;
      return true;
    }
  });

  // Add lazily-loaded store modules at run-time
  this.register = (modules) => {
    modules = Array.isArray(modules)
      ? modules
      : [ modules ];

    modules.forEach(mod => {
      merge(this.state, mod.state || {});
      merge(watch, mod.watch || {});
      merge(actions, mod.actions || {});
    });
  }

  this.register(modules);

  this.subscribe = (cb) => {
    subs.push(cb);
    return () => subs = subs.filter(sub => sub !== cb);
  }

  this.fire = (name, payload) => {
    const action = actions[name];
    if (!action) return;
    const context = {
      set,
      fire: this.fire,
      state: this.state
    };
    action(context, payload);
  }

  const set = (delta, cb) => {
    // Freeze state before mutations
    const before = deref(this.state);
    // Merge delta
    merge(this.state, delta);
    // Freeze state after delta and computers
    const after = deref(this.state);
    // Given `before` and `after`, find changed keys and run watchers on them
    // Watchers can mutate the `after` object
    let changedKeys = diff(before, after);
    changedKeys.forEach(key => runWatch(watch, key, after[key], before[key], after));
    // Get final list of changed keys
    changedKeys = diff(before, after);
    // Call all subscribers and execute cb
    subs.forEach(sub => sub(changedKeys, before, after));
    if(cb) cb();
  }
}
