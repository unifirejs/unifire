export const Unifire = (config) => {
  const SUBSCRIPTIONS = {};
  const ACTIONS = {};
  const DEPS = new Set();

  const STATE = new Proxy({}, {
    get (state, prop) {
      return isFunc(state[prop]) ? state[prop](STATE) : state[prop]
    },
    set (state, prop, next) {
      const current = state[prop];
      if (!isFunc(current) && current !== next) {
        state[prop] = next;
        SUBSCRIPTIONS[prop].forEach((sub) => sub(STATE, { prop, prior: current }));
      }
      return true;
    }
  });

  const isFunc = (val) => val instanceof Function;

  const subscribe = (cb, override) => {
    DEPS.clear();
    cb(new Proxy({}, {
      get (_, prop) {
        DEPS.add(prop);
        return STATE[prop];
      }
    }), {});
    // These should both use optional chaining. Support is nearly complete.
    // https://caniuse.com/#feat=mdn-javascript_operators_optional_chaining
    DEPS.forEach((dep) => SUBSCRIPTIONS[dep] && SUBSCRIPTIONS[dep].add(override || cb));
    return () => DEPS.forEach((dep) => SUBSCRIPTIONS[dep] && SUBSCRIPTIONS[dep].delete(override || cb));
  }

  const fire = (actionName, payload) => {
    return ACTIONS[actionName]
      ? ACTIONS[actionName]({ state: STATE, fire }, payload)
      : undefined;
  }

  const register = ({ state = {}, actions = {} }) => {
    for (const key in state) SUBSCRIPTIONS[key] = new Set();
    Object.assign(ACTIONS, actions);
    Object.assign(STATE, state);
    for (const key in state) {
      if (isFunc(state[key])) {
        subscribe(state[key], () => SUBSCRIPTIONS[key].forEach((sub) => sub(STATE)));
      }
    }
  }

  register(config);

  return { state: STATE, subscribe, fire, register };
}
