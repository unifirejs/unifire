export const Unifire = (config) => {
  const SUBSCRIPTIONS = {};
  const ACTIONS = {};
  const DEPS = new Set();
  const BARE_STATE = {};

  const STATE = new Proxy(BARE_STATE, {
    get (state, prop) {
      return isFunc(state[prop]) ? state[prop](STATE) : state[prop]
    },
    set (state, prop, next) {
      const current = state[prop];
      if (!isFunc(current) && current !== next) {
        const prior = deref(STATE);
        state[prop] = next;
        SUBSCRIPTIONS[prop] && SUBSCRIPTIONS[prop].forEach((sub) => sub(STATE, { prior }));
      }
      return true;
    }
  });

  const isFunc = (val) => val instanceof Function;

  const deref = (obj, target = {}) => Object.assign(target, obj);

  const getDepProxy = (obj, addToDeps) => {
    return new Proxy(obj, {
      get (_, prop) {
        if (addToDeps) DEPS.add(prop);
        return STATE[prop];
      }
    })
  }

  const subscribe = (cb, override) => {
    DEPS.clear();
    cb(getDepProxy(deref(STATE), true), {});
    // These should both use optional chaining. Support is nearly complete.
    // https://caniuse.com/#feat=mdn-javascript_operators_optional_chaining
    DEPS.forEach((dep) => SUBSCRIPTIONS[dep] && SUBSCRIPTIONS[dep].add(override || cb));
    return () => DEPS.forEach((dep) => SUBSCRIPTIONS[dep] && SUBSCRIPTIONS[dep].delete(override || cb));
  }

  const callUniqueSubscribers = (delta) => {
    const changedProps = Object.keys(delta).filter((prop) => delta[prop] !== STATE[prop]);
    const uniqueSubscribers = new Set();
    for (const prop of changedProps) {
      SUBSCRIPTIONS[prop] && SUBSCRIPTIONS[prop].forEach((sub) => uniqueSubscribers.add(sub));
    }
    const prior = deref(STATE);
    deref(delta, BARE_STATE);
    uniqueSubscribers.forEach((sub) => sub(STATE, { prior }));
  }

  const fire = async (actionName, payload) => {
    const action = ACTIONS[actionName];
    let output;
    if (action) {
      let state = deref(STATE);
      const stateTrap = getDepProxy(state);
      output = ACTIONS[actionName]({ state: stateTrap, fire }, payload);
      callUniqueSubscribers(state);
      if (output && output.then) {
        state = deref(STATE);
        await output;
        callUniqueSubscribers(state);
      }
    }
    return output;
  }

  const register = ({ state = {}, actions = {} }) => {
    for (const prop in state) SUBSCRIPTIONS[prop] = new Set();
    deref(actions, ACTIONS);
    deref(state, STATE);
    for (const prop in state) {
      if (isFunc(state[prop])) {
        subscribe(state[prop], () => SUBSCRIPTIONS[prop].forEach((sub) => sub(STATE)));
      }
    }
  }

  register(config);

  return { state: STATE, subscribe, fire, register };
}
