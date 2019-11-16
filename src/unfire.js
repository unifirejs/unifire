export class Unifire {
  constructor ({ state = {}, watch = {}, actions = {} }) {
    this._WATCHERS = watch;
    this._ACTIONS = actions;
    this._SUBSCRIBERS = [];
    this.state = new Proxy({}, this._getHandler());
    Object.assign(this.state, state);
  }

  subscribe (cb) {
    this._SUBSCRIBERS.push(cb);
    return () => this._SUBSCRIBERS = this._SUBSCRIBERS.filter(sub => sub !== cb);
  }

  dispatch = (actionName, payload) => {
    const action = this._ACTIONS[actionName];
    if (!action) return;
    const context = {
      set: this._set,
      state: this.state,
      dispatch: this.dispatch
    };
    action(context, payload);
  }

  _set = (delta, cb) => {
    const before = Object.assign({}, this.state);
    Object.assign(this.state, delta);

    const changedKeys = [];
    for (const key in before) {
      if(before[key] !== this.state[key]){
        changedKeys.push(key);
      }
    }
    this._SUBSCRIBERS.forEach(sub => sub(changedKeys, before, this.state));

    if(cb) cb();
  }

  _compute (state, prop) {
    const output = state[prop];
    return typeof output === 'function'
      ? output(state)
      : output;
  }

  _watch ({ state, prop, next, prev }) {
    const watcher = this._WATCHERS[prop];
    if (watcher) watcher({ prev, next, state });
  }

  _getHandler () {
    const self = this;
    return {
      get (state, prop) {
        return self._compute(state, prop);
      },
      set (state, prop, next) {
        const prev = state[prop];
        state[prop] = next;
        self._watch({ state, prop, next, prev });
        return true;
      }
    }
  }
};


const store = new Unifire({
  state: {
    loggedIn: false,
    showHeader: (state) => !!state.loggedIn
  },

  watch: {
    loggedIn: ({ next }) => console.log('Logged in:', next)
  },

  actions: {
    login: ({ set }) => set({ loggedIn: true })
  }
});




const store = new store({
  state: {
    loggedIn: false,
    entries: JSON.parse(localStorage.getItem('entries')) || [],
    filterText: '',
    viewEntries: (state) => state.entries.filter(entry => entry.includes(state.filterText))
  },

  watch: {
    entries: ({ next }) => localStorage.setItem('entries', JSON.stringify(next))
  },

  actions: {
    login ({ set }, { user }) {
      User.login(user)
        .then(() => set({ loggedIn: true }))
        .catch((e) => console.log('Login failure', e));
    },
    getEntries ({ set }) {
      Entry.getAll()
        .then(() => set({ entries }))
        .catch((e) => console.log('Get entries failure', e));
    }
  }
});
