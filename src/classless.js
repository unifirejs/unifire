const compute = (state, prop) => {
  return isFunc(state[prop])
    ? val(state)
    : val;
}

const runWatch = (watch, key, next, prev, state) => {
  const watcher = watch[key];
  if (watcher) watcher({ next, prev, state });
}

const isFunc = (val) => typeof val === 'function';

const deref = (obj) => Object.assign({}, obj);

const handler = {
  get: (state, prop) => compute(state, prop),
  set (state, prop, next) {
    if (isFunc(state[prop])) return;
    state[prop] = next;
    return true;
  }
};

export default function Unifire ({ state = {}, watch = {}, actions = {} }) {
  const subs = [];
  this.state = new Proxy({}, handler);
  Object.assign(this.state, state);

  this.subscribe = (cb) => {
    subs.push(cb);
    return () => subs = subs.filter(sub => sub !== cb);
  }

  this.fire = (name, payload) => {
    const action = actions[name];
    if (!action) return;
    const context = {
      set: this.set,
      state: this.state,
      fire: this.fire
    };
    action(context, payload);
  }

  this.set = (delta, cb) => {
    // Freeze state before mutations
    const before = deref(this.state);
    // Merge delta
    Object.assign(this.state, delta);
    // Freeze state after delta and computers
    let after = deref(this.state);
    // Given `before` and `after`, find changed keys and run watchers on them
    const changedKeys = Object.keys(before).filter(key => before[key] !== after[key]);
    changedKeys.forEach(key => runWatch(watch, key, after[key], before[key], after));
    // Recompute/freeze state after running watchers because watchers can also change state
    after = deref(this.state);
    // Call all subscribers and execute cb
    subs.forEach(sub => sub(changedKeys, before, after));
    if(cb) cb();
  }
}
