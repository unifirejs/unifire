const compute = (state, prop) => {
  return getReturnValue(state[prop], state);
}

const runWatch = ({ watch, state, prop, next, prev }) => {
  const watcher = watch[prop];
  if (watcher) watcher({ prev, next, state });
}

const getReturnValue = (val, arg) => {
  return typeof val === 'function'
    ? val.call(null, arg)
    : val;
}

const getHandler = (watch) => ({
  get (state, prop) {
    return compute(state, prop);
  },
  set (state, prop, next) {
    const prev = state[prop];
    state[prop] = next;
    runWatch({ watch, state, prop, next, prev });
    return true;
  }
})

export default function Unifire ({ state = {}, watch = {}, actions = {} }) {
  const subs = [];
  state = getReturnValue(state);
  this.state = new Proxy({}, getHandler(watch));
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
    const before = Object.assign({}, this.state);
    Object.assign(this.state, delta);
    const changedKeys = Object.keys(before).filter(key => before[key] !== this.state[key]);
    subs.forEach(sub => sub(changedKeys, before, Object.assign({}, this.state)));
    if(cb) cb();
  }
}
