export class Unifire {
  constructor ({ state = {}, watch = {}, actions = {} }) {
    this._WATCHERS = watch;
    this._ACTIONS = actions;
    this._SUBSCRIBERS = [];
    this.state = new Proxy({}, this._getHandler());
    state = this._getReturnValue(state);
    Object.assign(this.state, state);
  }

  subscribe (cb) {
    this._SUBSCRIBERS.push(cb);
    return () => this._SUBSCRIBERS = this._SUBSCRIBERS.filter(sub => sub !== cb);
  }

  fire = (actionName, payload) => {
    const action = this._ACTIONS[actionName];
    if (!action) return;
    const context = {
      set: this._set,
      state: this.state,
      fire: this.fire
    };
    action(context, payload);
  }

  _set = (delta, cb) => {
    const before = Object.assign({}, this.state);
    Object.assign(this.state, delta);
    const changedKeys = [];
    const changedKeys = Object.keys(before).filter(key => before[key] !== this.state[key]);
    this._SUBSCRIBERS.forEach(sub => sub(changedKeys, before, this.state));
    if(cb) cb();
  }

  _compute (state, prop) {
    return this._getReturnValue(state[prop], state);
  }

  _watch ({ state, prop, next, prev }) {
    const watcher = this._WATCHERS[prop];
    if (watcher) watcher({ prev, next, state });
  }

  _getReturnValue (val, arg) {
    return typeof val === 'function'
      ? val.call(null, arg)
      : val;
  }

  _getHandler = () => {
    return {
      get (state, prop) {
        return self._compute(state, prop);
      },
      set (state, prop, next) {
        const prev = state[prop];
        state[prop] = next;
        this._watch({ state, prop, next, prev });
        return true;
      }
    }
  }
};
